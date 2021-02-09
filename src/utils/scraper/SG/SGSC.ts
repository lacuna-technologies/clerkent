import Request from '../../Request'
import cheerio from 'cheerio'
import type Law from '../../../types/Law'

const DOMAIN = `https://www.supremecourt.gov.sg`
const getSearchResults = (citation: string) => `${DOMAIN}/search-judgment?q=${citation}&y=All`

const getPDF = async (citation: string): Promise<Law.Case | false> => {
  const { data } = await Request.get(getSearchResults(citation))
  const $ = cheerio.load(data)

  const matches: Law.Case[] = $(`.judgmentpage`).map((_, element) => {
    const name = $(`.text`, element).contents().get(2).data.trim()
    const link = `${DOMAIN}${$(`.pdf-download`, element).attr(`href`)}`
    const citation = $(`.text ul.decision li`).eq(0).text()
    return {
      citation,
      link,
      name,
    }
  }).get().filter((match: Law.Case)=> match.citation === citation)

  if (matches.length !== 1) {
    return false
  }

  return matches[0]
}

const SGSC = {
  getPDF,
  getSearchResults,
}

export default SGSC