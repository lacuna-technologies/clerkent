import { useState, useEffect, useCallback } from 'preact/compat'
import Admonition from '../components/Admonition'
import Clipboard from '../utils/Clipboard'
import OptionsStorage from '../utils/OptionsStorage'

const ClipboardSuggestion = ({ query, applyClipboardText }) => {
  const [clipboardText, setClipboardText] = useState(``)
  const [enabled, setEnabled] = useState(false)

  const onClick = useCallback(() => applyClipboardText(clipboardText), [clipboardText, applyClipboardText])

  useEffect(() => {
    (async () => {
      const text = await Clipboard.getPopupSearchText()
      if(text.length > 0){
        setClipboardText(text)
      }

      const enabled = await OptionsStorage.clipboardPaste.get()
      setEnabled(enabled as boolean)
    })()
  }, [])

  return (enabled && clipboardText && query !== clipboardText) ? (
    <Admonition title="Search for copied text?" className="mb-4" onClick={onClick}>
      <em>{clipboardText}</em>
    </Admonition>
  ) : null
}

export default ClipboardSuggestion