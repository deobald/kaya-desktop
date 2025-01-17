import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

const homeDir = document.getElementById('home-dir')
window.electronAPI.onSetHomeDir((value:string) => {
  console.log("### Renderer received call to setHomeDir()");
  homeDir.innerText = value;
});

const apiKey = document.getElementById('api-key')
window.electronAPI.onSetApiKey((value:string) => {
  console.log("### Renderer received call to setApiKey()");
  apiKey.innerText = value;
});

// FontAwesome nonsense
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-regular-svg-icons'
import { faGlobe, faCirclePlay, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faJediOrder, faGalacticSenate, faGalacticRepublic, faFulcrum, faFirstOrder, 
         faConnectdevelop, faCanadianMapleLeaf, faDiaspora } from '@fortawesome/free-brands-svg-icons'
library.add(faCircleQuestion, faGlobe, faCirclePlay, faSpinner, 
  faJediOrder, faGalacticSenate, faGalacticRepublic, faFulcrum, faFirstOrder, 
  faConnectdevelop, faCanadianMapleLeaf, faDiaspora);

createApp(App)
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app')
