import React, { useEffect } from 'react'

import { browser } from 'webextension-polyfill-ts'
import type { Runtime } from 'webextension-polyfill-ts'
import Messenger from '../utils/Messenger'
import type { Message } from '../utils/Messenger'
import Scraper from '../utils/scraper'

const handleAction = (port: Runtime.Port) => async ({ action, ...otherProperties }) => {
  if (action === Messenger.ACTION_TYPES.viewCitation) {
    console.log(`background handling viewCitation`)
    const { citation } = otherProperties
    const result = await Scraper.SG.getPDF(citation)

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
  console.log(`new port`, port)
  port.postMessage({ hello: `world` })
  port.onMessage.addListener(onReceiveMessage(port))
}

const init = () => {
  browser.runtime.onInstalled.addListener((): void => {
    console.log(`⚖ clerkent installedzz`)
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