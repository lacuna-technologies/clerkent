import Constants from '../../Constants'
import { formatAbbrs, sortCitationsByVolume } from './utils'

const UKAbbrs = [
    { abbr: `UKSC` },
    { abbr: `UKHL` },
    { abbr: `UKPC` },
    { abbr: `AC` },
    { abbr: `HL Cas` },

    { abbr: `EWCA`, appendum: `( Civ| Crim)?` },
    { abbr: `App Cas` },
    { abbr: `Cr App R` },

    { abbr: `CSIH` },
    { abbr: `ScotCS CSIH` },
    { abbr: `SCLR` },

    { abbr: `EWHC`, appendum: `( Patents)?` },
    { abbr: `CSOH` },
    { abbr: `ScotCS CSOH` },
    { abbr: `QB`, appendum: `(D)?` },
    { abbr: `KB` },
    { abbr: `Ch`, appendum: `( D)?` },
    { abbr: `WLR`, appendum: `( ?\\(D\\))?` },
    { abbr: `All ER`, appendum: `( \\((D|Comm.?)\\))?` },
    { abbr: `UKIPTrib` },
    { abbr: `HRLR` },
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
    { abbr: `Ves Sen` },
    { abbr: `EngR` },
    { abbr: `Lloyd's Rep` },
    { abbr: `BLR` },
    { abbr: `CLC` },
  ]

export const sortUKCitations = (citationsArray: any[], attribute = null) => sortCitationsByVolume(
  UKAbbrs,
  citationsArray,
  attribute,
)

const ukIPORegex = /(\[\d{4}] UKIntelP o\d{5}|O\/?\d{3}\/?(?<year>\d{2}))/

export const findUKCaseCitationMatches = (query: string) => {
  const abbrs = formatAbbrs(UKAbbrs)
  const yearRegex = new RegExp(/[12]\d{3}/)
  const openYearRegex = new RegExp(/[([]/)
  const endYearRegex = new RegExp(/(-([12]\d{3}|\d{2}))/)
  const closeYearRegex = new RegExp(/[)\]]/)
  const volumeRegex = new RegExp(/( \d{1,2})?/)
  const pageRegex = new RegExp(/(\d{2}_\d{2}-[A-Z]{1,2}|\d{1,4})/)
  const regex = new RegExp(
    `(`+
      `(${openYearRegex.source}(?<year>${yearRegex.source})${endYearRegex.source}?${closeYearRegex.source})`+
      `${volumeRegex.source} `+
      `(?<abbr>${abbrs})`+
      `[ _]${pageRegex.source}`+
      `|`+
      `(?<ukipo>${ukIPORegex.source})`+
    `)`, `gi`)

  return [...query.matchAll(regex)]
}

const formatUKIPOYear = (shortYear: string) => {
  const shortYearNumber = Number.parseInt(shortYear)
  return shortYearNumber > 90 ? `19${shortYear}` : `20${shortYear}`
}

export const findUKCaseCitation = (query:string): Finder.CaseCitationFinderResult[] => {
  const matches = findUKCaseCitationMatches(query)
  if (matches.length > 0) {
    return sortUKCitations(
      matches.map((match) => {
        const abbr = match.groups.ukipo
          ? `UKIPO`
          : match.groups.abbr
        
        const year = match.groups.ukipo
          ? formatUKIPOYear(match[0].slice(-2))
          : match.groups.year

        return {
          abbr,
          citation: match[0],
          index: match.index,
          jurisdiction: Constants.JURISDICTIONS.UK.id,
          type: `case-citation`,
          year,
        }
      }),
      `abbr`,
    )
  }
  return []
}