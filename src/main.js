import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Storage from 'vue-ls'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { VueAxios } from "@/utils/request"
import store from './store/'
import qs from 'qs'

// vue-ls的配置
const storageOptions = {
  namespace: 'pcIngenuity__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
}
import {
  ACCESS_TOKEN
} from "@/store/mutation-types"

Vue.use(ElementUI)
Vue.use(Storage, storageOptions)
Vue.use(VueAxios, router)

Vue.config.productionTip = false
Vue.prototype.$qs = qs

new Vue({
  router,
  store,
  mounted () {
    store.commit('SET_TOKEN', Vue.ls.get(ACCESS_TOKEN))
  },
  render: h => h(App)
}).$mount('#app')
