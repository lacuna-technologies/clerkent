import Fuse from 'fuse.js'
import * as cheerio from 'cheerio'
import Constants from 'utils/Constants'
import Logger from 'utils/Logger'
import Request from 'utils/Request'
import Helpers from 'utils/Helpers'

const BASE_URL = `https://www.stratatb.gov.sg`
const CURRENT_DECISIONS = `${BASE_URL}/resources-judgments.html`
const HISTORICAL_DECISIONS = `${BASE_URL}/resources-judgments-archives.html`

export const SGSTBlongFormatRegex = /stb(\sno\.?)?\s?(?<number>\d{1,4}[a-z]?)((\s(and|&)\s\d{1,4}[a-z]?)|(\/\d{1,4}[a-z]?)+)?\sof\s(?<year>[12]\d{3})/gi
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
  return `[${match.groups.year}] SGSTB ${match.groups.number}`
}

const parseCasesPage = (html: string): Law.Case[] => {
  const $ = cheerio.load(html)
  return $(`.main-cnt > .list.yearItm`).map((yearIndex, year) => {
    return $(`.itm`, year).map((rowIndex, row) => {
      const hyperlink = $(`.itm-desc a`, row)
      const path = hyperlink.attr(`href`)
      const hyperlinkText = hyperlink.attr(`title`).replaceAll(`&nbsp;`, ` `)
      const matches = [...hyperlinkText.matchAll(/(stb.*\d{4})\s*[–-]\s*([\da-z].*)/gi)]
      try {
        const [[_, citation, name]] = matches
        const judgmentLink: Law.Link = {
          doctype: `Judgment`,
          filetype: `PDF`,
          url: `${BASE_URL}/${path}`,
        }
        return {
          citation: citation.trim(),
          database: Constants.DATABASES.SG_stb,
          jurisdiction: Constants.JURISDICTIONS.SG.id,
          links: [
            judgmentLink,
          ],
          name: name.trim(),
        }
      } catch (error) {
        Logger.error(
          error,
        )
      }
      return null
    }).get().filter(c => c !== null)
  }).get()
}

const getAllCases = async (): Promise<Law.Case[]> => {
  const getCurrentCases = Request.get(CURRENT_DECISIONS)
  const getHistoricalCases = Request.get(HISTORICAL_DECISIONS)
  const results = (await Promise.allSettled([
    getCurrentCases,
    getHistoricalCases,
  ])).filter(({ status }) => status === `fulfilled`)

  return results.flatMap(({ value }: any) => {
    const { data } = value
    return parseCasesPage(data)
  })
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