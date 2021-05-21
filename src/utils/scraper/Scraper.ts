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
import type { CaseFinderResult } from '../Finder/CaseFinder'
import type { LegislationFinderResult } from '../Finder/LegislationFinder'

type JurisdictionType = typeof SG | typeof UK | typeof EU | typeof HK | typeof CA

const getCase = Memoize((targetCase: CaseFinderResult): Promise<Law.Case | false> => {
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
      return Promise.resolve(false)
    }
  }

  return targetJurisdiction.getCase(citation, court)
}, {
  normalizer: ([targetCase]) => targetCase.citation,
})

const getLegislation = Memoize(async (targetLegislation: LegislationFinderResult): Promise<Law.Legislation[] | false> => {
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
        return Promise.resolve(false)
      }
    }
    return targetJurisdiction.getLegislation(targetLegislation)
  }

  const results = (await Promise.all([SG, UK].map(juris => juris.getLegislation(targetLegislation)))).filter(result => result !== false)
  return results as Law.Legislation[]
}, {
  normalizer: ([{provisionType, provisionNumber, statute}]) => `${provisionType}-${provisionNumber}-${statute}`,
})

const scraper = {
  EU,
  SG,
  UK,
  getCase,
  getLegislation,
}

export default scraper