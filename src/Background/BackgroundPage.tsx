import React, { useEffect } from 'react'

import { browser, Tabs } from 'webextension-polyfill-ts'

const pageActionCheck = async (tabId: number, changeInfo: Tabs.OnUpdatedChangeInfoType, tab: Tabs.Tab) => {
  console.log(tabId, changeInfo)

  const { url } = tab

  if (/uk\.westlaw\.com/.test(url)) {
    browser.pageAction.show(tabId)
  } else {
    browser.pageAction.hide(tabId)
  }
}

const init = () => {
  browser.runtime.onInstalled.addListener((): void => {
    console.log(`⚖ clerkent installedzz`)
  })
  browser.tabs.onUpdated.addListener(pageActionCheck)
}

const BackgroundPage = () => {
  useEffect(() => init(), [])
  return (
    <h1>Background Page</h1>
  )
}

export default BackgroundPage