import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'
import type { CaseCitationFinderResult } from './types'

export const NZAbbrs = [
  { abbr: `NZSC` },
  { abbr: `NZPC` },
  { abbr: `NZCA` },
  { abbr: `NZAR` },
  { abbr: `NZLR` }, 
  { abbr: `NZHC` },
  { abbr: `ACJ` },
  { abbr: `NZILR` },
  { abbr: `NZGazLawRp` },
  { abbr: `NZFC` },
  { abbr: `NZDC` },
]

export const sortNZCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(
  NZAbbrs,
  citationsArray,
  attribute,
)

export const findNZCaseCitationMatches = (query: string) => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs(NZAbbrs)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  return [...query.matchAll(regex)]
}

export const findNZCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const matches = findNZCaseCitationMatches(query)
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.NZ.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}