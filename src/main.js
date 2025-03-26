   
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Sortable from 'vue-sortable';
const api2 = axios.create({
  baseURL: 'http://120.26.211.53:8089' // 设置URL前缀
})

//elementui引入
import ElementPlus from 'element-plus';
import "element-plus/theme-chalk/index.css"
import axios from 'axios'
axios.defaults.baseURL = 'http://120.26.211.53:8090'
axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf-8';
  return config;
}, error => {
  Promise.reject(config)
})
const app = createApp(App)
app.config.globalProperties.$http2 = api2
app.config.globalProperties.$http=axios

app.use(ElementPlus)
app.use(router)


app.use(Sortable);
app.mount('#app')
 