import { browser } from 'webextension-polyfill-ts'
import Logger from './Logger'

const set = (key: string, value: unknown, noJSON: boolean = false) => {
  Logger.log(`Storage storing`, key, value)
  if(noJSON){
    return browser.storage.local.set({
      [key]: value,
    })
  }
  return browser.storage.local.set({
    [key]: JSON.stringify(value),
  })
}
const get = async (key: string, noJSON: boolean = false) => {
  const result = await browser.storage.local.get({[key]: null})
  if(result === null){
    return null
  }
  Logger.log(`Storage retrieving`, key, result[key])
  if(noJSON){
    return result[key]
  }
  return JSON.parse(result[key])
}

const clear = () => browser.storage.local.clear()

const remove = (key: string) => browser.storage.local.remove(key)

const Storage = {
  clear,
  get,
  remove,
  set,
}

export default Storage