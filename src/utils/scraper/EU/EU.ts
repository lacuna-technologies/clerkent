import CURIA from './CURIA'
import EPO from './EPO'
import EURLex from './EURLex'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import { databaseUse, sortByName } from '../utils'

const getLegislation = EURLex.getLegislation

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`EU`, `curia`, () => CURIA.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.EU.id)

    return sortByName(
      caseName,
      Helpers.uniqueBy(results, `citation`),
    ) 
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
      Logger.error(error)
    }
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.EU_curia.id]: CURIA,
  [Constants.DATABASES.EU_epo.id]: EPO,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const EU = {
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default EU