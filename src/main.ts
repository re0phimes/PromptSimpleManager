import { createApp } from 'vue'
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './index.css'
import './style.css'
import App from './App.vue'


const pinia = createPinia();
const app = createApp(App);
app.use(ElementPlus);
app.use(pinia);
app.mount('#app');
