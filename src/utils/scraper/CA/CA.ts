import canlii from './canlii'
import Common from '../common'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortCACitations } from '../../Finder/CaseCitationFinder/CA'
import Helpers from '../../Helpers'
import { databaseUse, sortByName } from '../utils'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`CA`, `canlii`, () => canlii.getCaseByName(caseName)),
      databaseUse(`CA`, `commonlii`, () => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.CA.name)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.CA.id)

    return sortByName(
      caseName,
      sortCACitations(
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
      canlii.getCaseByCitation(citation),
      Common.CommonLII.getCaseByCitation(citation),
    ])).filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.CA.id)

    return sortCACitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error){
    Logger.error(error)
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.CA_canlii.id]: canlii,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const CA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default CA