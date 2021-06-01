import HKLIIHK from './HKLIIHK'
import HKLIIORG from './HKLIIORG'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortHKCitations } from '../../Finder/CaseCitationFinder/HK'
import Helpers from '../../Helpers'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      HKLIIORG.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.HK.name),
    ]))
    .filter(({ status }) => status === `fulfilled`)
    .flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => value)
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.HK.id)

    return sortHKCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = [HKLIIORG, HKLIIHK, Common.CommonLII]
  for (const option of options){
    try {
      return await option.getCaseByCitation(citation)
    } catch (error) {
      Logger.error(error)
    }
  }
  return []
}

const HK = {
  getCaseByCitation,
  getCaseByName,
}

export default HK