import * as cheerio from 'cheerio'
import Request from 'utils/Request'
import Constants from 'utils/Constants'
import Helpers from 'utils/Helpers'
import Logger from 'utils/Logger'

const API_DOMAIN = `https://api.sclqld.org.au`
const DOMAIN = `https://www.sclqld.org.au`

const parseCaseResults = (htmlResponse: string): Law.Case[] => {
  const $ = cheerio.load(htmlResponse)
  const results = $(`#results-list > tbody > tr`).map((_, element): Law.Case => {
    const nameElement = $(`a.qjudgment`, element)
    const name = Helpers.htmlDecode(nameElement.text()).trim()
    const path = nameElement.attr(`href`)
    const link = `${DOMAIN}${path}`
    const citation = $(`span.no-wrap:first-of-type`, element).text().trim()
    const pdfLink = $(`a.direct-link`, element).attr(`href`)
    return {
      citation,
      database: Constants.DATABASES.AU_queensland_scl,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: link,
        },
        {
          doctype: `Judgment`,
          filetype: `PDF`,
          url: pdfLink,
        },
      ],
      name,
    }
  }).get()
  return results.filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${API_DOMAIN}/v1/caselaw/search`,
    {
      params: {
        c: citation,
        court: 0,
        cw: ``,
        fn: ``,
        form_id: `caselaw_advanced_search_form`,
        format: `results`,
        j: ``,
        lg: ``,
        lpp: 25,
        op: `Search`,
        p: 0,
        pt: ``,
        q: ``,
        reported: 0,
        sort: `score:desc`,
      },
    },
  )
  return parseCaseResults(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${API_DOMAIN}/v1/caselaw/search`,
    {
      params: {
        c: ``,
        court: 0,
        cw: ``,
        fn: ``,
        form_id: `caselaw_advanced_search_form`,
        format: `results`,
        j: ``,
        lg: ``,
        lpp: 25,
        op: `Search`,
        p: 0,
        pt: caseName,
        q: ``,
        reported: 0,
        sort: `score:desc`,
      },
    },
  )
  return parseCaseResults(data)
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  return null
}

const QueenslandSCL = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default QueenslandSCL