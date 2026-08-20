import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initLayoutMode } from './composables/useLayoutMode'

initLayoutMode()
createApp(App).use(router).mount('#app')
