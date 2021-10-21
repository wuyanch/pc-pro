import Vue from 'vue'
import { login } from "@/api/login"
import { ACCESS_TOKEN, USER_NAME, USER_INFO, USER_SALENO} from "@/store/mutation-types"

const user = {
  state: {
    token: '',
    username: '',
    realname: '',
    saleno: '',
    welcome: '',
    avatar: '',
    permissionList: [],
    info: {}
  },
 
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { username, realname }) => {
      state.username = username
      state.realname = realname
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_SALENO: (state, saleno) => {
      state.saleno = saleno
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      console.log("I AM COME 1",userInfo)
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          console.log("I AM COME 2")
          console.log(response)
          if(response.code =='200'){
            const result = response.data
            Vue.ls.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_NAME, result.agentName, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_INFO, result.userInfo, 7 * 24 * 60 * 60 * 1000)
            Vue.ls.set(USER_SALENO, result.agentNo, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token) // ------ store.getters.token
            commit('SET_INFO', result.userInfo)
            commit('SET_NAME', { username: result.agentName,realname: result.agentName })
            // commit('SET_AVATAR', userInfo.avatar)
            commit('SET_SALENO', result.agentNo)
            resolve(response)
          }else{
            reject(response)
          }
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user