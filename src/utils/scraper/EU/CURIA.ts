import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import type { AxiosResponse } from 'axios'
import { findEUCaseCitation } from '../../Finder/CaseCitationFinder/EU'
import Helpers from '../../Helpers'
import Logger from '../../Logger'

const DOMAIN = `https://curia.europa.eu`

const getEurlexPDF = (url: string): string => url.replace(/\/TXT\//, `/TXT/PDF/`)

const scrapeDocumentsPage = async (caseResult: Law.Case): Promise<Law.Link[]> => {
  const summaryLink = Helpers.getSummaryLink(caseResult.links)
  const { data } = await Request.get(
    summaryLink.url,
  )
  const $ = cheerio.load(data)
  const matchingDocumentTypes: Law.Link[`doctype`][] = [`Judgment`, `Opinion`, `Order`]
  return $(`#details_docs table.detail_table_documents > tbody > tr`).map(
    (_, element) => {
      const rowLabel = $(`.table_cell_doc:nth-of-type(1)`, element).first().contents().first().text().trim()

      // the classes are wrong on the CURIA site
      // the eurlex class is on the curia td and the doc class is on the eurlex td
      const rowCuriaLink = $(`.table_cell_links_eurlex a`, element).first().attr(`href`)
      const rowEurlexLink = ($(`.table_cell_doc:last-of-type a`, element).first().attr(`href`) || ``)

      const match = matchingDocumentTypes.find(doctype => rowLabel === doctype)
      if(match){
        return [
          {
            doctype: match,
            filetype: `HTML`,
            url: rowCuriaLink,
          },
          {
            doctype: match,
            filetype: `PDF`,
            url: getEurlexPDF(rowEurlexLink),
          },
        ]
      }
    return []
  }).get()
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const parseCaseData = async (data: AxiosResponse[`data`]): Promise<Law.Case[]> => {
  const $ = cheerio.load(data)

  const results: Law.Case[] = $(`#listeAffaires > ul.rich-datalist > li.rich-list-item`).map((_, element): Law.Case => {
    const name = $(`.affaire .affaire_header .affaire_title`, element).text().trim()
    const citation = Helpers.findCitation(findEUCaseCitation, name)
    
    const judgmentContainer = $(`.procedure > ul.rich-datalist > li.rich-list-item:last-of-type`, element)
    const summaryLink = $(`td.decision > span.decision_links > a`, judgmentContainer).attr(`href`)
    const textsContainer = $(
      `.decision td:nth-of-type(2) .decision_title .detail_zone_content_documents table.liste_table_documents tbody`,
      judgmentContainer,
    )

    // current setup makes the following assumptions:
    // - the linked text is either a judgment, opinion, or order
    const firstRow = $(`tr:nth-of-type(1)`, textsContainer)
    const firstRowLabel = $(`td.liste_table_cell_doc`, firstRow)
    const firstRowLink = $(`.liste_table_cell_links_curia a`, firstRow)
    const firstRowEURLEX = $(`.liste_table_cell_links_eurlex a`, firstRow)

    const secondRow = $(`tr:nth-of-type(2)`, textsContainer)
    const secondRowLink = $(`.liste_table_cell_links_curia a`, secondRow)
    const secondRowEURLEX = $(`.liste_table_cell_links_eurlex a`, secondRow)

    const firstRowType: Law.Link[`doctype`] = firstRowLabel.text().includes(`Judgment`)
      ? `Judgment`
      : (firstRowLabel.text().includes(`Opinion`)
      ? `Opinion`
      : `Order`)

    const opinionElement = (firstRowType === `Opinion` ? firstRowLink : secondRowLink)
    const opinionURL = opinionElement.attr(`href`)
    const opinionLink: Law.Link = {
      doctype: `Opinion`,
      filetype: `HTML`,
      url: opinionURL,
    }

    const judgmentElement = (firstRowType === `Judgment` ? firstRowLink : secondRowLink)
    const judgmentURL = judgmentElement.attr(`href`)
    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: judgmentURL,
    }

    const judgmentPDFElement = (firstRowType === `Judgment` ? firstRowEURLEX : secondRowEURLEX)
    const judgmentPDFURL = getEurlexPDF(judgmentPDFElement.attr(`href`) || ``)
    const judgmentPDFLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `PDF`,
      url: judgmentPDFURL,
    }

    const opinionPDFElement = (firstRowType === `Opinion` ? firstRowEURLEX : secondRowEURLEX)
    const opinionPDFURL = getEurlexPDF(opinionPDFElement.attr(`href`) || ``)
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

  for(const [index, caseResult] of results.entries()){
    if(caseResult.links.length === 1){ // only summary
      try {
        const additionalLinks = await scrapeDocumentsPage(caseResult)
        console.log(`additionalLinks`, additionalLinks)
        if(additionalLinks.length > 0){
          results[index].links = [
            ...results[index].links,
            ...additionalLinks,
          ]
          console.log(`added`, results[index].links)
        }
      } catch (error) {
        Logger.error(error)
      }
    }
  }

  return results
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        num: citation, 
      },
    })
  
  return await parseCaseData(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/juris/liste.jsf`, 
    {
      params: {
        parties: caseName, 
      },
    })
  
  return await parseCaseData(data)
}

const getPDF = () => null

const CURIA = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default CURIA