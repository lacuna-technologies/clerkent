import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import type { AxiosResponse } from 'axios'
import { findEUCaseCitation } from '../../Finder/CaseCitationFinder/EU'
import Helpers from '../../Helpers'

const DOMAIN = `https://curia.europa.eu`

const parseCaseData = (data: AxiosResponse[`data`]) => {
  const $ = cheerio.load(data)

  return $(`#listeAffaires > ul.rich-datalist > li.rich-list-item`).map((_, element) => {
    const name = $(`.affaire .affaire_header .affaire_title`, element).text().trim()
    const citation = Helpers.findCitation(findEUCaseCitation, name)
    const link = $(`td.decision > span.decision_links > a`, element).attr(`href`)

    return {
      citation,
      database: Constants.DATABASES.EU_curia,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
      link,
      name: name.replace(citation, ``).replace(/^[\s-]+/g, ``).trim(),
    }
  }).get()
  .filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        num: citation, 
      },
    })
  
  return parseCaseData(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        parties: caseName, 
      },
    })
  
  return parseCaseData(data)
}

const CURIA = {
  getCaseByCitation,
  getCaseByName,
}

export default CURIA