import canlii from './canlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortCACitations } from '../../Finder/CaseCitationFinder/CA'
import Helpers from '../../Helpers'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      canlii.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.CA.name),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.CA.id)

    return sortCACitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = [canlii, Common.CommonLII]
  for (const option of options){
    try {
      return await option.getCaseByCitation(citation)
    } catch (error){
      Logger.error(error)
    }
  }
  return []
}

const CA = {
  getCaseByCitation,
  getCaseByName,
}

export default CA