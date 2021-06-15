import { browser } from "webextension-polyfill-ts"
import Memoize from 'memoizee'

const getExtensionLink = Memoize(
  (string = ``) => browser.runtime.getURL(string),
)
const isFirefox = () => getExtensionLink().startsWith(`moz-extension://`)
const isChrome = () => getExtensionLink().startsWith(`chrome-extension://`)

const Browser = {
  getExtensionLink,
  isChrome,
  isFirefox,
}

export default Browser
