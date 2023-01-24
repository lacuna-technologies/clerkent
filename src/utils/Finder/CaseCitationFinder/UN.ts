import Constants from '../../Constants'

export const sortUNCases = (
  citationsArray: Law.Case[],
  attribute: string,
): Law.Case[] => citationsArray

export const findUNCaseCitation = (
  query: string,
): Finder.CaseCitationFinderResult[] => {
  // TODO: figure out ICJ citation format
  return []
}