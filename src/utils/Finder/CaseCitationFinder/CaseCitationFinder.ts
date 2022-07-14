import { findUKCaseCitation, sortUKCitations } from './UK'
import { findSGCaseCitation , sortSGCitations } from './SG'
import { findNZCaseCitation, sortNZCitations } from './NZ'
import { findHKCaseCitation, sortHKCitations } from './HK'
import { findCACaseCitation, sortCACitations } from './CA'
import { findAUCaseCitation, sortAUCitations } from './AU'
import { findEUCaseCitation, sortEUCitations } from './EU'
import { findMYCaseCitation, sortMYCitations } from './MY'
import { findECHRCaseCitation, sortECHRCitations } from './ECHR'
import { findUNCaseCitation, sortUNCitations } from './UN'

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

const CaseFinder = {
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
  sortAUCitations,
  sortCACitations,
  sortECHRCitations,
  sortEUCitations,
  sortHKCitations,
  sortMYCitations,
  sortNZCitations,
  sortSGCitations,
  sortUKCitations,
  sortUNCitations,
}

export default CaseFinder