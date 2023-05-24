import request from '../../Request'
import * as cheerio from 'cheerio'
import Constants from '../../Constants'
import { sortByName } from '../utils'
import Logger from 'utils/Logger'

const BASE_URL = `https://www.icj-cij.org`

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

const getAllCases = async (): Promise<Law.Case[]> => {
  const year = (new Date()).getFullYear()
  const { data } = await request.get(`${BASE_URL}/en/decisions?type=1&from=1946&to=${year}&sort_bef_combine=order_DESC`)
  const $ = cheerio.load(data)
  return $(`.view-judgments-advisory-opinions-and-orders > .view-content.row > .views-row`).map((_, element): Law.Case | null => {
    const name = $(`.views-field.views-field-field-case-long-title a`, element).text().trim().replace(`\n`, ``)
    const details = $(`.views-field.views-field-field-icj-document-subtitle p`, element).text().trim()
    const caseName = name + (details.length > 0 ? ` - ${details}` : ``)
    const docname = $(`.views-field.views-field-field-document-long-title a`, element).text().trim().replace(`\n`, ``)
    const doctype = getDocumentTypeFromDocumentName(docname)
    const summaryURL = BASE_URL + $(`.views-field.views-field-field-case-long-title a`, element).attr(`href`)
    const documentURL = BASE_URL + $(`.views-field.views-field-field-document-long-title a`, element).attr(`href`)
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
          url: summaryURL,
        },
        {
          doctype,
          filetype: `PDF`,
          url: documentURL,
        },
      ],
      name: caseName,
    }

  }).get().filter((c) => c !== null)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const cases = await getAllCases()
  Logger.log(`Cases: `, cases)
  return sortByName(caseName, cases).slice(0, 20)
}

const getPDF = (inputCase, inputDocumentType) => null

const ICJCIJ = {
  getCaseByName,
  getPDF,
}

export default ICJCIJ