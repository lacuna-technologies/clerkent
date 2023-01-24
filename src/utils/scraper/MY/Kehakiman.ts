import * as cheerio from 'cheerio'
import Request from '../../Request'
import Constants from '../../Constants'
import { AxiosResponse } from 'axios'
import { CacheRequestConfig } from 'axios-cache-interceptor'

const DOMAIN = `https://ejudgment.kehakiman.gov.my`

const parseCases = (data: AxiosResponse[`data`]): Law.Case[] => {
  const $ = cheerio.load(data)
  return $(`table#CUSTOM_Ap > tbody > tr`).map((_, element) => {
    const citation = $(`td:nth-of-type(2)`, element).text().trim()
    const parties = $(`td:nth-of-type(3)`, element).text().trim()
    const pdfURL = $(`td:nth-of-type(7) a`, element).attr(`href`)
    const pdfLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `PDF`,
      url: (new RegExp(`^//ejudgment.kehakiman.gov.my`)).test(pdfURL)
        ? `https:${pdfURL}`
        : `${DOMAIN}${pdfURL}`,
    }
    return {
      citation,
      database: Constants.DATABASES.MY_kehakiman,
      jurisdiction: Constants.JURISDICTIONS.MY.id,
      links: [
        ...(pdfURL ? [pdfLink] : []),
      ],
      name: parties,
    }
  }).get()
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/portal/ap_list_all.php`,
    {
      params: {
        aph_ap_date: ``,
        aph_case_no: caseName,
        aph_case_type: ``,
        aph_court_category: ``,
        nama_hakim: ``,
      },
    } as CacheRequestConfig,
  )
  return parseCases(data)
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/portal/ap_list_all.php`,
    {
      params: {
        aph_ap_date: ``,
        aph_case_no: citation,
        aph_case_type: ``,
        aph_court_category: ``,
        nama_hakim: ``,
      },
    } as CacheRequestConfig,
  )
  return parseCases(data)
}

const Kehakiman = {
  getCaseByCitation,
  getCaseByName,
}

export default Kehakiman