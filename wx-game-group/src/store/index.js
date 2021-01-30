import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import game from './store.js'
export default new Vuex.Store({
  modules: {
    game
  }
})
