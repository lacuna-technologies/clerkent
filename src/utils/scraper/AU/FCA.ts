import { CacheRequestConfig } from "axios-cache-interceptor"
import * as cheerio from 'cheerio'
import { Constants, Request } from "utils"
import CaseCitationFinder from "utils/Finder/CaseCitationFinder"

const search = async (query: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(`https://search2.fedcourt.gov.au/s/search.html`, {
    params: {
      collection: `judgments`,
      meta_2: query,
      meta_v_phrase_orsand: `judgments/Judgments/`,
      sort: `date`,
    },
  } as CacheRequestConfig)

  const $ = cheerio.load(data)

  return $(`#fb-results > .result`).map((_, element): Law.Case => {
    const title = $(`h3 > a`, element).text().trim()
    const citation = CaseCitationFinder.findAUCaseCitation(title)[0].citation
    const name = title.replace(citation, ``)
    const url = $(`h3 > a`, element).attr(`href`)
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
      ],
      name,
    }
  }).get()
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => search(citation)

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => search(caseName)

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  return null
}

const FCA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default FCA