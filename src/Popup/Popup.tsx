import React, { useEffect, useState, useCallback, useRef } from 'react'
import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import type { FinderResult } from '../utils/Finder'
import type { Message } from '../utils/Messenger'
import Law from '../types/Law'
import QueryResult from './QueryResult'
import { Messenger, Finder, Storage, Logger, Helpers } from '../utils'

import './Popup.scss'

const keys = {
  POPUP_QUERY: `POPUP_QUERY`,
}

type SearchResult = Law.Case | Law.Legislation

const Popup: React.FC = () => {
  const port = useRef({} as Runtime.Port)
  const [query, setQuery] = useState(``)
  const [parseResult, setParseResult] = useState([] as FinderResult[])
  const [searchResult, setSearchResult] = useState([] as SearchResult[])
  const [notFound, setNotFound] = useState(false)
  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])

  const viewCitation = useCallback((citation) => sendMessage({
    action: Messenger.ACTION_TYPES.viewCitation,
    citation: citation,
    source: Messenger.TARGETS.popup,
    target: Messenger.TARGETS.background,
  }), [sendMessage])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedViewCitation = useCallback(Helpers.debounce(viewCitation, 500), [viewCitation])

  const onSearchQueryChange = useCallback(({ target: { value }}) => {
    setQuery(value)
    setSearchResult([] as SearchResult[])
    setNotFound(false)

    const results = Finder.find(`${value}`)
    Storage.set(keys.POPUP_QUERY, value)

    if(results.length === 0){
      setNotFound(true)
      return null
    }

    setParseResult(results)

    if(results.length === 1){
      debouncedViewCitation(value)
    }
  }, [debouncedViewCitation])

  const onEnter = useCallback((event) => {
    if(event.key === `Enter`){
      onSearchQueryChange({ target: { value: query }})
    }
  }, [onSearchQueryChange, query])

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
        setSearchResult([
          {
            ...parseResult[0],
            ...(Array.isArray(data) ? data[0] : data),
          },
        ])
      }
    }
  }, [parseResult])

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
      }
    })()
  }, [onSearchQueryChange])

  // const onMassCitations = useCallback(() => {
  //   browser.tabs.create({
  //     url: `mass-citations.html`,
  //   })
  // }, [])

  return (
    <section id="popup">
      <input
        type="search"
        placeholder="case citation or legislation"
        onChange={onSearchQueryChange}
        onKeyDown={onEnter}
        value={query}
      />
      {query.length > 0 &&
        <QueryResult
          parseResult={parseResult}
          searchResult={searchResult}
          downloadPDF={downloadPDF}
          notFound={notFound}
        />
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
