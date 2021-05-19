import CaseFinder from './CaseFinder'
import LegislationFinder from './LegislationFinder'
import type { CaseFinderResult } from './CaseFinder'
import type { LegislationFinderResult } from './LegislationFinder'
export type { CaseFinderResult } from './CaseFinder'
export type { LegislationFinderResult } from './LegislationFinder'
 
export type FinderResult = CaseFinderResult | LegislationFinderResult

const find = (citation: string): FinderResult[] => {
  const legislation = [...LegislationFinder.findLegislation(citation)]
  if(legislation.length > 0){
    return legislation
  }
  return [...CaseFinder.findCase(citation)]
}

const Finder = {
  find,
  findCase: CaseFinder.findCase,
  findLegislation: LegislationFinder.findLegislation,
}

export default Finder