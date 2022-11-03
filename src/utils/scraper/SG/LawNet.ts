import Fuse from 'fuse.js'
import Request from 'utils/Request'
import Parser from 'rss-parser'
import Constants from 'utils/Constants'
import Finder from 'utils/Finder'
import Logger from 'utils/Logger'
import Helpers from 'utils/Helpers'
import PDF from 'utils/PDF'

const STATE_COURT_JUDGMENTS = `https://www.lawnet.sg/lawnet/web/lawnet/free-resources?p_p_id=freeresources_WAR_lawnet3baseportlet&p_p_lifecycle=2&p_p_state=normal&p_p_mode=view&p_p_resource_id=subordinateRSS&p_p_cacheability=cacheLevelPage&p_p_col_id=column-1&p_p_col_pos=2&p_p_col_count=3&_freeresources_WAR_lawnet3baseportlet_total=92`
const FAMILY_COURT_JUDGMENTS = `https://www.lawnet.sg/lawnet/web/lawnet/free-resources?p_p_id=freeresources_WAR_lawnet3baseportlet&p_p_lifecycle=0&p_p_state=normal&p_p_mode=view&p_p_col_id=column-1&p_p_col_pos=2&p_p_col_count=3&_freeresources_WAR_lawnet3baseportlet_action=juvenile`

const rssParser = new Parser()

const getStateCourtCases = async (): Promise<Parser.Item[]> => {
  const { data } = await Request.get(STATE_COURT_JUDGMENTS)
  const feed = await rssParser.parseString(data)
  return feed.items
}

const getFamilyCourtCases = async (): Promise<Parser.Item[]> => {
  const { data } = await Request.get(FAMILY_COURT_JUDGMENTS)
  const feed = await rssParser.parseString(data)
  return feed.items
}

const parseCases = (items: Parser.Item[]): Law.Case[] => {
  return items.map(({ title, link }) => {
    const citation = Finder.findCaseCitation(title)[0].citation
    const caseName = title.replace(citation, ``).replace(/ - $/, ``).trim()
    const law: Law.Case = {
      citation,
      database: Constants.DATABASES.SG_lawnetsg,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [
        {
          doctype: `Judgment`,
          filetype: `HTML`,
          url: link,
        },
      ],
      name: caseName,
    }
    return law
  })
}

const getAllCases = async (): Promise<Law.Case[]> => {
  try {
    const results = (await Promise.allSettled([
      getStateCourtCases(),
      getFamilyCourtCases(),
    ])).filter(({ status }) => status === `fulfilled`)

    return results.flatMap(({ value }: PromiseFulfilledResult<Parser.Item[]>) => parseCases(value))
  } catch (error){
    Logger.error(error)
  }
  return []
}

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const allCases = await getAllCases()
  const escapedCitation = Helpers.escapeRegExp(citation)
  return allCases.filter(({ citation: c }) => {
    return (new RegExp(`${escapedCitation}`, `i`).test(c))
  })
}

const getCaseByName = async (caseName: string): Promise<Law.Case[]> => {
  const allCases = await getAllCases()
  const fuse = new Fuse(allCases.map(({ name }) => name))

  return fuse.search(caseName)
    .map(({ refIndex }) => allCases[refIndex])
}

const getPDF = async (inputCase: Law.Case, inputDocumentType: Law.Link[`doctype`]): Promise<null> => {
  const fileName = Helpers.getFileName(inputCase, inputDocumentType)
  await PDF.save({
    code: ``,
    fileName,
    url: Helpers.getJudgmentLink(inputCase.links)?.url,
  })
  return null
}

const LawNet = {
  getCaseByCitation,
  getCaseByName,
  getPDF,
}

export default LawNet