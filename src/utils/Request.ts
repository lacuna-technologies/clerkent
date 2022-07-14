import axios from 'axios'

const request = axios.create({
  timeout: 10_000,
})

export default request