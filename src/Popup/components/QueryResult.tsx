import { useCallback, useState } from 'preact/hooks'
import CaseResult from './CaseResult'
import LegislationResult from './LegislationResult'
import ShowMore from './ShowMore'
import AnimatedLoading from '../../components/AnimatedLoading'
import type { FunctionComponent } from 'preact'

interface Props {
  searchResult: (Law.Case | Law.Legislation)[],
  downloadPDF: downloadPDFType,
  isSearching: boolean,
}

const maxResults = 3

// eslint-disable-next-line sonarjs/cognitive-complexity
const QueryResult: FunctionComponent<Props> = ({ searchResult, downloadPDF, isSearching }) => {
  const [morePressed, setMorePressed] = useState(false)
  const onShowMore = useCallback(() => setMorePressed(true), [])

  if (isSearching){
    return <AnimatedLoading />
  }

  if(searchResult.length === 0){
    return <div className="flex-grow">No cases found</div>
  }

  const showMore = morePressed || searchResult.length <= maxResults

  const resultType: Law.Type = searchResult[0]?.type
  if(resultType === `case-citation` || resultType === `case-name`){
    return (
      <div className="flex flex-col mt-2 items-start content-start gap-4">
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
      <div className="flex flex-col mt-2 items-start content-start gap-4">
        {
          (searchResult as Law.Legislation[])
          .slice(0, showMore ? undefined: maxResults)
          .map((legislation) => {
            const { provisionType, provisionNumber, statute } = legislation
            return (
              <LegislationResult
                legislation={legislation}
                downloadPDF={downloadPDF}
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