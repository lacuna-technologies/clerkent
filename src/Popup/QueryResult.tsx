import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { Constants } from '../utils'
import './QueryResult.scss'

const QueryResult = ({ parseResult, searchResult, downloadPDF, notFound }) => {

  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  if(!Array.isArray(parseResult) || parseResult.length === 0 || notFound){
    return <span>No results found</span>
  }

  
  if (searchResult.length === 0){
    return <span>Loading...</span>
  }

  const resultType = parseResult[0]?.type || searchResult[0]?.type
  if(resultType === `case-citation` || resultType === `case-name`){
    return (
      <div id="results">
        {
          searchResult.map(({ citation, name, link, pdf, jurisdiction, database }) => (
            <div className="result" key={`${name}-${link}`}>
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
          ))
        }
      </div>
    )
  } else if (resultType === `legislation`){
    return (
      <div id="results">
        {
          searchResult.map(({
            jurisdiction,
            provisionNumber,
            provisionType,
            statute,
            link,
          }) => (
            <div className="result" key={`${provisionType}-${provisionNumber}-${statute}-${link}`}>
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
          ))
        }
      </div>
    )
  }
  return null
}

export default QueryResult