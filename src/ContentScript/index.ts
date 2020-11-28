import { browser } from 'webextension-polyfill-ts'

const pageActionCheck = (tabId, changeInfo, tab) => {
  console.log(tabId, changeInfo)

  if (![`undefined`, `null`].includes(typeof tab)) {
    if (/uk\.westlaw\.com/.test(tab.url)) {
      browser.pageAction.show(tabId)
    }
  }
  browser.pageAction.hide(tabId)
}

const init = () => {
  console.log('helloworld from content script zzz')
  browser.tabs.onUpdated.addListener(pageActionCheck)
}

init()