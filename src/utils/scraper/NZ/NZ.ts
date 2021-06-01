import nzlii from './nzlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Helpers from '../../Helpers'
import Constants from '../../Constants'
import { sortNZCitations } from '../../Finder/CaseCitationFinder/NZ'

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.all([
      nzlii.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.NZ.name),
    ]))
    .flat()
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.NZ.id)

    return sortNZCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = [`NZLR`].some(cit => citation.includes(cit)) ? [Common.CommonLII, nzlii] : [nzlii, Common.CommonLII]
  for (const option of options){
    try {
      return await option.getCaseByCitation(citation)
    } catch (error){
      Logger.error(error)
    }
  }
  return []
}

const NZ = {
  getCaseByCitation,
  getCaseByName,
}

export default NZ