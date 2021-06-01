import React, { useCallback, useState } from 'react'
import { Constants } from '../utils'
import type Law from '../types/Law'
import CaseResult from './CaseResult'
import ShowMore from './ShowMore'
import './QueryResult.scss'

const maxResults = 3

const QueryResult = ({ searchResult, downloadPDF, notFound }) => {
  const [morePressed, setMorePressed] = useState(false)
  const onShowMore = useCallback(() => setMorePressed(true), [])

  if(notFound){
    return <span>No results found</span>
  }
  
  if (searchResult.length === 0){
    return <span>Loading...</span>
  }

  const showMore = morePressed || searchResult.length <= maxResults

  const resultType: Law.Type = searchResult[0]?.type
  if(resultType === `case-citation` || resultType === `case-name`){
    return (
      <div id="results">
        {
          searchResult
            .slice(0, showMore ? undefined : maxResults)
            .map(({ name, citation, link, pdf, jurisdiction, database }) => (
              <CaseResult
                {...{ citation, database, downloadPDF, jurisdiction, link, name, pdf }}
                key={`${name}-${citation}`}
              />
            ))
        }
        { showMore ? null : <ShowMore onClick={onShowMore} /> }
      </div>
    )
  } else if (resultType === `legislation`){
    return (
      <div id="results">
        {
          searchResult.map(({
            database,
            jurisdiction,
            provisionNumber,
            provisionType,
            statute,
            link,
          }) => (
            <div className="result" key={`${provisionType}-${provisionNumber}-${statute}-${link}`}>
              <p className="details">
                <div className="left">
                  { jurisdiction &&
                    <span className="jurisdiction">
                      {Constants.JURISDICTIONS[jurisdiction].emoji}
                    </span>
                  }
                  { database && <span className="database">{database.name}</span> }
                </div>
              </p>
              <a className="legislation-name link" href={link} target="_blank" rel="noreferrer">
                {provisionNumber
                  ? `${provisionType} ${provisionNumber}, `
                  : null
                }
                {statute}
              </a>
            </div>
          ))
        }
      </div>
    )
  }
  return null
}

export default QueryResult