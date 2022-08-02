import { useState, useEffect, useCallback } from 'preact/compat'
import Admonition from 'components/Admonition'
import Clipboard from 'utils/Clipboard'
import OptionsStorage from 'utils/OptionsStorage'
import { browser } from 'webextension-polyfill-ts'

// eslint-disable-next-line sonarjs/cognitive-complexity
const ClipboardSuggestion = ({ query, applyClipboardText }) => {
  const [clipboardText, setClipboardText] = useState(``)
  const [enabled, setEnabled] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)

  const onClick = useCallback(() => applyClipboardText(clipboardText), [clipboardText, applyClipboardText])
  const onGrant = useCallback(async () => {
    const permissionsRequest = await browser.permissions.request({
      permissions: [`clipboardRead`],
    })
    setPermissionGranted(permissionsRequest)
  }, [])

  useEffect(() => {
    (async () => {
      const granted = await browser.permissions.contains({ permissions: [`clipboardRead`] })
      setPermissionGranted(granted)

      if(granted){
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
  }, [])

  return (enabled && !permissionGranted) ? (
    <Admonition title="Search for copied text?" className="mb-4" onClick={onGrant}>
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