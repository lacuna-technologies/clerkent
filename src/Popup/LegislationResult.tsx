import React from 'react'
import type Law from '../types/Law'
import { Constants } from '../utils'

interface Props {
  legislation: Law.Legislation,
  downloadPDF: ({ name, citation, pdf }) => () => void,
}

const LegislationResult: React.FC<Props> = ({
  legislation: {
    database,
    jurisdiction,
    provisionNumber,
    provisionType,
    statute,
    links,
  },
  downloadPDF,
}) => {
  const pdf = links.find(({ filetype }) => filetype === `PDF`)

  return (
    <div className="result">
      <div className="details">
        <div className="left">
          { jurisdiction &&
            <span className="jurisdiction">
              {Constants.JURISDICTIONS[jurisdiction].emoji}
            </span>
          }
          { database && <span className="database">{database.name}</span> }
        </div>
        <div className="right">
          {
            pdf ? (
              <p className="links">
                <button
                  className="pdf button"
                  onClick={downloadPDF({ citation: ``, name: statute, pdf: pdf.url })}
                >PDF</button>
              </p>
            ) : null
          }
        </div>
      </div>
      <a className="legislation-name link" href={links[0]?.url} target="_blank" rel="noreferrer">
        {provisionNumber
          ? `${provisionType} ${provisionNumber}, `
          : null
        }
        {statute}
      </a>
    </div>
  )
}

export default LegislationResult