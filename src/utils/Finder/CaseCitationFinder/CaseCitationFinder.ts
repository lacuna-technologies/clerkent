import { findUKCaseCitation, sortUKCases } from './UK'
import { findSGCaseCitation , sortSGCases } from './SG'
import { findNZCaseCitation, sortNZCases } from './NZ'
import { findHKCaseCitation, sortHKCases } from './HK'
import { findCACaseCitation, sortCACases } from './CA'
import { findAUCaseCitation, sortAUCases } from './AU'
import { findEUCaseCitation, sortEUCases } from './EU'
import { findMYCaseCitation, sortMYCases } from './MY'
import { findECHRCaseCitation, sortECHRCases } from './ECHR'
import { findUNCaseCitation, sortUNCases } from './UN'

const findCaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
  return [
    ...findSGCaseCitation(query),
    ...findUKCaseCitation(query),
    ...findEUCaseCitation(query),
    ...findHKCaseCitation(query),
    ...findCACaseCitation(query),
    ...findAUCaseCitation(query),
    ...findNZCaseCitation(query),
    ...findMYCaseCitation(query),
    ...findECHRCaseCitation(query),
    ...findUNCaseCitation(query),
  ]
}

const CaseCitationFinder = {
  findAUCaseCitation,
  findCACaseCitation,
  findCaseCitation,
  findECHRCaseCitation,
  findEUCaseCitation,
  findHKCaseCitation,
  findNZCaseCitation,
  findSGCaseCitation,
  findUKCaseCitation,
  findUNCaseCitation,
  sortAUCases,
  sortCACases,
  sortECHRCases,
  sortEUCases,
  sortHKCases,
  sortMYCases,
  sortNZCases,
  sortSGCases,
  sortUKCases,
  sortUNCases,
}

export default CaseCitationFinder