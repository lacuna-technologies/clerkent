import type Law from '../types/Law'

export const JURISDICTIONS = {
  EW: {
    emoji: `🏴󠁧󠁢󠁥󠁮󠁧󠁿🏴󠁧󠁢󠁷󠁬󠁳󠁿`,
    id: `EW` as Law.JursidictionCode,
    name: `England & Wales`,
  },
  SG: {
    emoji: `🇸🇬`,
    id: `SG` as Law.JursidictionCode,
    name: `Singapore`,
  },
}
// const EW_DATABASE_URLS = {
//   legislation: `https://www.legislation.gov.uk/`,
//   lexis: `http://www.lexisnexis.com/uk/legal`,
//   westlaw: `https://signon.thomsonreuters.com/federation/UKF?entityID=https%3A%2F%2Fshib-idp.ucl.ac.uk%2Fshibboleth&returnto=https%3A%2F%2Fwestlawuk.thomsonreuters.co.uk%2FBrowse%2FHome%2FWestlawUK%3FskipAnonymous%3Dtrue`,
// }

interface Database {
  icon: string,
  name: string, 
  url: string
}

type JurisdictionURLS = typeof SG_DATABASE_URLS

const SG_DATABASE_URLS: Record<string, Database> = {
  lawnet: {
    icon: ``,
    name: `Lawnet`,
    url: `https://www.lawnet.sg/lawnet/web/lawnet/home`,
  },
  lexis: {
    icon: ``,
    name: `Lexread`,
    url: `https://www.lexread.lexisnexis.com/`,
  },
  sc: {
    icon: ``,
    name: `Supreme Court (Singapore)`,
    url: `https://www.supremecourt.gov.sg/news/supreme-court-judgments`,
  },
  slw: {
    icon: ``,
    name: `Singapore Law Watch`,
    url: `https://www.singaporelawwatch.sg/Judgments`,
  },
  sso: {
    icon: ``,
    name: `Singapore Statutes Online`,
    url: `https://sso.agc.gov.sg/`,
  },
  westlaw: {
    icon: ``,
    name: `Westlaw Asia`,
    url: `https://www.westlawasia.com/singapore/`,
  },
}

const dedupeJurisdictionURLs = (jurisdictionURLs: JurisdictionURLS, jurisdictionCode: Law.JursidictionCode) =>
  Object.entries(jurisdictionURLs)
  .reduce((accumulator, [id, object]: [string, Database]) => ({
    ...accumulator,
    [`${jurisdictionCode}_${id}`]: object,
  }), {})


export const DATABASE_URLS: Record<string, Database> = {
  // ...dedupeJurisdictionURLs(EW_DATABASE_URLS, `EW`),
  ...dedupeJurisdictionURLs(SG_DATABASE_URLS, `SG`),
}
