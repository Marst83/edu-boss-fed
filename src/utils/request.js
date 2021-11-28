import axios from 'axios'

const request = axios.create({})

// request.interceptors.request.use((config) => {
//   config.baseURL = config.url.startsWith('/boss')
//     ? 'http://eduboss.lagou.com'
//     : 'http://edufront.lagou.com'
// })

export default request
