import Request from '../../Request'
import cheerio from 'cheerio'
import type { LegislationFinderResult } from '../../Finder'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Constants from '../../Constants'

const DOMAIN = `https://eur-lex.europa.eu`

interface StatuteResult {
  name: string,
  link: string
}

const getStatute = async (statuteName: string): Promise<StatuteResult[]> => {
  const { data } = await Request.get(`${DOMAIN}/search.html`, {
    params: {
      lang: `en`,
      scope: `EURLEX`,
      text: statuteName,
      type: `quick`,
    },
  })
  const $ = cheerio.load(data)
  return $(`.EurlexContent .SearchResult`).map((_, element) => {
    const name = $(`h2`, element).text().trim()
    const link = $(`h2 > a`, element).attr(`name`) // full URL is in name for some reason
    return {
      link,
      name,
    }
  }).get()
}

const getLegislation = async (legislation: LegislationFinderResult): Promise<Law.Legislation[]> => {
  const {
    provisionType,
    provisionNumber,
    statute,
  } = legislation

  let statuteResults = []

  try {
    const result = await getStatute(statute)
    statuteResults = result.map(({ link, name }) => ({
      ...legislation,
      database: Constants.DATABASES.EU_eurlex,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
      link,
      statute: name,
    }))
  } catch (error){
    Logger.error(error)
    return []
  }

  if(!provisionNumber){
    return statuteResults
  }
}

const EURLex = {
  getLegislation,
  getStatute,
}

export default EURLex