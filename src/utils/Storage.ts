import { browser } from 'webextension-polyfill-ts'

const set = (key: string, value: unknown) => browser.storage.local.set({
  [key]: JSON.stringify(value),
})
const get = async (key: string) => {
  const result = await browser.storage.local.get({[key]: null})
  if(result === null){
    return null
  }
  return JSON.parse(result[key])
}

const Storage = { get, set }

export default Storage