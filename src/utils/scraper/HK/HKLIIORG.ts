import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import { findHKCaseCitation } from '../../Finder/CaseCitationFinder/HK'
import type { AxiosResponse } from 'axios'

const DOMAIN = `https://www.hklii.org`

const parseCaseData = (data: AxiosResponse[`data`]): Law.Case[] => {
  const $ = cheerio.load(data)

  return $(`body ol[start="1"] > li`).map((_, element): Law.Case => {
    const nameText = $(`a:first-of-type`, element).eq(0).text().trim()
    const name = nameText.split(`[`)[0]
    const link = `${DOMAIN}${$(`a:nth-of-type(2)`, element).attr(`href`)}`
    const citation = Helpers.findCitation(
      findHKCaseCitation,
      nameText,
    )
    return {
      citation,
      database: Constants.DATABASES.HK_hkliiorg,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: link,
        },
      ],
      name,
    }
  }).get()
  .filter(({ citation}) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
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

  return parseCaseData(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/cgi-bin/sinosrchadvanced.cgi`,
    {
      params: {
        meta: `hklii`,
        method: `boolean`,
        mode: `advanced`,
        results: 20,
        titleall: caseName,
      },
    },
  )

  return parseCaseData(data)
}

const HKLII = {
  getCaseByCitation,
  getCaseByName,
}

export default HKLII