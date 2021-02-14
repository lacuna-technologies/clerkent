import React, { useEffect } from 'react'

import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import Messenger from '../utils/Messenger'
import Finder from '../utils/Finder'
import type { Message } from '../utils/Messenger'
import Scraper from '../utils/scraper'

const handleAction = (port: Runtime.Port) => async ({ action, ...otherProperties }) => {
  if (action === Messenger.ACTION_TYPES.viewCitation) {
    const { citation } = otherProperties
    const [targetCase] = Finder.findCase(citation)
    const result = await Scraper.getCase(targetCase)

    console.log(`sending viewCitation`, {
      action: Messenger.ACTION_TYPES.viewCitation,
      data: result,
      target: Messenger.TARGETS.contentScript,
    })

    port.postMessage({
      action: Messenger.ACTION_TYPES.viewCitation,
      data: result,
      target: Messenger.TARGETS.contentScript,
    })
  } else if (action === Messenger.ACTION_TYPES.downloadFile){
    const { filename, url } = otherProperties
    await browser.downloads.download({
      conflictAction: `overwrite`,
      filename,
      url,
    })
  } else if (action === Messenger.ACTION_TYPES.test){
    console.log(`test action received by bg`)
    const result = await Scraper.EW.getCase(`[2020] UKSC 1`)
    console.log(result)
  }
}

const onReceiveMessage = (port: Runtime.Port) => (message: Message) => {
  console.log(`background received`, message)
  if (message.target === Messenger.TARGETS.popup) {
    return
  } else if (message.target === Messenger.TARGETS.background){
    if (typeof message.action === `string`) {
      console.log(`background handling action`, message.action)
      return handleAction(port)(message)
    } else {
      console.log(`unknown action`, message.action)
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
    console.log(`⚖ clerkent installed`)
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