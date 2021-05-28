import qs from 'qs'
import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

const DOMAIN = `https://www.canlii.org`


const getCase = async (citation: string): Promise<Law.Case | false> => {
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
    return false
  }

  return cases[0]
}

const CA = {
  getCase,
}

export default CA