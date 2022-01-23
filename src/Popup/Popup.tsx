import React, { useEffect, useState, useCallback, useRef } from 'react'
import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import type { Message } from '../utils/Messenger'
import Law from '../types/Law'
import QueryResult from './QueryResult'
import { Constants, Messenger, Storage, Logger, Helpers } from '../utils'
import Toggle from '../components/Toggle'
import SelectInput from '../components/SelectInput'
import ExternalLinks from './ExternalLinks'
import ClipboardSuggestion from './ClipboardSuggestion'

import './Popup.scss'

const keys = {
  QUERY: `POPUP_QUERY`,
  SELECTED_JURISDICTION: `POPUP_SELECTED_JURISDICTION`,
  SELECTED_MODE: `POPUP_SELECTED_MODE`,
}

const parseMode = (mode: boolean): Law.SearchMode => mode ? `legislation` : `case`
const modeToBool = (mode: Law.SearchMode) => mode === `legislation`

type SearchResult = Law.Case | Law.Legislation

// eslint-disable-next-line sonarjs/cognitive-complexity
const Popup: React.FC = () => {
  const port = useRef({} as Runtime.Port)
  const [query, setQuery] = useState(``)
  const [lastSearchQuery, setLastSearchQuery] = useState(query)
  const [isSearching, setIsSearching] = useState(false)
  const [mode, setMode] = useState(`case` as Law.SearchMode)
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(Constants.JURISDICTIONS.UK.id)
  const [searchResult, setSearchResult] = useState([] as SearchResult[])
  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])

  const search = useCallback((citation, inputMode, inputJurisdiction) => sendMessage({
    action: Messenger.ACTION_TYPES.search,
    citation: citation,
    jurisdiction: inputJurisdiction,
    mode: inputMode,
    source: Messenger.TARGETS.popup,
    target: Messenger.TARGETS.background,
  }), [sendMessage])
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
  }, [debouncedStoreQuery])

  const doSearch = useCallback((
    {
      inputQuery = query,
      inputMode = mode,
      inputJurisdiction = selectedJurisdiction,
      forceSearch = false,
    } = {},
  ) => {
    if(inputQuery.length >= 3 || forceSearch){ // ignore anything that's too short
      Logger.log(`Doing search`, inputQuery, inputMode)
      debouncedViewCitation(inputQuery, inputMode, inputJurisdiction)
      setIsSearching(true)
      setLastSearchQuery(inputQuery)
    }
  },  [debouncedViewCitation, query, mode, selectedJurisdiction])

  const onEnter = useCallback((event) => {
    if(event.key === `Enter`){
      doSearch({ forceSearch: true })
    }
  }, [doSearch])

  // const downloadSelectedCitations = useCallback(() => {
  //   const selection = window.getSelection().toString()
  //   Logger.log(selection)
  // }, [])

  const downloadPDF = useCallback(
    ({ law, doctype }: { law: Law.Case | Law.Legislation, doctype: Law.Link[`doctype`]}) => () => sendMessage({
      action: Messenger.ACTION_TYPES.downloadPDF,
      doctype,
      law,
      source: Messenger.TARGETS.popup,
      target: Messenger.TARGETS.background,
    }), [sendMessage])

  const onMessage = useCallback((message: Message) => {
    Logger.log(`popup received:`, message)
    if(message.target !== Messenger.TARGETS.popup){
      return null // ignore
    }
    if(message.action === Messenger.ACTION_TYPES.search){
      const { data } = message
      setIsSearching(false)
      setSearchResult(Array.isArray(data) ? data : [data])
    }
  }, [])

  const onModeChange = useCallback((newMode: boolean, doNotStore: boolean = false) => {
    const parsedMode = parseMode(newMode)
    setMode(parsedMode)
    if(!doNotStore){
      Storage.set(keys.SELECTED_MODE, parsedMode)
    }
    setLastSearchQuery(``)
    setSearchResult([] as SearchResult[])
  }, [])

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
  }, [])

  const applyClipboardText = useCallback((clipboardText) => {
    onSearchQueryChange({target: { value: clipboardText }})
    doSearch({ inputQuery: clipboardText })
  }, [doSearch, onSearchQueryChange])

  useEffect(() => {
    port.current = browser.runtime.connect(``, { name: `popup-port` })
    sendMessage({ message: `popup says hi` })
    port.current.onMessage.addListener(onMessage)
  }, [onMessage, sendMessage])

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
      const storedMode = await Storage.get(keys.SELECTED_MODE)
      if(storedMode !== null && storedMode.length > 0){
        onModeChange(modeToBool(storedMode), true)
        shouldDoSearch = true
      }

      if(shouldDoSearch){
        doSearch({
          ...(storedQuery?.length > 0 ? { inputQuery: storedQuery }: {}),
          ...(storedJurisdiction?.length > 0 ? { inputJurisdiction: storedJurisdiction } : {}),
          ...(storedMode?.length > 0 ? { inputMode: storedMode } : {}),
        })
      }
    })()
  // run only once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const onMassCitations = useCallback(() => {
  //   browser.tabs.create({
  //     url: `mass-citations.html`,
  //   })
  // }, [])

  const supportedJurisdictions = mode === `case`
    ? Object.values(Constants.JURISDICTIONS)
    : [
      Constants.JURISDICTIONS.EU,
      Constants.JURISDICTIONS.UK,
      Constants.JURISDICTIONS.SG,
    ]

  return (
    <section id="popup">
      <div className="options">
        <Toggle
          leftText="Cases"
          rightText="Legislation"
          onChange={onModeChange}
          value={modeToBool(mode)}
        />
        <SelectInput
          options={Object.values(supportedJurisdictions).map(({ id, emoji, name }) => ({
            content: `${emoji} ${name}`,
            value: id,
          }))}
          value={selectedJurisdiction}
          onChange={onChangeJurisdiction}
        />
      </div>
      <input
        type="search"
        placeholder="case citation, party name, or legislation"
        onChange={onSearchQueryChange}
        onKeyDown={onEnter}
        value={query}
      />
      {
        query === lastSearchQuery ? (
          <ClipboardSuggestion query={query} applyClipboardText={applyClipboardText} />
        ) : null
      }
      {
        (!isSearching && query.length > 0 && searchResult.length === 0 && lastSearchQuery !== query) ? (
          <span>Press enter to search</span>
        ) : (
          <QueryResult
            searchResult={searchResult}
            downloadPDF={downloadPDF}
            isSearching={isSearching}
            mode={mode}
          />
        )
      }
      {
        (query.length > 0 && !isSearching && mode === `case`) ? (
          <ExternalLinks
            jurisdiction={selectedJurisdiction}
            type={searchResult[0]?.type}
            query={query}
          />
        ) : null
      }
      <div id="help">
        <a className="link" href={browser.runtime.getURL(`/options.html`)} target="_blank" rel="noreferrer">
          Options
        </a>
        <a className="link" href="https://clerkent.huey.xyz/help" target="_blank" rel="noreferrer">
          Help
        </a>
      </div>
      {/* <div className="buttons">
        <button id="mass-citations" onClick={onMassCitations}>Want to paste in a large amount of text?</button>
      </div> */}
    </section>
  )
}

export default Popup
