import React, { useState, useEffect, useCallback } from 'react'
import Admonition from '../components/Admonition'
import Clipboard from '../utils/Clipboard'
import './ClipboardSuggestion.scss'

const ClipboardSuggestion = ({ query, applyClipboardText }) => {
  const [clipboardText, setClipboardText] = useState(``)

  const onClick = useCallback(() => applyClipboardText(clipboardText), [clipboardText, applyClipboardText])

  useEffect(() => {
    (async () => {
      const text = await Clipboard.getPopupSearchText()
      if(text.length > 0){
        setClipboardText(text)
      }
    })()
  }, [])

  return (clipboardText && query !== clipboardText) ? (
    <Admonition title="Search for copied text?" className="clipboard-suggestion" onClick={onClick}>
      <em>{clipboardText}</em>
    </Admonition>
  ) : null
}

export default ClipboardSuggestion