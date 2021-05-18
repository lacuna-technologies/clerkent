import HKLIIHK from './HKLIIHK'
import HKLIIORG from './HKLIIORG'
import Common from '../common'
import type Law from '../../../types/Law'

const getCase = async (citation: string, court: string): Promise<Law.Case | false> => {
  const options = [HKLIIORG, HKLIIHK, Common.CommonLII]
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