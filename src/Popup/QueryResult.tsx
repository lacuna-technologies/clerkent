import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { Constants } from '../utils'
import './QueryResult.scss'

const QueryResult = ({ parseResult, searchResult, downloadPDF, notFound }) => {

  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  if(!Array.isArray(parseResult) || parseResult.length === 0 || searchResult === false || notFound){
    return <span>No results found</span>
  }

  
  if (!searchResult?.citation && !searchResult?.statute){
    return <span>Loading...</span>
  }

  const resultType = parseResult[0]?.type || searchResult[0]?.type
  if(resultType === `case`){
    const { citation, name, link, pdf, jurisdiction, database } = searchResult
    
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
  } else if (resultType === `legislation`){
    const {
      jurisdiction,
      provisionNumber,
      provisionType,
      statute,
      link,
    } = searchResult
    return (
      <div id="results">
        {
          <div className="result">
            <p className="details">
              { jurisdiction &&
                <span className="jurisdiction">
                  {Constants.JURISDICTIONS[jurisdiction].emoji}
                </span>
              }
            </p>
            <button className="legislation-name link" onClick={openTab(link)}>
              {provisionNumber
                ? `${provisionType} ${provisionNumber}, `
                : null
              }
              {statute}
            </button>
          </div>
        }
      </div>
    )
  }
  return null
}

export default QueryResult