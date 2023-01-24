import axios from 'axios'
import { buildWebStorage, setupCache } from 'axios-cache-interceptor'

const storage = buildWebStorage(localStorage, `request-cache:`)

const request = setupCache(
  axios.create({
    timeout: 10_000,
  }),
  {
    methods: [`get`, `post`],
    storage,
    ttl: 1000 * 60 * 60, // an hour
  },
)

export default request