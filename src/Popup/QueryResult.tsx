import React from 'react'
import { Constants } from '../utils'
import './QueryResult.scss'

const QueryResult = ({ parseResult, searchResult }) => {
  if(parseResult.length === 1){
    if(searchResult && typeof searchResult.citation !== `undefined`){
      const { name, link, pdf, jurisdiction, database } = searchResult

      return (
        <div id="result">
          <p className="jurisdiction">
            {Constants.JURISDICTIONS[jurisdiction].name}
          </p>
          <p>
            <a href={link}>{name}</a>
          </p>
          <p className="links">
            <span className="database">{database.name}</span>
            {
              pdf ? (
                <a className="pdf" href={pdf}>PDF</a>
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