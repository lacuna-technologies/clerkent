import Request from '../../Request'
import cheerio from 'cheerio'
import type { LegislationFinderResult } from '../../Finder'
import type Law from '../../../types/Law'
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

const getLegislation = async (legislation: LegislationFinderResult): Promise<Law.Legislation[]> => {
  const {
    provisionNumber,
    statute,
  } = legislation
  
  let statuteResult = {} as StatuteResult
  try {
    const result = await getStatute(statute)
    if(result.length === 0){
      return []
    }
    const { name, link } = result[0]
    statuteResult = { link, name }
  } catch (error) {
    Logger.error(error)
    return []
  }

  if(!provisionNumber){ // getting the statute is enough
    return [{
      ...legislation,
      database: Constants.DATABASES.SG_sso,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [
        {
          doctype: `Legislation`,
          filetype: `HTML`,
          url: statuteResult.link,
        },
        {
          doctype: `Legislation`,
          filetype: `PDF`,
          url: `${statuteResult.link}?ViewType=Pdf`,
        },
      ],
      statute: statuteResult.name,
    }]
  }
  
  try { 
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