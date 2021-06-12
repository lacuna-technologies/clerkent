import SGSC from './SGSC'
import SLW from './SLW'
import Common from '../common'
import SSO from './SSO'
import type Law from '../../../types/Law'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortSGCitations } from '../../Finder/CaseCitationFinder/SG'
import { sortByNameSimilarity } from '../utils'

const getLegislation = SSO.getLegislation

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      SGSC.getCaseByName(caseName),
      // SLW.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.SG.name),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.SG.id)

    return sortByNameSimilarity(
      caseName,
      sortSGCitations(
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
      SGSC.getCaseByCitation(citation),
      SLW.getCaseByCitation(citation),
      Common.CommonLII.getCaseByCitation(citation),
    ])).filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.SG.id)

    return sortSGCitations(
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

const SG = {
  SGSC,
  SLW,
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default SG