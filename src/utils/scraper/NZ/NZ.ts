import nzlii from './nzlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'

const getCaseByName = () => Promise.resolve([])

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