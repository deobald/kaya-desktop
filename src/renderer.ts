import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const apiKey = document.getElementById('api-key')
window.electronAPI.onSetApiKey((value:string) => {
  console.log("### Renderer received call to setApiKey()");
  apiKey.innerText = value;
})

createApp(App).mount('#app')
