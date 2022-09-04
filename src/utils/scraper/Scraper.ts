import Memoize from 'memoizee'
import SG from './SG'
import UK from './UK'
import EU from './EU'
import HK from './HK'
import CA from './CA'
import AU from './AU'
import NZ from './NZ'
import MY from './MY'
import ECHR from './ECHR'
import Constants from '../Constants'
import Logger from '../Logger'
import UN from './UN'

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
  [Constants.JURISDICTIONS.MY.id]: MY,
  [Constants.JURISDICTIONS.ECHR.id]: ECHR,
  [Constants.JURISDICTIONS.UN.id]: UN,
}

const getCaseByCitation = (
  targetCase: Finder.CaseCitationFinderResult,
  inputJurisdiction: Law.JurisdictionCode = null,
): Promise<Law.Case[]> => {
  const { jurisdiction, citation, court } = targetCase

  const targetJurisdiction = inputJurisdiction === null
    ? jurisdictionMap[jurisdiction]
    : jurisdictionMap[inputJurisdiction]

  Logger.log(`Scraper: getByCaseCitation`, citation, targetJurisdiction)

  return targetJurisdiction.getCaseByCitation(citation, court)
}

const getCaseByName = (
  targetCaseName: Finder.CaseNameFinderResult,
  inputJurisdiction: Law.JurisdictionCode,
) : Promise<Law.Case[]> => {
  const { name } = targetCaseName
  const targetJurisdiction = jurisdictionMap[inputJurisdiction]

  if(!targetJurisdiction || !targetJurisdiction?.getCaseByName){
    return Promise.resolve([])
  }

  return targetJurisdiction.getCaseByName(name)
}

const getLegislation = Memoize((
  targetLegislation: Finder.LegislationFinderResult,
  inputJurisdiction: Law.JurisdictionCode,
): Promise<Law.Legislation[]> => {
  const targetJurisdiction = jurisdictionMap[inputJurisdiction]

  if(!targetJurisdiction || !(`getLegislation` in targetJurisdiction)){
    return Promise.resolve([])
  }

  Logger.log(`Scraper: getLegislation`, targetLegislation, inputJurisdiction)

  return (
    targetJurisdiction as JurisdictionWithLegislationSearch
  ).getLegislation(targetLegislation)
}, {
  normalizer: ([{
    provisionType,
    provisionNumber,
    statute,
  }, inputJurisdiction]) => `${provisionType}-${provisionNumber}-${statute}-${inputJurisdiction}`,
})

const getPDF = Memoize((
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<string> => {
  Logger.log(`Scraper: getPDF`, inputCase, inputDocumentType)
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
}, {
  normalizer: ([inputCase, inputDocumentType]) => {
    const { citation, jurisdiction } = inputCase
    return `${jurisdiction}-${citation}-${inputDocumentType}`
  },
})

const scraper = {
  AU,
  CA,
  ECHR,
  EU,
  HK,
  MY,
  NZ,
  SG,
  UK,
  getCaseByCitation,
  getCaseByName,
  getLegislation,
  getPDF,
}

export default scraper