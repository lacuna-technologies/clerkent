import CaseFinder from './CaseFinder'
import LegislationFinder from './LegislationFinder'

const find = (citation: string) => {
  const legislation = [...LegislationFinder.findLegislation(citation)]
  if(legislation.length > 0){
    return legislation
  }
  return [...CaseFinder.findCase(citation)]
}

const Finder = {
  find,
  findCase: CaseFinder.findCase,
  findLegislation: LegislationFinder.findLegislation,
}

export default Finder