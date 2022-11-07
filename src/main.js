import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import "bootstrap/dist/css/bootstrap.min.css"; //удалить перед сборкой
import "primevue/resources/themes/bootstrap4-light-blue/theme.css"
import "primevue/resources/primevue.min.css"

createApp(App)
    .mount('#app')
    .use(PrimeVue)
