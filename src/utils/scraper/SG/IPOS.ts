import Fuse from 'fuse.js'
import * as cheerio from 'cheerio'
import Logger from 'utils/Logger'
import Request from 'utils/Request'
import Constants from 'utils/Constants'
import Finder from 'utils/Finder'
import Helpers from 'utils/Helpers'
import { CacheAxiosResponse } from 'axios-cache-interceptor'

// IPOS's search functionality is buggy
// - CaseActionDecisions sometimes does not contain a link to the judgment
// - no results are returned if the full citation is used
// Current workaround is to fetch all decisions and manually search
// since there are not that many

const BASE_URL = `https://www.ipos.gov.sg`
const SEARCH_URL = `${BASE_URL}/manage-ip/resolve-ip-disputes/legal-decisions/LoadCaseData`
const CURRENT_DECISIONS = `${BASE_URL}/manage-ip/resolve-ip-disputes/legal-decisions`
const HISTORICAL_DECISIONS = `${BASE_URL}/manage-ip/resolve-ip-disputes/legal-decisions/legal-decisions-(pre-2018)`

const makeAbsoluteURL = (url: string): string => {
  if (!url) {
    return ``
  }
  if (url.startsWith(`http`)) {
    return url
  }
  return `${BASE_URL}${url}`
}

const parseCasesPage = (html: string): Law.Case[] => {
  const $ = cheerio.load(html)
  return $(`table > tbody > tr`).map((rowIndex, row) => {
    try {
      const isHeaderRow = $(`td`, row).first().text().trim() === `Citation`
      const isAppealRow = $(row).children().length === 2
      if (isHeaderRow || isAppealRow) {
        return null
      }
      const fullCitation = $(`td`, row).first().text()
      const { citation } = Finder.findCaseCitation(fullCitation)[0]
      const markPatent = $(`td`, row).eq(2).text().trim()
      const name = fullCitation.replace(citation, ``).trim() +
        (markPatent && markPatent.length > 0
          ? ` (${markPatent})`
          : ``)
      const links = $(`a`, $(`td`, row).eq(5))

      const judgmentURL = links.filter((_, link) =>
        $(link).text().includes(`Full Decision`),
      ).eq(0).attr(`href`)
      const summaryURL = links.filter((_, link) =>
        $(link).text().includes(`Case Summary`),
      ).eq(0).attr(`href`)

      const judgmentLink: Law.Link = {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: makeAbsoluteURL(judgmentURL),
      }
      const summaryLink: Law.Link = {
        doctype: `Summary`,
        filetype: `PDF`,
        url: makeAbsoluteURL(summaryURL),
      }
      return {
        citation,
        database: Constants.DATABASES.SG_ipos,
        jurisdiction: Constants.JURISDICTIONS.SG.id,
        links: [
          ...(judgmentURL && judgmentURL.length > 0 ? [judgmentLink] : []),
          ...(summaryURL && summaryURL.length > 0 ? [summaryLink] : []),
        ],
        name,
      }
    } catch (error) {
      Logger.error(error, $(`td`, row).first().text())
      return null
    }
  }).get().filter(c => c !== null)
}

const searchCases = async (query: string): Promise<Law.Case[]> => {
  const getCurrentCases = searchPost2020Cases(query)
  const getHistoricalCases = (async (): Promise<Law.Case[]> => {
    try {
      const { data } = await Request.get(HISTORICAL_DECISIONS)
      return parseCasesPage(data)
    } catch (error) {
      Logger.error(error)
    }
  })()
  try {
    const results = (await Promise.allSettled([
      getCurrentCases,
      getHistoricalCases,
    ])).filter(({ status }) => status === `fulfilled`) as PromiseFulfilledResult<Law.Case[]>[]

    return results.flatMap(({ value }: PromiseFulfilledResult<Law.Case[]>) => {
      return value
    })
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const searchPost2020Cases = async (query: string): Promise<Law.Case[]> => {
  const { data } = await Request.post(SEARCH_URL, {
    Citation: query,
    MarkPatent: ``,
    TypeIP: ``,
    YearIssue: ``,
  })

  return data.map(r => {
    const { citation } = Finder.findCaseCitation(r.Case.Citation)[0]
    const name = r.Case.Citation.replace(citation, ``).trim()

    try {

      const judgmentURL = r.CaseActions[0]?.CaseActionDecisions.find(d => (
        d.Text === `Full Decision` || d.Text === `Registrar's Decision`
      ))?.DecisionFileUrl
      const summaryURL = r.CaseActions[0]?.CaseActionDecisions.find(d => d.Text === `Case Summary`)?.DecisionFileUrl

      return {
        citation,
        database: Constants.DATABASES.SG_ipos,
        jurisdiction: Constants.JURISDICTIONS.SG.id,
        links: [
          ...(judgmentURL && judgmentURL.length > 0 ? [{
            doctype: `Judgment`,
            filetype: `PDF`,
            url: makeAbsoluteURL(judgmentURL),
          }] : []),
          ...(summaryURL && summaryURL.length > 0 ? [{
            doctype: `Summary`,
            filetype: `PDF`,
            url: makeAbsoluteURL(summaryURL),
          }] : []),
        ],
        name,
      }
    } catch (error) {
      Logger.error(error)
    }

    return null
  }).filter(r => r !== null)
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const allCases = await searchCases(citation)
  const escapedCitation = Helpers.escapeRegExp(citation)
  return allCases.filter(({ citation: c }) => {
    return (new RegExp(`${escapedCitation}`, `i`).test(c))
  })
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const allCases = await searchCases(``) // fetch all because IPOS search does not work well
  const fuse = new Fuse(allCases.map(({ name }) => name))

  return fuse.search(caseName)
    .map(({ refIndex }) => allCases[refIndex])
}

const IPOS = {
  getCaseByCitation,
  getCaseByName,
}

export default IPOS