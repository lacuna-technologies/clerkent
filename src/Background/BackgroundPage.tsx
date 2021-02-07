import React, { useEffect } from 'react'

import { browser, Tabs } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'

const pageActionCheck = async (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  console.log(tabId, changeInfo)

  const { url } = tab

  if (/uk\.westlaw\.com/.test(url)) {
    browser.pageAction.show(tabId)
  } else {
    browser.pageAction.hide(tabId)
  }
}

const onReceiveMessage = (message: unknown) => {
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