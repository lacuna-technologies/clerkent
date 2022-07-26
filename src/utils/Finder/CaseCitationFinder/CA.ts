import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'

export const CAAbbrs = [
  { abbr: `SCR` },
  { abbr: `SCC` },
  { abbr: `WWR` },
  { abbr: `EXP` },
  { abbr: `DLR`, appendum: `( \\(3d\\))?` },
  { abbr: `OR`, appendum: `( \\(3d\\))?` },
  { abbr: `CarswellAlta` },
  { abbr: `SCJ No` },
]

export const sortCACitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(CAAbbrs, citationsArray, attribute)

export const findCACaseCitationMatches = (query: string) => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs(CAAbbrs)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)
  return [...query.matchAll(regex)]
}

export const findCACaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
  const matches = findCACaseCitationMatches(query)
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.CA.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}