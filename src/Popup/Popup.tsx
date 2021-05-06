import React, { useEffect, useState, useCallback, useRef } from 'react'
import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import type { FinderResult } from '../utils/Finder'
import type { Message } from '../utils/Messenger'
import Law from '../types/Law'
import QueryResult from './QueryResult'
import { Messenger, Finder, Storage, Logger } from '../utils'

import './Popup.scss'

const keys = {
  POPUP_QUERY: `POPUP_QUERY`,
}

const Popup: React.FC = () => {
  const port = useRef({} as Runtime.Port)
  const [query, setQuery] = useState(``)
  const [parseResult, setParseResult] = useState([] as FinderResult[])
  const [searchResult, setSearchResult] = useState({} as Law.Case)
  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])

  const onSearchQueryChange = useCallback(({ target: { value }}) => {
    setQuery(value)
    const result = Finder.findCase(value)
    setParseResult(result)
    Storage.set(keys.POPUP_QUERY, value)

    if(result.length === 1){
      sendMessage({
        action: Messenger.ACTION_TYPES.viewCitation,
        citation: value,
        source: Messenger.TARGETS.popup,
        target: Messenger.TARGETS.background,
      })
    }
  }, [sendMessage])

  // const downloadSelectedCitations = useCallback(() => {
  //   const selection = window.getSelection().toString()
  //   Logger.log(selection)
  // }, [])

  const onMessage = useCallback((message: Message) => {
    Logger.log(`popup received:`, message)
    if(message.target !== Messenger.TARGETS.popup){
      return null // ignore
    }
    if(message.action === Messenger.ACTION_TYPES.viewCitation){
      const { data } = message
      setSearchResult({
        ...parseResult,
        ...data as Law.Case,
      })
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
        placeholder="case citation (e.g. [2020] EWHC 2472)"
        onChange={onSearchQueryChange}
        value={query}
      />
      {query.length > 0 &&
        <QueryResult
          parseResult={parseResult}
          searchResult={searchResult}
        />
      }
      {/* <div className="buttons">
        <button id="mass-citations" onClick={onMassCitations}>Want to paste in a large amount of text?</button>
      </div> */}
    </section>
  )
}

export default Popup
