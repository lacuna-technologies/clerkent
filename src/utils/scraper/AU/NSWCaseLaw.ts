import qs from 'qs'
import * as cheerio from 'cheerio'
import Request from 'utils/Request'
import Constants from 'utils/Constants'
import Helpers from 'utils/Helpers'
import { findCitation } from '../utils'
import { findAUCaseCitation } from 'utils/Finder/CaseCitationFinder/AU'

const DOMAIN = `https://www.caselaw.nsw.gov.au`

const defaultCourts = [
  `54a634063004de94513d827a`,
  `54a634063004de94513d827b`,
  `54a634063004de94513d8278`,
  `54a634063004de94513d8279`,
  `54a634063004de94513d827c`,
  `54a634063004de94513d827d`,
  `54a634063004de94513d828e`,
  `54a634063004de94513d8285`,
  `54a634063004de94513d827e`,
  `54a634063004de94513d827f`,
  `54a634063004de94513d8286`,
  `54a634063004de94513d8280`,
  `54a634063004de94513d8281`,
]
const defaultParameters = {
  _courts: defaultCourts.map(() => `on`),
  before: ``,
  body: ``,
  casesCited: ``,
  catchwords: ``,
  courts: defaultCourts,
  endDate: ``,
  fileNumber: ``,
  legislationCited: ``,
  mnc: ``,
  page: ``,
  party: ``,
  sort: ``,
  startDate: ``,
  title: ``,
}

const parseCaseResults = (htmlResponse: string): Law.Case[] => {
  const $ = cheerio.load(htmlResponse)
  const results = $(`.container.searchresults > .row.result`).map((_, element): Law.Case => {
    const titleElement = $(`h4 a`, element)
    const citation = findCitation(findAUCaseCitation, titleElement.text().trim())
    const name = titleElement.text().trim().replace(citation, ``)
    const path = titleElement.attr(`href`)
    const link = `${DOMAIN}${path}`
    return {
      citation,
      database: Constants.DATABASES.AU_nsw_caselaw,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      links: [
        {
          doctype: `Summary`,
          filetype: `HTML`,
          url: link,
        },
        {
          doctype: `Judgment`,
          filetype: `DOCX`,
          url: `${link}/export.docx`,
        },
      ],
      name,
    }
  }).get()
  return results.filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/search/advanced`,
    {
      params: {
        ...defaultParameters,
        mnc: citation,
      },
      paramsSerializer: {
        serialize: parameters => qs.stringify(
          parameters,
          {
            arrayFormat: `repeat`,
            format: `RFC3986`,
            indices: false,
          },
        ),
      },
    },
  )
  return parseCaseResults(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/search/advanced`,
    {
      params: {
        ...defaultParameters,
        party: caseName,
      },
      paramsSerializer: {
        serialize: parameters => qs.stringify(
          parameters,
          {
            arrayFormat: `repeat`,
            format: `RFC3986`,
            indices: false,
          },
        ),
      },
    },
  )
  return parseCaseResults(data)
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  return null
}

const NSWCaseLaw = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default NSWCaseLaw