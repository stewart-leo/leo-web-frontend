<template>
  <div class="submit-container">
    <div v-if="isSubmitted" class="submission-success">
      <div class="success-icon">
        <i class="pi pi-check-circle"></i>
      </div>
      <h2>Thank you for your submission!</h2>
      <p>
        We look forward to reviewing your entry. if you have any questions please contact
        ukpreferredsuppliers@cbre.com
      </p>
      <p v-if="sendCopyChecked" class="email-confirmation">
        <i class="pi pi-envelope"></i>
        A confirmation email has been sent to your registered email address.
      </p>
      <div class="button-group">
        <PvButton
          label="View Application"
          icon="pi pi-external-link"
          @click="redirectToMyApplications"
          class="mt-4"
        />
        <!-- <PvButton
          label="Submit Another Innovation"
          icon="pi pi-plus"
          @click="resetForm"
          class="mt-4"
        /> -->
      </div>
    </div>

    <div v-else class="submission-form">
      <PvPanel class="support-section">
        <template #header>
          <div class="section-header">
            <i class="pi pi-info-circle"></i>
            <span>Contact & Support</span>
          </div>
        </template>
        <div class="support-content">
          <p class="support-text">
            If you have questions about the Supplier Innovation Challenge, please contact:
          </p>
          <a href="mailto:ukpreferredsuppliers@cbre.com" class="contact-email">
            <i class="pi pi-envelope"></i>
            ukpreferredsuppliers@cbre.com
          </a>
          <p class="support-text">
            If you have questions about this form or tactical steps related to submission, please
            contact:
          </p>
          <a href="mailto:innovation@leadingedgeonly.com" class="contact-email">
            <i class="pi pi-envelope"></i>
            innovation@leadingedgeonly.com
          </a>
        </div>
      </PvPanel>

      <PvPanel class="submission-options">
        <template #header>
          <div class="section-header">
            <i class="pi pi-send"></i>
            <span>Submission Options</span>
          </div>
        </template>

        <div class="options-content">
          <!-- First submission note and checkbox group -->
          <div class="note-checkbox-group">
            <PvMessage severity="info" :closable="false" class="submission-note">
              <strong>Submission Note:</strong> We strongly encourage you to check the box below to
              receive a copy of your submission.
            </PvMessage>
            <div class="checkbox-item">
              <PvCheckbox v-model="sendCopyChecked" inputId="sendCopy" binary />
              <label for="sendCopy" class="checkbox-label">
                Send me a copy of my submission via email
              </label>
            </div>
          </div>

          <!-- Second submission note and checkbox group -->
          <div class="note-checkbox-group">
            <PvMessage severity="info" :closable="false" class="submission-note">
              <strong>Submission Note:</strong> Any information shared as part of a submission, may
              be shared internally. Please tick the below box to confirm you understand this.
            </PvMessage>
            <div class="checkbox-item required-checkbox">
              <PvCheckbox
                v-model="consentChecked"
                inputId="consent"
                binary
                :invalid="consentError"
              />
              <label for="consent" class="checkbox-label">
                I understand and agree to the information sharing policy
              </label>
            </div>
            <small v-if="consentError" class="error-message">
              <i class="pi pi-exclamation-circle"></i>
              This field is required to submit the form
            </small>
          </div>

          <!-- Submission error message -->
          <PvMessage
            v-if="submissionError"
            severity="error"
            :closable="true"
            @close="clearSubmissionError"
          >
            <strong>Submission Failed:</strong> {{ submissionError }}
          </PvMessage>
        </div>
      </PvPanel>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useFormStore } from '@/stores/formStore'

const formStore = useFormStore()
const emit = defineEmits(['update:isSubmitted'])

// Form state
const consentChecked = ref(false)
const sendCopyChecked = ref(false)
const consentError = ref(false)
const isSubmitted = ref(false)
const submissionError = ref('')

// Watch isSubmitted and emit changes
watch(isSubmitted, (newValue) => {
  emit('update:isSubmitted', newValue)
})

// Clear submission error
const clearSubmissionError = () => {
  submissionError.value = ''
}

// Handle form submission
const handleSubmit = async () => {
  // Clear any previous errors
  consentError.value = false
  submissionError.value = ''

  // Validate consent checkbox
  if (!consentChecked.value) {
    consentError.value = true
    submissionError.value = 'Please agree to the information sharing policy to continue.'
    return
  }

  try {
    // Save email preference to store first
    formStore.updateStep4('sendEmailCopy', sendCopyChecked.value)

    // Log the payload before submission (for debugging)
    const payload = formStore.buildSubmissionPayload()
    console.log('Final submission payload:', JSON.stringify(payload, null, 2))

    // Submit the form
    const response = await formStore.submitForm()

    // Show success screen
    isSubmitted.value = true
  } catch (error) {
    console.error('Submission error:', error)

    // Extract error message
    let errorMessage = 'An unexpected error occurred. Please try again.'

    if (error.response) {
      // Server responded with error
      errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${error.response.status}`
    } else if (error.request) {
      // Request made but no response
      errorMessage = 'No response from server. Please check your connection.'
    } else if (error.message) {
      // Something else happened
      errorMessage = error.message
    }

    submissionError.value = errorMessage

    // Scroll to top to show error message
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const resetForm = () => {
  // Reset the form store
  formStore.resetForm()

  // Reset local state
  isSubmitted.value = false
  consentChecked.value = false
  sendCopyChecked.value = false
  consentError.value = false
  submissionError.value = ''

  // Optionally navigate back to step 1
  // You might need to emit an event or use router here
  console.log('Form reset - ready for new submission')
}

const redirectToMyApplications = () => {
  const env = formStore.environment
  const baseUrls = {
    dev: 'https://dev.leadingedgeonly.com',
    staging: 'https://staging.leadingedgeonly.com',
    production: 'https://www.leadingedgeonly.com',
  }

  const baseUrl = baseUrls[env] || baseUrls.production
  const fullUrl = `${baseUrl}/dashboard/applications`

  window.open(fullUrl, '_blank')
}

defineExpose({
  handleSubmit,
  isSubmitted,
})
</script>

<style scoped>
.submit-container {
  max-height: 100%;
  overflow-y: auto;
  padding: 0.5rem;
}

/* Success State */
.submission-success {
  text-align: center;
  padding: 3rem 2rem;
  border-radius: 12px;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-icon i {
  font-size: 5rem;
  color: #003f2d;
}

.submission-success h2 {
  font-family: 'Financier Display', Georgia, serif;
  color: #003f2d;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 500;
}

.submission-success p {
  color: #003f2d;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  font-family: 'Financier Display', Georgia, serif;
}

.email-confirmation {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

/* Button Group */
.button-group {
  display: inline-grid;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

/* Form Sections */
.support-section,
.submission-options {
  margin-bottom: 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
  color: #374151;
}

.section-header i {
  color: #003f2d;
}

/* Support Content */
.support-content {
  padding: 1.5rem;
}

.support-text {
  color: #374151;
}

.contact-email {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #003f2d;
  text-decoration: none;
  font-size: 1.05rem;
  padding: 0.5rem 1rem;
  background: #f0f9ff;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.contact-email:hover {
  background: #e0f2fe;
  transform: translateX(4px);
}

/* Submission Options */
.options-content {
  padding: 1.5rem;
}

/* Note and Checkbox Groups */
.note-checkbox-group {
  margin-bottom: 1.5rem;
}

.note-checkbox-group:last-child {
  margin-bottom: 0;
}

.note-checkbox-group .submission-note {
  margin-bottom: 0 !important;
  background: #cad1d3 !important;
  border: 1px solid #cad1d3 !important;
  border-bottom: none !important;
  border-bottom-left-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.note-checkbox-group .checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.checkbox-label {
  line-height: 1.5;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.error-message {
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.5rem;
  margin-left: 2rem;
  font-size: 0.875rem;
}

/* PrimeVue overrides */
:deep(.p-panel-header) {
  padding: 1rem 1.25rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.p-panel-content) {
  padding: 0;
}

:deep(.p-message) {
  margin: 0;
  border: 1px solid #fbbf24 !important;
  background: #fef3c7 !important;
}

:deep(.p-message.p-message-error) {
  border: 1px solid #f87171 !important;
  background: #fee2e2 !important;
  margin-top: 1rem;
  border-radius: 8px;
}

:deep(.p-message.p-message-error .p-message-text) {
  color: #991b1b !important;
}

:deep(.p-message.p-message-error .p-message-icon) {
  color: #dc2626 !important;
}

:deep(.p-message-wrapper) {
  padding: 1rem;
}

:deep(.p-message-text) {
  color: #92400e !important;
}

:deep(.p-message.p-message-info .p-message-icon) {
  color: #92400e !important;
}

/* Responsive */
@media (max-width: 768px) {
  .submission-success h2 {
    font-size: 1.5rem;
  }

  .success-icon i {
    font-size: 4rem;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
