import Memoize from 'memoizee'
import CaseCitationFinder from './CaseCitationFinder'
import Helpers from 'utils/Helpers'
import Logger from 'utils/Logger'
// import LegislationFinder from './LegislationFinder'

const findCase = Memoize((citation: string): Finder.FinderResult[] => {
  const cleanCitation = Helpers.cleanQuery(citation)
  const caseCitations = [...CaseCitationFinder.findCaseCitation(cleanCitation)]
  if (caseCitations.length > 0) {
    Logger.log(`findCase caseCitations found: `, caseCitations)
    return caseCitations
  }

  if (cleanCitation.trim().length > 0) {
    return [{ name: cleanCitation, type: `case-name` }]
  }

  return []
})

const Finder = {
  findCase,
  findCaseCitation: CaseCitationFinder.findCaseCitation,
}

export default Finder