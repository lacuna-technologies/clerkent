import React from 'react'
import Constants from '../utils/Constants'
import type Law from '../types/Law'

interface Props {
  case: Law.Case,
  downloadPDF: ({ name, citation, pdf }) => () => void,
}

const CaseResult: React.FC<Props> = ({
  case: {
    citation,
    name,
    links,
    jurisdiction,
    database,
  },
  downloadPDF,
}) => {
  const pdf = links.find(({ filetype }) => filetype === `PDF`)

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
                <button
                  className="pdf button"
                  onClick={downloadPDF({ citation, name, pdf: pdf.url })}
                >PDF</button>
              </p>
            ) : null
          }
        </div>
      </div>
      <a
        className="case-name link"
        target="_blank"
        href={links[0]?.url}
        rel="noreferrer"
      >
        {name} {citation}
      </a>
    </div>
  )
}

export default CaseResult