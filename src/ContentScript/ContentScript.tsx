import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Logger } from '../utils'
import Tooltip from './Tooltip'
import Highlighter from './Highlighter'
import Searcher from './Searcher'
import OptionsStorage, { OptionsSettings } from '../utils/OptionsStorage'
import downloadInterceptor from './DownloadInterceptor'
import './ContentScript.css'

let port: Runtime.Port

let highlightEnabled: OptionsSettings[`OPTIONS_HIGHLIGHT_ENABLED`]

const onMessage = (message: Messenger.Message) => {
  Logger.log(`content script received:`, message)

  if(highlightEnabled && document.querySelector(`#clerkent-tooltip`) === null){
    Tooltip.init()
  }
  
  if(message.target !== Messenger.TARGETS.contentScript){
    return null // ignore
  }
  if(message.action === Messenger.ACTION_TYPES.viewCitation){
    Highlighter.handleViewCitation(message)
  }
}

const init = async () => {
  port = browser.runtime.connect(``, { name: `contentscript-port` })
  port.onMessage.addListener(onMessage)

  highlightEnabled = (
    await OptionsStorage.highlight.get() as boolean
  )

  if(highlightEnabled){
    const hasHits = Highlighter.scanForCitations(port)

    if(hasHits){
      Tooltip.init()
    }
  }

  downloadInterceptor(port)

  Searcher.init()
}

if(document.readyState === `complete`){
  init()
} else {
  document.addEventListener(`readystatechange`, init)
}