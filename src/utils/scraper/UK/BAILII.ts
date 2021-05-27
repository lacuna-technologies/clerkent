import qs from 'qs'
import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 
import Logger from '../../Logger'

const DOMAIN = `https://www.bailii.org`

const getSearchResultsByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data, request } = await Request.post(
    `${DOMAIN}/cgi-bin/find_by_citation.cgi`, 
    qs.stringify({ citation }, { format : `RFC1738` }),
    {
      validateStatus: status => (status >= 200 && status < 300) || status === 302,
    },
  )

  if(request.responseURL === `${DOMAIN}/cgi-bin/find_by_citation.cgi`) {
    return []
  }

  const $ = cheerio.load(data)

  const pdfPath = $(`a[href$=".pdf"]`).eq(0).attr(`href`)

  const result = {
    citation,
    link: request.responseURL,
    name: $(`title`).text().trim().split(`[`)[0],
    ...(pdfPath ? {pdf: `${DOMAIN}${pdfPath}`} : {}),
    database: Constants.DATABASES.UK_bailii,
    jurisdiction: Constants.JURISDICTIONS.UK.id,
  }

  return [result]
}

const getCaseByCitation = async (citation: string): Promise<Law.Case | false> => {
  const results = (await getSearchResultsByCitation(citation))

  if(results.length !== 1){
    return false
  }

  return results[0]
}

const getCaseByName = async (caseName: string): Promise<Law.Case | false> => {
  try {
    const { data } = await Request.get(
      `${DOMAIN}/cgi-bin/lucy_search_1.cgi`,
      {
        params: {
          mask_path: `uk/cases scot/cases ew/cases ie/cases nie/cases eu/cases`,
          querytitle: caseName,
        },
      },
    )

    const $ = cheerio.load(data)

    const matches: Law.Case[] = $(`body ol[start="1"] > li`).map((_, element) => {
      const name = $(`a`, element).eq(0).text().trim().split(`[`)[0]
      const citation = $(`small`, element).text().trim()
      const link = `${DOMAIN}${$(`a`, element).eq(0).attr(`href`)}`
      return {
        citation,
        database: Constants.DATABASES.UK_bailii,
        jurisdiction: Constants.JURISDICTIONS.UK.id,
        link,
        name,
      }
    }).get()

    return matches[0]
  } catch (error){
    Logger.error(error)
  }
}

const BAILII = {
  getCase: getCaseByCitation,
  getCaseByName,
  getSearchResults: getSearchResultsByCitation,
}

export default BAILII