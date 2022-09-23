import CURIA from './CURIA'
import EPO from './EPO'
import EURLex from './EURLex'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import { databaseUseDatabase, databaseUseJurisdiction, sortByName } from '../utils'
import { sortEUCitations } from 'utils/Finder/CaseCitationFinder/EU'

const databaseUseEU = databaseUseJurisdiction(`EU`)
const databaseUseCURIA = databaseUseDatabase(`curia`, databaseUseEU)
const databaseUseEPO = databaseUseDatabase(`epo`, databaseUseEU)

const getLegislation = EURLex.getLegislation

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUseCURIA(() => CURIA.getCaseByName(caseName)),
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
  let applicableDatabases = []
  Logger.log(`EU getCaseByCitation`, citation, court)
  applicableDatabases = court === `EPO` ? [
      databaseUseEPO(() => EPO.getCaseByCitation(citation)),
    ] : [
      databaseUseCURIA(() => CURIA.getCaseByCitation(citation)),
    ]

  try {
    const results = (await Promise.allSettled(applicableDatabases))
      .filter(({ status }) => status === `fulfilled`)
      .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
      .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.EU.id)

    return sortEUCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
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