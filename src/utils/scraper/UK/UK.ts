import type Law from '../../../types/Law'
import BAILII from './BAILII'
import Common from '../common'
import LegislationGovUk from './LegislationGovUk'
import Logger from '../../Logger'
import Helpers from '../../Helpers'
import { sortUKCitations } from '../../Finder/CaseCitationFinder/UK'
import Constants from '../../Constants'

const getLegislation = LegislationGovUk.getLegislation
const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      BAILII.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.UK.name),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.UK.id)

    return sortUKCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      BAILII.getCaseByCitation(citation),
      Common.CommonLII.getCaseByCitation(citation),
    ])).filter(({ status }) => status === `fulfilled`)
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

const UK = {
  getCaseByCitation,
  getCaseByName,
  getLegislation,
}

export default UK