import Request from 'utils/Request'
import Logger from 'utils/Logger'
import Constants from 'utils/Constants'
import { browser, Downloads } from 'webextension-polyfill-ts'
import Helpers from 'utils/Helpers'

const SEARCH_API_URL = `https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/search/supreme-court`
const CITATION_API_URL = `https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/document/citation`
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
      ...defaultCitationConfig,
      data: {
        ...defaultCitationConfig.data,
        citation,
      },
    }
    const { data } = await Request.post(
      CITATION_API_URL,
      requestBody,
      defaultRequestOptions,
    )
    const encodedCitation = citation.replaceAll(` `, `+`)
    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
    }
    const summaryLink: Law.Link = {
      doctype: `Summary`,
      filetype: `HTML`,
      url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
    }
    const result: Law.Case = {
      citation: data.data.metadata[`NeutralCitation`][`NCit`],
      database: Constants.DATABASES.SG_openlaw,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [
        summaryLink,
        judgmentLink,
      ],
      name: data.data.metadata[`CaseTitle`],
    }
    return [result]

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
      defaultRequestOptions,
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
): Promise<void> => {
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
  Logger.log(options)
  await browser.downloads.download(options)
}

const OpenLaw = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
  getSearchResults,
}

export default OpenLaw