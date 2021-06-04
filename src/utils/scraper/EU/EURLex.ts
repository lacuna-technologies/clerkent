import Request from '../../Request'
import cheerio from 'cheerio'
import type { LegislationFinderResult } from '../../Finder'
import type Law from '../../../types/Law'
import Logger from '../../Logger'
import Constants from '../../Constants'

const DOMAIN = `https://eur-lex.europa.eu`

interface StatuteResult {
  name: string,
  links: Law.Legislation[`links`]
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
  return $(`.EurlexContent .SearchResult`).map((_, element): StatuteResult => {
    const name = $(`h2`, element).text().trim()
    const link = $(`h2 > a`, element).attr(`name`) // full URL is in name for some reason
    const pdf = $(`ul.SearchResultDoc li a.piwik_download[title*="pdf"]`).attr(`href`)
    return {
      links: [
        {
          doctype: `Legislation`,
          filetype: `HTML`,
          url: link,
        },
        {
          doctype: `Legislation`,
          filetype: `PDF`,
          url: `${DOMAIN}/${pdf}`,
        },
      ],
      name,
    }
  }).get()
}

const getLegislation = async (legislation: LegislationFinderResult): Promise<Law.Legislation[]> => {
  const {
    // provisionType,
    provisionNumber,
    statute,
  } = legislation

  let statuteResults = []

  try {
    const result = await getStatute(statute)
    statuteResults = result.map(({ links, name }): Law.Legislation => ({
      ...legislation,
      database: Constants.DATABASES.EU_eurlex,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
      links,
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