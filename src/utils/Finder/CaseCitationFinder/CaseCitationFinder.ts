import Constants from '../../Constants'
import { formatAbbrs } from './utils'
import type { CaseCitationFinderResult } from './types'
import { findUKCaseCitation, sortUKCitations } from './UK'

// const emptyParseResult: ParseResult = {
//   citation: undefined,
//   jurisdiction: undefined,
// }

// const parseQuery = (query: string): ParseResult => {
//   const cleanedQuery = query.trim()
//   return parseSGCase(cleanedQuery) || emptyParseResult
// }

// const inSLW = (query: string) => {
//   const eligibleCourt = Array.isArray(query.match(/SGCA|SGHC/))

//   const yearRegex = /^\[(2\d{3})]/
//   const yearMatch = query.match(yearRegex)
//   const eligibleYear = Array.isArray(yearMatch) && Number.parseInt(yearMatch[1]) >= 2000

//   return eligibleCourt && eligibleYear
// }

// const inSGSC = (query: string) => inSLW(query)


const findSGCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const regex = /\[[12]\d{3}]( \d{1,2})? (sgca(\(i\))?|sghc|sgdc|sgmc|slr(\(r\))?) \d{1,4}/gi
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}


export const epoRegex = new RegExp(/[GJT][ _]?\d{1,4}\/\d{1,2}/)
export const cjeuRegex = new RegExp(/[CT]-\d{1,3}\/\d{1,2}/)

const findEUCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const regex = new RegExp(`(${epoRegex.source})|(${cjeuRegex.source})`, `gi`)
  const cleanedQuery = query.replace(/‑/g, `-`)

  const matches = [...cleanedQuery.matchAll(regex)]
  if(matches.length > 0){
    return matches.map((match) => ({
      citation: match[0],
      court: match[1] ? Constants.COURTS.EU_epo.id : Constants.COURTS.EU_cjeu.id,
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}

const findHKCaseCitation = (query: string): CaseCitationFinderResult[] => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs([
    { abbr: `HKCA` },
    { abbr: `HKCFA` },
    { abbr: `HKCFI` },
    { abbr: `HKLRD` },
    { abbr: `HKCFAR` },
    { abbr: `HKC` },
    { abbr: `HKDC` },
    { abbr: `HKFC` },
    { abbr: `HKLdT` },
    { abbr: `HKCT` },
    { abbr: `HKCrC` },
    { abbr: `HKOAT` },
    { abbr: `HKLaT` },
    { abbr: `HKMagC` },
  ])
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}

const findCACaseCitation = (query: string): CaseCitationFinderResult[] => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs([
    { abbr: `SCR` },
    { abbr: `WWR` },
    { abbr: `EXP` },
    { abbr: `CarswellAlta` },
    { abbr: `SCJ No` },
  ])
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.CA.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}

const findAUCaseCitation = (query: string): CaseCitationFinderResult[] => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs([
    { abbr: `HCA` },
    { abbr: `UKPCHCA` },
    { abbr: `FamCA` },
    { abbr: `HCASum` },
    { abbr: `NSWSC` },
    { abbr: `NSWCA` },
    { abbr: `NSWCCA` },
    { abbr: `NSWCIMC` },
    { abbr: `NSWCC` },
    { abbr: `NSWDC` },
    { abbr: `NSWDRGC` },
    { abbr: `NSWIC` },
    { abbr: `NSWKnoxRp` },
    { abbr: `NSWLR` },
    { abbr: `NSWR` },
    { abbr: `SR \\(NSW\\)`},
    { abbr: `CLR` },
    { abbr: `FCA` },
    { abbr: `FCAFC` },
    { abbr: `FCCA` },
    { abbr: `FMCA` },
    { abbr: `FMCAfam` },
    { abbr: `IRCA` },
    { abbr: `FCR` },
    { abbr: `ALR` },
    { abbr: `QCA` },
    { abbr: `QSC` },
    { abbr: `QDC` },
    { abbr: `QChC` },
    { abbr: `QChCM` },
    { abbr: `ICQ` },
    { abbr: `QIC` },
    { abbr: `QLC` },
    { abbr: `VSC` },
    { abbr: `VicSC` },
    { abbr: `VSCA` },
    { abbr: `VicCorC` },
    { abbr: `VCC` },
    { abbr: `VMC` },
    { abbr: `VicRp` },
    { abbr: `VicLawRp` },
    { abbr: `WASC` },
    { abbr: `WASCA` },
    { abbr: `WALawRp` },
    { abbr: `WADC` },
    { abbr: `FWCA` },
    { abbr: `FCWAM` },
    { abbr: `WACIC` },
    { abbr: `WAGAB` },
    { abbr: `WASupC` },
    { abbr: `WAR` },
    { abbr: `TASSC` },
    { abbr: `TASFC` },
    { abbr: `TASCCA` },
    { abbr: `TASMC` },
    { abbr: `TASSupC` },
    { abbr: `TASLawRp` },
    { abbr: `TASStRp` },
    { abbr: `TASRp` },
    { abbr: `TASADT` },
    { abbr: `TASFPT` },
    { abbr: `SASC` },
    { abbr: `SASCA` },
    { abbr: `SASCFC` },
    { abbr: `SADC` },
    { abbr: `SAERDC` },
    { abbr: `SALC` },
    { abbr: `SAPelhamRp` },
    { abbr: `SAIRC` },
    { abbr: `SAIndRp` },
    { abbr: `SALawRp` },
    { abbr: `SAStRp` },
    { abbr: `SAWC` },
    { abbr: `SACAT` },
    { abbr: `NTSC` },
    { abbr: `NTCA` },
    { abbr: `NTCCA` },
    { abbr: `NTMC` },
    { abbr: `NTJud` },
    { abbr: `NTLC` },
    { abbr: `ACTCA` },
    { abbr: `ACTSCFC` },
    { abbr: `ACTSC` },
    { abbr: `ACTCD` },
    { abbr: `ACTIC` },
    { abbr: `ACTMC` },
    { abbr: `ACAT` },
    { abbr: `ADO` },
    { abbr: `AUDND` },
    { abbr: `NFSC` },
  ])
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}

const findNZCaseCitation = (query: string): CaseCitationFinderResult[] => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs([
    { abbr: `NZCA` },
    { abbr: `NZSC` },
    { abbr: `NZHC` },
    { abbr: `NZLR` },
    { abbr: `NZAR` },
    { abbr: `NZFC` },
    { abbr: `NZPC` },
    { abbr: `NZDC` },
  ])
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.NZ.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}
const findCaseCitation = (query: string): CaseCitationFinderResult[] => {
  return [
    ...findSGCaseCitation(query),
    ...findUKCaseCitation(query),
    ...findEUCaseCitation(query),
    ...findHKCaseCitation(query),
    ...findCACaseCitation(query),
    ...findAUCaseCitation(query),
    ...findNZCaseCitation(query),
  ]
}

const CaseFinder = {
  findAUCaseCitation,
  findCACaseCitation,
  findCaseCitation,
  findEUCaseCitation,
  findHKCaseCitation,
  findSGCaseCitation,
  findUKCaseCitation,
  sortUKCitations,
}

export default CaseFinder