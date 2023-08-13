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
import Helpers from 'utils/Helpers'

const findCaseCitation = (query: string): Finder.CaseCitationFinderResult[] => {
  const cleanQuery = Helpers.cleanQuery(query)
  return [
    ...findSGCaseCitation(cleanQuery),
    ...findUKCaseCitation(cleanQuery),
    ...findEUCaseCitation(cleanQuery),
    ...findHKCaseCitation(cleanQuery),
    ...findCACaseCitation(cleanQuery),
    ...findAUCaseCitation(cleanQuery),
    ...findNZCaseCitation(cleanQuery),
    ...findMYCaseCitation(cleanQuery),
    ...findECHRCaseCitation(cleanQuery),
    ...findUNCaseCitation(cleanQuery),
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