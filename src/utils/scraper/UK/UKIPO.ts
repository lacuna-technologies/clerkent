import type { AxiosResponse } from 'axios'
import cheerio from 'cheerio'
import type Law from 'types/Law'
import Constants from 'utils/Constants'
import Helpers from 'utils/Helpers'
import Logger from 'utils/Logger'
import Request from 'utils/Request'

const PATENT_DETAIL_URL = `https://www.ipo.gov.uk/p-challenge-decision-results/p-challenge-decision-results-bl`
const PATENT_SEARCH_URL = `https://www.ipo.gov.uk/p-challenge-decision-results/p-challenge-decision-results-gen.htm`
const TM_DETAIL_URL = `https://www.ipo.gov.uk/t-challenge-decision-results/t-challenge-decision-results-bl`
const TM_SEARCH_URL = `https://www.ipo.gov.uk/t-challenge-decision-results/t-challenge-decision-results-gen.htm`

const defaultPatentSearchParameters = {
  MonthFrom: ``,
  MonthTo: ``,
  YearFrom: ``,
  YearTo: ``,
  hearingType: `All`,
  hearingofficer: ``,
  keywords1: ``,
  keywords2: ``,
  keywords3: ``,
  number:``,
  party: ``,
  provisions: ``,
  submit: `Go %BB`,
}

const defaultTmSearchParameters = {
  MonthFrom: ``,
  MonthTo: ``,
  YearFrom: ``,
  YearTo: ``,
  grounds: `All`,
  hearingType: `All`,
  hearingofficer: ``,
  mark: ``,
  party: ``,
  submit: `Go %BB`,
  tmclass: 0,
}

const isPatentURL = (responseURL: string): boolean => responseURL.includes(`p-challenge-decision-results`)

const makeFullURL = (path: string, responseURL: string): string => {
  const baseURL = responseURL.split(`/`).slice(0, 4).join(`/`)
  return `${baseURL}/${path}`
}

const parseSingleCase = (html: string, responseURL: string): Law.Case => {
  const $ = cheerio.load(html)
  const mark = $(`.template > dl:nth-child(2) > dd:nth-child(8)`).text().trim()
  const parties = $(`.template > dl:nth-child(2) > dd:nth-child(10)`).text().trim()
  const name = isPatentURL(responseURL) ? parties : mark
  const judgmentLink: Law.Link = {
    doctype: `Judgment`,
    filetype: `HTML`,
    url: responseURL,
  }
  const summaryLink: Law.Link = {
    doctype: `Summary`,
    filetype: `HTML`,
    url: responseURL,
  }
  return {
    citation: $(`.template > dl:nth-child(2) > dd:nth-child(2)`).text().trim(),
    database: Constants.DATABASES.UK_ipo,
    jurisdiction: Constants.JURISDICTIONS.UK.id,
    links: [
      summaryLink,
      judgmentLink,
    ],
    name,
  }
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const patentSearch = await Request.get(
    PATENT_DETAIL_URL,
    {
      params: {
        "BL_Number": citation,
      },
    },
  )
  const tmSearch = await Request.get(
    TM_DETAIL_URL,
    {
      params: {
        "BL_Number": citation,
      },
    },
  )
  const result = (await Promise.allSettled([patentSearch, tmSearch]))
    .find(({ status,  value: { request }  }: PromiseFulfilledResult<AxiosResponse<any, any>>) =>
      status === `fulfilled` && !request.responseURL.includes(`Err=BLNUMNotExist`),
    )

  const { value: { data, request } } = result as PromiseFulfilledResult<AxiosResponse<any, any>>
  const parsedCase = parseSingleCase(data, request.responseURL)

  return [parsedCase]
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const patentSearchParty = await Request.get(
    PATENT_SEARCH_URL,
    { params: {
        ...defaultPatentSearchParameters,
        party: caseName,
    } },
  )
  const patentSearchNumber = await Request.get(
    PATENT_SEARCH_URL,
    { params: {
      ...defaultPatentSearchParameters,
      number: caseName,
    } },
  )
  const tmSearchParty = await Request.get(
    TM_SEARCH_URL,
    { params: {
      ...defaultTmSearchParameters,
      party: caseName,
    } },
  )
  const tmSearchMark = await Request.get(
    TM_SEARCH_URL,
    { params: {
      ...defaultTmSearchParameters,
      mark: caseName,
    } },
  )
  const result = (await Promise.allSettled([
    patentSearchParty,
    patentSearchNumber,
    tmSearchParty,
    tmSearchMark,
  ]))
    .filter(({ status,  value: { request }  }: PromiseFulfilledResult<AxiosResponse<any, any>>) =>
      status === `fulfilled` && !request.responseURL.includes(`Err=BLNUMNotExist`),
    )
    .map(({ value: { data, request } }: PromiseFulfilledResult<AxiosResponse<any, any>>) => {
      const $ = cheerio.load(data)
      const matches: Law.Case[] = $(`#mainCol div.template table tbody tr`).map((_, element) => {
        const hyperlink = $(`td:nth-child(1) > a`, element)
        const citation = hyperlink.text().trim()
        const name = $(`td:nth-child(3)`, element).text().trim()
        const summaryLink: Law.Link = {
          doctype: `Summary`,
          filetype: `HTML`,
          url: makeFullURL(hyperlink.attr(`href`), request.responseURL),
        }
        const judgmentLink: Law.Link = {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: makeFullURL(hyperlink.attr(`href`), request.responseURL),
        }
        return {
          citation,
          database: Constants.DATABASES.UK_ipo,
          jurisdiction: Constants.JURISDICTIONS.UK.id,
          links: [
            summaryLink,
            judgmentLink,
          ],
          name,
        }
      }).get()
      return matches
    })

  return result.flat()
}

const getPDF = async (inputCase: Law.Case): Promise<string | null> => {
  const judgmentLink = Helpers.getJudgmentLink(inputCase.links)?.url
  const baseURL = judgmentLink.split(`/`).slice(0,4).join(`/`)
  const path = inputCase.citation.toLowerCase().replaceAll(`/`, ``)
  try {
    const { request } = await Request.head(`${baseURL}/${path}.pdf`)
    return request.responseURL
  } catch {
    Logger.log(`UKIPO: getPDF - no PDF available`)
  }
  return null
}

const UKIPO = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default UKIPO