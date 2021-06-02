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
  type,
}) => {
  if(![Constants.JURISDICTIONS.UK.id, Constants.JURISDICTIONS.SG.id, Constants.JURISDICTIONS.HK.id].includes(jurisdiction)){
    return null
  }

  return (
    <div id="external-links">
      <small>Search on:</small>
      <div className="links-container">
        {
          jurisdiction === Constants.JURISDICTIONS.UK.id ? (
            <>
              <a
                href={`https://uk.westlaw.com/Browse/Home/WestlawUK/Cases?clerkent-query=${query}&clerkent-type=${type}`}
                target="_blank" rel="noreferrer"
              >Westlaw UK</a>

              <a
                href={`https://www.lexisnexis.com/uk/legal/home/home.do?clerkent-query=${query}`}
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
        {
          jurisdiction === Constants.JURISDICTIONS.HK.id ? (
            <>
              <a
                href={`https://app.justis.com/search/${query}/1/Relevance`}
                target="_blank" rel="noreferrer"
              >Justis</a>
            </>
          ) : null
        }
      </div>
    </div>
  )
}

export default ExternalLinks