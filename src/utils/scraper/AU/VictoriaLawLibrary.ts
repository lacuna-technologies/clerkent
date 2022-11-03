import * as cheerio from 'cheerio'
import Constants from 'utils/Constants'
import { findAUCaseCitation } from 'utils/Finder/CaseCitationFinder/AU'
import Helpers from 'utils/Helpers'
import Request from 'utils/Request'
import { findCitation } from '../utils'

const DOMAIN = `https://www.lawlibrary.vic.gov.au`

const parseCaseResults = (htmlResponse: string): Law.Case[] => {
  const $ = cheerio.load(htmlResponse)
  const results = $(`.view.view-search .view-content .views-row`).map((_, element): Law.Case => {
    const titleElement = $(`a`, element)
    const textContent = titleElement.text().trim()
    const citation = findCitation(findAUCaseCitation, textContent)
    const name = textContent.replace(citation, ``).trim()
    const path = titleElement.attr(`href`)
    const link = `${DOMAIN}${path}`
    return {
      citation,
      database: Constants.DATABASES.AU_victoria_lawlibrary,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: link,
        },
      ],
      name,
    }
  }).get()
  return results.filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/search/judgments`,
    {
      params: {
        keywords: citation,
      },
    },
  )
  return parseCaseResults(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/search/judgments`,
    {
      params: {
        keywords: caseName,
      },
    },
  )
  return parseCaseResults(data)
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string> => {
  const { data } = await Request.get(Helpers.getJudgmentLink(inputCase.links)?.url)

  const $ = cheerio.load(data)
  const pdfURL = $(`.field-name-field-citation a`)
  return pdfURL.attr(`href`)
}

const VictoriaLawLibrary = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default VictoriaLawLibrary