import * as cheerio from 'cheerio'
import Request from 'utils/Request'
import Constants from 'utils/Constants'
import Helpers from 'utils/Helpers'
import { findCitation } from '../utils'
import { findAUCaseCitation } from 'utils/Finder/CaseCitationFinder/AU'
import { CacheRequestConfig } from 'axios-cache-interceptor'

const DOMAIN = `https://www.queenslandjudgments.com.au`

const parseCaseResults = (htmlResponse: string): Law.Case[] => {
  const $ = cheerio.load(htmlResponse)
  const results = $(`#home > ul.result-list > li`).map((_, element): Law.Case => {
    const title = $(`span.caseName`, element).text().trim()
    const citation = findCitation(findAUCaseCitation, title)
    const name = title.replace(citation, ``).trim()
    const path = $(`.enhanced-search > .custom-tooltip:nth-of-type(1) > a`, element).attr(`href`).replace(/\?.*$/, ``)
    const link = `${DOMAIN}${path}`
    return {
      citation,
      database: Constants.DATABASES.AU_queensland_judgments,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      links: [
        {
          doctype: `Summary`,
          filetype: `HTML`,
          url: link,
        },
        {
          doctype: `Judgment`,
          filetype: `PDF`,
          url: `${link}/pdf`,
        },
      ],
      name,
    }
  }).get()
  return results.filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/caselaw-search/query`,
    {
      params: {
        queryStringCitation: citation,
        requestSource: `quickCitationSearch`,
        tab: `citation`,
      },
    } as CacheRequestConfig,
  )
  return parseCaseResults(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/caselaw-search/query`,
    {
      params: {
        queryStringCaseName: caseName,
        requestSource: `quickCaseNameSearch`,
        tab: `case-name`,
      },
    } as CacheRequestConfig,
  )
  return parseCaseResults(data)
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  return null
}

const QueenslandJudgments = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default QueenslandJudgments