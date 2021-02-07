import React from 'react'
import type { Links } from '../utils/Parser'
import './LinkResults.scss'

const URLS = {
  EWlegislation: `https://www.legislation.gov.uk/`,
  EWlexis: `http://www.lexisnexis.com/uk/legal`,
  EWwestlaw: `https://signon.thomsonreuters.com/federation/UKF?entityID=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&returnto=https%3A%2F%2Fwestlawuk.thomsonreuters.co.uk%2FBrowse%2FHome%2FWestlawUK%3FskipAnonymous%3Dtrue`,
  
  SGSC: {
    icon: ``,
    name: `Supreme Court (Singapore)`,
    url: `https://www.supremecourt.gov.sg/news/supreme-court-judgments`,
  },
  SGlexis: `https://www.lexread.lexisnexis.com/`,
  SGwestlaw: `https://www.westlawasia.com/singapore/`,
  lawnet: {
    icon: ``,
    name: `Lawnet`,
    url: `https://www.lawnet.sg/lawnet/web/lawnet/home`,
  },
  slw: {
    icon: ``,
    name: `Singapore Law Watch`,
    url: `https://www.singaporelawwatch.sg/Judgments`,
  },
  sso: `https://sso.agc.gov.sg/`,
}

const defaultLinks: Links = {
  SGSC: URLS.SGSC.url,
  lawnet: URLS.lawnet.url,
  slw: URLS.slw.url,
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