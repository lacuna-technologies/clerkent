import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Logger, Constants, Helpers } from '../utils'
import Tooltip from './Tooltip'
import Highlighter from './Highlighter'
import Searcher from './Searcher'
import OptionsStorage, { OptionsSettings } from '../utils/OptionsStorage'
import './ContentScript.scss'

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

const highlightBlacklist = new Set([
  `advance.lexis.com`,
  `app.justis.com`,
  `www.elitigation.sg`,
  `curia.europa.eu`,
  `ejudgment.kehakiman.gov.my`,
  `eur-lex.europa.eu`,
  `hudoc.echr.coe.int`,
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
  `www-lexisnexis-com.gate2.library.lse.ac.uk`,
  `www-lexisnexis-com.libproxy.kcl.ac.uk`,
  `www-lexisnexis-com.libproxy.ucl.ac.uk`,
  `www.austlii.edu.au`,
  `www.bailii.org`,
  `www.canlii.org`,
  `www.commonlii.org`,
  `www.epo.org`,
  `www.hklii.hk`,
  `www.hklii.org`,
  `www.lawnet.sg.remotexs.ntu.edu.sg`,
  `www.lawnet.sg`,
  `www.lexisnexis.com`,
  `www.lexread.lexisnexis.com`,
  `www.nzlii.org`,
  `www.worldlii.org`,
  `www6.austlii.edu.au`,
  `www8.austlii.edu.au`,
])

const downloadInterceptor = () => {
  const { hostname, pathname } = window.location
  if(hostname === `www.elitigation.sg` && new RegExp(`^/gdviewer/s/[0-9]{4}.+$`).test(pathname)){
    const downloadButton = document.querySelector(`.container.body-content > nav a.nav-item.nav-link[href$="/pdf"]`)
    const law: Law.Case = {
      citation: document.querySelector(`.HN-NeutralCit`).textContent.trim(),
      database: Constants.DATABASES.SG_elitigation,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [],
      name: (document.querySelector(`.HN-CaseName`) as HTMLElement).innerText.replaceAll(/\n+/g, ` `),
      type: `case-citation`,
    }
    const fileName = Helpers.getFileName(law, `Judgment`)
    downloadButton.addEventListener(`click`, (event) => {
      event.preventDefault()
      event.stopPropagation()
      port.postMessage({
        action: Messenger.ACTION_TYPES.downloadFile,
        fileName,
        source: Messenger.TARGETS.contentScript,
        target: Messenger.TARGETS.background,
        url: (downloadButton as HTMLAnchorElement).href,
      })
    })
  }
}

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

  downloadInterceptor()

  Searcher.init()
}

if(document.readyState === `complete`){
  init()
} else {
  document.addEventListener(`readystatechange`, init)
}