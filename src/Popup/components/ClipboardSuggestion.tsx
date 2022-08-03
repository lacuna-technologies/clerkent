import { useState, useEffect, useCallback } from 'preact/compat'
import Admonition from 'components/Admonition'
import Clipboard from 'utils/Clipboard'
import OptionsStorage from 'utils/OptionsStorage'
import useClipboard from 'Popup/hooks/useClipboard'

// eslint-disable-next-line sonarjs/cognitive-complexity
const ClipboardSuggestion = ({ query, applyClipboardText }) => {
  const [clipboardText, setClipboardText] = useState(``)
  const [enabled, setEnabled] = useState(false)
  const { permissionGranted, promptGrant } = useClipboard()

  const onClick = useCallback(() => applyClipboardText(clipboardText), [clipboardText, applyClipboardText])
  
  useEffect(() => {
    (async () => {
      if(permissionGranted){
        const enabled = await OptionsStorage.clipboardPaste.get()
        setEnabled(enabled as boolean)
        if(enabled){
          const text = await Clipboard.getPopupSearchText()
          if(text.length > 0){
            setClipboardText(text)
          }
        }
      }  
    })()
  }, [permissionGranted])

  return (enabled && !permissionGranted) ? (
    <Admonition title="Search for copied text?" className="mb-4" onClick={promptGrant}>
      Click here to grant Clerkent permission to access your clipboard
      so that Clerkent can automatically paste text that looks like a citation into the search box.
    </Admonition>
  ) : ((enabled && clipboardText && query !== clipboardText) ? (
    <Admonition title="Search for copied text?" className="mb-4" onClick={onClick}>
      <em>{clipboardText}</em>
    </Admonition>
  ) : null)
}

export default ClipboardSuggestion