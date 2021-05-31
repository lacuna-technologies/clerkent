import React from 'react'
import type Law from '../types/Law'
import Constants from '../utils/Constants'
import './ExternalLinks.scss'

interface Props {
  jurisdiction: Law.JursidictionCode
  type: Law.Type
  query: string
}

const ExternalLinks: React.FC<Props> = ({
  jurisdiction,
  query,
}) => {

  return (
    <div id="external-links">
      <small>Search on:</small>
      <div className="links-container">
        {
          jurisdiction === Constants.JURISDICTIONS.UK.id ? (
            <>
              <a
                href={`https://uk.westlaw.com/Browse/Home/WestlawUK/Cases`}
                target="_blank" rel="noreferrer"
              >Westlaw UK</a>

              <a
                href={`https://lexisnexis.com/uk/`}
                target="_blank" rel="noreferrer"
              >LexisNexis UK</a>

              <a
                href={`https://app.justis.com/search/${query}/1/Relevance`}
                target="_blank" rel="noreferrer"
              >Justis</a>
            </>
          ) : null
        }
        {
          jurisdiction === Constants.JURISDICTIONS.SG.id ? (
            <>
              <a
                href={`https://www.lawnet.sg/?clerkent-query=${query}`}
                target="_blank" rel="noreferrer"
              >LawNet</a>
            </>
          ) : null
        }
      </div>
    </div>
  )
}

export default ExternalLinks