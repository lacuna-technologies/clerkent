import React, { useEffect, useState } from 'react'
import type Law from '../types/Law'
import Constants from '../utils/Constants'
import OptionsStorage from '../utils/OptionsStorage'
import type { OptionsSettings } from '../utils/OptionsStorage'
import './ExternalLinks.scss'

interface Props {
  jurisdiction: Law.JursidictionCode
  type: Law.Type
  query: string
}

const getLawNetURL = (
  institution: OptionsSettings[`institutionalLogin`],
  query: string,
) => (new Proxy({
  NUS: `https://www-lawnet-sg.lawproxy1.nus.edu.sg/?clerkent-query=${query}`,
  SMU: `https://www-lawnet-sg.libproxy.smu.edu.sg/?clerkent-query=${query}`,
}, {
  get(target, property) {
    if(property in target) {return target[property as string]}
    return `https://www.lawnet.sg/?clerkent-query=${query}`
  },
})[institution])

const ExternalLinks: React.FC<Props> = ({
  jurisdiction,
  query,
  type,
}) => {
  const [institution, setInstitution] = useState(OptionsStorage.defaultOptions.institutionalLogin)

  useEffect(() => {
    (async () => {
      const institutionSelection = await OptionsStorage.institutionalLogin.get()
      setInstitution(institutionSelection)
    })()
  }, [])

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
                href={getLawNetURL(institution, query)}
                target="_blank" rel="noreferrer"
              >LawNet</a>
            </>
          ) : null
        }
        {
          [
            Constants.JURISDICTIONS.CA.id,
            Constants.JURISDICTIONS.HK.id,
            Constants.JURISDICTIONS.AU.id,
            Constants.JURISDICTIONS.NZ.id,
            Constants.JURISDICTIONS.EU.id,
          ].includes(jurisdiction) ? (
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