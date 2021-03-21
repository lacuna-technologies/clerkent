import qs from 'qs'
import cheerio from 'cheerio'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants' 

const DOMAIN = `https://www.bailii.org`

const getSearchResults = async (citation: string): Promise<Law.Case[]> => {
  const { data, request } = await Request.post(
    `${DOMAIN}/cgi-bin/find_by_citation.cgi`, 
    qs.stringify({ citation }, { format : `RFC1738` }),
    {
      validateStatus: status => (status >= 200 && status < 300) || status === 302,
    },
  )

  if(request.responseURL === `${DOMAIN}/cgi-bin/find_by_citation.cgi`) {
    return []
  }

  const $ = cheerio.load(data)

  const pdfPath = $(`a[href$=".pdf"]`).eq(0).attr(`href`)

  const result = {
    citation,
    link: request.responseURL,
    name: $(`title`).text().trim(),
    ...(pdfPath ? {pdf: `${DOMAIN}${pdfPath}`} : {}),
    database: Constants.DATABASES.UK_bailii,
    jurisdiction: Constants.JURISDICTIONS.UK.id,
  }

  return [result]
}

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const results = (await getSearchResults(citation))

  if(results.length !== 1){
    return false
  }

  return results[0]
}

const BAILII = {
  getCase,
  getSearchResults,
}

export default BAILII