import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { Constants } from '../utils'
import './QueryResult.scss'

const QueryResult = ({ parseResult, searchResult, downloadPDF, notFound }) => {

  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  if(!Array.isArray(parseResult) || parseResult.length === 0){
    return <span>No results found</span>
  }

  const resultType = parseResult[0].type
  
  if(resultType === `case`){
    if(searchResult && typeof searchResult.citation !== `undefined`){

      const { citation, name, link, pdf, jurisdiction, database } = searchResult
      console.log(searchResult)

      return (
        <div id="results">
          <div className="result">
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
        </div>
      )
    } else if (searchResult !== false && !notFound){
      return <span>Loading...</span>
    }
  } else if (resultType === `legislation`){
    
    return (
      <div id="results">
        {
          parseResult.map(({ provision, statute, jurisdiction }) => (
            <div className="result" key={`${provision}-${statute}`}>
              { jurisdiction && <span className="jurisdiction">{Constants.JURISDICTIONS[jurisdiction].emoji}</span> }
              <button className="legislation-name link">{provision}, {statute}</button>
            </div>
          ))
        }
      </div>
    )
  }
}

export default QueryResult