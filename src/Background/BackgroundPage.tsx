import React, { useEffect } from 'react'

import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import Messenger from '../utils/Messenger'
import Finder from '../utils/Finder'
import type { Message, OtherProperties} from '../utils/Messenger'
import Scraper from '../utils/scraper'
import Logger from '../utils/Logger'
import type {
  CaseCitationFinderResult,
  CaseNameFinderResult,
  LegislationFinderResult,
  FinderResult,
} from '../utils/Finder'
import Law from '../types/Law'
import { Helpers } from '../utils'

let currentCitation = null

const getScraperResult = (
  targets: FinderResult[],
  mode: Law.SearchMode,
  jurisdiction: Law.JursidictionCode,
): Promise<Law.Legislation[] | Law.Case[]> => {
  if(mode === `legislation`){
    return Scraper.getLegislation(targets[0] as LegislationFinderResult, jurisdiction)
  }
  if(mode === `case`){
    const { type } = targets[0]
    switch (type) {
      case `case-citation`: {
        return Scraper.getCaseByCitation(targets[0] as CaseCitationFinderResult, jurisdiction)
      }
      case `case-name`: {
        return Scraper.getCaseByName(targets[0] as CaseNameFinderResult, jurisdiction)
      }
    }
  }
  return Promise.resolve([])
}

// used by ContentScript/Highlighter for citation hover
const viewCitation = async (port: Runtime.Port, otherProperties: OtherProperties) => {
   const { citation, source } = otherProperties
  currentCitation = citation

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
  
  const result = await Scraper.getCaseByCitation(targets[0] as CaseCitationFinderResult)

  if(result.length === 0){
    return port.postMessage(noResultMessage)
  }

  if(citation === currentCitation){ // ignore outdated results
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
const search = async (port: Runtime.Port, otherProperties: OtherProperties) => {
  const { citation, source, mode, jurisdiction } = otherProperties
  currentCitation = citation

  const targets = mode === `legislation` ? Finder.findLegislation(citation) : Finder.findCase(citation)

  const noResultMessage = {
    action: Messenger.ACTION_TYPES.search,
    data: [],
    source: Messenger.TARGETS.background,
    target: source,
  }
  if(targets.length === 0){
    return port.postMessage(noResultMessage)
  }
  
  const result = await getScraperResult(targets, mode, jurisdiction)
  Logger.log(`BackgroundPage scraper result`, targets, result)

  if(result.length === 0){
    return port.postMessage(noResultMessage)
  }

  if(citation === currentCitation){ // ignore outdated results
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
      if(url){
        await browser.downloads.download({
          filename: fileName,
          saveAs: true,
          url: url,
        })
      }
    }
    // No default
  }
}

const onReceiveMessage = (port: Runtime.Port) => (message: Message) => {
  Logger.log(`background received`, message)
  if (message.target === Messenger.TARGETS.popup) {
    return
  } else if (message.target === Messenger.TARGETS.background){
    if (typeof message.action === `string`) {
      Logger.log(`background handling action`, message.action)
      return handleAction(port)(message)
    } else {
      Logger.log(`unknown action`, message.action)
      return
    }
  }
}

const onConnect = (port: Runtime.Port) => {
  port.postMessage({ hello: `world` })
  port.onMessage.addListener(onReceiveMessage(port))
}

const onInstall = (details: Runtime.OnInstalledDetailsType) => {
  if(details?.previousVersion){
    // just an update, do nothing
    return
  }
  // otherwise open the guide
  browser.tabs.create({ url: `guide.html` })
}

const DEBUG_MODE = process?.env?.NODE_ENV === `development`

const init = () => {
  browser.runtime.onInstalled.addListener((): void => {
    Logger.log(`⚖ clerkent installed`)
  })
  browser.runtime.onConnect.addListener(onConnect)

  if(DEBUG_MODE){
    browser.tabs.create({ url: `popup.html` })
  }

  browser.runtime.onInstalled.addListener(onInstall)
}

const BackgroundPage = () => {
  useEffect(() => init(), [])
  return (
    <h1>Background Page</h1>
  )
}

export default BackgroundPage