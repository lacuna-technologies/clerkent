import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Logger from '../../Logger'

const DOMAIN = `https://www8.austlii.edu.au`

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const queryString = `mask_path=au/journals&mask_path=au/cases&mask_path=au/cases/cth`
  const { data } = await Request.get(
    `${DOMAIN}/cgi-bin/sinosrch.cgi?${queryString}`,
    {
      params: {
        method: `auto`,
        query: citation,
      },
    },
  )

  const $ = cheerio.load(data)
  const matches: Law.Case[] = $(`#page-main > .card > ul > li`).map((_, element) => {
    const name = $(`a:first-of-type`, element).text().trim()
    const link = `${DOMAIN}${$(`a:first-of-type`, element).attr(`href`)}`
    return {
      citation,
      database: Constants.DATABASES.AU_austlii,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      link,
      name,
    }
  }).get()
  .filter(({ name }) => name.toLowerCase().includes(citation.toLowerCase()))
  .map(({ name, ...attributes }) => ({ ...attributes, name: name.split(`[`)[0] }))
  
  if(matches.length === 0){
    return false
  } else if (matches.length > 1){
    Logger.warn(`AUSTLII`, `multiple matches`, matches)
  }
  
  return matches[0]
}

const AU = {
  getCase,
}

export default AU