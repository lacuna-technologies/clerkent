import { databaseUse, sortByName } from '../utils'
import { sortSGCitations } from 'utils/Finder/CaseCitationFinder/SG'
import Common from '../common'
import Constants from 'utils/Constants'
import eLitigation from './eLitigation'
import Finder from 'utils/Finder'
import Helpers from 'utils/Helpers'
import IPOS from './IPOS'
import Logger from 'utils/Logger'
import OpenLaw from './OpenLaw'
import SLW from './SLW'
import SSO from './SSO'
import STB from './STB'
import { Downloads } from 'webextension-polyfill-ts'

const getLegislation = SSO.getLegislation

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`SG`, `elitigation`, () => eLitigation.getCaseByName(caseName)),
      databaseUse(`SG`, `openlaw`, () => OpenLaw.getCaseByName(caseName)),
      databaseUse(`SG`, `commonlii`, () => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.SG.name)),
      databaseUse(`SG`, `ipos`, () => IPOS.getCaseByName(caseName)),
      databaseUse(`SG`, `stb`, () => STB.getCaseByName(caseName)),
    ]))
      .filter(({ status }) => status === `fulfilled`)
      .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
      .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.SG.id)

    return sortByName(
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
  switch (abbr) {
    case `SGIPOS`: {
      return [IPOS.getCaseByCitation(citation)]
    }
    case `SGPDPC`: 
    case `SGPDPCR`: {
      // SLW is best source for now
      // PDPC's website does not include citations
      return [SLW.getCaseByCitation(citation)]
    }
    case `SGSTB`: {
      return [STB.getCaseByCitation(citation)]
    }
    default: {
      return Number.parseInt(year) >= 2000 ? [
          eLitigation.getCaseByCitation(citation),
          Common.CommonLII.getCaseByCitation(citation),
        ] : [
          OpenLaw.getCaseByCitation(citation),
          Common.CommonLII.getCaseByCitation(citation),
        ]
    }
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
): Promise<string | Downloads.DownloadOptionsType> => {
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