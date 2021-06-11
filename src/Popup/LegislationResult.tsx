import React from 'react'
import type Law from '../types/Law'
import Constants from '../utils/Constants'
// import Helpers from '../utils/Helpers'
import type { downloadPDFType } from './QueryResult'
// import ResultLink from './ResultLink'

interface Props {
  legislation: Law.Legislation,
  downloadPDF: downloadPDFType,
}

const LegislationResult: React.FC<Props> = ({
  legislation,
  downloadPDF,
}) => {
  const {
    database,
    jurisdiction,
    provisionNumber,
    provisionType,
    statute,
    links,
  } = legislation
  const link = links[0]

  return (
    <div className="result">
      <div className="details">
        <div className="left">
          <span className="jurisdiction" title={Constants.JURISDICTIONS[jurisdiction]?.name}>
            {Constants.JURISDICTIONS[jurisdiction]?.emoji}
          </span>
          {
            database && (
              <a className="database no-link" href={database.url} target="_blank" rel="noreferrer">
                {database.name}
              </a>
            )
          }
        </div>
        <div className="right">
        </div>
      </div>
      <a
        className="legislation-name link"
        href={link?.url}
        target="_blank"
        rel="noreferrer"
      >
        {provisionNumber
          ? `${provisionType} ${provisionNumber}, `
          : null
        }
        {statute}
      </a>
      {/* <div className="links">
        <ResultLink
          link={link}
          onDownloadPDF={downloadPDF({ doctype: `Legislation`, law: legislation })}
        />
      </div> */}
    </div>
  )
}

export default LegislationResult