import React, { useEffect } from 'react'

import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import Messenger from '../utils/Messenger'
import Finder from '../utils/Finder'
import type { Message } from '../utils/Messenger'
import Scraper from '../utils/scraper'
import Logger from '../utils/Logger'
import type {
  CaseCitationFinderResult,
  CaseNameFinderResult,
  LegislationFinderResult,
  FinderResult,
} from '../utils/Finder'
import Law from '../types/Law'

let currentCitation = null

const getScraperResult = (
  targets: FinderResult[],
  mode: Law.SearchMode,
  jurisdiction: Law.JursidictionCode,
): Promise<Law.Legislation[] | Law.Case[]> => {
  if(mode === `legislation`){
    return Scraper.getLegislation(targets[0] as LegislationFinderResult)
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

const handleAction = (port: Runtime.Port) => async ({ action, ...otherProperties }) => {
  switch (action) {
  case Messenger.ACTION_TYPES.viewCitation: {
    const { citation, source, mode, jurisdiction } = otherProperties
    currentCitation = citation

    const targets = mode === `legislation` ? Finder.findLegislation(citation) : Finder.findCase(citation)

    const noResultMessage = {
      action: Messenger.ACTION_TYPES.viewCitation,
      data: false,
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
      const data = result.map(r => ({...targets[0], ...r}))

      const message = {
        action: Messenger.ACTION_TYPES.viewCitation,
        data,
        source: Messenger.TARGETS.background,
        target: source,
      }
      Logger.log(`sending viewCitation`, message)
      port.postMessage(message)
    }
  break
  }
  case Messenger.ACTION_TYPES.downloadFile: {
    const { filename, url } = otherProperties
    await browser.downloads.download({
      conflictAction: `overwrite`,
      filename,
      url,
    })
  
  break
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

const init = () => {
  browser.tabs.create({url: `popup.html`})
  browser.runtime.onInstalled.addListener((): void => {
    Logger.log(`⚖ clerkent installed`)
  })
  browser.runtime.onConnect.addListener(onConnect)
}

const BackgroundPage = () => {
  useEffect(() => init(), [])
  return (
    <h1>Background Page</h1>
  )
}

export default BackgroundPage