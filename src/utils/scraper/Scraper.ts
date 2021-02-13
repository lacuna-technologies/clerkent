import Memoize from 'memoizee'
import SG from './SG'
import EW from './EW'
import type Law from '../../types/Law'
import { JURISDICTIONS } from '../Constants'
import type { FinderResult } from '../Finder'

const getCase = Memoize((targetCase: FinderResult): Promise<Law.Case | false> => {
  const { jurisdiction, citation } = targetCase

  let targetJurisdiction: typeof SG | typeof EW
  if(jurisdiction === JURISDICTIONS.SG.id){
    targetJurisdiction = SG
  } else if (jurisdiction === JURISDICTIONS.EW.id){
    targetJurisdiction = EW
  } else {
    return Promise.resolve(false)
  }

  return targetJurisdiction.getCase(citation)
}, {
  normalizer: ([targetCase]) => targetCase.citation,
})

const scraper = {
  EW,
  SG,
  getCase,
}

export default scraper