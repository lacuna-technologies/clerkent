import React from 'react'
import type Law from '../types/Law'
import { Constants } from '../utils'

interface Props {
  legislation: Law.Legislation,
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
}) => {
  return (
    <div className="result">
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