import { useState, useCallback, useEffect } from 'preact/hooks'
import { browser } from 'webextension-polyfill-ts'

const useClipboard = () => {
  const [permissionGranted, setPermissionGranted] = useState(false)

  const promptGrant = useCallback(async () => {
    const permissionsRequest = await browser.permissions.request({
      permissions: [`clipboardRead`],
    })
    setPermissionGranted(permissionsRequest)
  }, [])

  useEffect(() => {
    (async () => {
      const granted = await browser.permissions.contains({ permissions: [`clipboardRead`] })
      setPermissionGranted(granted)
    })()
  })

  return {
    permissionGranted,
    promptGrant,
  }
}

export default useClipboard