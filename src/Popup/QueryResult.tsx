import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { Constants } from '../utils'
import './QueryResult.scss'

const QueryResult = ({ parseResult, searchResult }) => {

  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  if(parseResult.length === 1){
    if(searchResult && typeof searchResult.citation !== `undefined`){
      const { name, link, pdf, jurisdiction, database } = searchResult

      return (
        <div id="result">
          <p className="jurisdiction">
            {Constants.JURISDICTIONS[jurisdiction].name}
          </p>
          <p>
            <button className="link" onClick={openTab(link)}>{name}</button>
          </p>
          <p className="links">
            <span className="database">{database.name}</span>
            {
              pdf ? (
                <button className="pdf button" onClick={openTab(pdf)}>PDF</button>
              ) : null
            }
          </p>
        </div>
      )
    } else if (searchResult !== false){
      return <span>Loading...</span>
    }
  }

  return <span>No results found</span>
}

export default QueryResult