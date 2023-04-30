import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from 'utils/Constants'
import Helpers from 'utils/Helpers'

const ASSETS_DOMAIN = `https://assets.caselaw.nationalarchives.gov.uk`
const DOMAIN = `https://caselaw.nationalarchives.gov.uk`

const generatePDFPath = (path: string): string => {
  const segments = path.slice(1).split(`/`).join(`_`)
  return `${path}/${segments}.pdf`
}

const parseCases = (html: string): Law.Case[] => {
  const $ = cheerio.load(html)
  if($(`.results__results-intro`).text().trim() === `We found 0 judgments`){
    return []
  }
  return $(`.results__result-list-container > .judgment-listing__list > li`).map((_, element): Law.Case => {
    const name = $(`span.judgment-listing__title`, element).text().trim()
    const citation = $(`span.judgment-listing__neutralcitation`, element).text().trim()
    const path = $(`span.judgment-listing__title> a`, element).attr(`href`)
    const link = DOMAIN + path

    return {
      citation,
      database: Constants.DATABASES.UK_findcaselaw,
      jurisdiction: Constants.JURISDICTIONS.UK.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: link,
        },
        {
          doctype: `Judgment`,
          filetype: `PDF`,
          url: ASSETS_DOMAIN + generatePDFPath(path),
        },
      ],
      name,
    }
  }).get().filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const response = await Request.get(
    `${DOMAIN}/judgments/advanced_search`,
    {
      params: {
        from: ``,
        judge: ``,
        order: `-relevance`,
        party: ``,
        per_page: 10,
        query: `"${citation}"`,
        to: ``, 
      },
    },
  )
  return parseCases(response.data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const response = await Request.get(
    `${DOMAIN}/judgments/advanced_search`,
    {
      params: {
        from: ``,
        judge: ``,
        order: `-relevance`,
        party: ``,
        per_page: 10,
        query: caseName,
        to: ``, 
      },
    },
  )
  return parseCases(response.data)
}

const FindCaseLaw = {
  getCaseByCitation,
  getCaseByName,
}

export default FindCaseLaw