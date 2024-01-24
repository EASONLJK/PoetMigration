import { createApp, defineAsyncComponent, Plugin} from 'vue'
import App from './App.vue'
import elmentUI from 'element-plus'
import 'element-plus/dist/index.css'
import store  from './store'
import mitt from 'mitt'

const app = createApp(App)
    .use(elmentUI)
    .use(store)
    // .component('VueLineup', defineAsyncComponent(() => import('vue-lineup')))
    .provide('bus', mitt())
    .mount('#app')