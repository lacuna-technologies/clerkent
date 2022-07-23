// import HKLIIHK from './HKLIIHK'
import HKLIIORG from './HKLIIORG'
import LRS from './LRS'
import Common from '../common'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortHKCitations } from '../../Finder/CaseCitationFinder/HK'
import Helpers from '../../Helpers'
import { databaseUse, sortByNameSimilarity } from '../utils'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUse(`HK`, `lrs`, () => LRS.getCaseByName(caseName)),
      databaseUse(`HK`, `hkliiorg`, () => HKLIIORG.getCaseByName(caseName)),
      databaseUse(`HK`, `commonlii`, () => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.HK.name)),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.HK.id)

    return sortByNameSimilarity(
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
      LRS.getCaseByCitation(citation),
      HKLIIORG.getCaseByCitation(citation),
      // HKLIIHK.getCaseByCitation(citation),
      Common.CommonLII.getCaseByCitation(citation),
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