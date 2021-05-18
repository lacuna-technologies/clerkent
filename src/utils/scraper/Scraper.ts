import Memoize from 'memoizee'
import SG from './SG'
import UK from './UK'
import EU from './EU'
import HK from './HK'
import type Law from '../../types/Law'
import Constants from '../Constants'
import type { CaseFinderResult } from '../Finder/CaseFinder'

const getCase = Memoize((targetCase: CaseFinderResult): Promise<Law.Case | false> => {
  const { jurisdiction, citation, court } = targetCase

  let targetJurisdiction: typeof SG | typeof UK
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

  return targetJurisdiction.getCase(citation, court)
}, {
  normalizer: ([targetCase]) => targetCase.citation,
})

const scraper = {
  EU,
  SG,
  UK,
  getCase,
}

export default scraper