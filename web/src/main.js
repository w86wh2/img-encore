import Vue from 'vue'
import ElementUI from 'element-ui'
import VueCropper from 'vue-cropper'
import App from './App.vue'


import 'element-ui/lib/theme-chalk/index.css'


Vue.use(ElementUI)
Vue.use(VueCropper)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
