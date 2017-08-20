import axios from 'axios'

const baseUrl = ''
const apiUrl = 'http://rap.taobao.org/mockjsdata/21639'

class Services {
  getWechatSignature (url) {
    return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
  }

  getUserByOAuth (url) {
    return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
  }

  fetchHouses () {
    return axios.get(`${apiUrl}/wiki/houses`)
  }

  fetchHouse (id) {
    return axios.get(`${apiUrl}/wiki/houses/${id}`)
  }

  fetchCities () {
    return axios.get(`${apiUrl}/wiki/cities`)
  }

  fetchCharacters () {
    return axios.get(`${apiUrl}/wiki/characters`)
  }

  fetchCharacter (id) {
    return axios.get(`${apiUrl}/wiki/characters/${id}`)
  }

  fetchProducts () {
    return axios.get(`${apiUrl}/wiki/products`)
  }

  fetchProduct (id) {
    return axios.get(`${apiUrl}/wiki/products/${id}`)
  }

  fetchUserAndOrders () {
    return axios.get(`${apiUrl}/wiki/user`)
  }
}

export default new Services()
