import BAILII from './BAILII'
import Common from '../common'
import LegislationGovUk from './LegislationGovUk'
import Custom from '../custom'
import Logger from '../../Logger'
import Helpers from '../../Helpers'
import { sortUKCitations } from '../../Finder/CaseCitationFinder/UK'
import Constants from '../../Constants'
import { databaseUseDatabase, databaseUseJurisdiction, sortByName } from '../utils'
import Finder from 'utils/Finder'
import UKIPO from './UKIPO'

const databaseUseUK = databaseUseJurisdiction(`UK`)
const databaseUseBailii = databaseUseDatabase(`bailii`, databaseUseUK)
const databaseUseCommonLII = databaseUseDatabase(`commonlii`, databaseUseUK)
const databaseUseIPO = databaseUseDatabase(`ipo`, databaseUseUK)

const getLegislation = LegislationGovUk.getLegislation
const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      databaseUseBailii(() => BAILII.getCaseByName(caseName)),
      databaseUseCommonLII(() => Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.UK.name)),
      databaseUseIPO(() => UKIPO.getCaseByName(caseName)),
      Custom.getCaseByName(caseName),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.UK.id)

    const uniqueResults = sortUKCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )

    return sortByName(
      caseName,
      uniqueResults,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  try {
    const [finderResult] = Finder.findCaseCitation(citation)
    const results = (await Promise.allSettled(
      finderResult.abbr === `UKIPO` ? [
        databaseUseIPO(() => UKIPO.getCaseByCitation(citation)),
      ] : [
        Custom.getCaseByCitation(citation, court),
        databaseUseBailii(() => BAILII.getCaseByCitation(citation)),
        databaseUseCommonLII(() => Common.CommonLII.getCaseByCitation(citation)),
      ],
    )).filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.UK.id)

    return sortUKCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error){
    Logger.error(error)
  }
  return []
}

const databaseMap = {
  [Constants.DATABASES.UK_bailii.id]: BAILII,
  [Constants.DATABASES.commonlii.id]: Common.CommonLII,
  [Constants.DATABASES.UK_ipo.id]: UKIPO,
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { database } = inputCase
  return databaseMap[database.id].getPDF(inputCase, inputDocumentType)
}

const UK = {
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default UK