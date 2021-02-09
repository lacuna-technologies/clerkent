import React, { useEffect } from 'react'

import { browser, Tabs } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import Messenger from '../utils/Messenger'
import type { Message } from '../utils/Messenger'
import Scraper from '../utils/scraper'
import Finder from '../utils/Finder'

const pageActionCheck = async (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  console.log(tabId, changeInfo)

  const { url } = tab

  if (/uk\.westlaw\.com/.test(url)) {
    browser.pageAction.show(tabId)
  } else {
    browser.pageAction.hide(tabId)
  }
}

const handleAction = async ({ action, ...otherProperties }) => {
  if (action === Messenger.ACTION_TYPES.downloadSelection) {
    const { selection } = otherProperties

    const citations = Finder.findSGCase(selection)

    return null

  } else if (action === Messenger.ACTION_TYPES.test) {
    const result = await Scraper.SG.getPDF(`[2016] SGHC 77`)
    console.log(result)
    // await browser.downloads.download({
    //   conflictAction: `prompt`,
    //   filename: `${result.name} ${result.citation}.pdf`,
    //   url: result.link,
    // })
  } else if (action === Messenger.ACTION_TYPES.viewCitation) {}
}

const onReceiveMessage = (message: Message) => {
  if (message.target === Messenger.TARGETS.popup) {} else if (typeof message.action === `string`) {
    return handleAction(message)
  }
  console.log(`background received`, message)
}

const onConnect = (port: Runtime.Port) => {
  port.postMessage({ hello: `world` })
  port.onMessage.addListener(onReceiveMessage)
}

const init = () => {
  browser.runtime.onInstalled.addListener((): void => {
    console.log(`⚖ clerkent installedzz`)
  })
  browser.runtime.onConnect.addListener(onConnect)
  browser.tabs.onUpdated.addListener(pageActionCheck)
}

const BackgroundPage = () => {
  useEffect(() => init(), [])
  return (
    <h1>Background Page</h1>
  )
}

export default BackgroundPage