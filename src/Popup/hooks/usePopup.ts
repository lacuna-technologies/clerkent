import { useState, useCallback, useEffect } from 'preact/hooks'
import {
  Storage,
  Helpers,
  Logger,
  Constants,
  Finder,
} from 'utils'

const keys = {
  QUERY: `POPUP_QUERY`,
  SELECTED_JURISDICTION: `POPUP_SELECTED_JURISDICTION`,
}

type SearchResult = Law.Case | Law.Legislation

const usePopup = ({ search, setIsSearching, setSearchResults }) => {
  const [query, setQuery] = useState(``)
  const [lastSearchQuery, setLastSearchQuery] = useState(query)
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(Constants.JURISDICTIONS.UK.id)
  
  const storeQuery = useCallback((value: string) => Storage.set(keys.QUERY, value), [])
  const onChangeJurisdiction = useCallback((
    value,
    doNotStore = false,
  ): void => {
    setSelectedJurisdiction(value)
    if(!doNotStore){
      Storage.set(keys.SELECTED_JURISDICTION, value)
    }
    setLastSearchQuery(``)
    setSearchResults([] as SearchResult[])
  }, [setSearchResults])

  const autosetJurisdiction = useCallback((value: string) => {
    const citations = Finder.findCaseCitation(value)
    if(citations.length > 0){
      onChangeJurisdiction(citations[0].jurisdiction)
    }
  }, [onChangeJurisdiction])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedViewCitation = useCallback(Helpers.debounce(search, 500), [search])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedStoreQuery = useCallback(Helpers.debounce(storeQuery, 250), [storeQuery])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedAutosetJurisdiction = useCallback(Helpers.debounce(autosetJurisdiction, 250), [])

  const onPaste = useCallback((event) => {
    const value = event.clipboardData.getData(`text/plain`)
    // no debouncing if citation is pasted
    autosetJurisdiction(value)
  }, [autosetJurisdiction])

  
  const onSearchQueryChange = useCallback((
    value: string,
    doNotStore = false,
    debounceAutosetJurisdiction = true,
  ) => {
    setQuery(value)
    setIsSearching(false)
    setSearchResults([] as SearchResult[])
    if(debounceAutosetJurisdiction){
      debouncedAutosetJurisdiction(value)
    } else {
      autosetJurisdiction(value)
    }
    if(!doNotStore){
      debouncedStoreQuery(value)
    }
  }, [autosetJurisdiction, debouncedAutosetJurisdiction, debouncedStoreQuery, setIsSearching, setSearchResults])

  const onSearchQueryInput = useCallback((event: Event) => {
    const { target } = event
    if(target instanceof HTMLInputElement){
      onSearchQueryChange(target.value)
    }
  }, [onSearchQueryChange])

  const doSearch = useCallback((
    {
      inputQuery = query,
      inputJurisdiction = selectedJurisdiction,
      forceSearch = false,
    } = {},
  ) => {
    if(inputQuery.length >= 3 || forceSearch){ // ignore anything that's too short
      Logger.log(`Doing search`, inputQuery)
      debouncedViewCitation(inputQuery, inputJurisdiction)
      setIsSearching(true)
      setLastSearchQuery(inputQuery)
    }
  },  [debouncedViewCitation, query, selectedJurisdiction, setIsSearching])

  const onEnter = useCallback((event) => {
    if(event.key === `Enter`){
      doSearch({ forceSearch: true })
    }
  }, [doSearch])

  // const downloadSelectedCitations = useCallback(() => {
  //   const selection = window.getSelection().toString()
  //   Logger.log(selection)
  // }, [])

  // const onMassCitations = useCallback(() => {
  //   browser.tabs.create({
  //     url: `mass-citations.html`,
  //   })
  // }, [])

  const applyClipboardText = useCallback((clipboardText) => {
    onSearchQueryChange(clipboardText)
    doSearch({ inputQuery: clipboardText })
  }, [doSearch, onSearchQueryChange])

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    (async () => {
      let shouldDoSearch = false
  
      const storedQuery = await Storage.get(keys.QUERY)
      if(query.length === 0 && storedQuery !== null && storedQuery.length > 0){
        onSearchQueryChange(storedQuery, true, false)
        shouldDoSearch = true
      }
      const storedJurisdiction = await Storage.get(keys.SELECTED_JURISDICTION)
      if(storedJurisdiction !== null && storedJurisdiction.length > 0){
        onChangeJurisdiction(storedJurisdiction, true)
        shouldDoSearch = true
      }

      if(shouldDoSearch){
        doSearch({
          ...(storedQuery?.length > 0 ? { inputQuery: storedQuery }: {}),
          ...(storedJurisdiction?.length > 0 ? { inputJurisdiction: storedJurisdiction } : {}),
        })
      }
    })()
  // run only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    applyClipboardText,
    lastSearchQuery,
    onChangeJurisdiction,
    onEnter,
    onPaste,
    onSearchQueryInput,
    query,
    selectedJurisdiction,
  }
}

export default usePopup