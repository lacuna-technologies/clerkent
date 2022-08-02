import { render } from 'preact'
import { useEffect } from 'preact/hooks'
import { browser } from 'webextension-polyfill-ts'
import type { Downloads , Runtime } from 'webextension-polyfill-ts'
import Messenger from './utils/Messenger'
import Finder from './utils/Finder'
import Storage from './utils/Storage'
import Scraper from './utils/scraper'
import Logger from './utils/Logger'
import { Helpers } from './utils'
import Browser from 'utils/Browser'

const getScraperResult = (
  targets: Finder.FinderResult[],
  jurisdiction: Law.JursidictionCode,
): Promise<Law.Legislation[] | Law.Case[]> => {
  const { type } = targets[0]
  switch (type) {
    case `case-citation`: {
      return Scraper.getCaseByCitation(targets[0] as Finder.CaseCitationFinderResult, jurisdiction)
    }
    case `case-name`: {
      return Scraper.getCaseByName(targets[0] as Finder.CaseNameFinderResult, jurisdiction)
    }
  }
  return Promise.resolve([])
}

// used by ContentScript/Highlighter for citation hover
const viewCitation = async (port: Runtime.Port, otherProperties: Messenger.OtherProperties) => {
  const { citation, source } = otherProperties
  await Storage.set(`CURRENT_HIGHLIGHTED_CITATION`, citation)

  const targets = Finder.findCase(citation)

  const noResultMessage = {
    action: Messenger.ACTION_TYPES.viewCitation,
    data: [],
    source: Messenger.TARGETS.background,
    target: source,
  }
  if(targets.length === 0){
    return port.postMessage(noResultMessage)
  }
  
  const result = await Scraper.getCaseByCitation(targets[0] as Finder.CaseCitationFinderResult)

  if(result.length === 0){
    return port.postMessage(noResultMessage)
  }

  if(citation === await Storage.get(`CURRENT_HIGHLIGHTED_CITATION`)){ // ignore outdated results
    const data = result.map((r: Law.Legislation | Law.Case) => ({...targets[0], ...r}))

    const message = {
      action: Messenger.ACTION_TYPES.viewCitation,
      data,
      source: Messenger.TARGETS.background,
      target: source,
    }
    Logger.log(`sending viewCitation`, message)
    port.postMessage(message)
  }
}

// Used by Popup
const search = async (port: Runtime.Port, otherProperties: Messenger.OtherProperties) => {
  const { citation, source, jurisdiction } = otherProperties
  await Storage.set(`CURRENT_HIGHLIGHTED_CITATION`, citation)
  const targets = Finder.findCase(citation)

  const noResultMessage: Messenger.Message = {
    action: Messenger.ACTION_TYPES.search,
    data: [],
    source: Messenger.TARGETS.background,
    target: source,
  }
  
  const result = await getScraperResult(targets, jurisdiction)
  Logger.log(`BackgroundPage scraper result`, jurisdiction, result)

  if(result.length === 0){
    return port.postMessage(noResultMessage)
  }

  if(citation === await Storage.get(`CURRENT_HIGHLIGHTED_CITATION`)){ // ignore outdated results
    const data = result.map((r: Law.Legislation | Law.Case) => ({...targets[0], ...r}))

    const message = {
      action: Messenger.ACTION_TYPES.search,
      data,
      source: Messenger.TARGETS.background,
      target: source,
    }
    Logger.log(`sending search`, message)
    port.postMessage(message)
  }
}

const downloadFile = async (url: string, fileName: string) => {
  if(url && url.length > 0){
    await browser.downloads.download({
      filename: fileName,
      saveAs: true,
      url,
    })
    return
  } 
  Logger.error(`Failed to downloadFile: url is empty`)
}


const handleAction = (port: Runtime.Port) => async ({ action, ...otherProperties }) => {
  switch (action) {
    case Messenger.ACTION_TYPES.viewCitation: {
      await viewCitation(port, otherProperties)
    break
    }
    case Messenger.ACTION_TYPES.search: {
      await search(port, otherProperties)
    break
    }

    case Messenger.ACTION_TYPES.downloadPDF: {
      const { law, doctype } = otherProperties
      const url = await Scraper.getPDF(law as Law.Case, doctype)
      const fileName = Helpers.getFileName(law, doctype)
      Logger.log(`downloadPDF fileName: `, fileName)
      Logger.log(`downloadPDF url: ${url}`)
      await downloadFile(url, fileName)
    break
    }

    case Messenger.ACTION_TYPES.downloadFile: {
      const { url, fileName } = otherProperties
      await downloadFile(url, fileName)
    break
    }
    // No default
  }
}

const onReceiveMessage = (port: Runtime.Port) => (message: Messenger.Message) => {
  Logger.log(`background received`, message)
  if (message.target === Messenger.TARGETS.popup) {
    return
  } else if (message.target === Messenger.TARGETS.background){
    if (typeof message.action === `string`) {
      Logger.log(`background handling action`, message.action)
      return handleAction(port)(message)
    } 
      Logger.log(`unknown action`, message.action)
      return
    
  }
}

const onConnect = (port: Runtime.Port) => {
  port.postMessage({ hello: `world` })
  port.onMessage.addListener(onReceiveMessage(port))
}

const onInstall = async (details: Runtime.OnInstalledDetailsType): Promise<void> => {
  Logger.log(`onInstall`, details)
  // if(details?.previousVersion){
  //   // just an update, do nothing
  //   return
  // }
  const GUIDE_SHOWN_KEY = `GUIDE_SHOWN`
  const guideShown = await Storage.get(GUIDE_SHOWN_KEY)
  if(guideShown === true){
    // shown before, don't show again
    // but try showing the subscribe page
    const subscribeShown = await Storage.get(`DO_NOT_REMIND_SUBSCRIBE`)
    if(subscribeShown !== true){
      await browser.tabs.create({ url: `updates.html` })
    }
    return
  }
  // otherwise open the guide
  await browser.tabs.create({ url: `guide.html` })
  await Storage.set(GUIDE_SHOWN_KEY, true)
}

const onDownload = (download: Downloads.DownloadItem) => {
  if(typeof download.byExtensionId === `string`){
    // don't mess with extension-initiated downloads, including Clerkent's
    return
  }
  // const url = new URL(download.url)
  // if(url.hostname === `www.elitigation.sg` && url.pathname.match(new RegExp(`^/gd/.*/pdf$`)) !== null){
  //   browser.downloads.cancel(download.id)
  //   browser.downloads.erase({
  //     id: download.id,
  //   })
  //   browser.downloads.download({
  //     url: download.url,
  //   })
  // }
}

const onBeforeSendHeaders = (details) => {
  const { requestHeaders } = details
  const originIndex = requestHeaders.findIndex(header => header.name === `Origin`)
  if(originIndex === -1){
    return requestHeaders
  }
  return {
    requestHeaders: [
      ...requestHeaders.slice(0, originIndex),
      { name: `Origin`, value: `https://www.lawnet.com` },
      ...requestHeaders.slice(originIndex + 1),
    ],
  }
}

const DEBUG_MODE = process.env.NODE_ENV === `development`

const synchronousInit = () => {
  browser.runtime.onInstalled.addListener(onInstall)
}

const init = () => {
  browser.runtime.onConnect.addListener(onConnect)
  browser.downloads.onCreated.addListener(onDownload)

  browser.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, {
    urls: [`*://api.lawnet.sg/lawnet/search-service/api/lawnetcore/*`],
  }, [
    `requestHeaders`,
    ...(Browser.isChrome() ? [`extraHeaders`] as const : []),
    `blocking`,
  ])

  if(DEBUG_MODE){
    browser.tabs.create({ url: `popup.html` })
  }
}

const BackgroundPage = () => {
  useEffect(() => init(), [])
  return (
    <h1>Background Page</h1>
  )
}

synchronousInit()

const container = document.querySelector(`#background-root`)
render(<BackgroundPage />, container)