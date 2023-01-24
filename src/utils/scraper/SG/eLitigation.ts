import { load } from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants'
import Logger from '../../Logger'
import { CacheRequestConfig } from 'axios-cache-interceptor'

const DOMAIN = `https://www.elitigation.sg`

const parseCaseResults = (data: string): Law.Case[] => {
  const $ = load(data)
  return $(`#listview > .row > .card.col-12`).map((_, element) => {
    const card = $(`> .card-body > .row`, element)
    const name = $(`a.gd-card-title,a.gd-heardertext`, card).text().trim()
    const link = $(`a.gd-card-title,a.gd-heardertext`, card).attr(`href`)
    const pdfPath = link.replace(`SUPCT/`, ``).replace(`/s/`, `/gd/`)
    const pdf = $(`img.card-icon`, card).parent().attr(`href`) || `${pdfPath}/pdf`
    const citation = $(`span.gd-addinfo-text`, card).first().text().trim().replace(`|`, ``).trim()

    const summaryLink = link
      ? { doctype: `Summary`, filetype: `HTML`, url: `${DOMAIN}${link}` } as Law.Link
      : null

    const pdfLink = pdf
      ? { doctype: `Judgment`, filetype: `PDF`, url: `${DOMAIN}${pdf}` } as Law.Link
      : null

    return {
      citation,
      database: Constants.DATABASES.SG_elitigation,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [
        ...(summaryLink ? [summaryLink] : []),
        ...(pdfLink ? [pdfLink] : []),
      ],
      name,
    }

  }).get()
}

const trimLeadingPageZeros = (citation: string) => citation.replace(/ 0+([1-9]+)$/, ` $1`)

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  // const abbr = citation.match(makeCaseCitationRegex(SGSCAbbrs))
  // Logger.log(`abbr`, abbr)

  const { data } = await Request.get(`${DOMAIN}/gdviewer/Home/Index`,
    {
      params: {
        currentPage: `1`,
        searchPhrase: `"${citation}"`,
        sortAscending: `False`,
        sortBy: `Score`,
        verbose: `False`,
        yearOfDecision: `All`,
      },
    } as CacheRequestConfig)

  return parseCaseResults(data).filter(({ citation: scrapedCitation }) => (
    trimLeadingPageZeros(scrapedCitation).toLowerCase() === citation.toLowerCase()
  ))
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const { data } = await Request.get(`${DOMAIN}/gdviewer/Home/Index`,
    {
      params: {
        currentPage: `1`,
        searchPhrase: caseName,
        sortAscending: `False`,
        sortBy: `Score`,
        verbose: `False`,
        yearOfDecision: `All`,
      },
    } as CacheRequestConfig)
    return parseCaseResults(data)
  } catch (error){
    Logger.error(error)
    throw error
  }
}

const eLitigation = {
  getCaseByCitation,
  getCaseByName,
}

export default eLitigation