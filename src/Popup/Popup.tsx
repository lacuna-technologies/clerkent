import React, { useEffect, useState, useCallback, useRef } from 'react'
import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import type { Message } from '../utils/Messenger'
import Law from '../types/Law'
import QueryResult from './QueryResult'
import { Messenger, Storage, Logger, Helpers } from '../utils'
import Toggle from '../components/Toggle'
import SelectInput from '../components/SelectInput'
import Constants from '../utils/Constants'
import ExternalLinks from './ExternalLinks'

import './Popup.scss'

const keys = {
  POPUP_QUERY: `POPUP_QUERY`,
  POPUP_SELECTED_JURISDICTION: `POPUP_SELECTED_JURISDICTION`,
}

type SearchResult = Law.Case | Law.Legislation

// eslint-disable-next-line sonarjs/cognitive-complexity
const Popup: React.FC = () => {
  const port = useRef({} as Runtime.Port)
  const [query, setQuery] = useState(``)
  const [mode, setMode] = useState(`case` as Law.SearchMode)
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(Constants.JURISDICTIONS.UK.id)
  const [searchResult, setSearchResult] = useState([] as SearchResult[])
  const [notFound, setNotFound] = useState(false)
  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])

  const viewCitation = useCallback((citation, inputMode, inputJurisdiction) => sendMessage({
    action: Messenger.ACTION_TYPES.viewCitation,
    citation: citation,
    jurisdiction: inputJurisdiction,
    mode: inputMode,
    source: Messenger.TARGETS.popup,
    target: Messenger.TARGETS.background,
  }), [sendMessage])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedViewCitation = useCallback(Helpers.debounce(viewCitation, 500), [viewCitation])

  const onSearchQueryChange = useCallback(({ target: { value }}) => {
    setQuery(value)
    setSearchResult([] as SearchResult[])
    setNotFound(false)
    Storage.set(keys.POPUP_QUERY, value)
  }, [])

  const doSearch = useCallback(({inputQuery = query, inputMode = mode, inputJurisdiction = selectedJurisdiction} = {}) => {
    Logger.log(`Doing search`, inputQuery, inputMode)
    setNotFound(false)
    debouncedViewCitation(inputQuery, inputMode, inputJurisdiction)
  },  [debouncedViewCitation, query, mode, selectedJurisdiction])

  const onEnter = useCallback((event) => {
    if(event.key === `Enter`){
      doSearch()
    }
  }, [doSearch])

  // const downloadSelectedCitations = useCallback(() => {
  //   const selection = window.getSelection().toString()
  //   Logger.log(selection)
  // }, [])

  const downloadPDF = useCallback(({ name, citation, pdf }) => () => sendMessage({
    action: Messenger.ACTION_TYPES.downloadFile,
    filename: `${Helpers.sanitiseFilename(name)} ${citation}.pdf`,
    source: Messenger.TARGETS.popup,
    target: Messenger.TARGETS.background,
    url: pdf,
  }), [sendMessage])

  const onMessage = useCallback((message: Message) => {
    Logger.log(`popup received:`, message)
    if(message.target !== Messenger.TARGETS.popup){
      return null // ignore
    }
    if(message.action === Messenger.ACTION_TYPES.viewCitation){
      const { data } = message
      if(data === false || (Array.isArray(data) && data.length === 0)){
        setNotFound(true)
      } else {
        setSearchResult(Array.isArray(data) ? data : [data])
      }
    }
  }, [])

  const onModeChange = useCallback((newMode: boolean) => {
    const parsedMode = newMode ? `legislation` : `case`
    setMode(parsedMode)
    doSearch({ inputMode: parsedMode })
  }, [doSearch])

  const onChangeJurisdiction = useCallback(({ target: { value } }): void => {
    setSelectedJurisdiction(value)
    Storage.set(keys.POPUP_SELECTED_JURISDICTION, value)
    doSearch({ inputJurisdiction: value})
  }, [doSearch])

  useEffect(() => {
    port.current = browser.runtime.connect(``, { name: `popup-port` })
    sendMessage({ message: `popup says hi` })
    port.current.onMessage.addListener(onMessage)
  }, [onMessage, sendMessage])

  useEffect(() => {
    (async () => {
      let shouldDoSearch = false
  
      const storedQuery = await Storage.get(keys.POPUP_QUERY)
      if(storedQuery !== null && storedQuery.length > 0){
        onSearchQueryChange({target: { value: storedQuery }})
        shouldDoSearch = true
      }
      const storedJurisdiction = await Storage.get(keys.POPUP_SELECTED_JURISDICTION)
      if(storedJurisdiction !== null && storedJurisdiction.length > 0){
        onChangeJurisdiction({ target: { value: storedJurisdiction } })
        shouldDoSearch = true
      }

      if(shouldDoSearch){
        doSearch({
          ...(storedQuery?.length > 0 ? { inputQuery: storedQuery }: {}),
          ...(storedJurisdiction?.length > 0 ? { inputJurisdiction: storedJurisdiction } : {}),
        })
      }
    })()
  }, [onSearchQueryChange, doSearch, onChangeJurisdiction])

  // const onMassCitations = useCallback(() => {
  //   browser.tabs.create({
  //     url: `mass-citations.html`,
  //   })
  // }, [])

  return (
    
    <section id="popup">
      <div className="options">
        <Toggle
          leftText="Cases"
          rightText="Legislation"
          onChange={onModeChange}
          value={mode === `legislation`}
        />
        <SelectInput
          options={Object.values(Constants.JURISDICTIONS).map(({ id, emoji, name }) => ({
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
      {query.length > 0 ?
        <QueryResult
          searchResult={searchResult}
          downloadPDF={downloadPDF}
          notFound={notFound}
        /> : (
          <p>Press enter to search</p>
        )
      }
      {
        (query.length > 0 && searchResult.length > 0) ? (
          <ExternalLinks
            jurisdiction={searchResult[0]?.jurisdiction}
            type={searchResult[0]?.type}
            query={query}
          />
        ) : null
      }
      <div id="help">
        {/*
          <button className="link">
            Options
          </button>
        */}
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
