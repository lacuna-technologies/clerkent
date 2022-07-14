import Request from '../../Request'
import * as cheerio from 'cheerio'
import Logger from '../../Logger'
import Constants from '../../Constants'

const DOMAIN = `https://sso.agc.gov.sg`

interface StatuteResult {
  name: string,
  link: string
}

const getStatute = async (statuteName: string): Promise<StatuteResult[]> => {
  const { data } = await Request.get(`${DOMAIN}/Search/Content`, {
    params: {
      In: `InForce_Act_SL`,
      Phrase: statuteName,
      PhraseType: `AllTheseWords`,
      Within: `title`,
    },
  })
  const $ = cheerio.load(data)
  return $(`#searchTable > tbody > tr`).map((_, row) => {
    const name = $(`a.title`, row).text().trim()
    const link = $(`a.title`, row).attr(`href`)
    return {
      link,
      name,
    }
  }).get()
}

const getLegislation = async (legislation: Finder.LegislationFinderResult): Promise<Law.Legislation[]> => {
  const {
    provisionNumber,
    statute,
  } = legislation
  
  let statuteResults = [] as StatuteResult[]
  try {
    const result = await getStatute(statute)
    if(result.length === 0){
      return []
    }
    statuteResults = result
  } catch (error) {
    Logger.error(error)
    return []
  }

  if(!provisionNumber){ // getting the statute is enough
    return statuteResults.map(({ name, link }) => ({
      ...legislation,
      database: Constants.DATABASES.SG_sso,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [
        {
          doctype: `Legislation`,
          filetype: `HTML`,
          url: link,
        },
        {
          doctype: `Legislation`,
          filetype: `PDF`,
          url: `${link}?ViewType=Pdf`,
        },
      ],
      statute: name,
    }))
  }
  
  try { 
    const statuteResult = statuteResults[0]
    const { data, request } = await Request.get(statuteResult.link, {
      params: {
        ProvIds: `pr${provisionNumber}-`,
      },
    })

    const $ = cheerio.load(data)
    const legisContent = $(`#legisContent`).html()
    return [{
      ...legislation,
      content: legisContent,
      database: Constants.DATABASES.SG_sso,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [
        {
          doctype: `Legislation`,
          filetype: `HTML`,
          url: request.responseURL,
        },
      ],
      statute: statuteResult.name,
    }]

  } catch (error) {
    Logger.error(error)
    return []
  }
}

const SSO = {
  getLegislation,
}

export default SSO