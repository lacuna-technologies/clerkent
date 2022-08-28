import useClipboard from 'Popup/hooks/useClipboard'
import type { FunctionComponent } from 'preact'
import { useCallback } from 'preact/hooks'
import Helpers from 'utils/Helpers'
import ResultLink from './ResultLink'

interface Props {
  case: Law.Case,
  downloadPDF: downloadPDFType
}

const CaseResult: FunctionComponent<Props> = ({
  case: currentCase,
  downloadPDF,
}) => {
  const {
    citation,
    name,
    links,
    database,
  } = currentCase
  const summaryURL = Helpers.getSummaryLink(links)?.url
  const judgmentLink = Helpers.getJudgmentLink(links)
  const opinionLink = Helpers.getOpinionLink(links)
  const orderLink = Helpers.getOrderLink(links)

  const caseNameClass = summaryURL ? `text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900 hover:underline` : ``
  const {
    permissionGranted,
    promptGrant,
  } = useClipboard()
  const onClickCitation = useCallback(async () => {
    if(!permissionGranted){
      await promptGrant()
    }
    await navigator.clipboard.writeText(citation)
  }, [permissionGranted, promptGrant, citation])

  return (
    <div className="w-full outline-none">
      <div className="flex flex-row justify-start items-center mb-0.5">
        {
          database && (
            <a className="text-xs" href={database.url} target="_blank" rel="noreferrer">
              {database.name}
            </a>
          )
        }
      </div>
      <a
        className={`align-left text-lg ${caseNameClass}`}
        target="_blank"
        href={summaryURL}
        rel="noreferrer"
        {...(summaryURL ? {title: `Summary`} : {})}
      >
        {name}
      </a>
      <div className="flex flex-row mt-0.5 gap-4">
        <span
          className="cursor-pointer select-all"
          onClick={onClickCitation}
          title="Click to copy citation"
        >
          {citation}
        </span>
        <ResultLink
          link={judgmentLink}
          onDownloadPDF={downloadPDF({ doctype: `Judgment`, law: currentCase })}
        />
        <ResultLink
          link={opinionLink}
          onDownloadPDF={downloadPDF({ doctype: `Opinion`, law: currentCase })}
        />
        <ResultLink
          link={orderLink}
          onDownloadPDF={downloadPDF({ doctype: `Order`, law: currentCase })}
        />
      </div>
    </div>
  )
}

export default CaseResult