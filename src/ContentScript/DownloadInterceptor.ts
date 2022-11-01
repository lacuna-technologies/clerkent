import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Constants, Helpers } from '../utils'

const augmentDownloadButton = (port: Runtime.Port, button: HTMLAnchorElement, fileName: string): void => {
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

const downloadPDF = (
  port: Runtime.Port,
  { law, doctype }: { law: Law.Case , doctype: Law.Link[`doctype`]},
) => (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  port.postMessage({
    action: Messenger.ACTION_TYPES.downloadPDF,
    doctype,
    law,
    source: Messenger.TARGETS.contentScript,
    target: Messenger.TARGETS.background,
  })
}

const waitForElement = (selector: string) => new Promise(resolve => {
  if (document.querySelector(selector)) {
    return resolve(document.querySelector(selector))
  }

  const observer = new MutationObserver(() => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector))
      observer.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

// eslint-disable-next-line sonarjs/cognitive-complexity
const downloadInterceptor = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location
  const iseLitigation = (hostname === `www.elitigation.sg` && (new RegExp(`^/gdviewer/s/[0-9]{4}.+$`)).test(pathname))
  if(iseLitigation){
    const downloadButton: HTMLAnchorElement = document.querySelector(`.container.body-content > nav a.nav-item.nav-link[href$="/pdf"]`)
    const citationElement = document.querySelector(`.HN-NeutralCit`) || document.querySelector(`span.Citation.offhyperlink,span.NCitation.offhyperlink`)
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
    return augmentDownloadButton(port, downloadButton, fileName)
  }
  
  const isLawNet = (hostname === `www.lawnet.sg` && pathname === `/lawnet/group/lawnet/page-content`)
  const isLawNetCase = document.querySelector(`div.case-reference > ul.statusInfo`) !== null
  if (isLawNet && isLawNetCase){
    const downloadButton: HTMLAnchorElement = document.querySelector(`li.iconPDF > a`)
    const citationElement = [...document.querySelectorAll(`span.Citation.offhyperlink`)].slice(-1)[0]
    const caseNameElement = document.querySelector(`span.caseTitle`)
    const law: Law.Case = {
      citation: citationElement.textContent.trim(),
      database: Constants.DATABASES.SG_lawnetsg,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [],
      name: Helpers.removeCommonAppends(
        caseNameElement.textContent.trim(),
      ),
      type: `case-citation`,
    }
    const fileName = Helpers.getFileName(law, `Judgment`)
    return augmentDownloadButton(port, downloadButton, fileName)
  }

  const isOpenLaw = (hostname === `www.lawnet.com` && pathname.match(new RegExp(`^/openlaw/cases/citation`)) !== null)
  if(isOpenLaw){
    const downloadButtonSelector = `li.document-action.download`
    await waitForElement(downloadButtonSelector)
    const downloadButton: HTMLAnchorElement = document.querySelector(downloadButtonSelector)
    const citationElement = document.querySelector(`span.NCitation.offhyperlink`) || document.querySelector(`div.lr_citation_link`)
    const caseNameElement = document.querySelector(`span.caseTitle`)
    const citation = citationElement.textContent.trim()
    const encodedCitation = citation.replaceAll(` `, `+`)
    const judgmentLink: Law.Link = {
      doctype: `Judgment`,
      filetype: `HTML`,
      url: `https://www.lawnet.com/openlaw/cases/citation/${encodedCitation}`,
    }
    const law: Law.Case = {
      citation,
      database: Constants.DATABASES.SG_openlaw,
      jurisdiction: Constants.JURISDICTIONS.SG.id,
      links: [judgmentLink],
      name: Helpers.removeCommonAppends(
        caseNameElement.textContent.trim(),
      ),
      type: `case-citation`,
    }
    const listener = downloadPDF(port, { doctype: `Judgment`, law })
    downloadButton.addEventListener(`click`, listener)
  }

  const isAustlii = ([`www.austlii.edu.au`, `www6.austlii.edu.au`, `www8.austlii.edu.au`].includes(hostname) && pathname.match(new RegExp(``)) !== null)
  if(isAustlii){
    const downloadButtonSelector = `div.side-element.side-download a[href^="/cgi-bin/sign.cgi"]`
    await waitForElement(downloadButtonSelector)
    const downloadButton: HTMLAnchorElement = document.querySelector(downloadButtonSelector)
    const citationElement = document.querySelector(`.ribbon-citation span`)
    const caseName = document.querySelector(`title`).textContent.replace(/ \[.*$/, ``).trim()
    const law: Law.Case = {
      citation: citationElement.textContent.trim(),
      database: Constants.DATABASES.AU_austlii,
      jurisdiction: Constants.JURISDICTIONS.AU.id,
      links: [],
      name: Helpers.removeCommonAppends(
        caseName,
      ),
      type: `case-citation`,
    }
    const fileName = Helpers.getFileName(law, `Judgment`)
    return augmentDownloadButton(port, downloadButton, fileName)
  }

  const isSSO = (hostname === `sso.agc.gov.sg`)
  if(isSSO){
    const isDetail = (pathname.match(new RegExp(/^\/(Act|SL|SL-Supp|Acts-Supp|Bills-Supp|Act-Rev|SL-Rev)\//)) !== null)
    if(isDetail){
      // there are 4, but we are only concerned with desktop
      const downloadButton: HTMLAnchorElement = document.querySelector(`.file-download`)
      // there are also 4, but it doesn't matter which one we pick
      const legislationName = document.querySelector(`.legis-title`).textContent.trim()
      const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
      return augmentDownloadButton(port, downloadButton, fileName)
    }
    
    const isSearch = (pathname.match(new RegExp(/^\/Search\/Content/)) !== null)
    if(isSearch){
      const downloadButtons = document.querySelectorAll(`td.hidden-xs a.file-download`)
      for(const downloadButton_ of downloadButtons){
        const downloadButton = downloadButton_ as HTMLAnchorElement
        const legislationName = downloadButton.parentElement.parentElement.children[0].querySelector(`a.title`).textContent.trim()
        const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
        augmentDownloadButton(port, downloadButton, fileName)
      }
      return
    }
    
    const isBrowse = (pathname.match(new RegExp(/^\/Browse\/(Act|SL|SL-Supp|Acts-Supp|Bills-Supp|Act-Rev|SL-Rev)\//)) !== null)
    if (isBrowse){
      const downloadButtons = document.querySelectorAll(`td.hidden-xs a.file-download`)
      for(const downloadButton_ of downloadButtons){
        const downloadButton = downloadButton_ as HTMLAnchorElement
        const legislationName = downloadButton.parentElement.parentElement.children[1].querySelector(`a.non-ajax`).textContent.trim()
        const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
        augmentDownloadButton(port, downloadButton, fileName)
      }
      return
    }
  }
}

export default downloadInterceptor