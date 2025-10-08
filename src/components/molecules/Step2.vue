<template>
  <PvPanel>
    <div class="form-container">
      <PvFloatLabel>
        <PvInputText id="title" v-model="title" />
        <label for="title">Innovation Title</label>
      </PvFloatLabel>
      <div class="description-field">
        <div class="field-label-with-tooltip">
          <label for="descripton">Short description of your innovation submission</label>
          <i
            class="pi pi-info-circle info-icon"
            v-tooltip.right="{
              value: descriptionTooltip,
              escape: false,
            }"
          ></i>
        </div>
        <PvTextArea id="descripton" v-model="description" :autoResize="true" rows="3" />
      </div>

      <PvFieldset legend="What client challenge is your innovation solving?">
        <div
          v-for="challenge of challenges"
          :key="challenge.id"
          class="flex align-items-center challenge-item"
        >
          <PvCheckbox
            v-model="selectedChallenges"
            :inputId="challenge.id"
            name="challenge"
            :value="challenge.value"
          />
          <label :for="challenge.id" class="ml-2 challenge-label">
            {{ challenge.label }}
            <i
              class="pi pi-info-circle info-icon"
              v-tooltip.right="{
                value: challenge.tooltip,
                escape: false,
              }"
            ></i>
          </label>
        </div>
      </PvFieldset>

      <PvFieldset legend="Is the proposed solution available in multiple countries?">
        <div
          v-for="option of availabilityOptions"
          :key="option.value"
          class="flex align-items-center"
        >
          <PvRadioButton
            v-model="selectedAvailability"
            :inputId="`availability_${option.value}`"
            name="availability"
            :value="option.value"
          />
          <label :for="`availability_${option.value}`" class="ml-2">{{ option.label }}</label>
        </div>
      </PvFieldset>

      <PvFieldset
        v-if="selectedAvailability === 270"
        legend="What is the regional application of this innovation?"
      >
        <div v-for="region of regionOptions" :key="region.value" class="flex align-items-center">
          <PvCheckbox
            v-model="selectedRegions"
            :inputId="`region_${region.value}`"
            name="region"
            :value="region.value"
          />
          <label :for="`region_${region.value}`" class="ml-2">{{ region.label }}</label>
        </div>
      </PvFieldset>

      <PvFloatLabel v-if="selectedAvailability === 271" class="w-full md:w-80">
        <PvMultiSelect
          id="countries"
          v-model="selectedCountries"
          :options="countryOptions"
          display="chip"
          optionLabel="name"
          filter
          :maxSelectedLabels="5"
          :selectionLimit="5"
          class="w-full"
        />
        <label for="countries">Please list specific countries your innovation is applicable</label>
      </PvFloatLabel>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useFormStore } from '@/stores/formStore'
import countries from '@/assets/json/countries.json'

const formStore = useFormStore()

// Form fields
const title = ref('')
const description = ref('')
const selectedChallenges = ref([])
const selectedAvailability = ref(null)
const selectedRegions = ref([])
const selectedCountries = ref([])

const descriptionTooltip = `<div style="line-height: 1.6;">
  <strong>Tip:</strong> Please keep your description short and concise. You may want to consider including the following:
  <ul style="margin-top: 0.5rem;">
    <li><strong>Purpose</strong> – what is the essence of your innovation and its value proposition? What problem does it address? Who is your target audience or market for your innovation?</li>
    <li><strong>Benefits & potential impact</strong> – what makes your solution unique and valuable? What positive outcomes can be expected?</li>
  </ul>
</div>`

// Map challenges to answer_id from API (question_id: 158)
const challenges = [
  {
    id: 'smart-fm-ai',
    value: 265,
    label: 'Smart FM & AI driven Solutions',
    tooltip: `<ul>
      <li>Increased efficiencies and operational reliability</li>
      <li>Reduced costs</li>
      <li>Connected buildings</li>
      <li>IoT, AI and advanced analytics</li>
      <li>Predictive maintenance</li>
      <li>Automated service delivery</li>
      <li>Intelligent building management systems</li>
    </ul>`,
  },
  {
    id: 'sustainable-solutions',
    value: 264,
    label: 'Sustainable Solutions',
    tooltip: `<ul>
      <li>Carbon/ energy reduction</li>
      <li>Support to clients on their journey to net zero</li>
      <li>Social value</li>
      <li>Environmental impact</li>
      <li>Waste reduction/ circular economy practices</li>
      <li>Sustainable & ethical sourcing</li>
    </ul>`,
  },
  {
    id: 'workplace-experience',
    value: 267,
    label: 'Workplace Experience Enhancements',
    tooltip: `<ul>
      <li>Employee wellbeing</li>
      <li>Improved customer satisfaction</li>
      <li>Enhance service personalisation</li>
      <li>Technology enabled feedback loops</li>
      <li>Support to attract and retain staff</li>
      <li>Encouragement to attend the office environment</li>
      <li>Digitisation of the workplace</li>
      <li>Streamlining of the human experience at work</li>
    </ul>`,
  },
  {
    id: 'operational-efficiencies',
    value: 268,
    label: 'Operational Efficiencies',
    tooltip: `<ul>
      <li>Operational efficiencies (i.e. reducing maintenance costs/ frequency of visits)</li>
      <li>Process optimisation</li>
      <li>Integrated service models</li>
      <li>Flexible staffing and resource sharing</li>
      <li>Real-time performance dashboards</li>
    </ul>`,
  },
  {
    id: 'soft-services',
    value: 266,
    label: 'Soft Services Innovation',
    tooltip: `<ul>
      <li>Robotics and automation</li>
      <li>Eco-friendly consumables</li>
      <li>Smart scheduling and workforce management</li>
    </ul>`,
  },
]

// Map availability options to answer_id from API (question_id: 159)
const availabilityOptions = [
  { value: 269, label: 'Yes, globally available' },
  { value: 270, label: 'Available in select regions' },
  { value: 271, label: 'Not currently available outside specific countries' },
  { value: 272, label: 'Availability unknown' },
]

// Map regions to answer_id from API (question_id: 160)
const regionOptions = [
  { value: 273, label: 'Americas' },
  { value: 274, label: 'APAC' },
  { value: 275, label: 'EMEA' },
  { value: 276, label: 'UK' },
  { value: 277, label: 'Ireland' },
]

// Country options for MultiSelect
const countryOptions = countries.map((country) => ({ name: country.name }))

// Load saved data from store on mount
onMounted(() => {
  title.value = formStore.formData.step2[156] || ''
  description.value = formStore.formData.step2[157] || ''
  selectedChallenges.value = formStore.formData.step2[158] || []
  selectedAvailability.value = formStore.formData.step2[159] || null
  selectedRegions.value = formStore.formData.step2[160] || []
  selectedCountries.value = formStore.formData.step2[161] || []
})

// Watch and save to store
watch(
  [
    title,
    description,
    selectedChallenges,
    selectedAvailability,
    selectedRegions,
    selectedCountries,
  ],
  () => {
    formStore.updateStep2(156, title.value) // Innovation title
    formStore.updateStep2(157, description.value) // Short description
    formStore.updateStep2(158, selectedChallenges.value) // Client challenge (checkbox - array)
    formStore.updateStep2(159, selectedAvailability.value) // Multiple countries (radio - single value)
    formStore.updateStep2(160, selectedRegions.value) // Regional application (checkbox - array)
    formStore.updateStep2(161, selectedCountries.value) // Specific countries (multiselect - array)
  },
  { deep: true },
)

// Clear dependent fields when availability changes
watch(selectedAvailability, (newValue) => {
  if (newValue !== 270) {
    selectedRegions.value = []
    formStore.updateStep2(160, [])
  }
  if (newValue !== 271) {
    selectedCountries.value = []
    formStore.updateStep2(161, [])
  }
})
</script>

<style scoped>
.p-panel {
  border: 2px solid #e2e8f0;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}
:deep(.p-inputtext),
:deep(.p-autocomplete) {
  width: 100%;
}
.p-checkbox,
.p-radiobutton {
  width: 2rem;
  height: 1.5rem;
}
.p-fieldset {
  border-color: #cbd5e1;
  margin-top: -1rem;
}
.p-multiselect {
  width: 100%;
}
:deep(.p-fieldset-legend-label) {
  font-weight: unset;
}
.challenge-item {
  margin-bottom: 0.75rem;
  gap: 0.5rem;
}
.description-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.field-label-with-tooltip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.field-label-with-tooltip label {
  font-weight: unset;
  color: unset;
}
.info-icon {
  color: #6b7280;
  font-size: 0.875rem;
  cursor: help;
  transition: color 0.2s;
  margin-left: 0.25rem;
}
.info-icon:hover {
  color: #10b981;
}
</style>

<style>
/* Global styles for PrimeVue tooltips - must be unscoped */
.p-tooltip {
  max-width: 20rem !important;
  min-width: 20rem !important;
}

.p-tooltip .p-tooltip-text {
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: normal !important;
  background-color: #538184 !important;
}

.p-tooltip ul {
  margin: 0;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.p-tooltip li {
  margin-bottom: 0;
}
</style>
