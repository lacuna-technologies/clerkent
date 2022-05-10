import Fuse from 'fuse.js'
import cheerio from 'cheerio'
import type Law from 'types/Law'
import Logger from 'utils/Logger'
import Request from 'utils/Request'
import Constants from 'utils/Constants'
import type { AxiosResponse } from 'axios'
import Finder from 'utils/Finder'

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
  if(!url){
    return ``
  }
  if(url.startsWith(`http`)){
    return url
  }
  return `${BASE_URL}${url}`
}

const parseCasesPage = (html: string): Law.Case[] => {
  const $ = cheerio.load(html)
  return $(`.sfContentBlock table`).map((tableIndex, table) => {
    // ignore header which for some reason is located in tbody
    return $(`tbody tr`, table).map((rowIndex, row) => {
      try {
        const isHeaderRow = $(`td:nth-child(1)`, row).text().trim() === `Citation`
        const isAppealRow = $(row).children().length === 2
        if(isHeaderRow || isAppealRow){
          return null
        }
        const fullCitation = $(`td:nth-child(1)`, row).text()
        const { citation } = Finder.findCaseCitation(fullCitation)[0]
        const markPatent = $(`td:nth-child(3)`, row).text().trim()
        const name = fullCitation.replace(citation, ``).trim() +
          (markPatent && markPatent.length > 0
            ? ` (${markPatent})`
            : ``)
        const links = $(`td:nth-child(6) a`, row)

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
      } catch (error){
        Logger.error(error, $(`td:nth-child(1)`, row).text())
        return null
      }
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

  return results.flatMap(({ value }: PromiseFulfilledResult<AxiosResponse<any, any>>) => {
    const { data } = value
    return parseCasesPage(data)
  })
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const allCases = await getAllCases()
  const escapedCitation = citation.replaceAll(`[`, `\\[`)
  return allCases.filter(({ citation: c }) => {
    return (new RegExp(`${escapedCitation}`, `i`).test(c))
  })
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const allCases = await getAllCases()
  const fuse = new Fuse(allCases.map(({ name }) => name))

  return fuse.search(caseName)
    .map(({ refIndex }) => allCases[refIndex])
}

// const search = async (citation: string): Promise<Law.Case[]> => {
  
//   const body = {
//     Citation: ``,
//     MarkPatent: ``,
//     TypeIP: ``,
//     YearIssue: ``,
//   }

//   try {
//     const { data } = await Request.post(
//       IPOS_SEARCH_URL,
//       body,
//     )
//     return data.map((result): Law.Case => {
//       const {
//         Case: {
//           Name,
//         },
//         CaseActions: {
//           CaseActionDecisions: [],
//         },
//       } = result
//       const judgmentLink: Law.Link = {
//         doctype: `Judgment`,
//         filetype: `HTML`,
//         url: ``,
//       }
//       return {
//         citation,
//         database: Constants.DATABASES.SG_ipos,
//         jurisdiction: Constants.JURISDICTIONS.SG.id,
//         links: [],
//         name: Name,
//       }
//     })
//   } catch (error) {
//     Logger.log(error)
//   }

//   return []
// }

const IPOS = {
  getCaseByCitation,
  getCaseByName,
}

export default IPOS