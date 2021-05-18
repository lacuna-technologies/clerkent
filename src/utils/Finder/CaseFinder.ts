import Constants from '../Constants'
import type Law from '../../types/Law'
export interface CaseFinderResult {
  jurisdiction: Law.JursidictionCode
  citation: string,
  index: number,
  court? : string,
  type: `case`
}

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

const findCase = (query: string): CaseFinderResult[] => {
  return [
    ...findSGCase(query),
    ...findUKCase(query),
    ...findEUCase(query),
    ...findHKCase(query),
  ]
}

const formatAbbrs = (abbrArray) => abbrArray.map(({ abbr, appendum }) => `${abbr
    .split(``)
    .map(letter =>
      /[a-z]/i.test(letter)
        ? letter+`\\.?`
        : letter,
    ).join(``)
    }${appendum ? appendum : ``}`,
  ).join(`|`)

const findSGCase = (query: string): CaseFinderResult[] => {
  const regex = /\[[12]\d{3}]( \d{1,2})? (sgca(\(i\))?|sghc|sgdc|sgmc|slr(\(r\))?) \d{1,4}/gi
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
    })).map(c => ({ ...c, type: `case` }))
  }
  return []
}

const findUKCase = (query:string): CaseFinderResult[] => {
  const abbrs = formatAbbrs([
    { abbr: `EWCA`, appendum: `( Civ| Crim)?` },
    { abbr: `EWHC`, appendum: `( Patents)?` },
    { abbr: `UKSC` },
    { abbr: `UKPC` },
    { abbr: `UKHL` },
    { abbr: `AC` },
    { abbr: `Ch`, appendum: `( D)?` },
    { abbr: `QB`, appendum: `(D)?` },
    { abbr: `KB` },
    { abbr: `WLR`, appendum: `( ?\\(D\\))?` },
    { abbr: `All ER`, appendum: `( \\(D\\))?` },
    { abbr: `BCLC` },
    { abbr: `BCC` },
    { abbr: `HL Cas` },
    { abbr: `App Cas` },
    { abbr: `Ld Raym` },
    { abbr: `FSR` },
    { abbr: `ECC` },
    { abbr: `ITCLR` },
    { abbr: `RPC` },
    { abbr: `Ex Rep` },
    { abbr: `ER` },
    { abbr: `Cr App R` },
    { abbr: `ALR` },
    { abbr: `FLR` },
    { abbr: `Hare` },
    { abbr: `H & Tw` },
    { abbr: `EMLR` },
    { abbr: `Fam` },
    { abbr: `Macq` },
    { abbr: `TLR` },
    { abbr: `Ves & B` },
    { abbr: `EngR` },
  ])
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/((\[|\()[12]\d{3}(-[12]\d{3})?(\]|\)))/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
    })).map(c => ({ ...c, type: `case` }))
  }
  return []
}

export const epoRegex = new RegExp(/[GJT][ _]?\d{1,4}\/\d{1,2}/)
export const cjeuRegex = new RegExp(/[CT]-\d{1,3}\/\d{1,2}/)

const findEUCase = (query: string): CaseFinderResult[] => {
  const regex = new RegExp(`(${epoRegex.source})|(${cjeuRegex.source})`, `gi`)
  const cleanedQuery = query.replace(/‑/g, `-`)

  const matches = [...cleanedQuery.matchAll(regex)]
  if(matches.length > 0){
    return matches.map((match) => ({
      citation: match[0],
      court: match[1] ? Constants.COURTS.EU_epo.id : Constants.COURTS.EU_cjeu.id,
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
    })).map(c => ({ ...c, type: `case` }))
  }
  return []
}

const findHKCase = (query: string): CaseFinderResult[] => {
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?(\)]))/)
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
    })).map(c => ({ ...c, type: `case` }))
  }
  return []
}

const CaseFinder = {
  findCase,
  findEUCase,
  findHKCase,
  findSGCase,
  findUKCase,
}

export default CaseFinder