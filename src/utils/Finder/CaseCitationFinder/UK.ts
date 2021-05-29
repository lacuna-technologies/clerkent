import Constants from '../../Constants'
import { formatAbbr, formatAbbrs } from './utils'
import type { CaseCitationFinderResult } from './types'

const UKAbbrs = [
    { abbr: `UKSC` },
    { abbr: `UKHL` },
    { abbr: `UKPC` },
    { abbr: `AC` },
    { abbr: `HL Cas` },

    { abbr: `EWCA`, appendum: `( Civ| Crim)?` },
    { abbr: `App Cas` },
    { abbr: `Cr App R` },

    { abbr: `EWHC`, appendum: `( Patents)?` },
    { abbr: `QB`, appendum: `(D)?` },
    { abbr: `KB` },
    { abbr: `Ch`, appendum: `( D)?` },
    { abbr: `WLR`, appendum: `( ?\\(D\\))?` },
    { abbr: `All ER`, appendum: `( \\((D|Comm.?)\\))?` },
    { abbr: `BCLC` },
    { abbr: `BCC` },
    { abbr: `Ld Raym` },
    { abbr: `FSR` },
    { abbr: `ECC` },
    { abbr: `ITCLR` },
    { abbr: `RPC` },
    { abbr: `Ex Rep` },
    { abbr: `ER` },
    { abbr: `ALR` },
    { abbr: `FLR` },
    { abbr: `Hare` },
    { abbr: `H & Tw` },
    { abbr: `EMLR` },
    { abbr: `Fam` },
    { abbr: `Macq` },
    { abbr: `TLR` },
    { abbr: `Ves & B` },
    { abbr: `EngR` },
    { abbr: `Lloyd's Rep` },
    { abbr: `BLR` },
    { abbr: `CLC` },
  ]

export const sortUKCitations = (citationsArray: any[], attribute = null) => {
  if(attribute === null){
    return citationsArray.sort((a, b) => {
      const indexA = UKAbbrs.findIndex(currentAbbr => new RegExp(formatAbbr(currentAbbr), `i`).test(a))
      const indexB = UKAbbrs.findIndex(currentAbbr =>  new RegExp(formatAbbr(currentAbbr), `i`).test(b))
      return indexA - indexB
    })
  }
  return sortUKCitations(citationsArray.map(c => c[attribute])).map(c => citationsArray.find(v => v[attribute] === c))
}

export const findUKCaseCitationMatches = (query: string) => {
  const abbrs = formatAbbrs(UKAbbrs)
  // eslint-disable-next-line unicorn/better-regex
  const yearRegex = new RegExp(/((\[|\()[12]\d{3}(-[12]\d{3})?(\]|\)))/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/\d{1,4}/)
  const regex = new RegExp(`${yearRegex.source}${volumeRegex.source} (${abbrs}) ${pageRegex.source}`, `gi`)

  return [...query.matchAll(regex)]
}

export const findUKCaseCitation = (query:string): CaseCitationFinderResult[] => {
  const matches = findUKCaseCitationMatches(query)
  if (matches.length > 0) {
    return matches.map((match) => ({
      citation: match[0],
      index: match.index,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
    })).map(c => ({ ...c, type: `case-citation` }))
  }
  return []
}
