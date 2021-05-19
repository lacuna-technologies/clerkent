import Request from '../../Request'
import cheerio from 'cheerio'
import type { LegislationFinderResult } from '../../Finder'
import type Law from '../../../types/Law'
import Logger from '../../Logger'

const DOMAIN = `https://sso.agc.gov.sg`

interface StatuteResult {
  name: string,
  link: string
}

const getStatute = async (statuteName: string): Promise<StatuteResult | false> => {
  const { data } = await Request.get(`${DOMAIN}/Search/Content`, {
    params: {
      In: `InForce_Act_SL`,
      Phrase: statuteName,
      PhraseType: `AllTheseWords`,
      Within: `title`,
    },
  })
  const $ = cheerio.load(data)
  const results = $(`#searchTable > tbody > tr`).map((_, row) => {
    const name = $(`a.title`, row).text().trim()
    const link = $(`a.title`, row).attr(`href`)
    return {
      link,
      name,
    }
  }).get()

  if(results.length === 0){
    return false
  }
  return results[0]
}

const getLegislation = async (legislation: LegislationFinderResult): Promise<Law.Legislation | false> => {
  const {
    provisionNumber,
    statute,
  } = legislation
  
  let statuteResult = {} as StatuteResult
  try {
    const result = await getStatute(statute)
    if(result === false){
      return false
    }
    const { name, link } = result
    statuteResult = { link, name }
  } catch (error) {
    Logger.error(error)
    return false
  }

  if(!provisionNumber){ // getting the statute is enough
    return {
      ...legislation,
      link: statuteResult.link,
      statute: statuteResult.name,
    }
  }
  
  try { 
    const { data, request } = await Request.get(statuteResult.link, {
      params: {
        ProvIds: `pr${provisionNumber}-`,
      },
    })

    const $ = cheerio.load(data)
    const legisContent = $(`#legisContent`).html()
    return {
      ...legislation,
      content: legisContent,
      link: request.responseURL,
      statute: statuteResult.name,
    }

  } catch (error) {
    Logger.error(error)
    return false
  }
}

const SSO = {
  getLegislation,
}

export default SSO