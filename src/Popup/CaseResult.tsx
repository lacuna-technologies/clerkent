import React from 'react'
import Constants from '../utils/Constants'

const CaseResult = ({
  citation,
  name,
  link,
  pdf,
  jurisdiction,
  database,
  downloadPDF,
}) => {
  return (
    <div className="result">
      <div className="details">
        <div className="left">
          <span className="jurisdiction">{Constants.JURISDICTIONS[jurisdiction]?.emoji}</span>
          { database && <span className="database">{database.name}</span> }
        </div>
        <div className="right">
          {
            pdf ? (
              <p className="links">
                <button className="pdf button" onClick={downloadPDF({ citation, name, pdf })}>PDF</button>
              </p>
            ) : null
          }
        </div>
      </div>
      <a
        className="case-name link"
        target="_blank"
        href={link}
        rel="noreferrer"
      >
        {name} {citation}
      </a>
    </div>
  )
}

export default CaseResult