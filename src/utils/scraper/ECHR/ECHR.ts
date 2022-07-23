
import HUDOC from './HUDOC'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import { databaseUse, sortByNameSimilarity } from '../utils'

const getLegislation = () => null

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`ECHR`, `hudoc`, () => HUDOC.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({
      jurisdiction,
    }) => (
      jurisdiction === Constants.JURISDICTIONS.ECHR.id
    ))

    return sortByNameSimilarity(
      caseName,
      Helpers.uniqueBy(results, `citation`),
    ) 
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (
  citation: string,
  court: string,
): Promise<Law.Case[]> => {
  const options = [HUDOC]
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
  [Constants.DATABASES.ECHR_hudoc.id]: HUDOC,
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const ECHR = {
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default ECHR