import Memoize from 'memoizee'
import SG from './SG'
import UK from './UK'
import EU from './EU'
import HK from './HK'
import type Law from '../../types/Law'
import Constants from '../Constants'
import type { FinderResult } from '../Finder'

const getCase = Memoize((targetCase: FinderResult): Promise<Law.Case | false> => {
  const { jurisdiction, citation } = targetCase

  let targetJurisdiction: typeof SG | typeof UK
  if(jurisdiction === Constants.JURISDICTIONS.SG.id){
    targetJurisdiction = SG
  } else if (jurisdiction === Constants.JURISDICTIONS.UK.id){
    targetJurisdiction = UK
  } else if (jurisdiction === Constants.JURISDICTIONS.EU.id){
    targetJurisdiction = EU
  } else if (jurisdiction === Constants.JURISDICTIONS.HK.id) {
    targetJurisdiction = HK
  } else {
    return Promise.resolve(false)
  }

  return targetJurisdiction.getCase(citation)
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