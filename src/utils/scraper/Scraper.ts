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

const jurisdictionMap = {
  [Constants.JURISDICTIONS.AU.id]: AU,
  [Constants.JURISDICTIONS.EU.id]: EU,
  [Constants.JURISDICTIONS.CA.id]: CA,
  [Constants.JURISDICTIONS.HK.id]: HK,
  [Constants.JURISDICTIONS.NZ.id]: NZ,
  [Constants.JURISDICTIONS.SG.id]: SG,
  [Constants.JURISDICTIONS.UK.id]: UK,
}

const getCaseByCitation = Memoize((targetCase: CaseCitationFinderResult, inputJurisdiction = null): Promise<Law.Case[]> => {
  const { jurisdiction, citation, court } = targetCase

  const targetJurisdiction = inputJurisdiction === null
    ? jurisdictionMap[jurisdiction]
    : inputJurisdiction

  Logger.log(`Scraper: getByCaseCitation`, citation, targetJurisdiction)

  return targetJurisdiction.getCaseByCitation(citation, court)
}, {
  normalizer: ([targetCase, inputJurisdiction]) => `${targetCase.citation.toLowerCase()} - ${inputJurisdiction}`,
})

const getCaseByName = Memoize((targetCaseName: CaseNameFinderResult, inputJurisdiction) : Promise<Law.Case[]> => {
  const { name } = targetCaseName
  const targetJurisdiction = jurisdictionMap[inputJurisdiction]

  if(!targetJurisdiction || !targetJurisdiction?.getCaseByName){
    return Promise.resolve([])
  }

  Logger.log(`Scraper: getCaseByName`, name, targetJurisdiction)

  return targetJurisdiction.getCaseByName(name)
}, {
  normalizer: ([targetCaseName, inputJurisdiction]) => `${targetCaseName.name.toLowerCase()}-${inputJurisdiction}`,
})

const getLegislation = Memoize(async (targetLegislation: LegislationFinderResult): Promise<Law.Legislation[]> => {
  const { jurisdiction } = targetLegislation

  if(jurisdiction){
    let targetJurisdiction
    switch (jurisdiction) {
      case Constants.JURISDICTIONS.SG.id: {
        targetJurisdiction = SG
      
      break
      }
      case Constants.JURISDICTIONS.UK.id: {
        targetJurisdiction = UK
      
      break
      }
      case Constants.JURISDICTIONS.EU.id: {
        targetJurisdiction = EU
      
      break
      }
      case Constants.JURISDICTIONS.HK.id: {
        targetJurisdiction = HK
      
      break
      }
      default: {
        return Promise.resolve([])
      }
    }
    return targetJurisdiction.getLegislation(targetLegislation)
  }

  return (await Promise.all([SG, UK].map(juris => juris.getLegislation(targetLegislation)))).filter(result => result.length > 0).flat()
}, {
  normalizer: ([{provisionType, provisionNumber, statute}]) => `${provisionType}-${provisionNumber}-${statute}`,
})

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
}

export default scraper