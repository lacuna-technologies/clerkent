import Memoize from 'memoizee'
import SG from './SG'
import UK from './UK'
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
  } else {
    return Promise.resolve(false)
  }

  return targetJurisdiction.getCase(citation)
}, {
  normalizer: ([targetCase]) => targetCase.citation,
})

const scraper = {
  SG,
  UK,
  getCase,
}

export default scraper