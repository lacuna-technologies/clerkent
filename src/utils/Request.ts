import axios from 'axios'
// import { setupCache } from 'axios-cache-adapter'

// const cache = setupCache({
//   exclude: { query: false },
//   maxAge: 15 * 60 * 1000,
// })

const request = axios.create({
  // adapter: cache.adapter,
})

export default request