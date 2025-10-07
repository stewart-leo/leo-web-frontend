<template>
  <PvPanel>
    <div class="form-container">
      <div class="upload-section">
        <PvFieldset legend="[Optional] File Upload for Supporting Materials">
          <p class="upload-description">
            <strong>Video (90 Seconds)</strong><br />
            As an added bonus to your entry, please submit a video that does not exceed 90 seconds
            in length. Ideally, this video should illustrate the innovation in action, or otherwise
            enhance and support the submission via visualization.
          </p>
          <p class="upload-description">
            <strong>16:9 PowerPoint Decks</strong><br />
            You can also upload additional marketing decks or supporting materials for your
            innovation below. All slides should have a widescreen, 16:9 Microsoft PowerPoint
            dimension.
          </p>
          <p class="upload-description">
            <strong>Reference</strong><br />
            A reference document can be provided for any previously completed project(s).
          </p>
          <p class="upload-description">
            <strong>Case Study</strong><br />
            Case study of previously completed project(s).
          </p>
          <PvFileUpload
            name="supportingMaterials[]"
            :multiple="true"
            accept="video/*,.ppt,.pptx,.pdf,.doc,.docx"
            :maxFileSize="31457000"
            chooseLabel="Choose Files"
            class="custom-file-upload"
            @select="onFileSelect"
          >
            <template #empty>
              <div class="upload-drop-zone">
                <i class="pi pi-file-arrow-up" style="font-size: 2.5rem"></i>
                <p class="text-xl font-semibold text-gray-700 mb-2">Drop your files here</p>
                <p class="text-sm text-gray-500">or click Choose Files</p>
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
          <PvIftaLabel class="w-full">
            <PvInputText id="videoLink" v-model="videoLink" class="w-full" />
            <label for="videoLink">Video URL</label>
          </PvIftaLabel>
        </PvFieldset>
      </div>
      <div class="form-section">
        <PvFieldset legend="Have you included references and case studies in your application?">
          <div class="radio-options">
            <div v-for="option in referenceOptions" :key="option.value" class="radio-option">
              <PvRadioButton
                v-model="selectedReference"
                :inputId="`reference_${option.value}`"
                name="reference"
                :value="option.value"
              />
              <label :for="`reference_${option.value}`" class="radio-label">{{
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

const videoLink = ref('')
const selectedReference = ref(null)
const uploadedFiles = ref([])

// Map reference options to answer_id from API (question_id: 167)
const referenceOptions = [
  { value: 298, label: 'Reference provided' },
  { value: 299, label: 'Case study provided' },
  { value: 300, label: 'Reference and case study provided' },
  { value: 301, label: 'Neither provided' },
]

// Handle file selection
const onFileSelect = (event) => {
  uploadedFiles.value = event.files
  // Save files to store
  formStore.updateStep4('uploadedFiles', uploadedFiles.value)
}

// Load saved data from store on mount
onMounted(() => {
  videoLink.value = formStore.formData.step4[166] || ''
  selectedReference.value = formStore.formData.step4[167] || null
  uploadedFiles.value = formStore.formData.step4.uploadedFiles || []
})

// Watch and save to store
watch([videoLink, selectedReference], () => {
  formStore.updateStep4(166, videoLink.value) // YouTube or Vimeo link
  formStore.updateStep4(167, selectedReference.value) // References/case studies
})
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
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
.strong {
  font-weight: bold !important;
}
:deep(.p-fieldset) {
  border-color: #cbd5e1;
  margin-top: -1rem;
}
:deep(.p-fieldset-legend-label) {
  font-weight: 600;
  color: #1f2937;
}
:deep(.p-inputtext) {
  width: 100%;
}
</style>
