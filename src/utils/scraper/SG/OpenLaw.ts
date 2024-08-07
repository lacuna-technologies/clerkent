import Request from 'utils/Request'
import Logger from 'utils/Logger'
import Constants from 'utils/Constants'
import { Downloads } from 'webextension-polyfill-ts'
import Helpers from 'utils/Helpers'
import { CacheRequestConfig } from 'axios-cache-interceptor'

const SEARCH_API_URL = `https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/search/supreme-court`
const PDF_DOWNLOAD_URL = `https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/download/v1`
const defaultUserDevice = {
  isBot: false,
}
const defaultConfig = {
  info: {
    appId: `APP_LAWNET_ONE`,
    sessionId: null,
    userDevice: defaultUserDevice,
    userId: 0,
    userName: null,
  },
}
const defaultSearchConfig = {
  ...defaultConfig,
  data: {
    filters: null,
    includeDraft: `true`,
    orderBy: `relevancy-desc`,
    pageLength: 10,
    searchDatabase: `allOfLawnet`,
    searchQuery: ``,
    searchSource: null,
    start: 1,
  },
}
const defaultCitationConfig = {
  ...defaultConfig,
  data: {
    citation: ``,
  },
}
const defaultPDFConfig = {
  ...defaultConfig,
  data: {
    citation: ``,
    legalTermsUrl: `/support/legal/terms-of-use`,
    pageUrl: ``,
  },
}
const defaultRequestOptions = {
  headers: {
    'Auth-Type': `Public`,
  },
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  try {
    const requestBody = {
      ...defaultSearchConfig,
      data: {
        ...defaultSearchConfig.data,
        searchQuery: `"${citation}"`,
      },
    }
    const { data } = await Request.post(
      SEARCH_API_URL,
      requestBody,
      defaultRequestOptions as unknown as CacheRequestConfig,
    )
    const results: Law.Case[] = data.data.results.map((result): Law.Case => {
      const encodedCitation = result.ncitation.replaceAll(` `, `+`)
      const summaryLink: Law.Link = {
        doctype: `Summary`,
        filetype: `HTML`,
        url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
      }
      const judgmentLink: Law.Link = {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
        }
      return {
        citation: result.ncitation,
        database: Constants.DATABASES.SG_openlaw,
        jurisdiction: Constants.JURISDICTIONS.SG.id,
        links: [
          summaryLink,
          judgmentLink,
        ],
        name: result.titles[0],
      }
    })
    return results
  } catch (error) {
    Logger.error(error)
    return []
  }
}

const getSearchResults = async (query: string): Promise<Law.Case[]>=> {
  const requestBody = {
    ...defaultSearchConfig,
    data: {
      ...defaultSearchConfig.data,
      searchQuery: query,
    },
  }
  try {
    const { data } = await Request.post(
      SEARCH_API_URL,
      requestBody,
      defaultRequestOptions as unknown as CacheRequestConfig,
    )
    const results: Law.Case[] = data.data.results.map((result): Law.Case => {
      const encodedCitation = result.ncitation.replaceAll(` `, `+`)
      const summaryLink: Law.Link = {
      doctype: `Summary`,
      filetype: `HTML`,
      url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
    }
      const judgmentLink: Law.Link = {
        doctype: `Judgment`,
        filetype: `HTML`,
        url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
      }
      return {
        citation: result.ncitation,
        database: Constants.DATABASES.SG_openlaw,
        jurisdiction: Constants.JURISDICTIONS.SG.id,
        links: [
          summaryLink,
          judgmentLink,
        ],
        name: result.titles[0],
      }
    })
    return results
  } catch (error){
    Logger.error(error)
    return []
  }
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  return await getSearchResults(caseName)
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<Downloads.DownloadOptionsType> => {
  Logger.log(`OpenLaw: getPDF`, inputCase, inputDocumentType)
  const options: Downloads.DownloadOptionsType = {
    body: JSON.stringify({
      ...defaultPDFConfig,
      data: {
        ...defaultPDFConfig.data,
        citation: inputCase.citation,
        pageUrl: (
          new URL(Helpers.getJudgmentLink(inputCase.links).url)
        ).pathname,
      },
    }),
    filename: Helpers.getFileName(inputCase, inputDocumentType),
    headers: [
      ...Object.entries(defaultRequestOptions.headers).map(([key, value]) => ({
        name: key,
        value,
      })),
      {
        name: `Content-Type`,
        value: `application/json`,
      },
    ],
    method: `POST`,
    saveAs: true,
    url: PDF_DOWNLOAD_URL,
  }
  return options
}

const OpenLaw = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
  getSearchResults,
}

export default OpenLaw