import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const apiKey = document.getElementById('api-key')
window.electronAPI.onSetApiKey((value:string) => {
  apiKey.innerText = value;
})

createApp(App).mount('#app')
