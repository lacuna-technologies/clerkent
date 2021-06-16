import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Logger } from '../utils'
import type { Message } from '../utils/Messenger'
import Tooltip from './Tooltip'
import Highlighter from './Highlighter'
import Searcher from './Searcher'
import OptionsStorage, { OptionsSettings } from '../utils/OptionsStorage'
import './ContentScript.scss'

let port: Runtime.Port

let highlightEnabled: OptionsSettings[`OPTIONS_HIGHLIGHT_ENABLED`]

const onMessage = (message: Message) => {
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

const highlightBlacklist = new Set([
  `advance.lexis.com`,
  `app.justis.com`,
  `curia.europa.eu`,
  `ejudgment.kehakiman.gov.my`,
  `eur-lex.europa.eu`,
  `lawcite.org`,
  `legalref.judiciary.hk`,
  `legislation.gov.uk`,
  `login.westlawasia.com`,
  `scc-csc.lexum.com`,
  `sso.agc.gov.sg`,
  `uk.westlaw.com`,
  `westlawasia.com`,
  `www-lawnet-sg.lawproxy1.nus.edu.sg`,
  `www-lawnet-sg.libproxy.smu.edu.sg`,
  `www-lexisnexis-com.libproxy.ucl.ac.uk`,
  `www.austlii.edu.au`,
  `www.bailii.org`,
  `www.canlii.org`,
  `www.commonlii.org`,
  `www.epo.org`,
  `www.hklii.hk`,
  `www.hklii.org`,
  `www.lawnet.sg`,
  `www.lexisnexis.com`,
  `www.lexread.lexisnexis.com`,
  `www.nzlii.org`,
  `www.worldlii.org`,
  `www6.austlii.edu.au`,
  `www8.austlii.edu.au`,
])

const init = async () => {
  port = browser.runtime.connect(``, { name: `contentscript-port` })
  port.onMessage.addListener(onMessage)

  highlightEnabled = (
    await OptionsStorage.highlight.get() &&
    !highlightBlacklist.has(window.location.hostname)
  )

  if(highlightEnabled){
    const hasHits = Highlighter.scanForCitations(port)

    if(hasHits){
      Tooltip.init()
    }
  }

  Searcher.init()
}

if(document.readyState === `complete`){
  init()
} else {
  document.addEventListener(`readystatechange`, init)
}