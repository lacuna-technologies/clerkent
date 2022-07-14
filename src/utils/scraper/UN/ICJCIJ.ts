import request from '../../Request'
import * as cheerio from 'cheerio'
import Constants from '../../Constants'
import { sortByNameSimilarity } from '../utils'

const BASE_URL = `https://www.icj-cij.org`

type Document = {
  casename: string,
  caseurl: string,
  docname: string,
  docurl: string
}

const getDocumentTypeFromDocumentName = (docname: string): Law.Link[`doctype`] | null => {
  const cleanDocname = docname.toLowerCase()
  if(cleanDocname.includes(`order`)){
    return `Order`
  } else if (cleanDocname.includes(`judgment`)){
    return `Judgment`
  } else if (cleanDocname.includes(`opinion`)){
    return `Opinion`
  }
  return null
}

const getAllCases = async () => {
  const { data } = await request.get(`${BASE_URL}/en/decisions/all/1946/2021/desc`)
  const $ = cheerio.load(data)
  return $(`.row > .col-sm-12 > .docket-odd`).map((_, element): Document => {
    return {
      casename: $(`h5:nth-of-type(2)`, element).text().trim().replace(`\n`, ``),
      caseurl: $(`h5:nth-of-type(2) > a`, element).attr(`href`),
      docname: $(`h4.docket`, element).text().trim().replace(`\n`, ``),
      docurl: `${BASE_URL}${$(`h4.docket > a`, element).attr(`href`)}`,
    }
  }).get().map(({
    casename,
    caseurl,
    docname,
    docurl,
  }): Law.Case | null => {
    const doctype = getDocumentTypeFromDocumentName(docname)
    if(doctype === null){
      return null
    }
    return {
      citation: docname,
      database: Constants.DATABASES.UN_icjcij,
      jurisdiction: Constants.JURISDICTIONS.UN.id,
      links: [
        {
          doctype: `Summary`,
          filetype: `HTML`,
          url: caseurl,
        },
        {
          doctype,
          filetype: `PDF`,
          url: docurl,
        },
      ],
      name: casename,
    }
  }).filter((c) => c !== null)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const cases = await getAllCases()
  return sortByNameSimilarity(caseName, cases).slice(0, 20)
}

const getPDF = (inputCase, inputDocumentType) => null

const ICJCIJ = {
  getCaseByName,
  getPDF,
}

export default ICJCIJ