import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import { findNZCaseCitation } from '../../Finder/CaseCitationFinder/NZ'
import type { AxiosResponse } from 'axios'

const DOMAIN = `http://www.nzlii.org`

const parseCaseData = (data: AxiosResponse[`data`]) => {
  const $ = cheerio.load(data)

  return $(`body ol[start="1"] > li`).map((_, element) => {
    const name = $(`a:first-of-type`, element).eq(0).text().trim()
    const link = $(`a:first-of-type`, element).attr(`href`)
    const citation = Helpers.findCitation(findNZCaseCitation, name)
    return {
      citation,
      database: Constants.DATABASES.NZ_nzlii,
      jurisdiction: Constants.JURISDICTIONS.NZ.id,
      link,
      name: name.replace(citation, ``).trim(),
    }
  }).get()
  .filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  try {
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

    return parseCaseData(data)
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  try {
    const { data } = await Request.get(
      `${DOMAIN}/cgi-bin/sinosrch.cgi`,
      {
        params: {
          mask_path: `+nz`,
          mask_world: `:nzlii:nz`,
          meta: `/nzlii`,
          method: `boolean`,
          query: caseName,
          rank: `on`,
        },
      },
    )

    return parseCaseData(data)
  } catch (error) {
    Logger.error(error)
  }
  return []
}

const NZ = {
  getCaseByCitation,
  getCaseByName,
}

export default NZ