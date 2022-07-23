import type { FunctionComponent } from 'preact'
import Constants from 'utils/Constants'
import Helpers from 'utils/Helpers'
import ResultLink from './ResultLink'

interface Props {
  legislation: Law.Legislation,
  downloadPDF: downloadPDFType,
}

const LegislationResult: FunctionComponent<Props> = ({
  legislation,
  downloadPDF,
}) => {
  const {
    database,
    jurisdiction,
    provisionNumber,
    provisionType,
    statute,
    links,
  } = legislation
  const link = links[0]
  const pdfLink = Helpers.getPDFLink(links)

  return (
    <div className="result">
      <div className="details">
        <div className="left">
          <span className="jurisdiction" title={Constants.JURISDICTIONS[jurisdiction]?.name}>
            {Constants.JURISDICTIONS[jurisdiction]?.emoji}
          </span>
          {
            database && (
              <a className="database no-link" href={database.url} target="_blank" rel="noreferrer">
                {database.name}
              </a>
            )
          }
        </div>
        <div className="right" />
      </div>
      <a
        className="legislation-name link"
        href={link?.url}
        target="_blank"
        rel="noreferrer"
      >
        {provisionNumber
          ? `${provisionType} ${provisionNumber}, `
          : null
        }
        {statute}
      </a>
      {pdfLink && (
        <div className="links">
          <ResultLink
            empty
            link={link}
            onDownloadPDF={downloadPDF({ doctype: `Legislation`, law: legislation })}
          />
        </div>
      )}
    </div>
  )
}

export default LegislationResult