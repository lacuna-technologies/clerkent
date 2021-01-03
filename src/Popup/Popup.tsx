import React from 'react'
// import {browser, Tabs} from 'webextension-polyfill-ts'
import Links from './LinkResults'
import Parser from '../utils/Parser'
import type { ParseResult } from '../utils/Parser'
import { JURISDICTIONS } from '../utils/Constants'

import './Popup.scss'

const Popup: React.FC = () => {
  const [query, setQuery] = React.useState(``)
  const [parseResult, setParseResult] = React.useState({} as ParseResult)

  const onSearchQueryChange = React.useCallback(({ target: { value }}) => {
    setQuery(value)
    setParseResult(Parser.parseQuery(value))
  }, [])
  // const onKeyDown = React.useCallback((e) => {
  //   if(e.key === `Enter`){
  //     setResult(Parser.parseQuery(query))
  //   }
  // }, [query])

  return (
      <section id="popup">
          <input
            type="search"
            placeholder="case citation, case name, statute, section, etc."
            // onKeyDown={onKeyDown}
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
