import SGSC from './SGSC'
import SLW from './SLW'
import Common from '../common'
import SSO from './SSO'
import type Law from '../../../types/Law'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import Constants from '../../Constants'
import { sortSGCitations, findSGCaseCitationMatches } from '../../Finder/CaseCitationFinder/SG'

const getLegislation = SSO.getLegislation

const getCaseByName = async (caseName): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.all([
      SGSC.getCaseByName(caseName),
      SLW.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.SG.name),
    ]))
    .flat()
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.SG.id)

    return sortSGCitations(
      Helpers.uniqueBy(results, `citation`)
      .map(c => ({
          ...c,
          journal: findSGCaseCitationMatches(c.citation)[0],
      })),
      `journal`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = [`sgca`, `sghc`].some(cit => citation.includes(cit.toLowerCase())) ? [SGSC, SLW, Common.CommonLII] : [Common.CommonLII, SGSC, SLW]
  for (const option of options) {
    try {
      return await option.getCaseByCitation(citation)
    } catch (error) {
      console.error(error)
    }
  }
  return []
}

const SG = {
  SGSC,
  SLW,
  getCaseByCitation,
  getCaseByName,
  getLegislation,
}

export default SG