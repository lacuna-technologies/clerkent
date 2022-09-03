import austlii from './austlii'
import Common from '../common'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortAUCitations } from '../../Finder/CaseCitationFinder/AU'
import Helpers from '../../Helpers'
import { sortByName, databaseUse } from '../utils'
import CommonLII from '../common/CommonLII'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`AU`, `austlii`, () => austlii.getCaseByName(caseName)),
      databaseUse(`AU`, `commonlii`, () => CommonLII.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.AU.id)

    return sortByName(
      caseName,
      sortAUCitations(
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
      austlii.getCaseByCitation(citation),
      Common.CommonLII.getCaseByCitation(citation),
    ])).filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.AU.id)

    return sortAUCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error){
    Logger.error(error)
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.AU_austlii.id]: austlii,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const AU = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default AU