import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import { Form } from '@primevue/forms'

import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanels from 'primevue/steppanels'
import Step from 'primevue/step'
import StepPanel from 'primevue/steppanel'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.dark-mode',
    },
  },
})

// We prepend the component names with Pv to avoid name conflicts
// with other libraries or custom components.
app.component('PvForm', Form)
app.component('PvButton', Button)
app.component('PvInputText', InputText)
app.component('PvInputNumber', InputNumber)
app.component('PvStepper', Stepper)
app.component('PvStepList', StepList)
app.component('PvStepPanels', StepPanels)
app.component('PvStepPanel', StepPanel)
app.component('PvStep', Step)

app.mount('#app')
