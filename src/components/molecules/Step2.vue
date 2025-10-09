<template>
  <PvPanel>
    <div class="form-container">
      <div>
        <PvFloatLabel>
          <PvInputText
            id="title"
            v-model="title"
            :invalid="!!errors.title"
            @blur="validateField('title')"
          />
          <label for="title">Innovation Title</label>
        </PvFloatLabel>
        <small v-if="errors.title" class="error-text">
          {{ errors.title }}
        </small>
      </div>

      <div class="description-field">
        <div class="field-label-with-tooltip">
          <label for="description">Short description of your innovation submission</label>
          <i
            class="pi pi-info-circle info-icon"
            v-tooltip.right="{
              value: descriptionTooltip,
              escape: false,
            }"
          ></i>
        </div>
        <PvTextArea
          id="description"
          v-model="description"
          :autoResize="true"
          rows="3"
          :invalid="!!errors.description"
          @blur="validateField('description')"
        />
        <small v-if="errors.description" class="error-text">
          {{ errors.description }}
        </small>
      </div>

      <div>
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
        <small v-if="errors.selectedChallenges" class="error-text">
          {{ errors.selectedChallenges }}
        </small>
      </div>

      <div>
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
        <small v-if="errors.selectedAvailability" class="error-text">
          {{ errors.selectedAvailability }}
        </small>
      </div>

      <div v-if="selectedAvailability === 270">
        <PvFieldset legend="What is the regional application of this innovation?">
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
        <small v-if="errors.selectedRegions" class="error-text">
          {{ errors.selectedRegions }}
        </small>
      </div>

      <div v-if="selectedAvailability === 271">
        <PvFloatLabel class="w-full md:w-80">
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
            :invalid="!!errors.selectedCountries"
            @blur="validateField('selectedCountries')"
          />
          <label for="countries"
            >Please list specific countries your innovation is applicable</label
          >
        </PvFloatLabel>
        <small v-if="errors.selectedCountries" class="error-text">
          {{ errors.selectedCountries }}
        </small>
      </div>
    </div>
  </PvPanel>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue'
import { useForm, useField } from 'vee-validate'
import { object, string, array, number } from 'yup'
import { useFormStore } from '@/stores/formStore'
import countries from '@/assets/json/countries.json'

const formStore = useFormStore()

const descriptionTooltip = `<div style="line-height: 1.6;">
  <strong>Tip:</strong> Please keep your description short and concise. You may want to consider including the following:
  <ul style="margin-top: 0.5rem;">
    <li><strong>Purpose</strong> – what is the essence of your innovation and its value proposition? What problem does it address? Who is your target audience or market for your innovation?</li>
    <li><strong>Benefits & potential impact</strong> – what makes your solution unique and valuable? What positive outcomes can be expected?</li>
  </ul>
</div>`

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

const availabilityOptions = [
  { value: 269, label: 'Yes, globally available' },
  { value: 270, label: 'Available in select regions' },
  { value: 271, label: 'Not currently available outside specific countries' },
  { value: 272, label: 'Availability unknown' },
]

const regionOptions = [
  { value: 273, label: 'Americas' },
  { value: 274, label: 'APAC' },
  { value: 275, label: 'EMEA' },
  { value: 276, label: 'UK' },
  { value: 277, label: 'Ireland' },
]

const countryOptions = countries.map((country) => ({ name: country.name }))

const { errors, validate, validateField, setFieldError } = useForm({
  initialValues: {
    title: formStore.formData.step2[156] || '',
    description: formStore.formData.step2[157] || '',
    selectedChallenges: formStore.formData.step2[158] || [],
    selectedAvailability: formStore.formData.step2[159] || null,
    selectedRegions: formStore.formData.step2[160] || [],
    selectedCountries: formStore.formData.step2[161] || [],
  },
})

const { value: title } = useField<string>(
  'title',
  string().required('Innovation Title is required').trim(),
)
const { value: description } = useField<string>(
  'description',
  string().required('Description is required').trim(),
)
const { value: selectedChallenges } = useField<number[]>(
  'selectedChallenges',
  array()
    .of(number())
    .min(1, 'Please select at least one challenge')
    .required('Please select at least one challenge'),
)
const { value: selectedAvailability } = useField<number | null>(
  'selectedAvailability',
  number()
    .required('Please select an availability option')
    .typeError('Please select an availability option'),
)
const { value: selectedRegions } = useField<number[]>('selectedRegions')
const { value: selectedCountries } = useField<any[]>('selectedCountries')

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
    formStore.updateStep2(156, title.value)
    formStore.updateStep2(157, description.value)
    formStore.updateStep2(158, selectedChallenges.value)
    formStore.updateStep2(159, selectedAvailability.value)
    formStore.updateStep2(160, selectedRegions.value)
    formStore.updateStep2(161, selectedCountries.value)
  },
  { deep: true },
)

watch(selectedRegions, (newValue) => {
  if (newValue && newValue.length > 0) {
    setFieldError('selectedRegions', undefined)
  }
})

watch(selectedCountries, (newValue) => {
  if (newValue && newValue.length > 0) {
    setFieldError('selectedCountries', undefined)
  }
})

watch(selectedAvailability, (newValue) => {
  if (newValue !== 270) {
    selectedRegions.value = []
    formStore.updateStep2(160, [])
    setFieldError('selectedRegions', undefined)
  }
  if (newValue !== 271) {
    selectedCountries.value = []
    formStore.updateStep2(161, [])
    setFieldError('selectedCountries', undefined)
  }
})

const validateAll = async () => {
  if (selectedAvailability.value === 270) {
    if (!selectedRegions.value || selectedRegions.value.length === 0) {
      setFieldError('selectedRegions', 'Please select at least one region')
      return false
    }
  }

  if (selectedAvailability.value === 271) {
    if (!selectedCountries.value || selectedCountries.value.length === 0) {
      setFieldError('selectedCountries', 'Please select at least one country')
      return false
    }
  }

  const result = await validate()
  return result.valid
}

defineExpose({
  validateAll,
  isValid: async () => {
    const result = await validate()
    return result.valid
  },
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
:deep(.p-autocomplete),
:deep(.p-textarea) {
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

.error-text {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}

:deep(.p-inputtext.p-invalid),
:deep(.p-textarea.p-invalid),
:deep(.p-multiselect.p-invalid) {
  border-color: #dc2626;
}

:deep(.p-inputtext.p-invalid:focus),
:deep(.p-textarea.p-invalid:focus),
:deep(.p-multiselect.p-invalid:focus) {
  border-color: #dc2626;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.2);
}
</style>

<style>
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
