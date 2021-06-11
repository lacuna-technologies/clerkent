import cheerio from 'cheerio'
import qs from 'qs'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Helpers from '../../Helpers'
import { findCACaseCitation } from '../../Finder/CaseCitationFinder/CA'
import type { AxiosResponse } from 'axios'
import Logger from '../../Logger'
import PDF from '../../PDF'

const DOMAIN = `https://www.canlii.org`

const parseCase = (data: AxiosResponse[`data`]): Law.Case[] => {
  const { results } = data
  return results.map(({
    title,
    path,
    reference,
  }): Law.Case => {
    const cleanReference = typeof reference === `string`
      ? Helpers.findCitation(
          findCACaseCitation,
          cheerio.load(reference)(`html`).text().trim(),
      ) : ``

    return {
      citation: cleanReference,
      database: Constants.DATABASES.CA_canlii,
      jurisdiction: Constants.JURISDICTIONS.CA.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: `${DOMAIN}${path}`,
        },
      ],
      name: cheerio.load(title)(`html`).text().trim(),
    }
  }).filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/en/search/ajaxSearch.do?${qs.stringify({ id: citation, page: 1})}`,
    {
      headers: {
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
        'X-Requested-With': `XMLHttpRequest`,
      },
    },
  )

  return parseCase(data)
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<string | null> => {
  const judgmentLink = Helpers.getJudgmentLink(inputCase.links)?.url
  try {
    const { request } = await Request.head(judgmentLink.replace(/\.html$/i, `.pdf`))
    return request.responseURL
  } catch {
    Logger.log(`CANLII: getPDF - no PDF available`)
  }
  
  const fileName = Helpers.getFileName(inputCase, inputDocumentType)
  await PDF.save({
    code: `document.body.innerHTML = document.querySelector('#originalDocument').innerHTML;`,
    fileName,
    url: judgmentLink,
  })
  return null
}

const CA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default CA