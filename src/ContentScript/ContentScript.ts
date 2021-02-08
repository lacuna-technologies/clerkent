
import { browser } from 'webextension-polyfill-ts'


const init = (() => {
  console.log(`helloworld from content script`)

  const port = browser.runtime.connect(``, { name: `contentscript-port` })

  const onMessage = (message: unknown) => {
    console.log(`content script received:`, message)
  }
  port.onMessage.addListener(onMessage)

})()

export default init