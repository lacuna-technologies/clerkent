import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import { findAUCaseCitation } from '../../Finder/CaseCitationFinder/AU'
import type { AxiosResponse } from 'axios'
import Logger from '../../Logger'
import { findCitation } from '../utils'
import { CacheRequestConfig } from 'axios-cache-interceptor'

const DOMAIN = `http://www8.austlii.edu.au`

const parseCaseData = (data: AxiosResponse[`data`]): Law.Case[] => {
  const $ = cheerio.load(data)
  return $(`#page-main > .card > ul > li`).map((_, element): Law.Case => {
    const name = $(`> a:first-of-type`, element).text().trim()
    const path = $(`> a:first-of-type`, element).attr(`href`)
    const link = `${DOMAIN}${path}`
    const citation = findCitation(findAUCaseCitation, name)
    return {
      citation,
      database: Constants.DATABASES.AU_austlii,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
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
  const queryString = `mask_path=au/journals&mask_path=au/cases&mask_path=au/cases/cth`
  const { data } = await Request.get(
    `${DOMAIN}/cgi-bin/sinosrch.cgi?${queryString}`,
    {
      params: {
        method: `auto`,
        query: citation,
      },
    } as CacheRequestConfig,
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
    } as CacheRequestConfig,
  )

  return parseCaseData(data)
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  const judgmentLink = Helpers.getJudgmentLink(inputCase.links)?.url
  const pdfURL = judgmentLink
    .replace(/\/(viewdoc|sinodisp)\//, `/sign.cgi/`)
    .replace(/\.html\??.*/, ``)
  try {
    const { request } = await Request.head(pdfURL)
    return request.responseURL
  } catch {
    Logger.log(`austlii: getPDF - no PDF available`)
  }
  
  return null
}

const AU = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default AU