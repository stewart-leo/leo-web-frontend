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
      </div>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useFormStore } from '@/stores/formStore'

const formStore = useFormStore()

// Create reactive refs for each question's selected answer
const selectedAnswers = ref({
  question1: null, // question_id: 162
  question2: null, // question_id: 163
  question3: null, // question_id: 164
  question4: null, // question_id: 165
})

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

// Load saved data from store on mount
onMounted(() => {
  selectedAnswers.value.question1 = formStore.formData.step3[162] || null
  selectedAnswers.value.question2 = formStore.formData.step3[163] || null
  selectedAnswers.value.question3 = formStore.formData.step3[164] || null
  selectedAnswers.value.question4 = formStore.formData.step3[165] || null
})

// Watch and save to store
watch(
  selectedAnswers,
  (newValues) => {
    formStore.updateStep3(162, newValues.question1) // ROI question
    formStore.updateStep3(163, newValues.question2) // Integration question
    formStore.updateStep3(164, newValues.question3) // Differentiation question
    formStore.updateStep3(165, newValues.question4) // Value creation question
  },
  { deep: true },
)
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
</style>
