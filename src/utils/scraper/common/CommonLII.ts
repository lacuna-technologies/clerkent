import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Logger from '../../Logger'

// Available judgments
//  Singapore
//    SGDC - http://www.commonlii.org/sg/cases/SGDC/
//    SGMC - http://www.commonlii.org/sg/cases/SGMC/
//    SGCA - http://www.commonlii.org/sg/cases/SGCA/
//    SGHC - http://www.commonlii.org/sg/cases/SGHC/

const LAWCITE_DOMAIN = `http://lawcite.org`
const COMMONLII_DOMAIN = `http://www.commonlii.org`
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

const parseCase = async (citation: string, result): Promise<Law.Case | false> => {
  try {

    const { data, request } = result

    const $ = cheerio.load(data)

    const message = $(`.message-level-1`)?.eq(0)?.text()?.trim()

    if(message === NotFoundMessage){
      return false
    }

    const multipleCases = $(`a.cases > h1.search-results`)?.eq(0)?.text()?.trim()
    if(multipleCases && multipleCases.includes(`Matching Cases`)){
      const firstCaseURL = $(`table.search-results > tbody > tr:first-of-type > td > a`).eq(0).attr(`href`)
      const subResult = await Request.get(`${COMMONLII_DOMAIN}${firstCaseURL}`)
      return parseCase(citation, subResult)
    }

    const name = ($(`h1.name`)[0] as any).children.find(child => child.type === `text`).data.trim()
    // const date = $(`div.date`)?.text()?.trim()
    const link = $(`div.citation > a.free-external`)?.attr(`href`)
    const jurisdiction = matchJurisdiction($(`.jurisdiction`).eq(0).text().trim())

    let pdf: string | undefined
    if(link){
      const { data: pdfData } = await Request.get(link)
      const $$ = cheerio.load(pdfData)

      const pdfHref = $$(`b > a`).filter((_, element) => $$(element).text().includes(`PDF version`))?.attr(`href`)
      pdf = pdfHref ? `${link.split(`/`).slice(0, -1).join(`/`)}/${pdfHref}` : undefined
    }
    
    
    return {
      citation,
      database: Constants.DATABASES.commonlii,
      ...(jurisdiction ? { jurisdiction: jurisdiction as Law.JursidictionCode } : {}),
      link: link || request.responseURL,
      name,
      ...(pdf ? { pdf } : {}),
    }

  } catch (error){
    Logger.error(error)
    return false
  }
}

const getCase = async (citation: string): Promise<Law.Case | false> => {
  try {
    const result = await Request.get(`${LAWCITE_DOMAIN}/cgi-bin/LawCite`, {
      params: {
        cit: citation,
        filter: `on`,
      },
    })
    
    return parseCase(citation, result)
    
  } catch (error){
    Logger.error(error)
    return false
  }
  
}

const CommonLII = {
  getCase,
}

export default CommonLII