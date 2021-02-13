import type Law from '../../../types/Law'
import BAILII from './BAILII'

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const options = [BAILII]
  for (const option of options) {
    try {
      const result = await option.getCase(citation)
      if (result !== false) {
        return result
      }
    } catch (error) {
      console.error(error)
    }
  }
  return false
}

const EW = {
  getCase,
}

export default EW