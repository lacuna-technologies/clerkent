import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

const DOMAIN = `https://curia.europa.eu`

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data, request } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        num: citation, 
      },
    })
  
  const $ = cheerio.load(data)

  const name = $(`.affaire .affaire_header .affaire_title`).text().trim()
  
  return [{
    citation,
    database: Constants.DATABASES.EU_curia,
    jurisdiction: Constants.JURISDICTIONS.EU.id,
    link: request.responseURL,
    name,
  }]

}

const CURIA = {
  getCaseByCitation,
}

export default CURIA