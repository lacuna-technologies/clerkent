import type { CaseCitationFinderResult } from './types'
import { findUKCaseCitation, sortUKCitations } from './UK'
import { findSGCaseCitation , sortSGCitations } from './SG'
import { findNZCaseCitation, sortNZCitations } from './NZ'
import { findHKCaseCitation, sortHKCitations } from './HK'
import { findCACaseCitation, sortCACitations } from './CA'
import { findAUCaseCitation, sortAUCitations } from './AU'
import { findEUCaseCitation, sortEUCitations } from './EU'

const findCaseCitation = (query: string): CaseCitationFinderResult[] => {
  return [
    ...findSGCaseCitation(query),
    ...findUKCaseCitation(query),
    ...findEUCaseCitation(query),
    ...findHKCaseCitation(query),
    ...findCACaseCitation(query),
    ...findAUCaseCitation(query),
    ...findNZCaseCitation(query),
  ]
}

const CaseFinder = {
  findAUCaseCitation,
  findCACaseCitation,
  findCaseCitation,
  findEUCaseCitation,
  findHKCaseCitation,
  findNZCaseCitation,
  findSGCaseCitation,
  findUKCaseCitation,
  sortAUCitations,
  sortCACitations,
  sortEUCitations,
  sortHKCitations,
  sortNZCitations,
  sortSGCitations,
  sortUKCitations,
}

export default CaseFinder