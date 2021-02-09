import { JURISDICTIONS } from './Constants'
import type Law from '../types/Law'
export interface FinderResult {
  jurisdiction: Law.JursidictionCode
  citation: String,
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
  ]
}

const findSGCase = (query: string): FinderResult[] => {
  const regex = /\[[12]\d{3}] (SGCA|SGHC) \d{1,3}/g
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

const Finder = {
  findCase,
  findSGCase,
}

export default Finder