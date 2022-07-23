import Kehakiman from './Kehakiman'
import Common from '../common'
import Constants from '../../Constants'
import { sortMYCitations } from '../../Finder/CaseCitationFinder/MY'
import Helpers from '../../Helpers'
import { databaseUse, sortByNameSimilarity } from '../utils'
import Logger from '../../Logger'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`MY`, `commonlii`, () => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.MY.name)),
      databaseUse(`MY`, `kehakiman`, () => Kehakiman.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.MY.id)
  
    return sortByNameSimilarity(
      caseName,
      sortMYCitations(
        Helpers.uniqueBy(results, `citation`),
        `citation`,
      ),
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      Common.CommonLII.getCaseByCitation(citation),
      Kehakiman.getCaseByCitation(citation),
    ])).filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.MY.id)

    return sortMYCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error){
    Logger.error(error)
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const MY = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default MY