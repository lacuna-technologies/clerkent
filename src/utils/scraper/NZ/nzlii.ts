import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import Logger from '../../Logger'
import { findNZCaseCitation } from '../../Finder/CaseCitationFinder/NZ'
import type { AxiosResponse } from 'axios'
import PDF from '../../PDF'

const DOMAIN = `http://www.nzlii.org`

const parseCaseData = (data: AxiosResponse[`data`]): Law.Case[] => {
  const $ = cheerio.load(data)

  return $(`body ol[start="1"] > li`).map((_, element): Law.Case => {
    const name = $(`a:first-of-type`, element).eq(0).text().trim()
    const link = $(`a:first-of-type`, element).attr(`href`).replace(/\?.*/i, ``)
    const citation = Helpers.findCitation(findNZCaseCitation, name)
    return {
      citation,
      database: Constants.DATABASES.NZ_nzlii,
      jurisdiction: Constants.JURISDICTIONS.NZ.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: link,
        },
      ],
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

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  const judgmentLink = Helpers.getJudgmentLink(inputCase.links)?.url
  try {
    const { request } = await Request.head(judgmentLink.replace(/\.html$/i, `.pdf`))
    return request.responseURL
  } catch {
    Logger.log(`NZLII: getPDF - no PDF available`)
  }
  
  const fileName = Helpers.getFileName(inputCase, inputDocumentType)
  await PDF.save({
    code: `const immediateChildren = document.querySelectorAll('body> *');`
      + `const hrList = [];`
      + `immediateChildren.forEach((el, i) => {if(el.nodeName === 'HR') {hrList.push(i)}});`
      + `immediateChildren.forEach((el, i) => {if(i >= hrList.slice(-1)[0] || i <= hrList[0]){el.remove()}});`
      +`document.querySelector('body').setAttribute('style', 'font-family: Times New Roman;');`,
    fileName,
    url: judgmentLink,
  })
  return null
}

const NZ = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default NZ