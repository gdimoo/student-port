import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as VueGoogleMaps from 'vue2-google-maps'
Vue.config.productionTip = false

import Vuetify from 'vuetify'
Vue.use(Vuetify)

import Axios from 'axios'

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
// Now, when we want to use axios inside our component, 
// we can do this.$http and it will be like calling axios directly. 
// We also set the Authorization on axios header to our token, so our requests can be processed if a token is required. This way, we do not have to set token anytime we want to make a request.
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyD9HLBChmNYpha_zVIiP1zVmohAhxK3z-E',
    libraries: 'places',
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
