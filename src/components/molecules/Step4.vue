<template>
  <PvPanel>
    <div class="form-container">
      <div class="upload-section">
        <PvFieldset legend="File Upload for Supporting Materials">
          <p class="upload-description">
            <strong>Optional Video (90 Seconds)</strong><br />
            As an added bonus to your entry, please submit a video that does not exceed 90 seconds
            in length. Ideally, this video should illustrate the innovation in action, or otherwise
            enhance and support the submission via visualization.
          </p>
          <p class="upload-description">
            <strong>Optional (16:9 PowerPoint Decks)</strong><br />
            You can also upload additional marketing decks or supporting materials for your
            innovation below. All slides should have a widescreen, 16:9 Microsoft PowerPoint
            dimension.
          </p>
          <PvFileUpload
            name="supportingMaterials[]"
            :multiple="true"
            accept="video/*,.ppt,.pptx,.pdf,.doc,.docx"
            :maxFileSize="50000000"
            chooseLabel="Choose Files"
            class="custom-file-upload"
          >
            <template #empty>
              <div class="upload-drop-zone">
                <i class="pi pi-file text-6xl text-primary mb-4"></i>
                <p class="text-xl font-semibold text-gray-700 mb-2">Drop your files here</p>
                <p class="text-sm text-gray-500">or click to browse</p>
              </div>
            </template>
          </PvFileUpload>
        </PvFieldset>
      </div>
      <div class="form-section">
        <PvFieldset legend="[Optional] Video Hyperlink">
          <p class="upload-description">
            If your submission video is hosted on a service (e.g. YouTube or Vimeo) please provide
            the link here versus uploading the native file.
          </p>
          <PvFloatLabel class="w-full">
            <PvInputText id="videoLink" v-model="videoLink" class="w-full" />
            <label for="videoLink">Video URL (YouTube, Vimeo, etc.)</label>
          </PvFloatLabel>
        </PvFieldset>
      </div>
      <div class="form-section">
        <PvFieldset legend="Have you included references and case studies in your application?">
          <div class="radio-options">
            <div v-for="(option, index) in referenceOptions" :key="index" class="radio-option">
              <PvRadioButton
                v-model="selectedReference"
                :inputId="`reference_${index}`"
                name="reference"
                :value="option"
              />
              <label :for="`reference_${index}`" class="radio-label">{{ option }}</label>
            </div>
          </div>
        </PvFieldset>
      </div>
      <div class="form-section">
        <div class="consent-section">
          <p class="consent-text">
            Any information shared as part of a submission, may be shared internally. Please tick
            the below box to confirm you understand this:
            <span class="required">*</span>
          </p>
          <div class="checkbox-wrapper">
            <PvCheckbox v-model="consentAgreed" inputId="consent" binary />
            <label for="consent" class="consent-label">
              I understand and agree to the information sharing policy
            </label>
          </div>
        </div>
      </div>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref } from 'vue'

const videoLink = ref('')
const selectedReference = ref('')
const consentAgreed = ref(false)

const referenceOptions = [
  'Reference provided',
  'Case study provided',
  'Reference and case study provided',
  'Neither provided',
]
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}
.upload-section,
.form-section {
  margin-bottom: 1.5rem;
}
.upload-description {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.custom-file-upload {
  width: 100%;
  margin-top: 1rem;
}
.upload-drop-zone {
  text-align: center;
  padding: 3rem 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
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
.consent-section {
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.consent-text {
  color: #374151;
  line-height: 1.6;
  margin-bottom: 1rem;
}
.required {
  color: #ef4444;
  font-weight: bold;
}
.checkbox-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}
.consent-label {
  color: #374151;
  line-height: 1.5;
  font-size: 0.9rem;
}
.strong {
  font-weight: bold !important;
}
:deep(.p-fieldset) {
  border-color: #cbd5e1;
  margin-bottom: 1rem;
}
:deep(.p-fieldset-legend-label) {
  font-weight: 600;
  color: #1f2937;
}
:deep(.p-inputtext) {
  width: 100%;
}
</style>
