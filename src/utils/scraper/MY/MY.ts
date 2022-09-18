import Kehakiman from './Kehakiman'
import Common from '../common'
import Constants from '../../Constants'
import { sortMYCitations } from '../../Finder/CaseCitationFinder/MY'
import Helpers from '../../Helpers'
import { databaseUseDatabase, databaseUseJurisdiction, sortByName } from '../utils'
import Logger from '../../Logger'

const databaseUseMY = databaseUseJurisdiction(`MY`)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseMY)
const databaseUseKehakiman = databaseUseDatabase(`kehakiman`, databaseUseMY)

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.MY.name)),
      databaseUseKehakiman(() => Kehakiman.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.MY.id)
  
    return sortByName(
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
      databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
      databaseUseKehakiman(() => Kehakiman.getCaseByCitation(citation)),
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