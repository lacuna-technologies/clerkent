import Request from 'utils/Request'

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  return []
}

const getCaseByName = async (citation: string): Promise<Law.Case[]> => {
  return []
}

const WAECourts = {
  getCaseByCitation,
  getCaseByName,
}

export default WAECourts