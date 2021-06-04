import React, { useCallback, useState } from 'react'
import type Law from '../types/Law'
import CaseResult from './CaseResult'
import LegislationResult from './LegislationResult'
import ShowMore from './ShowMore'
import Loading from '../components/Loading'
import './QueryResult.scss'

interface Props {
  searchResult: (Law.Case | Law.Legislation)[],
  downloadPDF: ({ name, citation, pdf }) => () => void,
  isSearching: boolean,
}

const maxResults = 3

// eslint-disable-next-line sonarjs/cognitive-complexity
const QueryResult: React.FC<Props> = ({ searchResult, downloadPDF, isSearching }) => {
  const [morePressed, setMorePressed] = useState(false)
  const onShowMore = useCallback(() => setMorePressed(true), [])

  if (isSearching){
    return <Loading.Animated />
  }

  if(searchResult.length === 0){
    return <span>No results found</span>
  }

  const showMore = morePressed || searchResult.length <= maxResults

  const resultType: Law.Type = searchResult[0]?.type
  if(resultType === `case-citation` || resultType === `case-name`){
    return (
      <div id="results">
        {
          (searchResult as Law.Case[])
            .slice(0, showMore ? undefined : maxResults)
            .map((result) => (
              <CaseResult
                case={result}
                downloadPDF={downloadPDF}
                key={`${result.name}-${result.citation}`}
              />
            ))
        }
        { showMore ? null : <ShowMore onClick={onShowMore} /> }
      </div>
    )
  } else if (resultType === `legislation`){
    return (
      <div id="results">
        {
          (searchResult as Law.Legislation[])
          .slice(0, showMore ? undefined: maxResults)
          .map((legislation) => {
            const { provisionType, provisionNumber, statute } = legislation
            return (
              <LegislationResult
                legislation={legislation}
                key={`${provisionType}-${provisionNumber}-${statute}`}
              />
            )
          })
        }
        { showMore ? null : <ShowMore onClick={onShowMore} /> }
      </div>
    )
  }
  return null
}

export default QueryResult