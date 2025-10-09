<template>
  <PvPanel>
    <div class="form-container">
      <div v-for="(question, questionKey) in questions" :key="questionKey" class="question-section">
        <PvFieldset :legend="question.text">
          <div class="radio-options">
            <div
              v-for="(option, optionIndex) in question.options"
              :key="optionIndex"
              class="radio-option"
            >
              <PvRadioButton
                v-model="selectedAnswers[questionKey]"
                :inputId="`${questionKey}_${optionIndex}`"
                :name="questionKey"
                :value="option.value"
              />
              <label :for="`${questionKey}_${optionIndex}`" class="radio-label">{{
                option.label
              }}</label>
            </div>
          </div>
        </PvFieldset>
        <small v-if="errors[questionKey]" class="error-text">
          {{ errors[questionKey] }}
        </small>
      </div>
    </div>
  </PvPanel>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { number } from 'yup'
import { useFormStore } from '@/stores/formStore'

const formStore = useFormStore()

// Questions mapped to API response (question_id: 162-165)
const questions = {
  question1: {
    text: 'What is the expected ROI of this innovation, and over what timeframe?',
    options: [
      { value: 278, label: 'High ROI within 6 months' },
      { value: 279, label: 'Moderate ROI within 12 months' },
      { value: 280, label: 'ROI expected in 12–24 months' },
      { value: 281, label: 'ROI difficult to quantify but strategic value evident' },
      { value: 282, label: 'No clear ROI or financial benefit' },
    ],
  },
  question2: {
    text: 'How easily can this innovation be integrated into existing CBRE operations or client environments?',
    options: [
      { value: 283, label: 'Fully plug-and-play; no changes required' },
      { value: 284, label: 'Minor adjustments needed; low effort integration' },
      { value: 285, label: 'Moderate changes required; some process or system updates' },
      { value: 286, label: 'Significant changes required; high effort integration' },
      { value: 287, label: 'Not currently feasible without major transformation' },
    ],
  },
  question3: {
    text: 'How does this innovation differentiate CBRE from competitors?',
    options: [
      { value: 288, label: 'Unique and proprietary; no known competitors' },
      { value: 289, label: 'Emerging innovation; few competitors currently using' },
      { value: 290, label: 'Common in market but with a unique CBRE application' },
      { value: 291, label: 'Similar to existing solutions; limited differentiation' },
      { value: 292, label: 'No clear market advantage' },
    ],
  },
  question4: {
    text: 'How does this innovation create measurable value for CBRE and its clients?',
    options: [
      {
        value: 293,
        label: 'Strong value for both CBRE and clients (e.g. cost, ESG, satisfaction)',
      },
      { value: 294, label: 'Primarily benefits CBRE operations' },
      { value: 295, label: 'Primarily benefits client experience' },
      { value: 296, label: 'Limited measurable value but aligns with strategic goals' },
      { value: 297, label: 'No clear value identified' },
    ],
  },
}

// Initialize VeeValidate form
const { errors, validate, setFieldError } = useForm({
  initialValues: {
    question1: formStore.formData.step3[162] || null,
    question2: formStore.formData.step3[163] || null,
    question3: formStore.formData.step3[164] || null,
    question4: formStore.formData.step3[165] || null,
  },
  validateOnMount: false,
})

// Create fields with validation
const { value: question1 } = useField<number | null>(
  'question1',
  number().required('Please select an answer').typeError('Please select an answer'),
  { validateOnValueUpdate: false },
)
const { value: question2 } = useField<number | null>(
  'question2',
  number().required('Please select an answer').typeError('Please select an answer'),
  { validateOnValueUpdate: false },
)
const { value: question3 } = useField<number | null>(
  'question3',
  number().required('Please select an answer').typeError('Please select an answer'),
  { validateOnValueUpdate: false },
)
const { value: question4 } = useField<number | null>(
  'question4',
  number().required('Please select an answer').typeError('Please select an answer'),
  { validateOnValueUpdate: false },
)

// Create a reactive object for v-model binding
const selectedAnswers = {
  question1,
  question2,
  question3,
  question4,
}

// Watch and save to store, and clear errors when value changes
watch(question1, (newValue) => {
  formStore.updateStep3(162, newValue)
  if (newValue !== null) setFieldError('question1', undefined)
})

watch(question2, (newValue) => {
  formStore.updateStep3(163, newValue)
  if (newValue !== null) setFieldError('question2', undefined)
})

watch(question3, (newValue) => {
  formStore.updateStep3(164, newValue)
  if (newValue !== null) setFieldError('question3', undefined)
})

watch(question4, (newValue) => {
  formStore.updateStep3(165, newValue)
  if (newValue !== null) setFieldError('question4', undefined)
})

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
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}

.p-panel {
  border: 2px solid #e2e8f0;
}

.p-fieldset {
  border-color: #cbd5e1;
  margin-top: -1rem;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.radio-label {
  margin-left: 0.5rem;
  line-height: 1.5;
}

.error-text {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}
</style>
