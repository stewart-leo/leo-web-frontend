<template>
  <div class="submit-container">
    <div v-if="isSubmitted" class="submission-success">
      <div class="success-icon">
        <i class="pi pi-check-circle"></i>
      </div>
      <h2>Submission Successful!</h2>
      <p>
        Your innovation has been successfully submitted to the CBRE Supplier Management Challenge
        2025.
      </p>
      <p v-if="sendCopyChecked" class="email-confirmation">
        <i class="pi pi-envelope"></i>
        A confirmation email has been sent to your registered email address.
      </p>
      <div class="button-group">
        <PvButton
          label="View Innovation"
          icon="pi pi-external-link"
          @click="redirectToMyApplications"
          class="mt-4"
        />
        <PvButton
          label="Submit Another Innovation"
          icon="pi pi-plus"
          @click="resetForm"
          class="mt-4"
        />
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
          <a href="mailto:rachel.edmunds@cbre.com" class="contact-email">
            <i class="pi pi-envelope"></i>
            rachel.edmunds@cbre.com
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
        </div>
      </PvPanel>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Form state
const consentChecked = ref(false)
const sendCopyChecked = ref(false)
const consentError = ref(false)
const isSubmitted = ref(false)

// Handle form submission
const handleSubmit = async () => {
  // Validate consent checkbox
  if (!consentChecked.value) {
    consentError.value = true
    return
  }

  // Clear error
  consentError.value = false

  // Simulate submission delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Show success screen
  isSubmitted.value = true
}

const resetForm = () => {
  isSubmitted.value = false
  consentChecked.value = false
  sendCopyChecked.value = false
  consentError.value = false
}

const redirectToMyApplications = () => {
  window.open('https://cbre.leadingedgeonly.com/dashboard/applications', '_blank')
}

defineExpose({
  handleSubmit,
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
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  border: 2px solid #86efac;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.success-icon i {
  font-size: 5rem;
  color: #10b981;
}

.submission-success h2 {
  color: #059669;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.submission-success p {
  color: #047857;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
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
  color: #10b981;
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
  color: #0369a1;
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
  background: #fef3c7 !important;
  border: 1px solid #fbbf24 !important;
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
