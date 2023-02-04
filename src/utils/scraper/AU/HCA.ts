import qs from 'qs'
import * as cheerio from 'cheerio'
import Request from 'utils/Request'
import CaseCitationFinder from 'utils/Finder/CaseCitationFinder'
import Constants from 'utils/Constants'
import type { CacheRequestConfig } from 'axios-cache-interceptor'
import Helpers from 'utils/Helpers'

const DOMAIN = `https://eresources.hcourt.gov.au`
const NOT_FOUND_STRING = `The case could not be found on the database.`

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const [{ year, page }] = CaseCitationFinder.findAUCaseCitation(citation)
  const url = `${DOMAIN}/showCase/${year}/HCA/${page}`
  const { data } = await Request.get(url)

  const $ = cheerio.load(data)

  const notFoundElement = $(`.wellCase`)

  if(notFoundElement.text().trim() === NOT_FOUND_STRING){
    return []
  }

  const name = $(`title`).text().trim()

  return [{
    citation,
    database: Constants.DATABASES.AU_hca,
    jurisdiction: Constants.JURISDICTIONS.AU.id,
    links: [
      {
        doctype: `Summary`,
        filetype: `HTML`,
        url,
      },
      {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: url.replace(`showCase`, `downloadPdf`),
      },
    ],
    name,
  }]
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/browse`,
    {
      params: {
        col: 0,
        facets: `name`,
        'srch-term': caseName,
      },
      paramsSerializer: {
        serialize: (parameters: Record<string, string>) => qs.stringify(parameters, { format : `RFC1738` }),
      },
    } as CacheRequestConfig,
  )

  const $ = cheerio.load(data)
  const results = $(`#caseList > h4`).map((_, element): Law.Case => {
    const name = $(`strong`, element).text().trim()
    const citation = $(`span`, element).text().trim()
    const url = DOMAIN + $(`a`, element).attr(`href`)

    const [{ year, page }] = CaseCitationFinder.findAUCaseCitation(citation)

    return {
      citation,
      database: Constants.DATABASES.AU_hca,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      links: [
        {
          doctype: `Summary`,
          filetype: `HTML`,
          url,
        },
        {
          doctype: `Judgment`,
          filetype: `PDF`,
          url: `${DOMAIN}/downloadPdf/${year}/HCA/${page}`,
        },
      ],
      name,
    }
  }).get()

  return results.filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  return null
}

const HCA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default HCA