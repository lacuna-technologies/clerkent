import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Logger from '../../Logger'

const DOMAIN = `https://www.hklii.org`

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const { data } = await Request.get(
    `${DOMAIN}/cgi-bin/sinosrchadvanced.cgi`,
    {
      params: {
        citation,
        meta: `hklii`,
        method: `boolean`,
        mode: `advanced`,
        results: 20,
      },
    },
  )

  const $ = cheerio.load(data)

  const matches: Law.Case[] = $(`body ol[start="1"] > li`).map((_, element) => {
    const name = $(`a:first-of-type`, element).eq(0).text().trim().split(`[`)[0]
    const link = `${DOMAIN}${$(`a:nth-of-type(2)`, element).attr(`href`)}`
    return {
      citation,
      database: Constants.DATABASES.HK_hkliiorg,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
      link,
      name,
    }
  }).get()

  if(matches.length === 0){
    return false
  } else if (matches.length > 1){
    Logger.warn(`HKLII`, `multiple matches`, matches)
  }
  
  return matches[0]
}

const HKLII = {
  getCase,
}

export default HKLII