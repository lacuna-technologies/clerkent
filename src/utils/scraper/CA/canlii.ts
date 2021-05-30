import cheerio from 'cheerio'
import qs from 'qs'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import { findCACaseCitation } from '../../Finder/CaseCitationFinder/CA'
import type { AxiosResponse } from 'axios'

const DOMAIN = `https://www.canlii.org`

const parseCase = (data: AxiosResponse[`data`]) => {
  const { results } = data
  return results.map(({
    title,
    path,
    reference,
  }) => {
    const cleanReference = typeof reference === `string`
      ? Helpers.findCitation(
          findCACaseCitation,
          cheerio.load(reference)(`html`).text().trim(),
      ) : ``

    return {
      citation: cleanReference,
      database: Constants.DATABASES.CA_canlii,
      jurisdiction: Constants.JURISDICTIONS.CA.id,
      link: `${DOMAIN}${path}`,
      name: cheerio.load(title)(`html`).text().trim(),
    }
  }).filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/en/search/ajaxSearch.do?${qs.stringify({ id: citation, page: 1})}`,
    {
      headers: {
        Referer: `https://www.canlii.org/en/`,
        'X-Requested-With': `XMLHttpRequest`,
      },
    },
  )

  return parseCase(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/en/search/ajaxSearch.do?${qs.stringify({ id: caseName, page: 1})}`,
    {
      headers: {
        Referer: `https://www.canlii.org/en/`,
        'X-Requested-With': `XMLHttpRequest`,
      },
    },
  )

  return parseCase(data)
}

const CA = {
  getCaseByCitation,
  getCaseByName,
}

export default CA