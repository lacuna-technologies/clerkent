import type Law from '../../../types/Law'
import BAILII from './BAILII'

const getPDF = async (citation: string): Promise<Law.Case | false> => {
  const options = [BAILII]
  for (const option of options) {
    try {
      const result = await option.getPDF(citation)
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
  getPDF,
}

export default EW