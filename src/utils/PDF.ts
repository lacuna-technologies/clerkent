import { browser } from "webextension-polyfill-ts"
import Browser from './Browser'

const saveFirefox = (filename: string) => browser.tabs.saveAsPDF({
  footerLeft: ``,
  footerRight: ``,
  headerLeft: ``,
  headerRight: ``,
  toFileName: filename,
})

const save = async ({
  url,
  code,
  fileName,
}) => {
  const isFirefox = Browser.isFirefox()
  const isChrome = Browser.isChrome()

  const tab = await browser.tabs.create({ url: url })
  await browser.tabs.executeScript(tab.id, {
    code: code +`document.title=\`${fileName}\`; ${
      isChrome ? `window.setTimeout(() => window.print(), 0);` : ``
    }`,
  })

  if(isFirefox){
    await saveFirefox(fileName)
    await browser.tabs.remove(tab.id)
  }
  // if(isChrome){
  //   await saveChrome()
  // }
}

const PDF = {
  save,
}

export default PDF