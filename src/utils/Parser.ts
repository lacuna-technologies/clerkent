import { JURISDICTIONS } from './Constants'
import type Law from '../types/Law'
export interface ParseResult {
  jurisdiction: Law.JursidictionCode
  citation: String
}

const emptyParseResult: ParseResult = {
  citation: undefined,
  jurisdiction: undefined,
}

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

const parseSGCase = (query: string): ParseResult[] => {
  const regex = /\[[12]\d{3}] (SGCA|SGHC) \d{1,3}/g
  const matches = [...query.matchAll(regex)]
  if (matches.length > 0) {
    return matches.map(([citation]) => ({
      citation,
      jurisdiction: JURISDICTIONS.SG.id,
    }))
  }
  return []
}

const Parser = {
  parseSGCase,
}

export default Parser