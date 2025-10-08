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
        <Step1 />
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
          <label>Innovation Title:</label>
          <span>{{ formStore.formData.step2[156] || 'Not provided' }}</span>
        </div>
        <div class="review-item">
          <label>Description:</label>
          <p class="description-text">{{ formStore.formData.step2[157] || 'Not provided' }}</p>
        </div>
        <div class="review-item">
          <label>Client Challenges:</label>
          <div class="tag-container" v-if="getChallengeLabels().length > 0">
            <PvChip v-for="challenge in getChallengeLabels()" :key="challenge" :label="challenge" />
          </div>
          <span v-else>Not provided</span>
        </div>
        <div class="review-item">
          <label>Solution Availability:</label>
          <span class="availability-status">{{ getAvailabilityLabel() }}</span>
        </div>

        <!-- Conditionally show regions if 'Available in select regions' was chosen -->
        <div v-if="formStore.formData.step2[159] === 270" class="review-item">
          <label>Selected Regions:</label>
          <div class="tag-container" v-if="getRegionLabels().length > 0">
            <PvChip v-for="region in getRegionLabels()" :key="region" :label="region" />
          </div>
          <span v-else>Not provided</span>
        </div>

        <!-- Conditionally show countries if 'specific countries' was chosen -->
        <div v-if="formStore.formData.step2[159] === 271" class="review-item">
          <label>Specific Countries:</label>
          <div class="tag-container" v-if="getCountryLabels().length > 0">
            <PvChip v-for="country in getCountryLabels()" :key="country" :label="country" />
          </div>
          <span v-else>Not provided</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step2 />
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
          v-for="questionId in [162, 163, 164, 165]"
          :key="questionId"
          class="review-item question-review"
        >
          <label class="question-label">{{ getQuestionText(questionId) }}</label>
          <span class="answer-text">{{ getAnswerText(questionId) }}</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step3 />
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
          <span v-if="formStore.formData.step4.uploadedFiles?.length > 0">
            {{ formStore.formData.step4.uploadedFiles.length }} file(s) uploaded
          </span>
          <span v-else>No files uploaded</span>
          <ul v-if="formStore.formData.step4.uploadedFiles?.length > 0" class="file-list">
            <li v-for="(file, index) in formStore.formData.step4.uploadedFiles" :key="index">
              <i class="pi pi-file"></i> {{ file.source_name }}
            </li>
          </ul>
        </div>
        <div class="review-item">
          <label>Video Link:</label>
          <span>{{ formStore.formData.step4[166] || 'Not provided' }}</span>
        </div>
        <div class="review-item">
          <label>References/Case Studies:</label>
          <span>{{ getReferenceLabel() }}</span>
        </div>
      </div>

      <div v-else class="edit-content">
        <Step4 />
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

<script setup>
import { ref, computed } from 'vue'
import { useFormStore } from '@/stores/formStore'
import Step1 from '@/components/molecules/Step1.vue'
import Step2 from '@/components/molecules/Step2.vue'
import Step3 from '@/components/molecules/Step3.vue'
import Step4 from '@/components/molecules/Step4.vue'

// Register components locally

const formStore = useFormStore()

// Edit state for each section
const editingStep1 = ref(false)
const editingStep2 = ref(false)
const editingStep3 = ref(false)
const editingStep4 = ref(false)

// Challenge mapping (answer_id to label)
const challengeMap = {
  264: 'Sustainable Solutions',
  265: 'Smart FM & AI driven Solutions',
  266: 'Soft Services Innovation',
  267: 'Workplace Experience Enhancements',
  268: 'Operational Efficiencies',
}

// Region mapping (answer_id to label)
const regionMap = {
  273: 'Americas',
  274: 'APAC',
  275: 'EMEA',
  276: 'UK',
  277: 'Ireland',
}

// Availability mapping (answer_id to label)
const availabilityMap = {
  269: 'Yes, globally available',
  270: 'Available in select regions',
  271: 'Not currently available outside specific countries',
  272: 'Availability unknown',
}

// Reference mapping (answer_id to label)
const referenceMap = {
  298: 'Reference provided',
  299: 'Case study provided',
  300: 'Reference and case study provided',
  301: 'Neither provided',
}

// Get challenge labels from answer IDs
const getChallengeLabels = () => {
  const answerIds = formStore.formData.step2[158] || []
  return answerIds.map((id) => challengeMap[id] || 'Unknown').filter(Boolean)
}

// Get region labels from answer IDs
const getRegionLabels = () => {
  const answerIds = formStore.formData.step2[160] || []
  return answerIds.map((id) => regionMap[id] || 'Unknown').filter(Boolean)
}

// Get country labels from country objects
const getCountryLabels = () => {
  const countries = formStore.formData.step2[161] || []
  if (Array.isArray(countries)) {
    return countries.map((country) => country.name || 'Unknown').filter(Boolean)
  }
  return []
}

// Get availability label
const getAvailabilityLabel = () => {
  const answerId = formStore.formData.step2[159]
  return availabilityMap[answerId] || 'Not provided'
}

// Get reference label
const getReferenceLabel = () => {
  const answerId = formStore.formData.step4[167]
  return referenceMap[answerId] || 'Not provided'
}

// Get question text by ID from store
const getQuestionText = (questionId) => {
  const question = formStore.getQuestionById(questionId)
  return question?.question_text || 'Question not found'
}

// Get answer text by question ID
const getAnswerText = (questionId) => {
  const answerId = formStore.formData.step3[questionId]
  if (!answerId) return 'Not provided'

  const question = formStore.getQuestionById(questionId)
  if (!question) return 'Not provided'

  const option = question.question_answer_options.find((opt) => opt.answer_id === answerId)
  return option?.answer_text || 'Not provided'
}

// Toggle edit mode for a step
const toggleEdit = (step) => {
  editingStep1.value = false
  editingStep2.value = false
  editingStep3.value = false
  editingStep4.value = false

  // Open the selected step for editing
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

// Save function - just closes the edit panel
const saveStep = (step) => {
  // Data is already saved to store via watch in each step component
  switch (step) {
    case 1:
      editingStep1.value = false
      break
    case 2:
      editingStep2.value = false
      break
    case 3:
      editingStep3.value = false
      break
    case 4:
      editingStep4.value = false
      break
  }
}
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

/* Smooth scrollbar styling */
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .section-title {
    font-size: 1rem;
  }
  .review-content {
    padding: 0.75rem;
  }
}
</style>
