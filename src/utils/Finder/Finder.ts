import Memoize from 'memoizee'
import CaseCitationFinder from './CaseCitationFinder'
import LegislationFinder from './LegislationFinder'
import Logger from '../Logger'

const findCase = Memoize((citation: string): Finder.FinderResult[] => {
  const caseCitations = [...CaseCitationFinder.findCaseCitation(citation)]
  if(caseCitations.length > 0){
    Logger.log(`Found case citations: `, caseCitations)
    return caseCitations
  }

  if(citation.trim().length > 0){
    return [{ name: citation, type: `case-name` }]
  }

  return []
})

const Finder = {
  findCase,
  findCaseCitation: CaseCitationFinder.findCaseCitation,
  findLegislation: LegislationFinder.findLegislation,
}

export default Finder