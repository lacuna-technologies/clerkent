import HKLIIHK from './HKLIIHK'
import HKLIIORG from './HKLIIORG'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'

const getCaseByName = () => Promise.resolve([])

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

const EU = {
  getCaseByCitation,
  getCaseByName,
}

export default EU