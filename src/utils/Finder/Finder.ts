import Memoize from 'memoizee'
import CaseFinder from './CaseFinder'
import LegislationFinder from './LegislationFinder'
import type { CaseFinderResult } from './CaseFinder'
import type { LegislationFinderResult } from './LegislationFinder'
import Logger from '../Logger'
export type { CaseFinderResult } from './CaseFinder'
export type { LegislationFinderResult } from './LegislationFinder'
 
export type FinderResult = CaseFinderResult | LegislationFinderResult

const find = Memoize((citation: string): FinderResult[] => {
  const isCaseCitation = citation.match(/^\s*[()[]/gi) !== null
  if(isCaseCitation){
    const caseCitations = [...CaseFinder.findCase(citation)]
    Logger.log(`Found cases: `, caseCitations)
    return caseCitations
  } else {
    const legislation = [...LegislationFinder.findLegislation(citation)]
    Logger.log(`Found legislation: `, legislation)
    return legislation
  }  
})

const Finder = {
  find,
  findCase: CaseFinder.findCase,
  findLegislation: LegislationFinder.findLegislation,
}

export default Finder