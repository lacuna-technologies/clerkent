import nzlii from './nzlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = [`NZLR`].some(cit => citation.includes(cit)) ? [Common.CommonLII, nzlii] : [nzlii, Common.CommonLII]
  for (const option of options){
    try {
      const result = await option.getCase(citation)
      if(result !== false){
        return result
      }
    } catch (error){
      Logger.error(error)
    }
  }
  return false
}

const NZ = {
  getCase,
}

export default NZ