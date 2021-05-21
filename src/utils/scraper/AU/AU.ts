import austlii from './austlii'
import Common from '../common'
import type Law from '../../../types/Law'
import Logger from '../../Logger'

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = [austlii, Common.CommonLII]
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

const AU = {
  getCase,
}

export default AU