import type Law from '../../../types/Law'
import BAILII from './BAILII'
import Common from '../common'
import LegislationGovUk from './LegislationGovUk'
import Logger from '../../Logger'
import Helpers from '../../Helpers'
import { sortUKCitations, findUKCaseCitationMatches } from '../../Finder/CaseCitationFinder/UK'

const getLegislation = LegislationGovUk.getLegislation
const getCaseByName = async (caseName): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.all([
      BAILII.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName),
    ])).flat()

    return sortUKCitations(
      Helpers.uniqueBy(results, `citation`)
        .map(c => ({
          ...c,
          journal: findUKCaseCitationMatches(c.citation)[0],
      })),
      `journal`,
    )
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const bailiiPriority = [`UKSC`, `EWCA`, `EWHC`, `UKPC`, `UKHL`, ` KB `, ` QB `, ` Ch `, `EMLR`, ` All ER`, ` WLR `, ` Fam `]

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = bailiiPriority.some(cit => citation.includes(cit))
    ? [BAILII, Common.CommonLII]
    : [Common.CommonLII, BAILII]
  for (const option of options) {
    try {
      return await option.getCaseByCitation(citation)
    } catch (error) {
      Logger.error(error)
    }
  }
  return []
}

const UK = {
  getCaseByCitation,
  getCaseByName,
  getLegislation,
}

export default UK