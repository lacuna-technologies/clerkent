import CURIA from './CURIA'
import EPO from './EPO'
import type Law from '../../../types/Law'

const getCaseByName = () => Promise.resolve([])

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const options = court === `EPO` ? [EPO] : [CURIA]
  for (const option of options){
    try {
      return await option.getCaseByCitation(citation)
    } catch (error) {
      console.error(error)
    }
  }
  return []
}

const EU = {
  getCaseByCitation,
  getCaseByName,
}

export default EU