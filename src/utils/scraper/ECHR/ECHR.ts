
import HUDOC from './HUDOC'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import { databaseUseDatabase, databaseUseJurisdiction, sortByName } from '../utils'
import { sortECHRCitations } from 'utils/Finder/CaseCitationFinder/ECHR'

const databaseUseECHR = databaseUseJurisdiction(`ECHR`)
const databaseUseHUDOC = databaseUseDatabase(`hudoc`, databaseUseECHR)

const getLegislation = () => null

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUseHUDOC(() => HUDOC.getCaseByName(caseName)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({
      jurisdiction,
    }) => (
      jurisdiction === Constants.JURISDICTIONS.ECHR.id
    ))

    return sortByName(
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
  const applicableDatabases = [
    databaseUseHUDOC(() => HUDOC.getCaseByCitation(citation)),
  ]

  try {
    const results = (await Promise.allSettled(applicableDatabases))
      .filter(({ status }) => status === `fulfilled`)
      .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
      .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.SG.id)

    return sortECHRCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
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