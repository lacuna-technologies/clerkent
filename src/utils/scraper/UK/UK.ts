import type Law from '../../../types/Law'
import BAILII from './BAILII'
import Common from '../common'
import LegislationGovUk from './LegislationGovUk'
import Logger from '../../Logger'
import Helpers from '../../Helpers'
import { sortUKCitations } from '../../Finder/CaseCitationFinder/UK'
import Constants from '../../Constants'

const getLegislation = LegislationGovUk.getLegislation
const getCaseByName = async (caseName): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.all([
      BAILII.getCaseByName(caseName),
      Common.CommonLII.getCaseByName(caseName, Constants.JURISDICTIONS.UK.name),
    ]))
    .flat()
    .filter(({ jurisdiction }) => jurisdiction === Constants.JURISDICTIONS.UK.id)

    Logger.log(`UK getCaseByName pre-sort results`, results)

    return sortUKCitations(
      Helpers.uniqueBy(results, `citation`),
      `citation`,
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