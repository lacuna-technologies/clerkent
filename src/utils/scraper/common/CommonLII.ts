import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Logger from '../../Logger'
import CaseCitationFinder from '../../Finder/CaseCitationFinder'
import Helpers from '../../Helpers'
import type { AxiosResponse } from 'axios'

// Available judgments
//  Singapore
//    SGDC - http://www.commonlii.org/sg/cases/SGDC/
//    SGMC - http://www.commonlii.org/sg/cases/SGMC/
//    SGCA - http://www.commonlii.org/sg/cases/SGCA/
//    SGHC - http://www.commonlii.org/sg/cases/SGHC/

const LAWCITE_DOMAIN = `http://lawcite.org`
// const COMMONLII_DOMAIN = `http://www.commonlii.org`
const NotFoundMessage = `Sorry, no cases or law journal articles found.`

const matchJurisdiction = (jurisdictionString: string): Law.JursidictionCode => {
  if(/united kingdom/gi.test(jurisdictionString)) {
    return Constants.JURISDICTIONS.UK.id
  } else if (/singapore/gi.test(jurisdictionString)) {
    return Constants.JURISDICTIONS.SG.id
  } else if (/hong kong/gi.test(jurisdictionString)) {
    return Constants.JURISDICTIONS.HK.id
  } else if (/canada/gi.test(jurisdictionString)) {
    return Constants.JURISDICTIONS.CA.id
  } else if (/australia/gi.test(jurisdictionString)) {
    return Constants.JURISDICTIONS.AU.id
  } else if (/new zealand/gi.test(jurisdictionString)) {
    return Constants.JURISDICTIONS.NZ.id
  }
  return null
}

const parseCase = async (result: AxiosResponse): Promise<Law.Case[] > => {
  try {

    const { data, request } = result

    const $ = cheerio.load(data)

    const message = $(`.message-level-1`)?.eq(0)?.text()?.trim()

    if(message === NotFoundMessage){
      return []
    }

    const multipleCases = $(`a[name="cases"] > h1.search-results`)?.eq(0)?.text()?.trim()
    if(multipleCases && multipleCases.includes(`Matching Cases`)){
      const results = $(`a[name="cases"] table.search-results > tbody > tr`).map((_, element) => {
        const name = $(`td.case-cited > a`, element).text().trim()
        const lawCiteLink = `${LAWCITE_DOMAIN}${$(`td.case-cited > a`, element).attr(`href`)}`
        const link = $(`td.service > a`, element).attr(`href`)
        const jurisdiction = matchJurisdiction($(`td.jurisdiction`, element).text().trim())
        const citation = Helpers.findCitation(CaseCitationFinder.findCaseCitation, $(`td.citation`, element).text().trim())
        return {
          citation,
          database: Constants.DATABASES.commonlii,
          ...(jurisdiction ? { jurisdiction: jurisdiction as Law.JursidictionCode } : {}),
          link: lawCiteLink || link,
          name,
        }
      }).get()
      .filter(({ citation }) => Helpers.isCitationValid(citation))
      Logger.log(`CommonLII scraper result`, results)
      return results
    }

    const name = ($(`h1.name`)[0] as any).children.find(child => child.type === `text`).data.trim()
    // const date = $(`div.date`)?.text()?.trim()
    const link = $(`div.citation > a.free-external`)?.attr(`href`)
    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: link,
    }
    const jurisdiction = matchJurisdiction($(`.jurisdiction`).eq(0).text().trim())
    const citationText = Helpers.findCitation(
      CaseCitationFinder.findCaseCitation,
      $(`div.citation`).text().trim(),
    )

    let pdfLink: Law.Link | null = null
    if(link){
      const { data: pdfData } = await Request.get(link)
      const $$ = cheerio.load(pdfData)

      const pdfHref = $$(`b > a`).filter((_, element) => $$(element).text().includes(`PDF version`))?.attr(`href`)
      pdfLink = {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: `${link.split(`/`).slice(0, -1).join(`/`)}/${pdfHref}`,
       }
    }

    const summaryURL: Law.Link = {
      doctype: `Summary`,
      filetype: `HTML`,
      url: request.responseURL,
    }
    
    
    const results: Law.Case[] = [{
      citation: citationText,
      database: Constants.DATABASES.commonlii,
      ...(jurisdiction ? { jurisdiction: jurisdiction as Law.JursidictionCode } : {}),
      links: [
        ...(judgmentLink ? [judgmentLink] : []),
        ...(summaryURL ? [summaryURL] : []),
        ...(pdfLink ? [pdfLink] : []),
      ],
      name,
    }]
    Logger.log(`CommonLII scraper result`, results)
    return results

  } catch (error){
    Logger.error(error)
    return []
  }
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  try {
    const result = await Request.get(`${LAWCITE_DOMAIN}/cgi-bin/LawCite`, {
      params: {
        cit: citation,
        filter: `on`,
      },
    })
    
    return parseCase(result)
    
  } catch (error){
    Logger.error(error)
    return []
  }
}

const getCaseByName = async (citation: string, jurisdiction: string = null): Promise<Law.Case[]> => {
  try {
    const result = await Request.get(`${LAWCITE_DOMAIN}/cgi-bin/LawCite`, {
      params: {
        filter: `on`,
        ...(jurisdiction ? { juris: jurisdiction } : {}),
        party1: citation,
      },
    })

    return parseCase(result)
  } catch (error){
    Logger.error(error)
    return []
  }
}

const CommonLII = {
  getCaseByCitation,
  getCaseByName,
}

export default CommonLII