import Request from 'utils/Request'
import type Law from 'types/Law'
import Logger from 'utils/Logger'
import Constants from 'utils/Constants'

const SEARCH_API_URL = `https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/search/supreme-court`
const CITATION_API_URL = `https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/document/citation`
const defaultSearchConfig = {
  info: {
    appId: `APP_LAWNET_ONE`,
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
    sessionId: null,
    userDevice: {
      info: {
        isBot: false,
      },
    },
    userId: 0,
    userName: null,
  },
}
const defaultCitationConfig = {
  info: {
    appId: `APP_LAWNET_ONE`,
    data: {
      citation: ``,
    },
    sessionId: null,
    userDevice: {
      info: {
        isBot: false,
      },
    },
    userId: 0,
    userName: null,
  },
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  try {
    const requestBody = {
      ...defaultCitationConfig,
      info: {
        ...defaultCitationConfig.info,
        data: {
          ...defaultCitationConfig.info.data,
          citation,
        },
      },
    }
    const { data } = await Request.post(CITATION_API_URL, requestBody)
    const encodedCitation = citation.replaceAll(` `, `+`)
    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
    }
    const pdfLink: Law.Link = {
      // TODO: add PDF link, which is a POST link rather than a GET link 
      doctype: `Judgment`,
      filetype: `PDF`,
      url: ``,
    }
    const result: Law.Case = {
      citation: data.data.metadata[`NeutralCitation`][`NCit`],
      database: Constants.DATABASES.openlaw,
      links: [
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
    info: {
      ...defaultSearchConfig.info,
      data: {
        ...defaultSearchConfig.info.data,
        searchQuery: query,
      },
    },
  }
  try {
    const { data } = await Request.post(SEARCH_API_URL, requestBody)
    const results: Law.Case[] = data.results.map((result): Law.Case => {
      // TODO: parse links
      const encodedCitation = result.ncitation.replaceAll(` `, `+`)
      const pdfLink: Law.Link = {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: ``,
      }
      const judgmentLink: Law.Link = {
        doctype: `Judgment`,
        filetype: `HTML`,
        url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
      }
      return {
        citation: result.ncitation,
        database: Constants.DATABASES.openlaw,
        links: [
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

const Lawnet = {
  getCaseByCitation,
  getCaseByName,
  getSearchResults,
}

export default Lawnet