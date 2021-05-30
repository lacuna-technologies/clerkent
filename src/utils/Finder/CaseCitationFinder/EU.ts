import Constants from '../../Constants'
import type { CaseCitationFinderResult } from './types'

export const epoRegex = new RegExp(/[GJT][ _]?\d{1,4}\/\d{1,2}/)
export const cjeuRegex = new RegExp(/[CT]-\d{1,3}\/\d{1,2}/)

// TODO: sort by year
export const sortEUCitations = (citationsArray: any[], attribute = null) => citationsArray

export const findEUCaseCitation = (query: string): CaseCitationFinderResult[] => {
  const regex = new RegExp(`(${epoRegex.source})|(${cjeuRegex.source})`, `gi`)
  const cleanedQuery = query
    .replace(/‑/g, `-`)
    .replace(/case /gi, `C-`)

  const matches = [...cleanedQuery.matchAll(regex)]

  return matches.map((match) => ({
    citation: match[0],
    court: match[1] ? Constants.COURTS.EU_epo.id : Constants.COURTS.EU_cjeu.id,
    index: match.index,
    jurisdiction: Constants.JURISDICTIONS.EU.id,
  })).map(c => ({ ...c, type: `case-citation` }))
}