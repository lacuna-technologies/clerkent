import Constants from '../../Constants'
import { formatAbbrs, sortCasesByVolume } from './utils'

export const CAAbbrs = [
  { abbr: `SCR` },
  { abbr: `SCC` },
  { abbr: `WWR` },
  { abbr: `EXP` },
  { abbr: `DLR`, appendum: `( \\(3d\\))?` },
  { abbr: `OR`, appendum: `( \\(3d\\))?` },
  { abbr: `CarswellAlta` },
  { abbr: `CarswellOnt` },
  { abbr: `OAC` },
  { abbr: `ABQB` },
  { abbr: `ABCA` },
  { abbr: `ABPC` },
  { abbr: `ABSC` },
  { abbr: `MBQB` },
  { abbr: `MBCA` },
  { abbr: `MBPC` },
  { abbr: `MBSC` },
  { abbr: `ONQB` },
  { abbr: `ONCA` },
  { abbr: `ONPC` },
  { abbr: `ONSC` },
  { abbr: `ONCJ` },
  { abbr: `BCQB` },
  { abbr: `BCPC`},
  { abbr: `BCCA` },
  { abbr: `BCSC` },
  { abbr: `LSBC` },
  { abbr: `SKQB` },
  { abbr: `SKCA` },
  { abbr: `SKPC` },
  { abbr: `SKSC` },
  { abbr: `NBQB` },
  { abbr: `NSQB` },
  { abbr: `NSCA` },
  { abbr: `NSPC` },
  { abbr: `NSSC` },
  { abbr: `BCQB` },
  { abbr: `BCPC` },
  { abbr: `BCCA` },
  { abbr: `BCSC` },
  { abbr: `QCQB`},
  { abbr: `QCCA` },
  { abbr: `QCCM` },
  { abbr: `QCCS` },
  { abbr: `QCCQ` },
  { abbr: `SCJ No` },
  { abbr: `CanLII` },
]

export const sortCACases = (
  casesArray: Law.Case[],
  attribute: string,
): Law.Case[] => sortCasesByVolume(CAAbbrs, casesArray, attribute)

export const findCACaseCitationMatches = (query: string) => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])?[12]\d{3}(-[12]\d{3})?[)\]]?)/)
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