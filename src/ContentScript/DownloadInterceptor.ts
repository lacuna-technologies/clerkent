import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Constants, Helpers, Logger, Finder } from '../utils'

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

const intercepteLitigationDownloads = async (hostname: string, pathname: string, port: Runtime.Port) => {
  const iseLitigation = (hostname === `www.elitigation.sg` && (new RegExp(`^/(gdviewer|gd)/s/[0-9]{4}.+$`)).test(pathname))
  if(iseLitigation){
    const downloadButtonSelector = `.container.body-content > nav a.nav-item.nav-link[href$="/pdf"]`
    await waitForElement(downloadButtonSelector)
    const downloadButton: HTMLAnchorElement = document.querySelector(downloadButtonSelector)
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
}

const interceptLawNetDownloads = async (hostname: string, pathname: string, port: Runtime.Port) => {
  const isLawNet = (hostname === `www.lawnet.sg` && pathname === `/lawnet/group/lawnet/page-content`)
  const isLawNetCase = document.querySelector(`div.case-reference > ul.statusInfo`) !== null
  if (isLawNet && isLawNetCase){
    const downloadButtonSelector = `li.iconPDF > a`
    await waitForElement(downloadButtonSelector)
    const downloadButton: HTMLAnchorElement = document.querySelector(downloadButtonSelector)
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
}

const interceptOpenLawDownloads = async (hostname: string, pathname: string, port: Runtime.Port) => {
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
}

const interceptAustliiDownloads = async (hostname: string, pathname: string, port: Runtime.Port) => {
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
}

const interceptSSODownloads = async (hostname: string, pathname: string, port: Runtime.Port) => {
  const isSSO = (hostname === `sso.agc.gov.sg`)
  if(isSSO){
    // extra optional "/" because SSO sometimes adds a double slash in the the path
    const isDetail = (pathname.match(new RegExp(/^\/\/?(Act|SL|SL-Supp|Acts-Supp|Bills-Supp|Act-Rev|SL-Rev)\//)) !== null)
    if(isDetail){
      await waitForElement(`.legis-title .file-download`)
      // there are 4, but we are only concerned with desktop
      const downloadButton: HTMLAnchorElement = document.querySelector(`.file-download`)
      // there are also 4, but it doesn't matter which one we pick
      const legislationName = document.querySelector(`.legis-title`).textContent.trim()
      const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
      return augmentDownloadButton(port, downloadButton, fileName)
    }
    
    const isSearch = (pathname.match(new RegExp(/^\/Search\/Content/)) !== null)
    if(isSearch){
      await waitForElement(`td.hidden-xs a.file-download`)
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
      await waitForElement(`td.hidden-xs a.file-download`)
      const downloadButtons = document.querySelectorAll(`td.hidden-xs a.file-download`)
      for(const downloadButton of downloadButtons){
        const legislationName = downloadButton.parentElement.parentElement.children[1].querySelector(`a.non-ajax`).textContent.trim()
        const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
        augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
      }
      return
    }
  }
}

const interceptWestlawDownloads = async (hostname: string, pathname: string, port: Runtime.Port) => {
  const isWestLaw = (hostname === `uk.westlaw.com`)
  if(isWestLaw){
    const isDetail = (pathname.match(new RegExp(/^\/Document\/[\dA-Z]+\/View\/FullText\.html/)) !== null)
    if(isDetail){
      await waitForElement(`#co_docContentWhereReported,#co_docContentMetaInfo`)
      const caseName = document.title.replace(` | Westlaw UK`, ``)
      const downloadButtons = document.querySelectorAll(`#co_docContentWhereReported a[type="application/pdf"], #co_docContentMetaInfo a[type="application/pdf"]`)
      for(const downloadButton of downloadButtons){
        const citation = downloadButton.parentElement.parentElement.textContent.trim()
        const law: Law.Case = {
          citation,
          database: Constants.DATABASES.UK_westlaw,
          jurisdiction: Constants.JURISDICTIONS.UK.id,
          links: [],
          name: Helpers.removeCommonAppends(
            caseName,
          ),
          type: `case-citation`,
        }
        const fileName = Helpers.getFileName(law, `Judgment`)
        augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
        // TODO: Westlaw will return a HTML page if PDF is not within subscription
        // in such situations, should throw error instead of downloading invalid PDF file
      }      
    }
    const isSearch = (pathname.match(new RegExp(/^\/Search\/Results\.html/)) !== null)
    if(isSearch){
      await waitForElement(`#co_search_results_inner`)
      const downloadButtons = [...document.querySelectorAll(`.icon_colour_pdf`)].map(element => element.parentElement)
      for(const downloadButton of downloadButtons){
        const citation = downloadButton.previousElementSibling.textContent.trim()
        const caseName = downloadButton.parentElement.parentElement.querySelector(`.co_accessibilityLabel`).textContent.trim()
        const law: Law.Case = {
          citation,
          database: Constants.DATABASES.UK_westlaw,
          jurisdiction: Constants.JURISDICTIONS.UK.id,
          links: [],
          name: Helpers.removeCommonAppends(
            caseName,
          ),
          type: `case-citation`,
        }
        const fileName = Helpers.getFileName(law, `Judgment`)
        augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
        // TODO: Westlaw will return a HTML page if PDF is not within subscription
        // in such situations, should throw error instead of downloading invalid PDF file
      }
    }
  }
}

const interceptCanLIIDownloads = async (hostname, pathname, port) => {
  const isCanLII = (hostname === `www.canlii.org`)
  if(isCanLII){
    const selector = `#metas .subTab a[href$=".pdf"]`
    const downloadButton: HTMLAnchorElement = document.querySelector(selector)
    const title = document.querySelector(`.mainTitle`).textContent
    const caseName = title.replace(/, \d{4}.*$/, ``).trim()
    const citation = Finder.findCaseCitation(title)[0].citation
    const law: Law.Case = {
      citation,
      database: Constants.DATABASES.CA_canlii,
      jurisdiction: Constants.JURISDICTIONS.CA.id,
      links: [],
      name: Helpers.removeCommonAppends(caseName),
      type: `case-citation`,
    }
    const fileName = Helpers.getFileName(law, `Judgment`)
    return augmentDownloadButton(port, downloadButton, fileName)
  }
}

const downloadInterceptor = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location

  await intercepteLitigationDownloads(hostname, pathname, port)
  await interceptLawNetDownloads(hostname, pathname, port)
  await interceptOpenLawDownloads(hostname, pathname, port)
  await interceptAustliiDownloads(hostname, pathname, port)
  await interceptSSODownloads(hostname, pathname, port)
  await interceptWestlawDownloads(hostname, pathname, port)
  await interceptCanLIIDownloads(hostname, pathname, port)
}

export default downloadInterceptor