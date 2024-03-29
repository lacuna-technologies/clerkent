import qs from 'qs'
import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants' 
import Logger from '../../Logger'
import CaseCitationFinder from '../../Finder/CaseCitationFinder'
import Helpers from '../../Helpers'
import type { AxiosResponse } from 'axios'
import PDF from '../../PDF'
import { findCitation } from '../utils'
import { CacheRequestConfig } from 'axios-cache-interceptor'

const DOMAIN = `https://www.bailii.org`

const parseSingleCase = (data: AxiosResponse[`data`], url: string): Law.Case => {

  const $ = cheerio.load(data)

  const pdfPath = $(`a[href$=".pdf"]`).eq(0).attr(`href`)

  return {
    citation: findCitation(
      CaseCitationFinder.findUKCaseCitation,
      $(`title`).text().trim(),
    ),
    database: Constants.DATABASES.UK_bailii,
    jurisdiction: Constants.JURISDICTIONS.UK.id,
    links: [
      {
        doctype: `Judgment`,
        filetype: `HTML`,
        url,
      },
      ...(pdfPath
        ? [{ doctype: `Judgment`, filetype: `PDF`, url: `${DOMAIN}${pdfPath}` } as Law.Link]
        : []
      ),
    ],
    name: $(`title`).text().trim().split(`[`)[0],
  }
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const response = await Request.post(
    `${DOMAIN}/cgi-bin/find_by_citation.cgi`, 
    qs.stringify({ citation }, { format : `RFC1738` }),
    {
      validateStatus: status => (status >= 200 && status < 300) || status === 302,
    } as CacheRequestConfig,
  )

  // there is a bug in axios-cache-interceptor such that
  // the original request is not returned, so we have to
  // work around that
  // if(request.responseURL === `${DOMAIN}/cgi-bin/find_by_citation.cgi`) {
  //   return []
  // }
  const { data } = response
  const $ = cheerio.load(data)
  if($(`body > p`).eq(2).text().includes(`No matching citations found.`)){
    return []
  }

  const { config } = response
  const url = `${config.url}?${config.data}`

  const result = parseSingleCase(data, url)

  return [result]
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const { data } = await Request.get(
      `${DOMAIN}/cgi-bin/lucy_search_1.cgi`,
      {
        params: {
          mask_path: `uk/cases scot/cases ew/cases ie/cases nie/cases eu/cases`,
          querytitle: caseName,
          show: 20, // because BAILII sometimes doesn't do the best job of sorting
          sort: `rank`,
        },
      }  as CacheRequestConfig,
    )

    const $ = cheerio.load(data)

    const matches: Law.Case[] = $(`body ol[start="1"] > li`).map((_, element): Law.Case => {
      const name = $(`a`, element).eq(0).text().trim().split(`[`)[0]
      const citation = findCitation(
        CaseCitationFinder.findUKCaseCitation,
        $(`small`, element).text().trim(),
      )
      const path = $(`a`, element).eq(0).attr(`href`)
      const link = `${DOMAIN}${path}`
      return {
        citation,
        database: Constants.DATABASES.UK_bailii,
        jurisdiction: Constants.JURISDICTIONS.UK.id,
        links: [
          {
            doctype: `Judgment`,
            filetype: `HTML`,
            url: link,
          },
        ],
        name,
      }
    }).get().filter(({ citation }) => Helpers.isCitationValid(citation))

    Logger.log(`BAILII result`, matches)

    return matches
  } catch (error){
    Logger.error(error)
  }
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  const { data, request } = await Request.get(Helpers.getJudgmentLink(inputCase.links)?.url)

  const parsedCase = parseSingleCase(data, request)

  const existingURL = parsedCase.links.find(({ doctype, filetype }) => doctype === inputDocumentType && filetype === `PDF`)?.url
  if(existingURL) {
    return existingURL
  }
  
  const fileName = Helpers.getFileName(inputCase, inputDocumentType)
  await PDF.save({
    code: `document.querySelectorAll('body>p:nth-of-type(1),body>p:nth-of-type(2),body>hr:nth-of-type(1)').forEach(v => v.remove());`
      + `document.querySelectorAll('body>hr:last-of-type,body>small:last-of-type').forEach(v => v.remove());`
      +`document.querySelector('body').setAttribute('style', 'font-family: Times New Roman;');`,
    fileName,
    url: request.responseURL,
  })
  return null
}

const BAILII = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default BAILII