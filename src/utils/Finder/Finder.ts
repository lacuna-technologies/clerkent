import Memoize from 'memoizee'
import CaseCitationFinder from './CaseCitationFinder'
import LegislationFinder from './LegislationFinder'
import type { CaseCitationFinderResult } from './CaseCitationFinder'
import type { LegislationFinderResult } from './LegislationFinder'
import Logger from '../Logger'

export interface CaseNameFinderResult {
  name: string,
  type: `case-name`
}
 
export type FinderResult = CaseCitationFinderResult | LegislationFinderResult | CaseNameFinderResult

const findCase = Memoize((citation: string): FinderResult[] => {
  const isCaseCitation = citation.match(/^\s*[()[]/gi) !== null
  
  if(isCaseCitation){
    const caseCitations = [...CaseCitationFinder.findCaseCitation(citation)]
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
export type { CaseCitationFinderResult } from './CaseCitationFinder'
export type { LegislationFinderResult } from './LegislationFinder'