import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'

export const MYAbbrs = [
  { abbr: `MYFC` },
  { abbr: `UKPC` },
  { abbr: `MYCA` },
  { abbr: `MYMHC` },
  { abbr: `MYSSHC` },
  { abbr: `MLR` },
  { abbr: `MLJ` },
  { abbr: `CLJ` },
]

export const sortMYCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(
  MYAbbrs, 
  citationsArray, 
  attribute,
)

export const findMYCaseCitationMatches = (query: string) => {
  const regex = new RegExp(`\\[[12]\\d{3}]( \\d{1,2})? (${
    formatAbbrs(MYAbbrs)
  }) \\d{1,4}`, `gi`)
  return [...query.matchAll(regex)]
}

export const findMYCaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
  const matches = findMYCaseCitationMatches(query)
  return matches.map((match) => ({
    citation: match[0],
    index: match.index,
    jurisdiction: Constants.JURISDICTIONS.MY.id,
  })).map(c => ({ ...c, type: `case-citation` }))
}