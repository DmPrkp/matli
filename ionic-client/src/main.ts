import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import { createPinia } from 'pinia'
const pinia = createPinia()

import { IonicVue } from '@ionic/vue';
import i18n from './plugins/i18n'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import BaseModel from './models/BaseModel';
BaseModel.setBaseUrl()

const app = createApp(App)
  .use(IonicVue)
  .use(pinia)
  .use(i18n)
  .use(router);
  
router.isReady().then(() => {
  app.mount('#app');
});