import type Law from '../../../types/Law'
import BAILII from './BAILII'
import Common from '../common'
import LegislationGovUk from './LegislationGovUk'

const getLegislation = LegislationGovUk.getLegislation
const getCaseByName = BAILII.getCaseByName

const bailiiPriority = [`UKSC`, `EWCA`, `EWHC`, `UKPC`, `UKHL`, ` KB `, ` QB `, ` Ch `, `EMLR`, ` All ER`, ` WLR `, ` Fam `]

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = bailiiPriority.some(cit => citation.includes(cit))
    ? [BAILII, Common.CommonLII]
    : [Common.CommonLII, BAILII]
  for (const option of options) {
    try {
      const result = await option.getCase(citation)
      if (result !== false) {
        return result
      }
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

const UK = {
  getCase,
  getCaseByName,
  getLegislation,
}

export default UK