import HKLII from './HKLII'
import type Law from '../../../types/Law'

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = [HKLII]
  for (const option of options){
    try {
      const result = await option.getCase(citation)
      if(result !== false){
        return result
      }
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

const EU = {
  getCase,
}

export default EU