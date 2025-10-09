<template>
  <div class="review-container">
    <!-- Step 1: Supplier Details -->
    <PvPanel class="review-section" :toggleable="true">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <i class="pi pi-user"></i>
            <span>Supplier Details</span>
          </div>
          <PvButton
            v-if="!editingStep1"
            label="Edit"
            icon="pi pi-pencil"
            size="small"
            text
            @click="toggleEdit(1)"
          />
          <PvButton
            v-else
            label="Save"
            icon="pi pi-check"
            size="small"
            severity="success"
            @click="saveStep(1)"
          />
        </div>
      </template>

      <div v-if="!editingStep1" class="review-content">
        <div class="review-item">
          <label>Name:</label>
          <span>{{ formStore.formData.step1.name || 'Not provided' }}</span>
        </div>
        <div class="review-item">
          <label>Company Name:</label>
          <span>{{ formStore.formData.step1.companyName || 'Not provided' }}</span>
        </div>
        <div class="review-item">
          <label>Country:</label>
          <span>{{ formStore.formData.step1.selectedCountry?.name || 'Not provided' }}</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step1 ref="embeddedStep1Ref" />
      </div>
    </PvPanel>

    <!-- Step 2: Innovation Details -->
    <PvPanel class="review-section" :toggleable="true">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <i class="pi pi-cog"></i>
            <span>Innovation Details</span>
          </div>
          <PvButton
            v-if="!editingStep2"
            label="Edit"
            icon="pi pi-pencil"
            size="small"
            text
            @click="toggleEdit(2)"
          />
          <PvButton
            v-else
            label="Save"
            icon="pi pi-check"
            size="small"
            severity="success"
            @click="saveStep(2)"
          />
        </div>
      </template>

      <div v-if="!editingStep2" class="review-content">
        <div class="review-item">
          <label>{{ getQuestionText(formStore.Q.INNOVATION_TITLE) }}:</label>
          <span>{{
            formStore.formData.step2[formStore.Q.INNOVATION_TITLE] || 'Not provided'
          }}</span>
        </div>
        <div class="review-item">
          <label>{{ getQuestionText(formStore.Q.SHORT_DESCRIPTION) }}:</label>
          <p class="description-text">
            {{ formStore.formData.step2[formStore.Q.SHORT_DESCRIPTION] || 'Not provided' }}
          </p>
        </div>
        <div class="review-item">
          <label>{{ getQuestionText(formStore.Q.CLIENT_CHALLENGE) }}:</label>
          <div
            class="tag-container"
            v-if="
              getAnswerLabels(
                formStore.Q.CLIENT_CHALLENGE,
                formStore.formData.step2[formStore.Q.CLIENT_CHALLENGE],
              ).length > 0
            "
          >
            <PvChip
              v-for="label in getAnswerLabels(
                formStore.Q.CLIENT_CHALLENGE,
                formStore.formData.step2[formStore.Q.CLIENT_CHALLENGE],
              )"
              :key="label"
              :label="label"
            />
          </div>
          <span v-else>Not provided</span>
        </div>
        <div class="review-item">
          <label>{{ getQuestionText(formStore.Q.SOLUTION_AVAILABILITY) }}:</label>
          <span class="availability-status">{{
            getSingleAnswerLabel(
              formStore.Q.SOLUTION_AVAILABILITY,
              formStore.formData.step2[formStore.Q.SOLUTION_AVAILABILITY],
            )
          }}</span>
        </div>

        <!-- Conditionally show regions -->
        <div v-if="shouldShowRegions()" class="review-item">
          <label>{{ getQuestionText(formStore.Q.REGIONAL_APPLICATION) }}:</label>
          <div
            class="tag-container"
            v-if="
              getAnswerLabels(
                formStore.Q.REGIONAL_APPLICATION,
                formStore.formData.step2[formStore.Q.REGIONAL_APPLICATION],
              ).length > 0
            "
          >
            <PvChip
              v-for="label in getAnswerLabels(
                formStore.Q.REGIONAL_APPLICATION,
                formStore.formData.step2[formStore.Q.REGIONAL_APPLICATION],
              )"
              :key="label"
              :label="label"
            />
          </div>
          <span v-else>Not provided</span>
        </div>

        <!-- Conditionally show countries -->
        <div v-if="shouldShowCountries()" class="review-item">
          <label>{{ getQuestionText(formStore.Q.SPECIFIC_COUNTRIES) }}:</label>
          <div class="tag-container" v-if="getCountryLabels().length > 0">
            <PvChip v-for="country in getCountryLabels()" :key="country" :label="country" />
          </div>
          <span v-else>Not provided</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step2 ref="embeddedStep2Ref" />
      </div>
    </PvPanel>

    <!-- Step 3: Innovation Relevance -->
    <PvPanel class="review-section" :toggleable="true">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <i class="pi pi-bullseye"></i>
            <span>Innovation Relevance</span>
          </div>
          <PvButton
            v-if="!editingStep3"
            label="Edit"
            icon="pi pi-pencil"
            size="small"
            text
            @click="toggleEdit(3)"
          />
          <PvButton
            v-else
            label="Save"
            icon="pi pi-check"
            size="small"
            severity="success"
            @click="saveStep(3)"
          />
        </div>
      </template>

      <div v-if="!editingStep3" class="review-content">
        <div
          v-for="questionId in [
            formStore.Q.ROI,
            formStore.Q.INTEGRATION,
            formStore.Q.DIFFERENTIATION,
            formStore.Q.MEASURABLE_VALUE,
          ]"
          :key="questionId"
          class="review-item question-review"
        >
          <label class="question-label">{{ getQuestionText(questionId) }}</label>
          <span class="answer-text">{{
            getSingleAnswerLabel(questionId, formStore.formData.step3[questionId])
          }}</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step3 ref="embeddedStep3Ref" />
      </div>
    </PvPanel>

    <!-- Step 4: Supporting Materials -->
    <PvPanel class="review-section" :toggleable="true">
      <template #header>
        <div class="section-header">
          <div class="section-title">
            <i class="pi pi-file"></i>
            <span>Supporting Materials</span>
          </div>
          <PvButton
            v-if="!editingStep4"
            label="Edit"
            icon="pi pi-pencil"
            size="small"
            text
            @click="toggleEdit(4)"
          />
          <PvButton
            v-else
            label="Save"
            icon="pi pi-check"
            size="small"
            severity="success"
            @click="saveStep(4)"
          />
        </div>
      </template>

      <div v-if="!editingStep4" class="review-content">
        <div class="review-item">
          <label>Uploaded Files:</label>
          <span
            v-if="
              formStore.formData.step4.uploadedFiles &&
              formStore.formData.step4.uploadedFiles.length > 0
            "
          >
            {{ formStore.formData.step4.uploadedFiles.length }} file(s) uploaded
          </span>
          <span v-else>No files uploaded</span>
          <ul
            v-if="
              formStore.formData.step4.uploadedFiles &&
              formStore.formData.step4.uploadedFiles.length > 0
            "
            class="file-list"
          >
            <li v-for="(file, index) in formStore.formData.step4.uploadedFiles" :key="index">
              <i class="pi pi-file"></i> {{ file.source_name }}
            </li>
          </ul>
        </div>
        <div class="review-item">
          <label>{{ getQuestionText(formStore.Q.VIDEO_URL) }}:</label>
          <span>{{ formStore.formData.step4[formStore.Q.VIDEO_URL] || 'Not provided' }}</span>
        </div>
        <div class="review-item">
          <label>{{ getQuestionText(formStore.Q.REFERENCES) }}:</label>
          <span>{{
            getSingleAnswerLabel(
              formStore.Q.REFERENCES,
              formStore.formData.step4[formStore.Q.REFERENCES],
            )
          }}</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step4 ref="embeddedStep4Ref" />
      </div>
    </PvPanel>

    <!-- Form Status Summary -->
    <div class="status-summary">
      <PvMessage severity="info" :closable="false">
        <div class="status-summary-content">
          <i class="pi pi-info-circle"></i>
          <div>
            <h4>Form Status</h4>
            <p>
              Please review all sections before final submission. You can edit any section if
              needed.
            </p>
          </div>
        </div>
      </PvMessage>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useFormStore } from '@/stores/formStore'
import Step1 from '@/components/molecules/Step1.vue'
import Step2 from '@/components/molecules/Step2.vue'
import Step3 from '@/components/molecules/Step3.vue'
import Step4 from '@/components/molecules/Step4.vue'

const formStore = useFormStore()

// Refs for embedded step components
const embeddedStep1Ref = ref<InstanceType<typeof Step1> | null>(null)
const embeddedStep2Ref = ref<InstanceType<typeof Step2> | null>(null)
const embeddedStep3Ref = ref<InstanceType<typeof Step3> | null>(null)
const embeddedStep4Ref = ref<InstanceType<typeof Step4> | null>(null)

// Edit state for each section
const editingStep1 = ref(false)
const editingStep2 = ref(false)
const editingStep3 = ref(false)
const editingStep4 = ref(false)

// Get question text by ID from store
const getQuestionText = (questionId: number): string => {
  const question = formStore.getQuestionById(questionId)
  return question?.question_text || 'Question not found'
}

// Get answer label(s) for checkbox/multi-select questions (returns array)
const getAnswerLabels = (questionId: number, answerIds: number[] | null): string[] => {
  if (!answerIds || !Array.isArray(answerIds) || answerIds.length === 0) return []

  const question = formStore.getQuestionById(questionId)
  if (!question) return []

  return answerIds
    .map((id) => {
      const option = question.question_answer_options.find((opt) => opt.answer_id === id)
      return option?.answer_text || ''
    })
    .filter(Boolean)
}

// Get single answer label for radio/dropdown questions
const getSingleAnswerLabel = (questionId: number, answerId: number | null): string => {
  if (!answerId) return 'Not provided'

  const question = formStore.getQuestionById(questionId)
  if (!question) return 'Not provided'

  const option = question.question_answer_options.find((opt) => opt.answer_id === answerId)
  return option?.answer_text || 'Not provided'
}

// Get country labels from country objects
const getCountryLabels = (): string[] => {
  const countries = formStore.formData.step2[formStore.Q.SPECIFIC_COUNTRIES] || []
  if (Array.isArray(countries)) {
    return countries.map((country: any) => country.name || 'Unknown').filter(Boolean)
  }
  return []
}

// Check if regions should be shown (based on availability selection)
const shouldShowRegions = (): boolean => {
  const availabilityQuestion = formStore.getQuestionById(formStore.Q.SOLUTION_AVAILABILITY)
  if (!availabilityQuestion) return false

  const selectRegionsAnswer = availabilityQuestion.question_answer_options.find((opt) =>
    opt.answer_text.toLowerCase().includes('select regions'),
  )

  return (
    formStore.formData.step2[formStore.Q.SOLUTION_AVAILABILITY] === selectRegionsAnswer?.answer_id
  )
}

// Check if countries should be shown (based on availability selection)
const shouldShowCountries = (): boolean => {
  const availabilityQuestion = formStore.getQuestionById(formStore.Q.SOLUTION_AVAILABILITY)
  if (!availabilityQuestion) return false

  const specificCountriesAnswer = availabilityQuestion.question_answer_options.find((opt) =>
    opt.answer_text.toLowerCase().includes('specific countries'),
  )

  return (
    formStore.formData.step2[formStore.Q.SOLUTION_AVAILABILITY] ===
    specificCountriesAnswer?.answer_id
  )
}

// Toggle edit mode for a step
const toggleEdit = (step: number) => {
  editingStep1.value = false
  editingStep2.value = false
  editingStep3.value = false
  editingStep4.value = false

  switch (step) {
    case 1:
      editingStep1.value = true
      break
    case 2:
      editingStep2.value = true
      break
    case 3:
      editingStep3.value = true
      break
    case 4:
      editingStep4.value = true
      break
  }
}

// Save function - validate before closing the edit panel
const saveStep = async (step: number) => {
  let isValid = true

  // Validate the embedded step based on which one is open
  switch (step) {
    case 1:
      if (embeddedStep1Ref.value && typeof embeddedStep1Ref.value.validateAll === 'function') {
        isValid = await embeddedStep1Ref.value.validateAll()
      }
      if (isValid) editingStep1.value = false
      break
    case 2:
      if (embeddedStep2Ref.value && typeof embeddedStep2Ref.value.validateAll === 'function') {
        isValid = await embeddedStep2Ref.value.validateAll()
      }
      if (isValid) editingStep2.value = false
      break
    case 3:
      if (embeddedStep3Ref.value && typeof embeddedStep3Ref.value.validateAll === 'function') {
        isValid = await embeddedStep3Ref.value.validateAll()
      }
      if (isValid) editingStep3.value = false
      break
    case 4:
      if (embeddedStep4Ref.value && typeof embeddedStep4Ref.value.validateAll === 'function') {
        isValid = await embeddedStep4Ref.value.validateAll()
      }
      if (isValid) editingStep4.value = false
      break
  }

  if (!isValid) {
    console.log(`Step ${step} validation failed in review`)
  }
}

// Validate - check if any edit panels are open
const validateAll = async () => {
  // If any edit panel is open, validate that step first
  if (
    editingStep1.value &&
    embeddedStep1Ref.value &&
    typeof embeddedStep1Ref.value.validateAll === 'function'
  ) {
    const isValid = await embeddedStep1Ref.value.validateAll()
    if (!isValid) return false
  }

  if (
    editingStep2.value &&
    embeddedStep2Ref.value &&
    typeof embeddedStep2Ref.value.validateAll === 'function'
  ) {
    const isValid = await embeddedStep2Ref.value.validateAll()
    if (!isValid) return false
  }

  if (
    editingStep3.value &&
    embeddedStep3Ref.value &&
    typeof embeddedStep3Ref.value.validateAll === 'function'
  ) {
    const isValid = await embeddedStep3Ref.value.validateAll()
    if (!isValid) return false
  }

  if (
    editingStep4.value &&
    embeddedStep4Ref.value &&
    typeof embeddedStep4Ref.value.validateAll === 'function'
  ) {
    const isValid = await embeddedStep4Ref.value.validateAll()
    if (!isValid) return false
  }

  // Step 5 is just a review step, no validation needed if no panels are open
  return true
}

// Expose validation methods for Stepper
defineExpose({
  validateAll,
  isValid: async () => true,
})
</script>

<style scoped>
.review-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-height: 100%;
  overflow-y: auto;
  padding: 0.5rem;
}

.review-section {
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.review-section:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #374151;
}

.section-title i {
  color: #003f2d;
}

.review-content {
  padding: 1rem;
}

.review-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1.25rem;
}

.review-item:last-child {
  margin-bottom: 0;
}

.review-item label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.875rem;
}

.review-item span {
  color: #1f2937;
  font-size: 1rem;
}

.availability-status {
  font-style: italic;
  color: #059669;
}

.description-text {
  line-height: 1.6;
  white-space: pre-wrap;
  color: #1f2937;
  margin: 0;
}

.tag-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0 0;
}

.file-list li {
  padding: 0.25rem 0;
  color: #4b5563;
  font-size: 0.9rem;
}

.file-list li i {
  margin-right: 0.5rem;
  color: #6b7280;
}

.question-review {
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.question-review:last-child {
  border-bottom: none;
}

.question-label {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  color: #374151 !important;
}

.answer-text {
  font-style: italic;
  color: #4b5563;
}

.edit-content {
  padding: 1rem;
}

.status-summary {
  margin-top: 1rem;
}

.status-summary-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.status-summary-content i {
  font-size: 1.25rem;
  margin-top: 0.25rem;
}

.status-summary-content h4 {
  margin: 0 0 0.5rem 0;
  color: #0369a1;
  font-size: 1.1rem;
}

.status-summary-content p {
  margin: 0;
  color: #0c4a6e;
  font-size: 0.95rem;
  line-height: 1.5;
}

:deep(.p-panel-header) {
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-panel-content) {
  padding: 0;
}

:deep(.p-panel-icons) {
  display: flex;
  align-items: center;
}

:deep(.p-chip) {
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
}

:deep(.p-message) {
  margin: 0;
  border: 1px solid #bae6fd;
  background: #f0f9ff;
}

:deep(.p-message-wrapper) {
  padding: 1rem;
}

:deep(.p-message-icon) {
  display: none;
}

.review-container::-webkit-scrollbar {
  width: 8px;
}

.review-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.review-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.review-container::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1rem;
  }
  .review-content {
    padding: 0.75rem;
  }
}
</style>
