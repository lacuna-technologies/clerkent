import { useCallback } from 'preact/hooks'
import type { FunctionComponent } from 'preact'
import Helpers from 'utils/Helpers'
import PDFSvg from 'assets/icons/pdf.svg'
import DOCXSvg from 'assets/icons/docx.svg'

interface Props {
  empty?: boolean,
  link: Law.Link,
  onDownloadPDF: () => void
}

const PDFLink = ({
  href,
  onClick,
}) => {
  return (
    <a href={href} onClick={onClick}>
      <img className="h-4 ml-2 mt-[0.3rem] pdf-filter" src={PDFSvg} alt="download PDF" />
    </a>
  )
}

const DOCXLink = ({
  href,
  onClick,
}) => {
  return null
  // return (
  //   <a href={href} onClick={onClick}>
  //     <img className="h-4 ml-2 mt-[0.3rem]" src={DOCXSvg} alt="download DOCX" />
  //   </a>
  // )
}

const ResultLink: FunctionComponent<Props> = ({
  empty = false,
  link,
  onDownloadPDF,
}) => {
  const onClick = useCallback((event) => {
    event.preventDefault()
    event.stopPropagation()
    onDownloadPDF()
  }, [onDownloadPDF])
  return link ? (
    <div className={Helpers.classnames(
      `link`,
      link.doctype.toLowerCase(),
      empty ? `empty`: ``,
      `flex flex-row`,
      `text-blue-700 border-0 bg-none outline-none p-0 underline cursor-pointer select-text hover:text-blue-900`,
    )}>
      {!empty && (
        <a
          href={link?.url}
          target="_blank"
          rel="noreferrer"
          {...(link.filetype !== `HTML` ? { onClick } : {})}
        >
          {link.doctype}
        </a>
      )}
      <PDFLink href={link?.url} onClick={onClick} />
      {/* {
        link.filetype === `PDF` ? (
          <PDFLink href={link?.url} onClick={onClick} />
        ) : (link.filetype === `DOCX` ? (
          <DOCXLink href={link?.url} onClick={onClick} />
        ): null)
      } */}
    </div>
  ) : null
}

export default ResultLink