import Constants from 'utils/Constants'
import Finder from 'utils/Finder'
import Request from 'utils/Request'
import Scraper from '../Scraper'

describe(`Scraper`, () => {

  const SG_CITATIONS = [
    `[1999] SGHC 290`,
    `[1999] SGCA 18`,
  ]

  it(`getCaseByCitation`, () => {
    // for (const citation of SG_CITATIONS){
    //   const inputCase = Finder.findCaseCitation(citation)
    //   const result = Scraper.getCaseByCitation(
    //     inputCase[0],
    //     Constants.JURISDICTIONS.SG.id,
    //   )
    //   expect(result).toMatchSnapshot()
    // }
  })
})