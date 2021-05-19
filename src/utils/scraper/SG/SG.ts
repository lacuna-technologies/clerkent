import SGSC from './SGSC'
import SLW from './SLW'
import Common from '../common'
import SSO from './SSO'
import type Law from '../../../types/Law'

const getLegislation = SSO.getLegislation

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = [`SGCA`, `SGHC`].some(cit => citation.includes(cit)) ? [SGSC, SLW, Common.CommonLII] : [Common.CommonLII, SGSC, SLW]
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

const SG = {
  SGSC,
  SLW,
  getCase,
  getLegislation,
}

export default SG