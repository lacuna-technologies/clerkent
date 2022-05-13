import { useState, useCallback, useEffect } from 'react'
import {
  Storage,
  Helpers,
  Logger,
  Constants,
} from 'utils'
import type Law from 'types/Law'

const keys = {
  QUERY: `POPUP_QUERY`,
  SELECTED_JURISDICTION: `POPUP_SELECTED_JURISDICTION`,
}

type SearchResult = Law.Case | Law.Legislation

const usePopup = ({ search, setIsSearching, setSearchResult}) => {
  const [query, setQuery] = useState(``)
  const [lastSearchQuery, setLastSearchQuery] = useState(query)
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(Constants.JURISDICTIONS.UK.id)
  
  const storeQuery = useCallback((value: string) => Storage.set(keys.QUERY, value), [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedViewCitation = useCallback(Helpers.debounce(search, 500), [search])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedStoreQuery = useCallback(Helpers.debounce(storeQuery, 250), [storeQuery])

  const onSearchQueryChange = useCallback((
    { target: { value }},
    doNotStore = false,
  ) => {
    setQuery(value)
    setIsSearching(false)
    setSearchResult([] as SearchResult[])
    if(!doNotStore){
      debouncedStoreQuery(value)
    }
  }, [debouncedStoreQuery, setIsSearching, setSearchResult])

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

  const onChangeJurisdiction = useCallback((
    value,
    doNotStore: boolean = false,
  ): void => {
    setSelectedJurisdiction(value)
    if(!doNotStore){
      Storage.set(keys.SELECTED_JURISDICTION, value)
    }
    setLastSearchQuery(``)
    setSearchResult([] as SearchResult[])
  }, [setSearchResult])

  const applyClipboardText = useCallback((clipboardText) => {
    onSearchQueryChange({target: { value: clipboardText }})
    doSearch({ inputQuery: clipboardText })
  }, [doSearch, onSearchQueryChange])

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    (async () => {
      let shouldDoSearch = false
  
      const storedQuery = await Storage.get(keys.QUERY)
      if(query.length === 0 && storedQuery !== null && storedQuery.length > 0){
        onSearchQueryChange({target: { value: storedQuery }}, true)
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
    onSearchQueryChange,
    query,
    selectedJurisdiction,
  }
}

export default usePopup