import Vuex from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const createStore = () => new Vuex.Store({
  state: {
    currentCharacter: {},
    currentHouse: {},
    currentProduct: {},
    house: [],
    cities: [],
    products: [],
    characters: [],
  },
  getters,
  actions,
  mutations,
})

export default createStore
