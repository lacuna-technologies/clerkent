import Request from '../../Request'
import type Law from '../../../types/Law'

const DOMAIN = `https://www.singaporelawwatch.sg`

// eslint-disable-next-line no-secrets/no-secrets
const getSearchResults = (citation: string) => `${DOMAIN}/DesktopModules/EasyDNNNewsSearch/SearchAutoComplete.ashx?nsw=a&mid=479&TabId=21&portal_id=0&acat=1&ModToOpenResults=426&TabToOpenResults=48&evl=0&q=${citation}`

const getPDF = async (citation: string): Promise<Law.Case | false> => {
  const { data } = await Request.get(getSearchResults(citation))

  const matches: Law.Case[] = data
    .map(([name, link]) => ({ citation: name.slice(-citation.length), link, name: name.slice(0, -citation.length).trim() }))
    .filter((match: Law.Case) => match.citation === citation)
  
  if(matches.length !== 1){
    return false
  }
  
  return matches[0]
}

const SLW = {
  getPDF,
  getSearchResults,
}

export default SLW