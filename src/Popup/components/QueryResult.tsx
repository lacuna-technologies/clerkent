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
}

export default QueryResult