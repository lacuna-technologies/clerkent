import React, { useEffect, useCallback, useState } from 'react'
import Links from './LinkResults'
import Parser from '../utils/Parser'
import type { ParseResult } from '../utils/Parser'
import { JURISDICTIONS } from '../utils/Constants'
import { browser } from 'webextension-polyfill-ts'

import './Popup.scss'

const Popup: React.FC = () => {
  const [query, setQuery] = useState(``)
  const [parseResult, setParseResult] = useState({} as ParseResult)

  const onSearchQueryChange = useCallback(({ target: { value }}) => {
    setQuery(value)
    setParseResult(Parser.parseQuery(value))
  }, [])

  const onMessage = useCallback((message: unknown) => {
    console.log(`popup received:`, message)
  }, [])

  useEffect(() => {
    const port = browser.runtime.connect(``, { name: `popup-port` })
    port.postMessage({ message: `popup says hi` })
    port.onMessage.addListener(onMessage)
  }, [onMessage])

  return (
      <section id="popup">
          <input
            type="search"
            placeholder="case citation, case name, statute, section, etc."
            onChange={onSearchQueryChange}
            value={query}
          />
          <div id="query-result">
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
          </pre>
        <Links links={parseResult.links}/>
      </section>
  )
}

export default Popup
