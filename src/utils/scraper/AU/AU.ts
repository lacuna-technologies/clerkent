import austlii from './austlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { findAUCaseCitation, sortAUCitations } from '../../Finder/CaseCitationFinder/AU'
import Helpers from '../../Helpers'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.all([
      austlii.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.AU.name),
    ]))
    .flat()
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.AU.id)

    return sortAUCitations(
      Helpers.uniqueBy(results, `citation`)
      .map((c: Law.Case) => ({
          ...c,
          journal: findAUCaseCitation(c.citation)[0],
      })),
      `journal`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = [austlii, Common.CommonLII]
  for (const option of options){
    try {
      return await option.getCaseByCitation(citation)
    } catch (error){
      Logger.error(error)
    }
  }
  return []
}

const AU = {
  getCaseByCitation,
  getCaseByName,
}

export default AU