import React, { useEffect, useState, useCallback, useRef } from 'react'
import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import type { Message } from '../utils/Messenger'
import Law from '../types/Law'
import QueryResult from './QueryResult'
import { Messenger, Storage, Logger, Helpers } from '../utils'
import Toggle from './Toggle'

import './Popup.scss'

const keys = {
  POPUP_QUERY: `POPUP_QUERY`,
}

type SearchResult = Law.Case | Law.Legislation

// eslint-disable-next-line sonarjs/cognitive-complexity
const Popup: React.FC = () => {
  const port = useRef({} as Runtime.Port)
  const [query, setQuery] = useState(``)
  const [mode, setMode] = useState(false)
  const [searchResult, setSearchResult] = useState([] as SearchResult[])
  const [notFound, setNotFound] = useState(false)
  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])

  const viewCitation = useCallback((citation, inputMode) => sendMessage({
    action: Messenger.ACTION_TYPES.viewCitation,
    citation: citation,
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

  const doSearch = useCallback((inputQuery = query, inputMode = mode) => {
    setNotFound(false)
    debouncedViewCitation(inputQuery, inputMode)
  },  [debouncedViewCitation, query, mode])

  const onEnter = useCallback((event) => {
    if(event.key === `Enter`){
      doSearch()
    }
  }, [doSearch])

  // const downloadSelectedCitations = useCallback(() => {
  //   const selection = window.getSelection().toString()
  //   Logger.log(selection)
  // }, [])

  const openTab = useCallback((link: string) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const openHelp = useCallback(openTab(`https://clerkent.huey.xyz/help`), [openTab])

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

  const onModeChange = useCallback(newMode => {
    // false = case; true = legislation
    setMode(newMode)
    doSearch()
  }, [doSearch])

  useEffect(() => {
    port.current = browser.runtime.connect(``, { name: `popup-port` })
    sendMessage({ message: `popup says hi` })
    port.current.onMessage.addListener(onMessage)
  }, [onMessage, sendMessage ])

  useEffect(() => {
    (async () => {
      const storedQuery = await Storage.get(keys.POPUP_QUERY)
      if(storedQuery !== null && storedQuery.length > 0){
        onSearchQueryChange({target: { value: storedQuery }})
        doSearch(storedQuery)
      }
    })()
  }, [onSearchQueryChange, doSearch])

  // const onMassCitations = useCallback(() => {
  //   browser.tabs.create({
  //     url: `mass-citations.html`,
  //   })
  // }, [])

  return (
    <section id="popup">
      <Toggle
        leftText="Cases"
        rightText="Legislation"
        onChange={onModeChange}
        value={mode}
      />
      <input
        type="search"
        placeholder="case citation or legislation"
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
      <div id="help">
        {/*
          <button className="link">
            Options
          </button>
        */}
        <button className="link" onClick={openHelp}>Help</button>
      </div>
      {/* <div className="buttons">
        <button id="mass-citations" onClick={onMassCitations}>Want to paste in a large amount of text?</button>
      </div> */}
    </section>
  )
}

export default Popup
