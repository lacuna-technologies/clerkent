import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

const DOMAIN = `https://www.hklii.hk`

const getCase = async (citation: string): Promise<Law.Case | false> => {
  const { data: searchData } = await Request.post(
    `${DOMAIN}/searchapi/nonlegis/_search/template?filter_path=hits.hits._source`,
    {
      id: `quickcitation`,
      params: {
        citation,
      },
    },
  )

  if(!searchData?.hits?.hits || !Array.isArray(searchData.hits.hits) || searchData.hits.hits.length !== 1){
    return false
  }

  const path = searchData.hits.hits[0]._source.path
  const { data } = await Request.post(
    `${DOMAIN}/searchapi/nonlegis/_search/`,
    {
      query: {
        term: {
          path,
        },
      },
      size: 1,
    },
  )

  if(!data?.hits?.hits || !Array.isArray(data.hits.hits) || data.hits.hits.length !== 1){
    return false
  }

  const {
    hits: {
      hits: [
        {
          _source: {
            title: name,
            neutral,
            path: casePath,
          },
        },
      ],
    },
  } = data

  return {
    citation: neutral,
    database: Constants.DATABASES.HK_hklii,
    jurisdiction: Constants.JURISDICTIONS.HK.id,
    link: `${DOMAIN}${casePath}`,
    name,
  }

}

const HKLII = {
  getCase,
}

export default HKLII