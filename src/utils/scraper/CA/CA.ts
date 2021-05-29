import canlii from './canlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'

const getCaseByName = () => Promise.resolve([])

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