import { useRef, useCallback, useEffect } from 'preact/hooks'
import type { Runtime } from 'webextension-polyfill-ts'
import { browser } from 'webextension-polyfill-ts'
import { Logger, Messenger } from 'utils'

const useMessenger = ({ onSearchDone }) => {
  const port = useRef({} as Runtime.Port)
  const sendMessage = useCallback((message) => port.current.postMessage(message), [port])
  const onMessage = useCallback((message: Messenger.Message) => {
    Logger.log(`popup received:`, message)
    if(message.target !== Messenger.TARGETS.popup){
      return null // ignore
    }
    if(message.action === Messenger.ACTION_TYPES.search){
      const { data } = message
      onSearchDone(data)
    }
  }, [onSearchDone])

  const search = useCallback((citation, inputJurisdiction) => sendMessage({
    action: Messenger.ACTION_TYPES.search,
    citation: citation,
    jurisdiction: inputJurisdiction,
    source: Messenger.TARGETS.popup,
    target: Messenger.TARGETS.background,
  }), [sendMessage])

  const downloadPDF = useCallback(
    ({ law, doctype }: { law: Law.Case | Law.Legislation, doctype: Law.Link[`doctype`]}) => () => sendMessage({
      action: Messenger.ACTION_TYPES.downloadPDF,
      doctype,
      law,
      source: Messenger.TARGETS.popup,
      target: Messenger.TARGETS.background,
    }), [sendMessage])

  useEffect(() => {
    port.current = browser.runtime.connect(``, { name: `popup-port` })
    sendMessage({ message: `popup says hi` })
    port.current.onMessage.addListener(onMessage)
  }, [port, onMessage, sendMessage])

  return {
    downloadPDF,
    onMessage,
    port,
    search,
    sendMessage,
  }
}

export default useMessenger