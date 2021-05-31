import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 

const DOMAIN = `https://www.supremecourt.gov.sg`
const getSearchResults = (citation: string) => `${DOMAIN}/search-judgment?q=${citation}&y=All`

const parseCase = ($: cheerio.Root, cheerioElement: cheerio.Element) => {
  const name = $(`.text`, cheerioElement).contents().get(2).data.trim()
  const link = $(`.doc-download`, cheerioElement).attr(`href`)
  const pdf = `${DOMAIN}${$(`.pdf-download`, cheerioElement).attr(`href`)}`
  const citation = $(`.text ul.decision li`, cheerioElement).eq(0).text().trim()
  return {
    citation,
    name,
    pdf,
    ...(link ? { link: `${DOMAIN}${link}`} : { link: pdf }),
    database: Constants.DATABASES.SG_sc,
    jurisdiction: Constants.JURISDICTIONS.SG.id,
  }
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(citation))
  const $ = cheerio.load(data)

  return $(`.judgmentpage`)
    .map((_, element) => parseCase($, element))
    .get()
    .filter((match: Law.Case)=> match.citation.toLowerCase() === citation.toLowerCase())
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(getSearchResults(caseName))
  const $ = cheerio.load(data)

  return $(`.judgmentpage`).map((_, element) => parseCase($, element)).get()
}

const SGSC = {
  getCaseByCitation,
  getCaseByName,
  getSearchResults,
}

export default SGSC