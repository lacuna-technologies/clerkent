import Constants from '../../Constants'
import { formatAbbr, formatAbbrs } from './utils'
import type { CaseCitationFinderResult } from './types'

export const SGAbbrs = [
  { abbr: `SGCA`, appendum: `(I)?` },
  { abbr: `SGHC`, appendum: `(I)?` },
  { abbr: `SLR`, appendum: `(\\(r\\))?` },
  { abbr: `SGDC` },
  { abbr: `SGMC` },
]

export const sortSGCitations = (citationsArray: any[], attribute = null) => {
  if(attribute === null){
    return citationsArray.sort((a, b) => {
      const indexA = SGAbbrs.findIndex(currentAbbr => new RegExp(formatAbbr(currentAbbr), `i`).test(a))
      const indexB = SGAbbrs.findIndex(currentAbbr =>  new RegExp(formatAbbr(currentAbbr), `i`).test(b))
      return indexA - indexB
    })
  }
  return sortSGCitations(citationsArray.map(c => c[attribute])).map(c => citationsArray.find(v => v[attribute] === c))
}

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