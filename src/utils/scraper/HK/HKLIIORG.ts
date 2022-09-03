import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import { findHKCaseCitation } from '../../Finder/CaseCitationFinder/HK'
import type { AxiosResponse } from 'axios'
import PDF from '../../PDF'
import { findCitation } from '../utils'

const DOMAIN = `https://www.hklii.org`

const parseCaseData = (data: AxiosResponse[`data`]): Law.Case[] => {
  const $ = cheerio.load(data)

  return $(`body ol[start="1"] > li`).map((_, element): Law.Case => {
    const nameText = $(`a:first-of-type`, element).eq(0).text().trim()
    const name = nameText.split(`[`)[0]
    const link = `${DOMAIN}${$(`a:nth-of-type(2)`, element).attr(`href`)}`
    const citation = findCitation(
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

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  const judgmentLink = Helpers.getJudgmentLink(inputCase.links)?.url
  const fileName = Helpers.getFileName(inputCase, inputDocumentType)
  await PDF.save({
    code: `document.body.innerHTML = document.querySelector('#main-content').innerHTML;`
      + `const immediateChildren = document.querySelectorAll('body> *');`
      + `const hrList = [];`
      + `immediateChildren.forEach((el, i) => {if(el.nodeName === 'HR') {hrList.push(i)}});`
      + `immediateChildren.forEach((el, i) => {if(i <= hrList[0]){el.remove()}});`
      + `document.querySelector('body').setAttribute('style', 'font-family: Times New Roman;');`
      + `document.querySelectorAll('a').forEach((el) => el.style = 'color: black !important; text-decoration: none;');`,
    fileName,
    url: judgmentLink,
  })
  return null
}

const HKLIIORG = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default HKLIIORG