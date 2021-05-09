import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { LoaderPlugin } from 'vue-google-login';

Vue.config.productionTip = false

import Axios from 'axios'

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token')
if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}
// Now, when we want to use axios inside our component, 
// we can do this.$http and it will be like calling axios directly. 
// We also set the Authorization on axios header to our token, so our requests can be processed if a token is required. This way, we do not have to set token anytime we want to make a request.

Vue.use(LoaderPlugin, {
  client_id: "624928619172-6cq2g8hagvcaa5cmrql2jegiqe9ref1q.apps.googleusercontent.com"
});
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.GoogleAuth.then(auth2 => {
Vue.prototype.auth2 = auth2;
})