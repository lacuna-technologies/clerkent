import React, { useEffect, useCallback, useRef } from 'react'
import Messenger from '../utils/Messenger'
// import { JURISDICTIONS } from '../utils/Constants'
import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'

import './Popup.scss'

const Popup: React.FC = () => {
  const port = useRef({} as Runtime.Port)
  // const [parseResult, setParseResult] = useState({} as ParseResult)

  // const onSearchQueryChange = useCallback(({ target: { value }}) => {
  //   setQuery(value)
  //   setParseResult(Parser.parseQuery(value))
  // }, [])

  const downloadSelectedCitations = useCallback(() => {
    const selection = window.getSelection().toString()
    console.log(selection)
  }, [])

  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])

  const onMessage = useCallback((message: unknown) => {
    console.log(`popup received:`, message)
  }, [])

  useEffect(() => {
    port.current = browser.runtime.connect(``, { name: `popup-port` })
    sendMessage({ message: `popup says hi` })
    port.current.onMessage.addListener(onMessage)
  }, [onMessage, sendMessage ])

  return (
      <section id="popup">
          {/* <input
            type="search"
            placeholder="case citation, case name, statute, section, etc."
            onChange={onSearchQueryChange}
            value={query}
          /> */}
          {/* <div id="query-result">
            {
              typeof parseResult.jurisdiction !== `undefined` ? (
                <>
                  {JURISDICTIONS[parseResult.jurisdiction].emoji}
                  &nbsp;&nbsp;
                  {parseResult.jurisdiction}
                </>
              ) : null
            }
          </div>
          <pre>
            {
              JSON.stringify(parseResult, null, 2)
            }
          </pre> */}
      {/* <Links links={parseResult.links} /> */}
      {/* <button onClick={() => downloadSelectedCitations()}>GET SELECTION</button>
      <button onClick={() => sendMessage(Messenger.makeActionMessage(Messenger.ACTION_TYPES.test))}>BOOM</button> */}
      </section>
  )
}

export default Popup
