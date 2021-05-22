import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 

const DOMAIN = `https://www.supremecourt.gov.sg`
const getSearchResults = (citation: string) => `${DOMAIN}/search-judgment?q=${citation}&y=All`

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const { data } = await Request.get(getSearchResults(citation))
  const $ = cheerio.load(data)

  const matches: Law.Case[] = $(`.judgmentpage`).map((_, element) => {
    const name = $(`.text`, element).contents().get(2).data.trim()
    const link = $(`.doc-download`, element).attr(`href`)
    const pdf = `${DOMAIN}${$(`.pdf-download`, element).attr(`href`)}`
    const citation = $(`.text ul.decision li`, element).eq(0).text().trim()
    return {
      citation,
      name,
      pdf,
      ...(link ? { link: `${DOMAIN}${link}`} : {}),
      database: Constants.DATABASES.SG_sc,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
    }
  }).get().filter((match: Law.Case)=> match.citation.toLowerCase() === citation.toLowerCase())

  if (matches.length !== 1) {
    return false
  }

  return matches[0]
}

const SGSC = {
  getCase,
  getSearchResults,
}

export default SGSC