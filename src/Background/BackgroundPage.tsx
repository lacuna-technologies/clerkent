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
import type Law from '../types/Law'

let currentCitation = null

const getScraperResult = (targets: FinderResult[], mode: boolean) => {
  if(mode === true){
    return Scraper.getLegislation(targets[0] as LegislationFinderResult)
  }
  if(mode === false){
    const { type } = targets[0]
    switch (type) {
      case `case-citation`: {
        return Scraper.getCase(targets[0] as CaseCitationFinderResult)
      }
      case `case-name`: {
        return Scraper.getCaseByName(targets[0] as CaseNameFinderResult)
      }
    }
  }
  return Promise.resolve(false)
}

const handleAction = (port: Runtime.Port) => async ({ action, ...otherProperties }) => {
  switch (action) {
  case Messenger.ACTION_TYPES.viewCitation: {
    const { citation, source, mode } = otherProperties
    currentCitation = citation

    const targets = mode === true ? Finder.findLegislation(citation) : Finder.findCase(citation)

    const noResultMessage = {
      action: Messenger.ACTION_TYPES.viewCitation,
      data: false,
      source: Messenger.TARGETS.background,
      target: source,
    }
    if(targets.length === 0){
      return port.postMessage(noResultMessage)
    }
    
    const result = await getScraperResult(targets, mode)
    Logger.log(`BackgroundPage scraper result`, result)

    if(result === false){
      return port.postMessage(noResultMessage)
    }

    if(citation === currentCitation){ // ignore outdated results
      const data = Array.isArray(result)
        ? result.map(r => ({...targets[0], ...r}))
        : [{...targets[0], ...(result as  Law.Case | Law.Case[] | Law.Legislation[])}]

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
  case Messenger.ACTION_TYPES.test: {
    Logger.log(`test action received by bg`)
    const result = await Scraper.UK.getCase(`[2020] UKSC 1`, ``)
    Logger.log(result)
  
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