import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'
import type { CaseCitationFinderResult } from './types'

export const SGAbbrs = [
  { abbr: `SGCA`, appendum: `(I)?` },
  { abbr: `SGHC`, appendum: `(I)?` },
  { abbr: `SLR`, appendum: `(\\(r\\))?` },
  { abbr: `SGDC` },
  { abbr: `SGMC` },
]

export const sortSGCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(SGAbbrs, citationsArray, attribute)

export const findSGCaseCitationMatches = (query: string) => {
  const regex = new RegExp(`\\[[12]\\d{3}]( \\d{1,2})? (${
    formatAbbrs(SGAbbrs)
  }) \\d{1,4}`, `gi`)
  return [...query.matchAll(regex)]
}

export const findSGCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const matches = findSGCaseCitationMatches(query)
  return matches.map((match) => ({
    citation: match[0],
    index: match.index,
    jurisdiction: Constants.JURISDICTIONS.SG.id,
  })).map(c => ({ ...c, type: `case-citation` }))
}