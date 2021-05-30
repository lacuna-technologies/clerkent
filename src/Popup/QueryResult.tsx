import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import { Constants } from '../utils'
import ExternalLinks from './ExternalLinks'
import type Law from '../types/Law'
import './QueryResult.scss'

const QueryResult = ({ searchResult, downloadPDF, notFound, query }) => {

  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  if(notFound){
    return <span>No results found</span>
  }

  
  if (searchResult.length === 0){
    return <span>Loading...</span>
  }

  const resultType: Law.Type = searchResult[0]?.type
  const jurisdiction = searchResult[0]?.jurisdiction

  if(resultType === `case-citation` || resultType === `case-name`){
    return (
      <>
        <div id="results">
          {
            searchResult.map(({ citation, name, link, pdf, jurisdiction, database }) => (
              <div className="result" key={`${name}-${citation}`}>
                <p className="details">
                  <span className="jurisdiction">{Constants.JURISDICTIONS[jurisdiction]?.emoji}</span>
                  { database && <span className="database">{database.name}</span> }
                </p>
                <button className="case-name link" onClick={openTab(link)}>{name} {citation}</button>
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
        <ExternalLinks jurisdiction={jurisdiction} type={resultType} query={query} />
      </>
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