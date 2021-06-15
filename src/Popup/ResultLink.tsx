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
    <a className="pdf" href={href} onClick={onClick}>
      <img src={PDFSvg} alt="download PDF" />
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
    <div className={Helpers.classnames(`link`, link.doctype.toLowerCase(), empty ? `empty`: ``)}>
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