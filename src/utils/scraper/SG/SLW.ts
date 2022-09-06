import Request from '../../Request'
import Constants from '../../Constants' 
import { findSGCaseCitation } from '../../Finder/CaseCitationFinder/SG'
import Helpers from '../../Helpers'
import Logger from '../../Logger'

const DOMAIN = `https://www.singaporelawwatch.sg`

const getSearchResults = (citation: string) => `${DOMAIN}/DesktopModules/EasyDNNNewsSearch/SearchAutoComplete.ashx?nsw=a&mid=479&TabId=21&portal_id=0&acat=1&ModToOpenResults=426&TabToOpenResults=48&evl=0&q=${citation}`

const parseCase = (name: string, link: string) => ({
  citation: findSGCaseCitation(name)[0]?.citation,
  database: Constants.DATABASES.SG_slw,
  jurisdiction: Constants.JURISDICTIONS.SG.id,
  links: [
    {
      doctype: `Judgment`,
      filetype: `PDF`,
      url: link,
    },
  ],
  name: name.split(`[`)[0].trim(),
})

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(citation))
  const results = data
    .map(([name, link]) => parseCase(name, link))
    .filter(({ citation: scrapedCitation }) => scrapedCitation && citation.toLowerCase() === scrapedCitation.toLowerCase())
  Logger.log(`SLW scrape results`, results)
  return results
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(caseName))

  const results = data
    .map(([name, link]) => parseCase(name, link))
    .filter(({ citation}) => Helpers.isCitationValid(citation))
  Logger.log(`SLW scrape results`, results)
  return results
}

const SLW = {
  getCaseByCitation,
  getCaseByName,
  getSearchResults,
}

export default SLW