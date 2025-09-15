<template>
  <PvPanel>
    <div class="form-container">
      <div v-for="(question, questionKey) in questions" :key="questionKey" class="question-section">
        <PvFieldset :legend="question.text">
          <div
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            class="radio-option"
          >
            <PvRadioButton
              v-model="selectedAnswers[questionKey]"
              :inputId="`${questionKey}_${optionIndex}`"
              :name="questionKey"
              :value="option"
            />
            <label :for="`${questionKey}_${optionIndex}`" class="radio-label">{{ option }}</label>
          </div>
        </PvFieldset>
      </div>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref } from 'vue'
import questions from '@/assets/json/innovation-relevance.json'

// Create reactive refs for each question's selected answer
const selectedAnswers = ref({
  question1: '',
  question2: '',
  question3: '',
  question4: '',
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

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.radio-label {
  margin-left: 0.5rem;
  line-height: 1.5;
}
</style>
