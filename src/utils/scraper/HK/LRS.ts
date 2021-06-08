import qs from 'qs'
import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'
import Logger from '../../Logger'
import Helpers from '../../Helpers'
import { findHKCaseCitation } from '../../Finder/CaseCitationFinder/HK'


const DOMAIN = `https://legalref.judiciary.hk`

const getCaseByURL = async (url: string): Promise<Law.Case[]> => {
  try {
    const bodyURL = url.replace(/ju_frame/i, `ju_body`)
    const { data } = await Request.get(bodyURL)
    const $ = cheerio.load(data)

    const name = $(`title`).text().trim()
    const citation = $(`form[name="search_body"] > table > tbody > tr:first-of-type > td:first-of-type > p:nth-of-type(4)`).text().trim()
    
    return [{
      citation,
      database: Constants.DATABASES.HK_lrs,
      jurisdiction: Constants.JURISDICTIONS.HK.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url,
        },
      ],
      name,
    }]

  } catch (error){
    Logger.error(error)
    return []
  }
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  try {
    const { data } = await Request.get(`${DOMAIN}/lrs/common/search/jud_search_ncn.jsp`, {
      params: {
        isadvsearch: `1`,
        ncnLanguage: `en`,
        ncnParagraph: ``,
        ncnValue: citation,
        query: `Go!`,
        selDatabase: `JU`,
        selall: `0`,
        txtSearch: citation,
        txtselectopt: `4`,
      },
    })

    const urlRegex = new RegExp(/window\.location\.href="(.+)"/gi)
    const caseURL = [...data.matchAll(urlRegex)][0][1]

    if(caseURL){
      const caseResult = await getCaseByURL(caseURL)
      Logger.log(`HK LRS`, caseResult)
      return [...caseResult]
    }
  } catch (error) {
    Logger.error(error)
    return []
  }
  
  return []
}

const parseResultsTable = ($: cheerio.Root): Law.Case[] => {
  const results: Law.Case[] = []
  let currentResult: Law.Case
  $(`form > table.tablestyle1 > tbody > tr > td > table > tbody > tr:nth-of-type(5) > td > table > tbody > tr:nth-of-type(2) > td > table > tbody > tr:nth-of-type(1) > td > table > tbody > tr`).each((_, element) => {
    if($(`td.smalltxt`, element).text()){
      const citation = Helpers.findCitation(
        findHKCaseCitation,
        $(`td:nth-of-type(2) > table tr td:nth-of-type(1)`, element).text(),
      )
      const js = $(`td:nth-of-type(2) > table tr td:nth-of-type(1) > script`, element).get()[0].children[0].data
      const queryString = [...js.matchAll(new RegExp(/var temp\d+='(DIS=.+TP=JU)'/g))][0][1]
      currentResult = {
        citation,
        database: Constants.DATABASES.HK_lrs,
        jurisdiction: Constants.JURISDICTIONS.HK.id,
        links: [
          {
            doctype: `Judgment`,
            filetype: `HTML`,
            url: `https://legalref.judiciary.hk/lrs/common/search/search_result_detail_frame.jsp?${queryString}`,
          },
        ],
        name: ``,
      }
    } else if ($(`td[colspan="3"]:nth-of-type(2)`, element).length > 0) {
      const name = $(`td[colspan="3"]:nth-of-type(2)`, element).text().trim()
      currentResult = {
        ...currentResult,
        citation: currentResult.citation || Helpers.findCitation(
          findHKCaseCitation,
          name,
        ),
        name: name.replace(new RegExp(/; Reported in.+/), ``),
      }
    } else if($(`table`, element).length > 0) {
      results.push(currentResult)
      currentResult = null
    }
  })
  return results
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/lrs/common/search/search_result_form.jsp?vm=GO!`,
    {
      params: {
        day1: ``,
        isadvsearch: `1`,
        month: ``,
        selDatabase2: [`JU`,`RV`,`RS`,`PD`],
        selall2: `1`,
        selcourtname: ``,
        selcourtype: ``,
        stem: `1`,
        txtSearch: ``,
        txtSearch1: ``,
        txtSearch2: ``,
        txtSearch3: ``,
        txtSearch4: ``,
        txtSearch5: caseName,
        txtSearch6: ``,
        txtSearch7: ``,
        txtSearch8: ``,
        txtSearch9: ``,
        txtselectopt: `1`,
        txtselectopt1: `2`,
        txtselectopt2: `3`,
        txtselectopt3: `5`,
        txtselectopt4: `6`,
        txtselectopt5: `7`,
        txtselectopt6: `8`,
        txtselectopt7: `9`,
        txtselectopt8: `10`,
        txtselectopt9: `4`,
        year: ``,
      },
      paramsSerializer: parameters => qs.stringify(
        parameters,
        { arrayFormat: `repeat`, format : `RFC1738` },
      ),
    },
  )

  const $ = cheerio.load(data)

  return parseResultsTable($)
}

const LRS = {
  getCaseByCitation,
  getCaseByName,
}

export default LRS