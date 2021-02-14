import { JURISDICTIONS } from './Constants'
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
    ...findEWCase(query),
  ]
}

const findSGCase = (query: string): FinderResult[] => {
  const regex = /\[[12]\d{3}] (SGCA|SGHC|SGDC|SGMC) \d{1,3}/g
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: JURISDICTIONS.SG.id,
    }))
  }
  return []
}

const findEWCase = (query:string): FinderResult[] => {
  const abbrs = [
    `EWCA`,
    `EWHC( Patents)?`,
    `UKSC`,
    `UKPC`,
    `UKHL`,
    `AC`,
    `Ch( D)?`,
    `QB`,
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
  ].map(abbr => abbr.split(``).map(letter => letter+`\\.?`).join(``)).join(`|`)
  const regex = new RegExp(`((\\[|\\()[12]\\d{3}(\\]|\\)))( \\d{1,2})? (${abbrs}) \\d{1,3}`, `g`)
  
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: JURISDICTIONS.EW.id,
    }))
  }
  return []
}

const Finder = {
  findCase,
  findEWCase,
  findSGCase,
}

export default Finder