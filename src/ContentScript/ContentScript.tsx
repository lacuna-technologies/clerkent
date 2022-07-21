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

const augmentDownloadButton = (button: HTMLAnchorElement, fileName: string): void => {
  button.addEventListener(`click`, (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    port.postMessage({
      action: Messenger.ACTION_TYPES.downloadFile,
      fileName,
      source: Messenger.TARGETS.contentScript,
      target: Messenger.TARGETS.background,
      url: button.href,
    })
  })
}

const downloadInterceptor = () => {
  const { hostname, pathname } = window.location
  const iseLitigation = (hostname === `www.elitigation.sg` && (new RegExp(`^/gdviewer/s/[0-9]{4}.+$`)).test(pathname))

  if(iseLitigation){
    const downloadButton: HTMLAnchorElement = document.querySelector(`.container.body-content > nav a.nav-item.nav-link[href$="/pdf"]`)
    const citationElement = document.querySelector(`.HN-NeutralCit`) || document.querySelector(`span.Citation.offhyperlink`)
    const caseNameElement: HTMLElement = document.querySelector(`.HN-CaseName`) || document.querySelector(`h2.title > span.caseTitle`)
    const law: Law.Case = {
      citation: citationElement.textContent.trim(),
      database: Constants.DATABASES.SG_elitigation,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [],
      name: Helpers.removeCommonAppends(
        caseNameElement.innerText.replaceAll(/\n+/g, ` `),
      ),
      type: `case-citation`,
    }
    const fileName = Helpers.getFileName(law, `Judgment`)
    return augmentDownloadButton(downloadButton, fileName)
  }
  
  const isLawNet = (hostname === `www.lawnet.sg` && pathname === `/lawnet/group/lawnet/page-content`)
  const isLawNetCase = document.querySelector(`div.case-reference > ul.statusInfo`) !== null
  if (isLawNet && isLawNetCase){
    const downloadButton: HTMLAnchorElement = document.querySelector(`li.iconPDF > a`)
    const citationElement = [...document.querySelectorAll(`span.Citation.offhyperlink`)].slice(-1)[0]
    const caseNameLement = document.querySelector(`span.caseTitle`)
    const law: Law.Case = {
      citation: citationElement.textContent.trim(),
      database: Constants.DATABASES.SG_lawnetsg,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [],
      name: Helpers.removeCommonAppends(
        caseNameLement.textContent.trim(),
      ),
      type: `case-citation`,
    }
    const fileName = Helpers.getFileName(law, `Judgment`)
    return augmentDownloadButton(downloadButton, fileName)
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