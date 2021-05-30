import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import { findAUCaseCitation } from '../../Finder/CaseCitationFinder/AU'
import type { AxiosResponse } from 'axios'

const DOMAIN = `http://www8.austlii.edu.au`

const parseCaseData = (data: AxiosResponse[`data`]) => {
  const $ = cheerio.load(data)
  return $(`#page-main > .card > ul > li`).map((_, element) => {
    const name = $(`a:first-of-type`, element).text().trim()
    const link = `${DOMAIN}${$(`a:first-of-type`, element).attr(`href`)}`
    const citation = Helpers.findCitation(findAUCaseCitation, name)
    return {
      citation,
      database: Constants.DATABASES.AU_austlii,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      link,
      name: name.replace(citation, ``).trim(),
    }
  }).get()
  .filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
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

  return parseCaseData(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const queryString = `mask_path=au/journals&mask_path=au/cases&mask_path=au/cases/cth`
  const { data } = await Request.get(
    `${DOMAIN}/cgi-bin/sinosrch.cgi?${queryString}`,
    {
      params: {
        method: `auto`,
        query: caseName,
      },
    },
  )

  return parseCaseData(data)
}

const AU = {
  getCaseByCitation,
  getCaseByName,
}

export default AU