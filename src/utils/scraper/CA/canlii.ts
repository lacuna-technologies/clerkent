import qs from 'qs'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

const DOMAIN = `https://www.canlii.org`


const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
  const { data } = await Request.get(
    `${DOMAIN}/en/search/ajaxSearch.do?${qs.stringify({ id: citation, page: 1})}`,
    {
      headers: {
        Referer: `https://www.canlii.org/en/`,
        'X-Requested-With': `XMLHttpRequest`,
      },
    },
  )

  const { results } = data
  const cases = results.map(({
    title,
    path,
  }) => {
    return {
      citation,
      database: Constants.DATABASES.CA_canlii,
      jurisdiction: Constants.JURISDICTIONS.CA.id,
      link: `${DOMAIN}${path}`,
      name: title,
    }
  })

  if(cases.length === 0){
    return []
  }

  return cases
}

const CA = {
  getCaseByCitation,
}

export default CA