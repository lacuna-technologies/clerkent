import Constants from '../../Constants'
import { formatAbbrs, sortCasesByVolume, sortCitationsByVolume } from './utils'
import { SGSTBlongFormatRegex } from 'utils/scraper/SG/STB'

export const SGSCAbbrs = [
  { abbr: `SGCA`, appendum: `(\\(I\\))?` },
  { abbr: `SGHC`, appendum: `(R|F|\\(I\\)|\\(A\\))?` },
]

export const neutralSGAbbrs = [
  ...SGSCAbbrs,
  { abbr: `SDRP` },
  { abbr: `SGAB` },
  { abbr: `SGCAB` },
  { abbr: `SGCCS` },
  { abbr: `SGCRT` },
  { abbr: `SGDC` },
  { abbr: `SGFC` },
  { abbr: `SGYC` },
  { abbr: `SGDSC` },
  { abbr: `SGIAC` },
  { abbr: `SGIPOS` },
  { abbr: `SGITBR` },
  { abbr: `SGJC` },
  { abbr: `SGMC` },
  { abbr: `SGMCA` },
  { abbr: `SGMML` },
  { abbr: `SGPC` },
  { abbr: `SGPDPC` },
  { abbr: `SGPDPCR` },
  { abbr: `SGSTB` },
]

export const SGAbbrs = [
  ...neutralSGAbbrs,
  { abbr: `SLR`, appendum: `(\\(r\\))?` },
  { abbr: `MLR` },
  { abbr: `MLJ` },
]

export const sortSGCases = (
  citationsArray: Law.Case[],
  attribute: string,
): Law.Case[] => sortCasesByVolume(
  SGAbbrs, 
  citationsArray,
  attribute,
)

export const makeCaseCitationRegex = (abbrs: typeof SGAbbrs) => new RegExp(
  `(`+
    `\\[(?<year>[12]\\d{3})\\]( \\d{1,2})? (?<abbr>${
      formatAbbrs(abbrs)
    }) \\d{1,4}`+
    `|`+
    `(?<stb>${SGSTBlongFormatRegex.source})`+
  `)`, `gi`)

export const findSGCaseCitationMatches = (query: string) => {
  const regex = makeCaseCitationRegex(SGAbbrs)
  return [...query.matchAll(regex)]
}

const getAbbr = (match) => {
  if(match.groups.stb){
    return `SGSTB`
  }
  return match.groups.abbr
}

export const findSGCaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
  const matches = findSGCaseCitationMatches(query)
  return matches.map((match) => ({
    abbr: getAbbr(match),
    citation: match[0],
    index: match.index,
    jurisdiction: Constants.JURISDICTIONS.SG.id,
    type: `case-citation`,
    year: match.groups.year,
  }))
}