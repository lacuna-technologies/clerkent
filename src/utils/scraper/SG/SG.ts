import SGSC from './SGSC'
import SLW from './SLW'
import Common from '../common'
import SSO from './SSO'
import type Law from '../../../types/Law'

const getLegislation = SSO.getLegislation

const getCaseByName = () => Promise.resolve([])

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