import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'
import type { CaseCitationFinderResult } from './types'

export const SGSCAbbrs = [
  { abbr: `SGCA`, appendum: `(I)?` },
  { abbr: `SGHC`, appendum: `(F|\\(I\\))?` },
  { abbr: `SGHCR` },
]

export const neutralSGAbbrs = [
  ...SGSCAbbrs,
  { abbr: `SGDC` },
  { abbr: `SGMC` },
  { abbr: `SGIPOS` },
  { abbr: `SGPDPC` },
  { abbr: `SGPC` },
  { abbr: `SGIAC` },
  { abbr: `SGITBR` },
  { abbr: `SGJC` },
  { abbr: `SGMCA` },
  { abbr: `SGMML` },
  { abbr: `SGCRT` },
  { abbr: `SGCCS` },
  { abbr: `SGCAB` },
  { abbr: `SGAB` },
  { abbr: `SDRP` },
]

export const SGAbbrs = [
  ...neutralSGAbbrs,
  { abbr: `SLR`, appendum: `(\\(r\\))?` },
  { abbr: `MLR` },
  { abbr: `MLJ` },
]

export const sortSGCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(
  SGAbbrs, 
  citationsArray, 
  attribute,
)

export const makeCaseCitationRegex = (abbrs: typeof SGAbbrs) => new RegExp(`\\[[12]\\d{3}]( \\d{1,2})? (${
  formatAbbrs(abbrs)
}) \\d{1,4}`, `gi`)

export const findSGCaseCitationMatches = (query: string) => {
  const regex = makeCaseCitationRegex(SGAbbrs)
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