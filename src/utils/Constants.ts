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


type JurisdictionURLS = typeof SG_DATABASES | typeof EW_DATABASES

const SG_DATABASES: Record<string, Law.Database> = {
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
    name: `Supreme Court`,
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

const EW_DATABASES = {
  bailii: {
    icon: ``,
    name: `BAILII`,
    url: `https://bailii.org/`,
  },
  legislation: {
    icon: ``,
    name: `legislation.gov.uk`,
    url: `https://www.legislation.gov.uk/`,
  },
  lexis: {
    icon: ``,
    name: `LexisNexis`,
    url: `http://www.lexisnexis.com/uk/legal`,
  },
  westlaw: {
    icon: ``,
    name: `Westlaw`,
    url: `https://uk.westlaw.com/Browse/Home/WestlawUK`,
  },
}

const MISC_DATABASES = {
  commonlii: {
    icon: ``,
    name: `CommonLII`,
    url: `http://www.commonlii.org`,
  },
}

const dedupeJurisdictionURLs = (jurisdictionURLs: JurisdictionURLS, jurisdictionCode: Law.JursidictionCode) =>
  Object.entries(jurisdictionURLs)
  .reduce((accumulator, [id, object]: [string, Law.Database]) => ({
    ...accumulator,
    [`${jurisdictionCode}_${id}`]: object,
  }), {})


export const DATABASES: Record<string, Law.Database> = {
  ...dedupeJurisdictionURLs(SG_DATABASES, `SG`),
  ...dedupeJurisdictionURLs(EW_DATABASES, `EW`),
  ...MISC_DATABASES,
}
