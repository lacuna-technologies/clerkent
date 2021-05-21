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
  const caseCitations = [...CaseFinder.findCase(citation)]
  if(caseCitations.length > 0){
    Logger.log(`Found cases: `, caseCitations)
    return caseCitations
  }
  const legislation = [...LegislationFinder.findLegislation(citation)]
  Logger.log(`Found legislation: `, caseCitations)
  return legislation
})

const Finder = {
  find,
  findCase: CaseFinder.findCase,
  findLegislation: LegislationFinder.findLegislation,
}

export default Finder