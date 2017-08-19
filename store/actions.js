import Services from './Services'

export default {
  getWechatSignature ({commit}, url) {
    return Services.getWechatSignature(url)
  },

  getUserByOAuth ({commit}, url) {
    return Services.getUserByOAuth(url)
  },

  async fetchHouse ({state}) {
    const res = await Services.fetchHouses()
    state.houses = res.data.data

    return res
  },

  async fetchCities ({state}) {
    const res = await Services.fetchHouses()
    state.cities = res.data.data

    return res
  },

  async fetchCharacters ({state}) {
    const res = await Services.fetchCharacters()
    state.characters = res.data.data

    return res
  },

  async fetchHouses ({state}, _id) {
    if (_id === state.currentHouse._id) return
    const res = await Services.fetchHouse(_id)
    state.currentHouse = res.data.data

    return res
  },
}
