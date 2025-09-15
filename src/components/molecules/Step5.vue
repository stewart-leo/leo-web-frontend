<template>
  <div class="review-container">
    <div class="review-header">
      <h2 class="review-title">Review Your Submission</h2>
      <p class="review-subtitle">Please review all information before submitting</p>
    </div>

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
          <span>{{ mockData.supplierDetails.name }}</span>
        </div>
        <div class="review-item">
          <label>Company Name:</label>
          <span>{{ mockData.supplierDetails.companyName }}</span>
        </div>
        <div class="review-item">
          <label>Country:</label>
          <span>{{ mockData.supplierDetails.country }}</span>
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
          <span>{{ mockData.innovationDetails.title }}</span>
        </div>
        <div class="review-item">
          <label>Description:</label>
          <p class="description-text">{{ mockData.innovationDetails.description }}</p>
        </div>
        <div class="review-item">
          <label>Client Challenges:</label>
          <div class="tag-container">
            <PvChip
              v-for="challenge in mockData.innovationDetails.challenges"
              :key="challenge"
              :label="challenge"
            />
          </div>
        </div>
        <div class="review-item">
          <label>Regions:</label>
          <div class="tag-container">
            <PvChip
              v-for="region in mockData.innovationDetails.regions"
              :key="region"
              :label="region"
            />
          </div>
        </div>
        <div class="review-item">
          <label>Specific Countries:</label>
          <div class="tag-container">
            <PvChip
              v-for="country in mockData.innovationDetails.countries"
              :key="country"
              :label="country"
            />
          </div>
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
          v-for="(answer, index) in mockData.innovationRelevance"
          :key="index"
          class="review-item question-review"
        >
          <label class="question-label">{{ answer.question }}</label>
          <span class="answer-text">{{ answer.answer }}</span>
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
          <span>{{ mockData.supportingMaterials.filesCount }} file(s) uploaded</span>
        </div>
        <div class="review-item">
          <label>Video Link:</label>
          <span>{{ mockData.supportingMaterials.videoLink }}</span>
        </div>
        <div class="review-item">
          <label>References/Case Studies:</label>
          <span>{{ mockData.supportingMaterials.references }}</span>
        </div>
        <div class="review-item">
          <label>Information Sharing Consent:</label>
          <span :class="mockData.supportingMaterials.consent ? 'text-success' : 'text-danger'">
            <i
              :class="
                mockData.supportingMaterials.consent ? 'pi pi-check-circle' : 'pi pi-times-circle'
              "
            ></i>
            {{ mockData.supportingMaterials.consent ? 'Agreed' : 'Not agreed' }}
          </span>
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
              All sections have been completed. You can edit any section before final submission.
            </p>
          </div>
        </div>
      </PvMessage>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Step1 from '@/components/molecules/Step1.vue'
import Step2 from '@/components/molecules/Step2.vue'
import Step3 from '@/components/molecules/Step3.vue'
import Step4 from '@/components/molecules/Step4.vue'
import Chip from 'primevue/chip'
import Message from 'primevue/message'

// Register components locally
const PvChip = Chip
const PvMessage = Message

// Edit state for each section
const editingStep1 = ref(false)
const editingStep2 = ref(false)
const editingStep3 = ref(false)
const editingStep4 = ref(false)

// Mock data for display
const mockData = ref({
  supplierDetails: {
    name: 'John Smith',
    companyName: 'InnovateTech Solutions Ltd.',
    country: 'United Kingdom',
  },
  innovationDetails: {
    title: 'AI-Powered Facility Management Platform',
    description:
      'An innovative platform that leverages artificial intelligence and IoT sensors to optimize building operations, reduce energy consumption, and improve occupant comfort. The solution provides real-time monitoring, predictive maintenance, and automated control systems.',
    challenges: ['Smart FM Solutions & AI', 'ESG', 'Workplace Experience'],
    regions: ['EMEA', 'Americas'],
    countries: ['United Kingdom', 'United States', 'Germany'],
  },
  innovationRelevance: [
    {
      question: 'What is the expected ROI of this innovation, and over what timeframe?',
      answer: 'High ROI within 8 months',
    },
    {
      question:
        'How easily can this innovation be integrated into existing CBRE operations or client environments?',
      answer: 'Minor adjustments needed; low effort integration',
    },
    {
      question: 'How does this innovation differentiate CBRE from competitors?',
      answer: 'Emerging innovation; few competitors currently using',
    },
    {
      question: 'How does this innovation create measurable value for CBRE and its clients?',
      answer: 'Strong value for both CBRE and clients (e.g. cost, ESG, satisfaction)',
    },
  ],
  supportingMaterials: {
    filesCount: 3,
    videoLink: 'https://www.youtube.com/watch?v=demo123',
    references: 'Reference and case study provided',
    consent: true,
  },
})

// Toggle edit mode for a step
const toggleEdit = (step) => {
  // Close all other edit modes
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

// Save function (mock)
const saveStep = (step) => {
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

.review-header {
  text-align: center;
  margin-bottom: 1rem;
}

.review-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.review-subtitle {
  color: #6b7280;
  font-size: 0.95rem;
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
  color: #10b981;
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

.text-success {
  color: #10b981;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.text-danger {
  color: #ef4444;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  .review-title {
    font-size: 1.25rem;
  }

  .section-title {
    font-size: 1rem;
  }

  .review-content {
    padding: 0.75rem;
  }
}
</style>
