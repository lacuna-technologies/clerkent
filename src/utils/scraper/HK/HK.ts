// import HKLIIHK from './HKLIIHK'
import HKLIIORG from './HKLIIORG'
import LRS from './LRS'
import Common from '../common'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortHKCitations } from '../../Finder/CaseCitationFinder/HK'
import Helpers from '../../Helpers'
import { databaseUseDatabase, databaseUseJurisdiction, sortByName } from '../utils'

const databaseUseHK = databaseUseJurisdiction(`HK`)
const databaseUseLRS = databaseUseDatabase(`lrs`, databaseUseHK)
const databaseUseHKLIIIORG = databaseUseDatabase(`hkliiorg`, databaseUseHK)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseHK)

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUseLRS(() => LRS.getCaseByName(caseName)),
      databaseUseHKLIIIORG(() => HKLIIORG.getCaseByName(caseName)),
      databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.HK.name)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.HK.id)

    return sortByName(
      caseName,
      sortHKCitations(
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
      databaseUseLRS(() => LRS.getCaseByCitation(citation)),
      databaseUseHKLIIIORG(() => HKLIIORG.getCaseByCitation(citation)),
      databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
    ])).filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.HK.id)

    return sortHKCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error){
    Logger.error(error)
  }
  return []
}


const databaseMap = {
  [Constants.DATABASES.HK_lrs.id]: LRS,
  [Constants.DATABASES.HK_hkliiorg.id]: HKLIIORG,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const HK = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default HK