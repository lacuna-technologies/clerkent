import { browser } from 'webextension-polyfill-ts'

const pageActionCheck = async (tabId, changeInfo, tab) => {
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
    console.log('⚖ clerkent installedzz')
  })
  browser.tabs.onUpdated.addListener(pageActionCheck)
}

init()