import Fuse from 'fuse.js'
import Helpers from 'utils/Helpers'
import CustomDB from './CustomDB'

const { cases: CustomCases } = CustomDB

const toLawCase = ({ citations, ...others }: RawCase): Law.Case => ({
    ...others,
    citation: citations[0],
  })

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const fuse = new Fuse(CustomCases.map(({ name }) => name), { ignoreLocation: true })
  return fuse
    .search(caseName)
    .map(({ refIndex }) => CustomCases[refIndex])
    .map(rawCase => toLawCase(rawCase))
}

const getCaseByCitation = async (citation: string, court: string): Promise<Law.Case[]> => {
  const escapedCitation = Helpers.escapeRegExp(citation)
  return CustomCases
  .filter(({ citations }) =>
    citations.some((cit) => (new RegExp(`${escapedCitation}`, `i`)).test(cit)),
  )
  .map(({ citations, ...others }) => ({
    ...others,
    citation: citations[0],
  }))
}

const Custom = {
  getCaseByCitation,
  getCaseByName,
}

export default Custom
