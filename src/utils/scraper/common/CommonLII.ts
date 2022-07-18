import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants'
import Logger from '../../Logger'
import CaseCitationFinder from '../../Finder/CaseCitationFinder'
import Helpers from '../../Helpers'
import type { AxiosResponse } from 'axios'
import BAILII from '../UK/BAILII'
import nzlii from '../NZ/nzlii'
import HKLIIORG from '../HK/HKLIIORG'
import canlii from '../CA/canlii'
import scclexum from '../CA/scclexum'
import austlii from '../AU/austlii'
import PDF from '../../PDF'

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
  for(const jurisdiction of Object.values(Constants.JURISDICTIONS)){
    if((new RegExp(jurisdiction.name, `i`).test(jurisdictionString))){
      return jurisdiction.id
    }
  }
  return null
}

const fixURL = (url: string) => url.replace(/scc\.lexum\.umontreal\.ca/, `scc-csc.lexum.com`)

const parseMultipleCase = ($: cheerio.CheerioAPI): Law.Case[] => {
  const results = $(`a[name="cases"] table.search-results > tbody > tr`).map((_, element): Law.Case => {
    const name = $(`td.case-cited > a`, element).text().trim()
    const relativeLawCiteURL = $(`td.case-cited > a`, element).attr(`href`)
    const lawCiteURL = `${LAWCITE_DOMAIN}${relativeLawCiteURL}`
    const judgmentURL = $(`td.service > a`, element).attr(`href`)
    const jurisdiction = matchJurisdiction($(`td.jurisdiction`, element).text().trim())
    const citation = Helpers.findCitation(CaseCitationFinder.findCaseCitation, $(`td.citation`, element).text().trim())
    const lawCiteLink: Law.Link | null = lawCiteURL && lawCiteURL.length > 0 ? {
      doctype: `Summary`,
      filetype: `HTML`,
      url: lawCiteURL,
    } : null
    const judgmentLink: Law.Link | null = judgmentURL && judgmentURL.length > 0 ? {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: fixURL(judgmentURL),
    } : null
    return {
      citation,
      database: Constants.DATABASES.commonlii,
      ...(jurisdiction ? { jurisdiction: jurisdiction as Law.JursidictionCode } : {}),
      links: [
        ...(lawCiteLink ? [lawCiteLink] : []),
        ...(judgmentLink ? [judgmentLink] : []),
      ],
      name,
    }
  }).get()
  .filter(({ citation }) => Helpers.isCitationValid(citation))
  Logger.log(`CommonLII scraper result`, results)
  return results
}

const parseCase = async (result: AxiosResponse): Promise<Law.Case[]> => {
  try {

    const { data, request } = result

    const $ = cheerio.load(data)

    const message = $(`.message-level-1`)?.eq(0)?.text()?.trim()

    if(message === NotFoundMessage){
      return []
    }

    const multipleCases = $(`a[name="cases"] > h1.search-results`)?.eq(0)?.text()?.trim()
    if(multipleCases && multipleCases.includes(`Matching Cases`)){
      return parseMultipleCase($)
    }

    const name = ($(`h1.name`)[0] as any).children.find(child => child.type === `text`).data.trim()
    // const date = $(`div.date`)?.text()?.trim()
    const link = $(`div.citation > a.free-external`)?.attr(`href`)
    const judgmentLink: Law.Link | null = (link && link.length > 0) ? {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: fixURL(link),
    } : null
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
      const cleanPath = link.split(`/`).slice(0, -1).join(`/`)
      pdfLink = (pdfHref && pdfHref.length > 0) ? {
        doctype: `Judgment`,
        filetype: `PDF`,
        url: `${cleanPath}/${pdfHref}`,
      } : null
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

const hostMap = {
  'scc-csc.lexum.com': scclexum,
  'www.austlii.edu.au': austlii,
  'www.bailii.org': BAILII,
  'www.canlii.org': canlii,
  'www.hklii.org': HKLIIORG,
  'www.nzlii.org': nzlii,
  'www8.austlii.edu.au': austlii,
}

const getPDF = async (
  inputCase: Law.Case,
  inputDocumentType: Law.Link[`doctype`],
): Promise<null> => {
  const judgmentURL = new URL(Helpers.getJudgmentLink(inputCase.links)?.url)
  if(judgmentURL.hostname in hostMap){
    return hostMap[judgmentURL.hostname].getPDF(inputCase, inputDocumentType)
  }

  // if(judgmentURL.pathname.includes(`/sg/cases/SGCA/`) || judgmentURL.pathname.includes(`/sg/cases/SGHC/`)){
  //   return judgmentURL.toString().replace(/\.html$/i, `.pdf`)
  // }

  try {
    const pdfURL = (`${judgmentURL}`).replace(/\?.*$/, ``).replace(/\.html$/i, `.pdf`)
    Logger.log(pdfURL)
    const { request } = await Request.head(pdfURL)
    return request.responseURL
  } catch {
    Logger.log(`CommonLII: getPDF - no PDF available`)
  }

  const fileName = Helpers.getFileName(inputCase, inputDocumentType)
  await PDF.save({
    code: `const immediateChildren = document.querySelectorAll('body> *');`
      + `const hrList = [];`
      + `immediateChildren.forEach((el, i) => {if(el.nodeName === 'HR') {hrList.push(i)}});`
      + `immediateChildren.forEach((el, i) => {if(i >= hrList.slice(-1)[0] || i <= hrList[0]){el.remove()}});`,
    fileName,
    url: judgmentURL.toString(),
  })

  return null
}

const CommonLII = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default CommonLII