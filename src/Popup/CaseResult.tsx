import React from 'react'
import Helpers from '../utils/Helpers'
import Constants from '../utils/Constants'
import type Law from '../types/Law'
import ResultLink from './ResultLink'

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
  const summaryURL = Helpers.getSummaryLink(links)?.url
  const judgmentLink = Helpers.getJudgmentLink(links)
  const opinionLink = Helpers.getOpinionLink(links)

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
        className="case-name link"
        target="_blank"
        href={summaryURL}
        rel="noreferrer"
        {...(summaryURL ? {title: `Summary`} : {})}
      >
        {name}
      </a>
      <div className="links">
        <span>{citation}</span>
        <ResultLink
          link={judgmentLink}
          onDownloadPDF={downloadPDF({ citation, name, pdf: judgmentLink?.url })}
        />
        <ResultLink
          link={opinionLink}
          onDownloadPDF={downloadPDF({ citation, name, pdf: opinionLink?.url })}
        />
      </div>
    </div>
  )
}

export default CaseResult