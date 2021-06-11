import Memoize from 'memoizee'
import SG from './SG'
import UK from './UK'
import EU from './EU'
import HK from './HK'
import CA from './CA'
import AU from './AU'
import NZ from './NZ'
import type Law from '../../types/Law'
import Constants from '../Constants'
import type {
  CaseCitationFinderResult,
  CaseNameFinderResult,
  LegislationFinderResult,
} from '../Finder'
import Logger from '../Logger'

// type JurisdictionType = typeof SG | typeof UK | typeof EU | typeof HK | typeof CA | typeof AU | typeof NZ
type JurisdictionWithLegislationSearch = typeof SG | typeof UK | typeof EU

const jurisdictionMap = {
  [Constants.JURISDICTIONS.AU.id]: AU,
  [Constants.JURISDICTIONS.EU.id]: EU,
  [Constants.JURISDICTIONS.CA.id]: CA,
  [Constants.JURISDICTIONS.HK.id]: HK,
  [Constants.JURISDICTIONS.NZ.id]: NZ,
  [Constants.JURISDICTIONS.SG.id]: SG,
  [Constants.JURISDICTIONS.UK.id]: UK,
}

const getCaseByCitation = Memoize((
  targetCase: CaseCitationFinderResult,
  inputJurisdiction: Law.JursidictionCode = null,
): Promise<Law.Case[]> => {
  const { jurisdiction, citation, court } = targetCase

  const targetJurisdiction = inputJurisdiction === null
    ? jurisdictionMap[jurisdiction]
    : jurisdictionMap[inputJurisdiction]

  Logger.log(`Scraper: getByCaseCitation`, citation, targetJurisdiction)

  return targetJurisdiction.getCaseByCitation(citation, court)
}, {
  normalizer: ([
    targetCase,
    inputJurisdiction,
  ]) => `${targetCase.citation.toLowerCase()} - ${inputJurisdiction}`,
})

const getCaseByName = Memoize((
  targetCaseName: CaseNameFinderResult,
  inputJurisdiction: Law.JursidictionCode,
) : Promise<Law.Case[]> => {
  const { name } = targetCaseName
  const targetJurisdiction = jurisdictionMap[inputJurisdiction]

  if(!targetJurisdiction || !targetJurisdiction?.getCaseByName){
    return Promise.resolve([])
  }

  Logger.log(`Scraper: getCaseByName`, name, targetJurisdiction)

  return targetJurisdiction.getCaseByName(name)
}, {
  normalizer: ([
    targetCaseName,
    inputJurisdiction,
  ]) => `${targetCaseName.name.toLowerCase()}-${inputJurisdiction}`,
})

const getLegislation = Memoize(async (
  targetLegislation: LegislationFinderResult,
  inputJurisdiction: Law.JursidictionCode,
): Promise<Law.Legislation[]> => {
  const targetJurisdiction = jurisdictionMap[inputJurisdiction]

  if(!targetJurisdiction || !(`getLegislation` in targetJurisdiction)){
    return Promise.resolve([])
  }
  return (
    targetJurisdiction as JurisdictionWithLegislationSearch
  ).getLegislation(targetLegislation)
}, {
  normalizer: ([{
    provisionType,
    provisionNumber,
    statute,
  }]) => `${provisionType}-${provisionNumber}-${statute}`,
})

const getPDF = (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const existingLink = inputCase.links.find(({ doctype, filetype }) => doctype === inputDocumentType && filetype === `PDF`)
  if(existingLink){
    return Promise.resolve(existingLink?.url)
  }

  const targetJurisdiction = jurisdictionMap[inputCase.jurisdiction]
  if(!targetJurisdiction || !(`getPDF` in targetJurisdiction)){
    return Promise.resolve(``)
  }

  return (
    targetJurisdiction as any
  ).getPDF(inputCase, inputDocumentType)
}

const scraper = {
  AU,
  CA,
  EU,
  HK,
  NZ,
  SG,
  UK,
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default scraper