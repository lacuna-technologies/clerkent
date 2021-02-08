import SGSC from './SGSC'
import SLW from './SLW'
import type Law from '../../../types/Law'

const getPDF = async (citation: string): Promise<Law.Case | false> => {
  const options = [SLW, SGSC]
  for (const option of options) {
    try {
      const result = await option.getPDF(citation)
      if (result !== false) {
        return result
      }
    } catch (error) {
      console.error(error)
    } finally {
      continue
    }
  }
  return false
}

const SG = {
  SGSC,
  SLW,
  getPDF,
}

export default SG