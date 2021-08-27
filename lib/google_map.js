import axios from 'axios'
import config from 'watchout-common-functions/config/config'
import qs from 'query-string'

export const geocodeInstance = axios.create({
  baseURL: config.googleMapBaseURL,
  headers: {}
})

export function getGeocoding(address) {
  let params = {
    address: address,
    key: config.geocodingApiKey,
    language: 'zh-TW'
  }
  let url = `/geocode/json?${qs.stringify(params)}`
  return geocodeInstance.get(url)
}
