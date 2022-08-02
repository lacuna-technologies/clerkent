import axios from 'axios'
import { buildWebStorage, setupCache } from 'axios-cache-interceptor'
import { browser } from 'webextension-polyfill-ts'

const storage = buildWebStorage(localStorage, `request-cache:`)

// const onBeforeSendHeaders = (details) => {
//   const { requestHeaders } = details
//   const originIndex = requestHeaders.findIndex(header => header.name === `Origin`)
//   if(originIndex === -1){
//     return requestHeaders
//   }
//   const newHeaders = [
//     ...requestHeaders.slice(0, originIndex),
//     ...requestHeaders.slice(originIndex + 1),
//     { name: `Origin`, value: `https://www.lawnet.com` },
//   ]
//   console.log(newHeaders)
//   return newHeaders
// }
// browser.webRequest.onBeforeSendHeaders.addListener(onBeforeSendHeaders, {
//   urls: [`https://api.lawnet.sg/lawnet/search-service/api/lawnetcore/*`],
// }, [`blocking`, `requestHeaders`])

const request = setupCache(
  axios.create({
    timeout: 10_000,
  }),
  {
    interpretHeader: false,
    methods: [`get`, `post`],
    storage,
    ttl: 1000 * 60 * 60, // an hour
  },
)

export default request