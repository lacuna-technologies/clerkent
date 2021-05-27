import Memoize from 'memoizee'
import CaseCitationFinder from './CaseCitationFinder'
import LegislationFinder from './LegislationFinder'
import type { CaseCitationFinderResult } from './CaseCitationFinder'
import type { LegislationFinderResult } from './LegislationFinder'
import Logger from '../Logger'
export type { CaseCitationFinderResult } from './CaseCitationFinder'
export type { LegislationFinderResult } from './LegislationFinder'

export interface CaseNameFinderResult {
  name: string,
  type: `case-name`
}
 
export type FinderResult = CaseCitationFinderResult | LegislationFinderResult | CaseNameFinderResult

const find = Memoize((citation: string): FinderResult[] => {
  const isCaseCitation = citation.match(/^\s*[()[]/gi) !== null
  const caseNames = citation.match(/\w+ v\.? \w+/gi)
  if(isCaseCitation){
    const caseCitations = [...CaseCitationFinder.findCaseCitation(citation)]
    Logger.log(`Found case citations: `, caseCitations)
    return caseCitations
  } else if(caseNames !== null){
    Logger.log(`Found case names: `, caseNames)
    return [...caseNames].map(caseName => ({ name: caseName, type: `case-name` }))
  } else {
    const legislation = [...LegislationFinder.findLegislation(citation)]
    Logger.log(`Found legislation: `, legislation)
    return legislation
  }  
})

const Finder = {
  find,
  findCase: CaseCitationFinder.findCaseCitation,
  findLegislation: LegislationFinder.findLegislation,
}

export default Finder