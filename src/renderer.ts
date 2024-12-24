import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const apiKey = document.getElementById('api-key')
window.electronAPI.onSetApiKey((value:string) => {
  console.log("### Renderer received call to setApiKey()");
  apiKey.innerText = value;
})

// FontAwesome nonsense
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { faGlobe, faCirclePlay, faSpinner } from '@fortawesome/free-solid-svg-icons'
// import {  } from '@fortawesome/free-brands-svg-icons' // we'll want these eventually, I'm sure.
library.add(faCircleQuestion, faGlobe, faCirclePlay, faSpinner);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
