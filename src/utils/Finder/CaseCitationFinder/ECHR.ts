import Constants from '../../Constants'

const ECtHRApplicationRegex = new RegExp(/\b\d{5}\/\d{2}/)
const ECtHROSCOLARegex = new RegExp(/[12[]\d{3}] ECHR \d{1,3}/)
const ECtHRRegex = new RegExp(`${
  ECtHRApplicationRegex.source
}|${
  ECtHROSCOLARegex.source
}`, `gi`)
// TODO: parse ECLI

export const sortECHRCases = (
  citationsArray: Law.Case[],
  attribute: string,
): Law.Case[] => citationsArray

export const findECHRCaseCitation = (
  query: string,
): Finder.CaseCitationFinderResult[] => {
  const matches = [...query.matchAll(ECtHRRegex)]
  return matches.map((match) => ({
    citation: match[0],
    index: match.index,
    jurisdiction: Constants.JURISDICTIONS.ECHR.id,
  })).map(c => ({ ...c, type: `case-citation` }))
}