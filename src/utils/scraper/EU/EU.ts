import CURIA from './CURIA'
import EPO from './EPO'
import EURLex from './EURLex'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'

const getLegislation = EURLex.getLegislation

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.all([
      CURIA.getCaseByName(caseName),
    ]))
    .flat()
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.EU.id)

    return Helpers.uniqueBy(results, `citation`)
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = court === `EPO` ? [EPO] : [CURIA]
  for (const option of options){
    try {
      return await option.getCaseByCitation(citation)
    } catch (error) {
      console.error(error)
    }
  }
  return []
}

const EU = {
  getCaseByCitation,
  getCaseByName,
  getLegislation,
}

export default EU