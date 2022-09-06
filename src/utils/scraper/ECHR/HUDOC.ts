import { AxiosRequestConfig } from 'axios'
import Constants from '../../Constants'
import Request from '../../Request'

const DOMAIN = `https://hudoc.echr.coe.int`

const courtMap = {
  23: `Fifth Section`,
  25: `First Section Committee`,
  27: `Third Section`,
  3: `Commission (Plenary)`,
  4: `First Section`,
  5: `Second Section`,
  6: `Third Section`,
  7: `Fourth Section`,
  8: `Grand Chamber`,
}

const parseCaseData = (data: AxiosRequestConfig[`data`]): Law.Case[] => {
  const { results: rawResults } = data
  return rawResults.map((result) => {
    const {
      columns: {
        docname,
        originatingbody,
        itemid,
        appno,
      },
    } = result

    const court = courtMap[Number.parseInt(originatingbody)]
    const caseName = `${docname.trim()}${court ? ` (${court})` : ``}`

    const summaryLink: Law.Link = {
      doctype: `Summary`,
      filetype: `HTML`,
      url: `${DOMAIN}/eng#{"tabview":["notice"],"itemid":["${itemid}"]}`,
    }

    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: `${DOMAIN}/eng?i=${itemid}`,
    }

    const judgmentPDFLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `PDF`,
      url: `${DOMAIN}/app/conversion/docx/pdf?library=ECHR&id=${itemid}&filename=`,
    }

    return {
      citation: appno.split(`;`).slice(0, 1)[0],
      database: Constants.DATABASES.ECHR_hudoc,
      jurisdiction: Constants.JURISDICTIONS.ECHR.id,
      links: [
        summaryLink,
        judgmentLink,
        judgmentPDFLink,
      ],
      name: caseName,
    }
  })
}

const craftHUDOCParameters = (query) => ({
  length: 100,
  query: `contentsitename:ECHR AND (NOT (doctype=PR OR doctype=HFCOMOLD OR doctype=HECOMOLD)) AND (${query}) AND ((documentcollectionid="GRANDCHAMBER") OR (documentcollectionid="CHAMBER")) AND ((documentcollectionid="JUDGMENTS") OR (documentcollectionid="DECISIONS") OR (documentcollectionid="ADVISORYOPINIONS") OR (documentcollectionid="RESOLUTIONS"))`,
  rankingModelId: `22222222-eeee-0000-0000-000000000000`,
  // select: `sharepointid,Rank,ECHRRanking,languagenumber,itemid,docname,doctype,application,appno,conclusion,importance,originatingbody,typedescription,kpdate,kpdateAsText,documentcollectionid,documentcollectionid2,languageisocode,extractedappno,isplaceholder,doctypebranch,respondent,advopidentifier,advopstatus,ecli,appnoparts,sclappnos`,
  select: `docname,originatingbody,itemid,appno`,
  sort: ``,
  start: 0,
})

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/app/query/results`,
    {
      params: craftHUDOCParameters(citation),
    },
  )
  return await parseCaseData(data)
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/app/query/results`,
    {
      params: craftHUDOCParameters(caseName),
    },
  )
  return await parseCaseData(data)
}

const getPDF = (inputCase, inputDocumentType) => null

const HUDOC = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default HUDOC