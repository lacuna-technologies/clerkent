import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 
import Logger from '../../Logger'

const DOMAIN = `https://www.supremecourt.gov.sg`
const getSearchResults = (citation: string) => `${DOMAIN}/search-judgment?q=${citation}&y=All`

const parseCase = ($: cheerio.Root, cheerioElement: cheerio.Element): Law.Case => {
  const name = $(`.text`, cheerioElement).contents().get(2).data.trim()
  const link = $(`.doc-download`, cheerioElement).attr(`href`)
  const pdf = `${DOMAIN}${$(`.pdf-download`, cheerioElement).attr(`href`)}`
  const citation = $(`.text ul.decision li`, cheerioElement).eq(0).text().trim()

  const summaryLink: Law.Link | null = link
    ? { doctype: `Summary`, filetype: `HTML`, url: `${DOMAIN}${link}` }
    : null
  const pdfLink:Law.Link = { doctype: `Judgment`, filetype: `PDF`, url: pdf }
  return {
    citation,
    database: Constants.DATABASES.SG_sc,
    jurisdiction: Constants.JURISDICTIONS.SG.id,
    links: [
      ...(summaryLink ? [summaryLink] : []),
      pdfLink,
    ],
    name,
  }
}

const trimLeadingPageZeros = (citation: string) => citation.replace(/ 0+([1-9]+)$/, ` $1`)

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(citation))
  const $ = cheerio.load(data)

  const results = $(`.judgmentpage`)
    .map((_, element) => parseCase($, element))
    .get()
    .filter(({ citation: scrapedCitation })=> (
      trimLeadingPageZeros(scrapedCitation).toLowerCase() === citation.toLowerCase()
    ))
  Logger.log(`SGSC scrape results`, results)
  return results
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(caseName))
  const $ = cheerio.load(data)

  const results = $(`.judgmentpage`).map((_, element) => parseCase($, element)).get()
  Logger.log(`SGSC scrape results`, results)
  return results
}

const SGSC = {
  getCaseByCitation,
  getCaseByName,
  getSearchResults,
}

export default SGSC