import Fuse from 'fuse.js'
import * as cheerio from 'cheerio'
import Constants from 'utils/Constants'
import Logger from 'utils/Logger'
import Request from 'utils/Request'
import Helpers from 'utils/Helpers'

const BASE_URL = `https://www.stratatb.gov.sg`
const CURRENT_DECISIONS = `${BASE_URL}/news-and-judgments/judgments/`

export const SGSTBlongFormatRegex = /stb(\sno\.?)?\s?(?<stbnumber>\d{1,4}[a-z]?)(,\s\d{1,4}){0,4}((\s(and|&)\s\d{1,4}[a-z]?)|(\/\d{1,4}[a-z]?)+)?\sof\s(?<stbyear>[12]\d{3})/gi
const SGSTBsquareBracketRegex = /\[(?<year>[12]\d{3})] sgstb (?<number>\d{1,4}[a-z]?)/gi
export const SGSTBIsSquareBracketFormat = (citation: string): boolean => (new RegExp(SGSTBsquareBracketRegex, `i`)).test(citation)
export const SGSTBIsLongFormat = (citation: string): boolean => (new RegExp(SGSTBlongFormatRegex, `i`)).test(citation)
export const SGSTBLongFormat = (squareBracketCitation: string) => {
  const [match] = [...squareBracketCitation.matchAll(
    SGSTBsquareBracketRegex,
  )]
  return `STB ${match.groups.number} of ${match.groups.year}`
}
export const SGSTBSquareBracketFormat = (longCitation: string): string => {
  const [match] = [...longCitation.matchAll(
    SGSTBlongFormatRegex,
  )]
  return `[${match.groups.stbyear}] SGSTB ${match.groups.stbnumber}`
}

const parseCasesPage = (html: string): Law.Case[] => {
  const $ = cheerio.load(html)
  return $(`.bp-container > .row > div.col.resource-card-element`).map((_, item) => {
    const hyperlink = $(`a`, item)
    const path = hyperlink.attr(`href`)
    const title = $(`h5 > b`, item).text().trim()
    const [match] = [...title.matchAll(SGSTBlongFormatRegex)]
    const citation = match[0]
    const name = title.replace(`${citation} – `, ``).trim()

    try {
      const judgmentLink: Law.Link = {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: `${BASE_URL}/${path}`,
      }
      return {
        citation: SGSTBSquareBracketFormat(citation),
        database: Constants.DATABASES.SG_stb,
        jurisdiction: Constants.JURISDICTIONS.SG.id,
        links: [
          judgmentLink,
        ],
        name,
      }
    } catch (error) {
      Logger.error(
        error,
      )
    }
    return null
  }).get().filter(c => c !== null)
}

const getAllCases = async (): Promise<Law.Case[]> => {
  const { data } = await Request.get(CURRENT_DECISIONS)
  return parseCasesPage(data)
}

const makeSTBCitation = (citation: string): string => {
  if (SGSTBIsLongFormat(citation)) {
    return SGSTBSquareBracketFormat(citation)
  }
  return citation
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const allCases = await getAllCases()
  const escapedCitation = Helpers.escapeRegExp(makeSTBCitation(citation))
  return allCases.filter(({ citation: c }) => {
    return (new RegExp(`${escapedCitation}`, `i`).test(makeSTBCitation(c)))
  })
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const allCases = await getAllCases()
  const fuse = new Fuse(allCases.map(({ name }) => name))
  return fuse.search(caseName)
    .map(({ refIndex }) => allCases[refIndex])
}

const STB = {
  getCaseByCitation,
  getCaseByName,
}

export default STB