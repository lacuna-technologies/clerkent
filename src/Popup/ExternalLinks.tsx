import React, { useCallback } from 'react'
import { browser } from 'webextension-polyfill-ts'
import type Law from '../types/Law'
import Constants from '../utils/Constants'

interface Props {
  jurisdiction: Law.JursidictionCode
  type: Law.Type
  query: string
}

const ExternalLinks: React.FC<Props> = ({
  jurisdiction,
  query,
}) => {
  const openTab = useCallback((link) => () => {
    browser.tabs.create({ active: true, url: link })
  }, [])

  return (
    <div className="external-links">
      {
        jurisdiction === Constants.JURISDICTIONS.UK.id ? (
          <>
            <button
              className="link"
              onClick={openTab(`https://uk.westlaw.com/Browse/Home/WestlawUK/Cases`)}
            >Westlaw UK</button>

            <button
              className="link"
              onClick={openTab(`https://lexisnexis.com/uk/`)}
            >LexisNexis UK</button>

            <button
              className="link"
              onClick={openTab(`https://app.justis.com/search/${query}/1/Relevance`)}
            >Justis</button>
          </>
        ) : null
      }
      {
        jurisdiction === Constants.JURISDICTIONS.SG.id ? (
          <>
            <button
              className="link"
              onClick={openTab(`https://www.lawnet.sg/?clerkent-query=${query}`)}
            >LawNet</button>
          </>
        ) : null
      }
    </div>
  )
}

export default ExternalLinks