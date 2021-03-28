import { Constants } from '../utils'
import type Law from '../types/Law'
export interface FinderResult {
  jurisdiction: Law.JursidictionCode
  citation: string,
  index: number
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

const findCase = (query: string): FinderResult[] => {
  return [
    ...findSGCase(query),
    ...findUKCase(query),
    ...findEUCase(query),
    ...findHKCase(query),
  ]
}

const findSGCase = (query: string): FinderResult[] => {
  const regex = /\[[12]\d{3}]( \d{1,2})? (SGCA|SGHC|SGDC|SGMC|SLR(\(R\))?) \d{1,4}/g
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
    }))
  }
  return []
}

const findUKCase = (query:string): FinderResult[] => {
  const abbrs = [
    `EWCA( Civ)?`,
    `EWHC( Patents)?`,
    `UKSC`,
    `UKPC`,
    `UKHL`,
    `AC`,
    `Ch( D)?`,
    `QB(D)?`,
    `KB`,
    `WLR( \\(D\\))?`,
    `All ER( \\(D\\))?`,
    `BCLC`,
    `BCC`,
    `HL Cas`,
    `App Cas`,
    `Ld Raym`,
    `FSR`,
    `ECC`,
    `ITCLR`,
    `RPC`,
    `Ex Rep`,
  ].map(abbr => abbr.split(``).map(letter => letter+`\\.?`).join(``)).join(`|`)
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/((\[|\()[12]\d{3}(-[12]\d{3})?(\]|\)))/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `g`)
  
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
    }))
  }
  return []
}

const findEUCase = (query: string): FinderResult[] => {
  const regex = /C-\d{1,3}\/\d{1,2}/g

  const matches = [...query.matchAll(regex)]
  if(matches.length > 0){
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
    }))
  }
  return []
}

const findHKCase = (query: string): FinderResult[] => {
  const regex = /\[[12]\d{3}] (HKCA|HKCFA|HKCFI) \d{1,4}/g
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
    }))
  }
  return []
}

const Finder = {
  findCase,
  findEUCase,
  findHKCase,
  findSGCase,
  findUKCase,
}

export default Finder