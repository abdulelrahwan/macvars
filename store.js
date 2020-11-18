/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: process.browser && localStorage.getItem('auth') || '',
    user : {},
    comment: {}
  },
  mutations: {
    auth_success(state, auth){
      state.auth = auth
      state.user = auth.user
    },
    logout(state){
      state.auth = ''
      state.user = ''
    },
    changeComment(state, comment){
      state.comment = comment
    }
  },
  actions: {
    ChangeComment({commit}, comment){
      commit('changeComment', comment)
    }
  },
  getters : {
    getComment: state => state.comment,
    userRole: state=>{
        if(state.auth == ''){
            return null
        }
        if(state.auth.user.permissions === 0){
            return "user"
        }
        if(state.auth.user.permissions[0] === "admin"){
            return "admin"
        }
    }
  }
})