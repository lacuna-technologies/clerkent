import type { Runtime } from 'webextension-polyfill-ts'
import { Messenger, Constants, Helpers, Finder } from '../utils'
import qs from 'qs'

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

const waitForElement = (selector: string, multiple: boolean): Promise<Element | NodeListOf<Element>> => new Promise(resolve => {
  const getElement = () => multiple
    ? document.querySelectorAll(selector)
    : document.querySelector(selector)
  const initialAttempt = getElement()
  if (initialAttempt) {
    return resolve(initialAttempt)
  }

  const observer = new MutationObserver(() => {
    const attempt = getElement()
    if (attempt) {
      resolve(attempt)
      observer.disconnect()
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
})

const intercepteLitigationDownloads = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location
  const iseLitigation = (hostname === `www.elitigation.sg` && (new RegExp(`^/(gdviewer|gd)/s/[0-9]{4}.+$`)).test(pathname))
  if(iseLitigation){
    const downloadButtonSelector = `.container.body-content > nav a.nav-item.nav-link[href$="/pdf"]`
    const downloadButton = await waitForElement(downloadButtonSelector, false)
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
    return augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
  }
}

const interceptLawNetDownloads = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location
  const isLawNet = (hostname === `www.lawnet.sg` && pathname === `/lawnet/group/lawnet/page-content`)
  const isLawNetCase = document.querySelector(`div.case-reference > ul.statusInfo`) !== null
  if (isLawNet && isLawNetCase){
    const downloadButtonSelector = `li.iconPDF > a`
    const downloadButton = await waitForElement(downloadButtonSelector, false)
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
    return augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
  }
}

const interceptOpenLawDownloads = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location
  const isOpenLaw = (hostname === `www.lawnet.com` && pathname.match(new RegExp(`^/openlaw/cases/citation`)) !== null)
  if(isOpenLaw){
    const downloadButtonSelector = `li.document-action.download`
    const downloadButton = await waitForElement(downloadButtonSelector, false)
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
    const listener = downloadPDF(port, { doctype: `Judgment`, law });
    (downloadButton as HTMLAnchorElement).addEventListener(`click`, listener)
  }
}

const interceptAustliiDownloads = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location
  const isAustlii = ([`www.austlii.edu.au`, `www6.austlii.edu.au`, `www8.austlii.edu.au`].includes(hostname) && pathname.match(new RegExp(``)) !== null)
  if(isAustlii){
    const downloadButtonSelector = `div.side-element.side-download a[href^="/cgi-bin/sign.cgi"]`
    const downloadButton = await waitForElement(downloadButtonSelector, true)
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
    return augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
  }
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const interceptSSODownloads = async (port: Runtime.Port) => {
  const { hostname, pathname, search } = window.location
  const isSSO = (hostname === `sso.agc.gov.sg`)
  if(isSSO){

    const isSubsidiaryLegislationView = (pathname.match(new RegExp(/^\/Act\//)) !== null) && (qs.parse(search)[`ViewType`] === `Sl`)
    if (isSubsidiaryLegislationView){
      const downloadButtons = (await waitForElement(`td.hidden-xs a.file-download`, true) as NodeListOf<Element>)
      for(const downloadButton of downloadButtons){
        const legislationName = downloadButton.parentElement.parentElement.children[0].querySelector(`a.non-ajax`).textContent.trim()
        const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
        augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
      }
      return
    }

    // extra optional "/" because SSO sometimes adds a double slash in the the path
    const isDetail = (pathname.match(new RegExp(/^\/\/?(Act|SL|SL-Supp|Acts-Supp|Bills-Supp|Act-Rev|SL-Rev)\//)) !== null)
    if(isDetail){
      await waitForElement(`.legis-title .file-download`, true)
      // there are 4, but we are only concerned with desktop
      const downloadButton: HTMLAnchorElement = document.querySelector(`.file-download`)
      // there are also 4, but it doesn't matter which one we pick
      const legislationName = document.querySelector(`.legis-title`).textContent.trim()
      const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
      return augmentDownloadButton(port, downloadButton, fileName)
    }
    
    const isSearch = (pathname.match(new RegExp(/^\/Search\/Content/)) !== null)
    if(isSearch){
      const downloadButtons = (await waitForElement(`td.hidden-xs a.file-download`, true)) as NodeListOf<Element>
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
      const downloadButtons = (await waitForElement(`td.hidden-xs a.file-download`, true) as NodeListOf<Element>)
      for(const downloadButton of downloadButtons){
        const legislationName = downloadButton.parentElement.parentElement.children[1].querySelector(`a.non-ajax`).textContent.trim()
        const fileName = Helpers.sanitiseFilename(`${legislationName}.pdf`)
        augmentDownloadButton(port, downloadButton as HTMLAnchorElement, fileName)
      }
      return
    }
  }
}

const interceptWestlawDownloads = async (port: Runtime.Port) => {
  const { hostname, pathname } = window.location
  const isWestLaw = (hostname === `uk.westlaw.com`)
  if(isWestLaw){
    const isDetail = (pathname.match(new RegExp(/^\/Document\/[\dA-Z]+\/View\/FullText\.html/)) !== null)
    if(isDetail){
      await waitForElement(`#co_docContentWhereReported,#co_docContentMetaInfo`, false)
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
      await waitForElement(`#co_search_results_inner`, false)
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

const interceptCanLIIDownloads = async (port: Runtime.Port) => {
  const { hostname } = window.location
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
  await intercepteLitigationDownloads(port)
  await interceptLawNetDownloads(port)
  await interceptOpenLawDownloads(port)
  await interceptAustliiDownloads(port)
  await interceptSSODownloads(port)
  await interceptWestlawDownloads(port)
  await interceptCanLIIDownloads(port)
}

export default downloadInterceptor