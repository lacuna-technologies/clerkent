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

type JurisdictionType = typeof SG | typeof UK | typeof EU | typeof HK | typeof CA

const getCaseByCitation = Memoize((targetCase: CaseCitationFinderResult): Promise<Law.Case[]> => {
  const { jurisdiction, citation, court } = targetCase

  let targetJurisdiction: JurisdictionType
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
    case Constants.JURISDICTIONS.CA.id: {
      targetJurisdiction = CA
      break
    }
    case Constants.JURISDICTIONS.AU.id: {
      targetJurisdiction = AU
      break
    }
    case Constants.JURISDICTIONS.NZ.id: {
      targetJurisdiction = NZ
      break
    }
    default: {
      return Promise.resolve([])
    }
  }

  return targetJurisdiction.getCaseByCitation(citation, court)
}, {
  normalizer: ([targetCase]) => targetCase.citation,
})

const getCaseByName = Memoize((targetCaseName: CaseNameFinderResult) : Promise<Law.Case[]> => {
  const { name } = targetCaseName

  return UK.getCaseByName(name)
}, {
  normalizer: ([targetCaseName]) => targetCaseName.name.toLowerCase(),
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