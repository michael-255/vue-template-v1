import { symRoundedClose } from '@quasar/extras/material-symbols-rounded'
import '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css'
import '@quasar/extras/roboto-font/roboto-font.css'
import { createPinia } from 'pinia'
import { Dialog, Loading, Meta, Notify, Quasar } from 'quasar'
import 'quasar/dist/quasar.css'
import quasarIconSet from 'quasar/icon-set/material-symbols-rounded'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/base.css'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  iconSet: quasarIconSet,
  plugins: {
    Meta,
    Dialog,
    Notify,
    Loading,
  },
  config: {
    dark: true,
    brand: {
      primary: '#1976d2',
      secondary: '#607d8b',
      accent: '#673ab7',
      info: '#0d47a1',
      warning: '#ff6f00',
      negative: '#C10015',
      positive: '#4caf50',
      dark: '#1d1d1d',
      'dark-page': '#121212',
    },
    notify: {
      textColor: 'white',
      position: 'top',
      multiLine: false,
      iconSize: '2rem',
      progress: true,
      actions: [
        {
          icon: symRoundedClose,
          round: true,
          color: 'white',
        },
      ],
    },
    loading: {},
  },
})

app.mount('#app')
