import CURIA from './CURIA'
import EPO from './EPO'
import type Law from '../../../types/Law'

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = court === `EPO` ? [EPO] : [CURIA]
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