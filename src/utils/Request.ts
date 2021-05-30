import axios from 'axios'
// import { setupCache } from 'axios-cache-adapter'

// const cache = setupCache({
//   debug: true,
//   exclude: {
//     methods: [],
//     query: false,
//   }, 
//   // a week
//   maxAge: 7 * 24 * 60 * 60 * 1000,
// })

const request = axios.create({
  // adapter: cache.adapter,
  timeout: 10_000,
})

export default request