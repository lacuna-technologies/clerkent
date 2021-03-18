import CURIA from './CURIA'
import type Law from '../../../types/Law'

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const options = [CURIA]
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