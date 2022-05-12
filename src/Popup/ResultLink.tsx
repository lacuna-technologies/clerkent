import React, { useCallback } from 'react'
import type { MouseEvent } from 'react'
import Helpers from '../utils/Helpers'
import type Law from '../types/Law'
import PDFSvg from '../assets/icons/pdf.svg'

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

const ResultLink: React.FC<Props> = ({
  empty = false,
  link,
  onDownloadPDF,
}) => {
  const onClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
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
          {...(link.filetype === `PDF` ? { onClick } : {})}
        >
          {link.doctype}
        </a>
      )}
      <PDFLink href={link?.url} onClick={onClick} />
    </div>
  ) : null
}

export default ResultLink