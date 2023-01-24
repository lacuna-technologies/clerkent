import { useCallback, useState } from 'preact/hooks'
import CaseResult from './CaseResult'
import ShowMore from './ShowMore'
import AnimatedLoading from '../../components/AnimatedLoading'
import type { FunctionComponent } from 'preact'
import ShowNewResultsButton from './ShowNewResultsButton'

interface Props {
  searchResults: Law.Case[],
  downloadPDF: downloadPDFType,
  isSearching: boolean,
  updatePending: boolean,
  updateResults: () => void
}

const maxResults = 3

const QueryResult: FunctionComponent<Props> = ({
  searchResults,
  downloadPDF,
  isSearching,
  updatePending,
  updateResults,
}) => {
  const [morePressed, setMorePressed] = useState(false)
  const onShowMore = useCallback(() => setMorePressed(true), [])

  if(!isSearching && searchResults.length === 0){
    return <div className="flex-grow">No cases found</div>
  }

  const showMore = morePressed || searchResults.length <= maxResults

  return (
    <div className="flex flex-col mt-2 items-start content-start gap-4">
      {
        (searchResults as Law.Case[])
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
      
      {
        updatePending ? (
          <ShowNewResultsButton onClick={updateResults} />
        ) : null
      }
      
      {
        isSearching ? (
          <AnimatedLoading />
        ) : null
      }
    </div>
  )
}

export default QueryResult