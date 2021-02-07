import { JURISDICTIONS } from './Constants'
import SLW from './SLW'
import SGSC from './SGSC'

export interface Links {
  slw: string | null
  lawnet: string | null
  SGSC: string | null
}

export interface ParseResult {
  jurisdiction: keyof typeof JURISDICTIONS
  citation: string
  links: Links
}

const parseQuery = (query: string): ParseResult => {
  const cleanedQuery = query.trim()
  return parseSGCase(cleanedQuery) || {}
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
        SGsc: inSGSC ? SGSC.getSearchResults(query) : null,
        slw: inSLW ? SLW.getSearchResults(query) : null,
      },
    }
  }
  return null
}

const Parser = {
  parseQuery,
}

export default Parser