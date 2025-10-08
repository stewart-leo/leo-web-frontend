<template>
  <PvPanel>
    <div class="form-container">
      <!-- Name Field -->
      <PvFloatLabel>
        <PvInputText id="name" v-model="formValues.name" :invalid="!!errors.name" />
        <label for="name">Name</label>
      </PvFloatLabel>
      <PvMessage v-if="errors.name" severity="error" size="small">
        {{ errors.name }}
      </PvMessage>

      <!-- Company Name Field -->
      <PvFloatLabel>
        <PvInputText
          id="companyName"
          v-model="formValues.companyName"
          :invalid="!!errors.companyName"
        />
        <label for="companyName">Company Name</label>
      </PvFloatLabel>
      <PvMessage v-if="errors.companyName" severity="error" size="small">
        {{ errors.companyName }}
      </PvMessage>

      <!-- Country Field -->
      <PvFloatLabel>
        <PvSelect
          id="selectedCountry"
          v-model="formValues.selectedCountry"
          :options="countries"
          optionLabel="name"
          filter
          :invalid="!!errors.selectedCountry"
          class="w-full"
        />
        <label for="country">Select a Country</label>
      </PvFloatLabel>
      <PvMessage v-if="errors.selectedCountry" severity="error" size="small">
        {{ errors.selectedCountry }}
      </PvMessage>
    </div>
  </PvPanel>
</template>

<script setup>
import { watch, reactive } from 'vue'
import { useFormStore } from '@/stores/formStore'
import * as yup from 'yup'
import countries from '@/assets/json/countries.json'

const formStore = useFormStore()

// Yup validation schema
const schema = yup.object({
  name: yup.string().required('Name is required').trim(),
  companyName: yup.string().required('Company Name is required').trim(),
  selectedCountry: yup
    .object()
    .shape({
      id: yup.number().required(),
      name: yup.string().required(),
    })
    .nullable()
    .required('Country is required')
    .typeError('Country is required'),
})

// Form values
const formValues = reactive({
  name: formStore.formData.step1.name || '',
  companyName: formStore.formData.step1.companyName || '',
  selectedCountry: formStore.formData.step1.selectedCountry || null,
})

// Error messages
const errors = reactive({
  name: '',
  companyName: '',
  selectedCountry: '',
})

// Validate all fields - called by Stepper before proceeding
const validateAll = async () => {
  try {
    await schema.validate(formValues, { abortEarly: false })
    // Clear all errors
    errors.name = ''
    errors.companyName = ''
    errors.selectedCountry = ''
    return true
  } catch (err) {
    // Set all errors
    errors.name = ''
    errors.companyName = ''
    errors.selectedCountry = ''

    err.inner.forEach((error) => {
      errors[error.path] = error.message
    })
    return false
  }
}

// Check if form is valid (for store)
const checkValidity = async () => {
  try {
    await schema.validate(formValues, { abortEarly: false })
    return true
  } catch {
    return false
  }
}

// Watch for changes and update store
watch(
  formValues,
  async (newValues) => {
    // Update store with form values
    formStore.updateStep1({
      name: newValues.name,
      companyName: newValues.companyName,
      selectedCountry: newValues.selectedCountry,
    })

    // Update validation status silently (no error display)
    const isValid = await checkValidity()
    formStore.updateStep1Validation(isValid)
  },
  { deep: true },
)

// Expose validation methods for Stepper
defineExpose({
  validateAll,
  isValid: async () => await checkValidity(),
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
:deep(.p-select) {
  width: 100%;
}

:deep(.p-message) {
  margin-top: -1.5rem;
  padding: 0.5rem 0.75rem;
}

:deep(.p-message .p-message-text) {
  font-size: 0.875rem;
}

:deep(.p-message .p-message-icon) {
  font-size: 0.875rem;
}

/* Invalid field styling */
:deep(.p-inputtext.p-invalid),
:deep(.p-select.p-invalid) {
  border-color: #dc2626;
}

:deep(.p-inputtext.p-invalid:focus),
:deep(.p-select.p-invalid:focus) {
  border-color: #dc2626;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.2);
}
</style>
