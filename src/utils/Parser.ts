import { JURISDICTIONS, DATABASE_URLS } from './Constants'
import SLW from './SLW'
import SGSC from './SGSC'
export interface ParseResult {
  jurisdiction: keyof typeof JURISDICTIONS
  citation: string
  links: Record<string, string | null>
}

const emptyParseResult: ParseResult = {
  citation: undefined,
  jurisdiction: undefined,
  links: {
    SG_sc: DATABASE_URLS.SG_sc.url,
    SG_slw: DATABASE_URLS.SG_slw.url,
  },
}

const parseQuery = (query: string): ParseResult => {
  const cleanedQuery = query.trim()
  return parseSGCase(cleanedQuery) || emptyParseResult
}

const inSLW = (query: string) => {
  const eligibleCourt = Array.isArray(query.match(/SGCA|SGHC/))

  const yearRegex = /^\[(2\d{3})]/
  const yearMatch = query.match(yearRegex)
  const eligibleYear = Array.isArray(yearMatch) && Number.parseInt(yearMatch[1]) >= 2000

  return eligibleCourt && eligibleYear
}

const inSGSC = (query: string) => inSLW(query)

const parseSGCase = (query: string): any | null => {
  const regex = /^\[[12]\d{3}] (SGCA|SGHC) \d{1,3}$/
  const match = query.match(regex)
  if (Array.isArray(match)) {
    return {
      citation: match[0],
      jurisdiction: JURISDICTIONS.SG.id,
      links: {
        SG_sc: inSGSC ? SGSC.getSearchResults(query) : null,
        SG_slw: inSLW ? SLW.getSearchResults(query) : null,
      },
    }
  }
  return null
}

const Parser = {
  parseQuery,
}

export default Parser