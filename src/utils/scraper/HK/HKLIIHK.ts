import Request from '../../Request'
import type Law from '../../../types/Law'
import Constants from '../../Constants'

const DOMAIN = `https://www.hklii.hk`

const getCaseByCitation = async (citation: string): Promise<Law.Case[]> => {
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
    return []
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
    return []
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

  return [{
    citation: neutral,
    database: Constants.DATABASES.HK_hklii,
    jurisdiction: Constants.JURISDICTIONS.HK.id,
    links: [
      {
        doctype: `Judgment`,
        filetype: `HTML`,
        url: `${DOMAIN}${casePath}`,
      },
    ],
    name,
  }]
}

const HKLII = {
  getCaseByCitation,
}

export default HKLII