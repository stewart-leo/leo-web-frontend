import './assets/styles/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import 'primeicons/primeicons.css'

import App from './App.vue'
import router from './router'

import { Form } from '@primevue/forms'

import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import CheckboxGroup from 'primevue/checkboxgroup'
import Fieldset from 'primevue/fieldset'
import FloatLabel from 'primevue/floatlabel'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import MultiSelect from 'primevue/multiselect'
import Panel from 'primevue/panel'
import RadioButton from 'primevue/radiobutton'
import Select from 'primevue/select'
import Textarea from 'primevue/textarea'

import Step from 'primevue/step'
import Stepper from 'primevue/stepper'
import StepList from 'primevue/steplist'
import StepPanel from 'primevue/steppanel'
import StepPanels from 'primevue/steppanels'

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
app.component('PvAutoComplete', AutoComplete)
app.component('PvButton', Button)
app.component('PvCheckbox', Checkbox)
app.component('PvCheckboxGroup', CheckboxGroup)
app.component('PvFieldset', Fieldset)
app.component('PvFloatLabel', FloatLabel)
app.component('PvForm', Form)
app.component('PvInputText', InputText)
app.component('PvInputNumber', InputNumber)
app.component('PvMultiSelect', MultiSelect)
app.component('PvPanel', Panel)
app.component('PvRadioButton', RadioButton)
app.component('PvSelect', Select)
app.component('PvStep', Step)
app.component('PvStepper', Stepper)
app.component('PvStepList', StepList)
app.component('PvStepPanel', StepPanel)
app.component('PvStepPanels', StepPanels)
app.component('PvTextArea', Textarea)

app.mount('#app')
