import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { Constants } from '../utils'
import './QueryResult.scss'

const QueryResult = ({ parseResult, searchResult, downloadPDF }) => {

  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  if(parseResult.length === 1){
    if(searchResult && typeof searchResult.citation !== `undefined`){
      const { citation, name, link, pdf, jurisdiction, database } = searchResult

      return (
        <div id="result">
          <p className="details">
            <span className="jurisdiction">{Constants.JURISDICTIONS[jurisdiction].emoji}</span>
            <span className="database">{database.name}</span>
          </p>
          <button className="case-name link" onClick={openTab(link)}>{name}</button>
          {
            pdf ? (
              <p className="links">
                <button className="pdf button" onClick={downloadPDF({ citation, name, pdf })}>PDF</button>
              </p>
            ) : null
          }
        </div>
      )
    } else if (searchResult !== false){
      return <span>Loading...</span>
    }
  }

  return <span>No results found</span>
}

export default QueryResult