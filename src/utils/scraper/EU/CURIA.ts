import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import type { AxiosResponse } from 'axios'
import { findEUCaseCitation } from '../../Finder/CaseCitationFinder/EU'
import Helpers from '../../Helpers'

const DOMAIN = `https://curia.europa.eu`

const parseCaseData = (data: AxiosResponse[`data`]): Law.Case[] => {
  const $ = cheerio.load(data)

  return $(`#listeAffaires > ul.rich-datalist > li.rich-list-item`).map((_, element): Law.Case => {
    const name = $(`.affaire .affaire_header .affaire_title`, element).text().trim()
    const citation = Helpers.findCitation(findEUCaseCitation, name)
    
    const judgmentContainer = $(`.procedure > ul.rich-datalist > li.rich-list-item:last-of-type`, element)
    const summaryLink = $(`td.decision > span.decision_links > a`, judgmentContainer).attr(`href`)
    const textsContainer = $(
      `.decision td:nth-of-type(2) .decision_title .detail_zone_content_documents table.liste_table_documents tbody`,
      judgmentContainer,
    )
    const opinionURL = $(`tr:nth-of-type(2) .liste_table_cell_links_curia a`, textsContainer).attr(`href`)
    const opinionLink: Law.Link = {
      doctype: `Opinion`,
      filetype: `HTML`,
      url: opinionURL,
    }
    const judgmentURL = $(`tr:nth-of-type(1) .liste_table_cell_links_curia a`, textsContainer).attr(`href`)
    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: judgmentURL,
    }
    const judgmentPDFURL = ($(`tr:nth-of-type(1) .liste_table_cell_links_eurlex a`, textsContainer)
      .attr(`href`) || ``)
      .replace(/\/TXT\//, `/TXT/PDF/`)
    const judgmentPDFLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `PDF`,
      url: judgmentPDFURL,
    }
    const opinionPDFURL = ($(`tr:nth-of-type(2) .liste_table_cell_links_eurlex a`, textsContainer)
      .attr(`href`) || ``)
      .replace(/\/TXT\//, `/TXT/PDF/`)
    const opinionPDFLink: Law.Link = {
      doctype: `Opinion`,
      filetype: `PDF`,
      url: opinionPDFURL,
    }

    return {
      citation,
      database: Constants.DATABASES.EU_curia,
      jurisdiction: Constants.JURISDICTIONS.EU.id,
      links: [
        {
          doctype: `Summary`,
          filetype: `HTML`,
          url: summaryLink,
        },
        ...(opinionURL ? [opinionLink] : []),
        ...(judgmentURL ? [judgmentLink] : []),
        ...(judgmentPDFURL.length > 0 ? [judgmentPDFLink] : []),
        ...(opinionPDFURL.length > 0 ? [opinionPDFLink] : []),
      ],
      name: name.replace(citation, ``).trim().slice(1).replace(/^[\s-]+/g, ``).trim(),
    }
  }).get()
  .filter(({ citation }) => Helpers.isCitationValid(citation))
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        num: citation, 
      },
    })
  
  return parseCaseData(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        parties: caseName, 
      },
    })
  
  return parseCaseData(data)
}

const getPDF = () => null

const CURIA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default CURIA