import React, { useCallback } from 'react'
import type { MouseEvent } from 'react'
import Helpers from '../utils/Helpers'
import type Law from '../types/Law'

interface Props {
  link: Law.Link,
  onDownloadPDF: () => void
}

const ResultLink: React.FC<Props> = ({
  link,
  onDownloadPDF,
}) => {
  const onClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    onDownloadPDF()
  }, [onDownloadPDF])
  return link ? (
    <div className={Helpers.classnames(`link`, link.doctype.toLowerCase())}>
      {
        link.filetype === `HTML` ? (
          <a href={link?.url} target="_blank" rel="noreferrer">
            {link.doctype}
          </a>
        ) : (
          <a
            className="pdf button"
            href={link?.url}
            onClick={onClick}
          >
            {link.doctype}
          </a>
        )
      }
    </div>
  ) : null
}

export default ResultLink