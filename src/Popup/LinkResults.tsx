import React from 'react'
import type { Links } from '../utils/Parser'
import './LinkResults.scss'

const URLS = {
  EWwestlaw: `https://signon.thomsonreuters.com/federation/UKF?entityID=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&returnto=https%3A%2F%2Fwestlawuk.thomsonreuters.co.uk%2FBrowse%2FHome%2FWestlawUK%3FskipAnonymous%3Dtrue`,
  EWlexis: `http://www.lexisnexis.com/uk/legal`,
  EWlegislation: `https://www.legislation.gov.uk/`,
  
  lawnet: {
    name: `Lawnet`,
    icon: ``,
    url: `https://www.lawnet.sg/lawnet/web/lawnet/home`
  },
  sso: `https://sso.agc.gov.sg/`,
  SGwestlaw: `https://www.westlawasia.com/singapore/`,
  SGlexis: `https://www.lexread.lexisnexis.com/`,
  slw: {
    name: `Singapore Law Watch`,
    icon: ``,
    url: `https://www.singaporelawwatch.sg/Judgments`
  },
  SGSC: {
    name: `Supreme Court (Singapore)`,
    icon: ``,
    url: `https://www.supremecourt.gov.sg/news/supreme-court-judgments`
  }
}

const defaultLinks: Links = {
  slw: URLS.slw.url,
  lawnet: URLS.lawnet.url,
  SGSC: URLS.SGSC.url,
}

const LinkResults = ({ links = defaultLinks }) => (
  <section id="link-results">
    <h1>Links</h1>
    <div className="links">
      {
        Object.entries(links).filter(([_, value]) => value !== null).map(([key, value]) => (
          <a href={value}>
            {URLS[key].name}
          </a>
        ))
        }
    </div>
  </section>
)

export default LinkResults