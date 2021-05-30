import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 
import { findSGCaseCitation } from '../../Finder/CaseCitationFinder/SG'
import Helpers from '../../Helpers'

const DOMAIN = `https://www.singaporelawwatch.sg`

// eslint-disable-next-line no-secrets/no-secrets
const getSearchResults = (citation: string) => `${DOMAIN}/DesktopModules/EasyDNNNewsSearch/SearchAutoComplete.ashx?nsw=a&mid=479&TabId=21&portal_id=0&acat=1&ModToOpenResults=426&TabToOpenResults=48&evl=0&q=${citation}`

const parseCase = (name, link) => ({
  citation: findSGCaseCitation(name)[0]?.citation,
  database: Constants.DATABASES.SG_slw,
  jurisdiction: Constants.JURISDICTIONS.SG.id,
  link,
  name: name.split(`[`)[0],
  pdf: link,
})

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(citation))

  return data
    .map(([name, link]) => parseCase(name, link))
    .filter(({ citation}) => Helpers.isCitationValid(citation))
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(caseName))

  return data
    .map(([name, link]) => parseCase(name, link))
    .filter(({ citation}) => Helpers.isCitationValid(citation))
}

const SLW = {
  getCaseByCitation,
  getCaseByName,
  getSearchResults,
}

export default SLW