import eLitigation from './eLitigation'
import SLW from './SLW'
import Common from '../common'
import SSO from './SSO'
import type Law from 'types/Law'
import Helpers from 'utils/Helpers'
import Logger from 'utils/Logger'
import Constants from 'utils/Constants'
import { sortSGCitations } from 'utils/Finder/CaseCitationFinder/SG'
import { sortByNameSimilarity } from '../utils'
import OpenLaw from './OpenLaw'
import Finder from 'utils/Finder'
import IPOS from './IPOS'

const getLegislation = SSO.getLegislation

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      eLitigation.getCaseByName(caseName),
      OpenLaw.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.SG.name),
      IPOS.getCaseByName(caseName),
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

const getApplicableDatabases = (citation: string) => {
  const [{ year, abbr }] = Finder.findCaseCitation(citation)
  if(abbr === `SGIPOS`){
    return [IPOS.getCaseByCitation(citation)]
  } else {
    return Number.parseInt(year) >= 2000 ? [
        eLitigation.getCaseByCitation(citation),
        Common.CommonLII.getCaseByCitation(citation),
      ] : [
        OpenLaw.getCaseByCitation(citation),
        Common.CommonLII.getCaseByCitation(citation),
      ]
  }
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled(
      getApplicableDatabases(citation),
    )).filter(({ status }) => status === `fulfilled`)
      .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
      .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.SG.id)

    return sortSGCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
  [Constants.DATABASES.SG_openlaw.id]: OpenLaw,
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<string | void> => {
  Logger.log(`SG: getPDF`, inputCase, inputDocumentType)
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const SG = {
  OpenLaw,
  SLW,
  eLitigation,
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default SG