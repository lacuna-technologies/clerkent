import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'
import type { CaseCitationFinderResult } from './types'

export const HKAbbrs =[
  { abbr: `HKCFA` },
  { abbr: `HKCFAR` },
  { abbr: `HKCA` },
  { abbr: `HKC` },
  { abbr: `HKLRD` },
  { abbr: `HKCFI` },
  { abbr: `HKDC` },
  { abbr: `HKFC` },
  { abbr: `HKLdT` },
  { abbr: `HKCT` },
  { abbr: `HKCrC` },
  { abbr: `HKOAT` },
  { abbr: `HKLaT` },
  { abbr: `HKMagC` },
]

export const sortHKCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(HKAbbrs, citationsArray, attribute)

export const findHKCaseCitationMatches = (query: string) => {
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/(([([])[12]\d{3}(-[12]\d{3})?[)\]])/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const abbrs = formatAbbrs(HKAbbrs)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)
  return [...query.matchAll(regex)]
}

export const findHKCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const matches = findHKCaseCitationMatches(query)
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}