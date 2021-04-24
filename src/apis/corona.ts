import axios from 'axios'

const API = axios.create({
  baseURL: `https://example.com`,
})

export default API
