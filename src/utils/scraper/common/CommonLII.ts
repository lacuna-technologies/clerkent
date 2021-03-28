import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

// Available judgments
//  Singapore
//    SGDC - http://www.commonlii.org/sg/cases/SGDC/
//    SGMC - http://www.commonlii.org/sg/cases/SGMC/
//    SGCA - http://www.commonlii.org/sg/cases/SGCA/
//    SGHC - http://www.commonlii.org/sg/cases/SGHC/

const DOMAIN = `http://www.commonlii.org`
const NotFoundMessage = `Sorry, no cases or law journal articles found.`

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const { data } = await Request.get(`${DOMAIN}/cgi-bin/LawCite`, {
    params: {
      cit: citation,
    },
  })
  
  const $ = cheerio.load(data)

  const message = $(`.message-level-1`)?.eq(0)?.text()?.trim()

  if(message === NotFoundMessage){
    return false
  }

  const name = $(`h1.name`).text().trim()
  // const date = $(`div.date`)?.text()?.trim()
  const link = $(`div.citation > a.free-external`)?.attr(`href`)
  let jurisdiction = $(`.jurisdiction`).eq(0).text().trim()

  if([`United Kingdom - England and Wales`, `United Kingdom`].some(s => s === jurisdiction)){
    jurisdiction = Constants.JURISDICTIONS.UK.id
  } else if (jurisdiction === `Singapore`) {
    jurisdiction = Constants.JURISDICTIONS.SG.id
  }
  
  return {
    citation,
    database: Constants.DATABASES.commonlii,
    jurisdiction: jurisdiction as Law.JursidictionCode,
    link,
    name,
  }
}

const CommonLII = {
  getCase,
}

export default CommonLII