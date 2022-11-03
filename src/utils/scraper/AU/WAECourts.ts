import Request from 'utils/Request'

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {}

const getCaseByName = async (citation: string): Promise<Law.Case[]> => {}

const WAECourts = {
  getCaseByCitation,
  getCaseByName,
}

export default WAECourts