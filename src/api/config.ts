import axios, { ResponseType } from 'axios'

import { Tip } from '@/common/tip'
import { errorMessage } from '@/common/message'

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
  timeout: 5000,
  withCredentials: true,
  responseType: 'json'
})
// Request interception unified configuration
service.interceptors.request.use(
  config => {
    // showLoading()
    if (config.url === '/fileUpload/upload') {
      ;(config as any).headers['Content-Type'] = 'multipart/form-data'
    }
    return config
  },
  err => {
    // hideLoading()
    errorMessage(err)
    return Promise.reject(new Error(err))
  }
)
// Unity deconstructs a layer of data here
service.interceptors.response.use(
  data => {
    return data.data
  },
  err => {
    // hideLoading()
    errorMessage(err)
    return Promise.reject(new Error(err))
  }
)

// get method
export function get(url: string, params: any = {}) {
  return new Promise((resolved, rejected) => {
    service
      .get(url, params)
      .then(
        resp => {
          resolved(resp)
        },
        err => {
          errorMessage(Tip.NETWORK_ERROR)
          rejected(err)
        }
      )
      .catch(err => {
        // Pop up error message
        rejected(err)
        errorMessage(Tip.NETWORK_ERROR)
      })
  })
}
// post method
export function post(url: string, data: any = {}, type?: ResponseType) {
  return new Promise((resolved, rejected) => {
    service
      .post(url, data, { responseType: type || 'json' })
      .then(
        resp => {
          resolved(resp)
        },
        err => {
          errorMessage(Tip.NETWORK_ERROR)
          rejected(err)
        }
      )
      .catch(err => {
        // Pop up error message
        errorMessage(Tip.NETWORK_ERROR)
        rejected(err)
      })
  })
}
