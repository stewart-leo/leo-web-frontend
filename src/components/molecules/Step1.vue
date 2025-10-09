<template>
  <PvPanel>
    <div class="form-container">
      <!-- Name Field -->
      <PvFloatLabel>
        <PvInputText
          id="name"
          v-model="name"
          :invalid="!!errors.name"
          @blur="validateField('name')"
        />
        <label for="name">Name</label>
      </PvFloatLabel>
      <small v-if="errors.name" class="error-text">
        {{ errors.name }}
      </small>

      <!-- Company Name Field -->
      <PvFloatLabel>
        <PvInputText
          id="companyName"
          v-model="companyName"
          :invalid="!!errors.companyName"
          @blur="validateField('companyName')"
        />
        <label for="companyName">Company Name</label>
      </PvFloatLabel>
      <small v-if="errors.companyName" class="error-text">
        {{ errors.companyName }}
      </small>

      <!-- Country Field -->
      <PvFloatLabel>
        <PvSelect
          id="selectedCountry"
          v-model="selectedCountry"
          :options="countries"
          optionLabel="name"
          filter
          :invalid="!!errors.selectedCountry"
          @blur="validateField('selectedCountry')"
          class="w-full"
        />
        <label for="country">Country</label>
      </PvFloatLabel>
      <small v-if="errors.selectedCountry" class="error-text">
        {{ errors.selectedCountry }}
      </small>
    </div>
  </PvPanel>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { object, string } from 'yup'
import { useFormStore } from '@/stores/formStore'
import countries from '@/assets/json/countries.json'

const formStore = useFormStore()

// Define validation schema
const validationSchema = object({
  name: string().required('Name is required').trim(),
  companyName: string().required('Company Name is required').trim(),
  selectedCountry: object()
    .shape({
      id: string().required(),
      name: string().required(),
    })
    .nullable()
    .required('Country is required')
    .typeError('Country is required'),
})

// Initialize VeeValidate form
const { errors, validate, validateField, setFieldValue } = useForm({
  validationSchema,
  initialValues: {
    name: formStore.formData.step1.name || '',
    companyName: formStore.formData.step1.companyName || '',
    selectedCountry: formStore.formData.step1.selectedCountry || null,
  },
})

// Create fields
const { value: name } = useField<string>('name')
const { value: companyName } = useField<string>('companyName')
const { value: selectedCountry } = useField<any>('selectedCountry')

// Watch for changes and update store
watch(
  [name, companyName, selectedCountry],
  () => {
    formStore.updateStep1({
      name: name.value,
      companyName: companyName.value,
      selectedCountry: selectedCountry.value,
    })
  },
  { deep: true },
)

// Validate all fields - called by Stepper before proceeding
const validateAll = async () => {
  const result = await validate()
  return result.valid
}

// Expose validation methods for Stepper
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
:deep(.p-select) {
  width: 100%;
}

.error-text {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: -2rem;
  margin-left: 0.25rem;
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
