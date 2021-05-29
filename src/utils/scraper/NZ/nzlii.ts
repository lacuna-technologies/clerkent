import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Logger from '../../Logger'

const DOMAIN = `http://www.nzlii.org`

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/cgi-bin/sinosrch.cgi`,
    {
      params: {
        mask_path: `+nz`,
        mask_world: `:nzlii:nz`,
        meta: `/nzlii`,
        method: `auto`,
        query: citation,
      },
    },
  )

  const $ = cheerio.load(data)

  const matches: Law.Case[] = $(`body ol[start="1"] > li`).map((_, element) => {
    const name = $(`a:first-of-type`, element).eq(0).text().trim()
    const link = $(`a:first-of-type`, element).attr(`href`)
    return {
      citation,
      database: Constants.DATABASES.NZ_nzlii,
      jurisdiction: Constants.JURISDICTIONS.NZ.id,
      link,
      name,
    }
  }).get()
  .filter(({ name }) => name.toLowerCase().includes(citation.toLowerCase()))
  .map(({ name, ...attributes }) => ({ ...attributes, name: name.split(`[`)[0] }))

  if(matches.length === 0){
    return []
  } else if (matches.length > 1){
    Logger.warn(`NZLII`, `multiple matches`, matches)
  }

  return matches
}

const NZ = {
  getCaseByCitation,
}

export default NZ