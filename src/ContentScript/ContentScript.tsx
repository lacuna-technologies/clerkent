import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Logger } from '../utils'
import type { Message } from '../utils/Messenger'
import Tooltip from './Tooltip'
import Highlighter from './Highlighter'
import Searcher from './Searcher'
import './ContentScript.scss'

let port: Runtime.Port

const onMessage = (message: Message) => {
  Logger.log(`content script received:`, message)

  if(document.querySelector(`#clerkent-tooltip`) === null){
    Tooltip.init()
  }
  
  if(message.target !== Messenger.TARGETS.contentScript){
    return null // ignore
  }
  if(message.action === Messenger.ACTION_TYPES.viewCitation){
    Highlighter.handleViewCitation(message)
  }
}

const init = () => {
  port = browser.runtime.connect(``, { name: `contentscript-port` })
  port.onMessage.addListener(onMessage)

  const hasHits = Highlighter.scanForCitations(port)

  if(hasHits){
    Tooltip.init()
  }

  Searcher.init()
}

if(document.readyState === `complete`){
  init()
} else {
  document.addEventListener(`readystatechange`, init)
}