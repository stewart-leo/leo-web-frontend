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

          <!-- Show upload messages -->
          <PvMessage v-if="uploadStatus === 'success'" severity="success" :closable="false">
            <i class="pi pi-check-circle"></i> Files uploaded successfully!
          </PvMessage>

          <PvMessage
            v-if="uploadStatus === 'error'"
            severity="error"
            :closable="true"
            @close="clearError"
          >
            <i class="pi pi-times-circle"></i> {{ uploadError }}
          </PvMessage>

          <!-- File input button -->
          <div class="file-input-wrapper">
            <input
              type="file"
              ref="fileInputRef"
              multiple
              accept="video/*,.ppt,.pptx,.pdf,.doc,.docx"
              @change="onFileInputChange"
              class="hidden-file-input"
            />
            <PvButton
              label="Choose Files"
              icon="pi pi-upload"
              @click="openFileDialog"
              :disabled="selectedFiles.length >= MAX_FILES"
            />
            <PvButton
              v-if="selectedFiles.length > 0"
              label="Upload Files"
              icon="pi pi-cloud-upload"
              severity="success"
              @click="uploadFiles"
              :loading="uploadStatus === 'uploading'"
            />
            <PvButton
              v-if="selectedFiles.length > 0 && uploadStatus !== 'uploading'"
              label="Clear"
              icon="pi pi-times"
              severity="secondary"
              @click="clearFiles"
            />
          </div>

          <!-- File limit indicator -->
          <p v-if="selectedFiles.length > 0" class="file-count-text">
            {{ selectedFiles.length }} / {{ MAX_FILES }} files selected
          </p>

          <!-- Selected files preview (before upload) -->
          <div
            v-if="selectedFiles.length > 0 && uploadStatus !== 'uploading'"
            class="selected-files-list"
          >
            <h4>Ready to Upload ({{ selectedFiles.length }}):</h4>
            <ul>
              <li v-for="(file, index) in selectedFiles" :key="index">
                <span>
                  <i class="pi pi-file"></i> {{ file.name }} ({{ formatFileSize(file.size) }})
                </span>
                <PvButton
                  icon="pi pi-times"
                  text
                  rounded
                  severity="danger"
                  size="small"
                  @click="removeFile(index)"
                  class="ml-2"
                />
              </li>
            </ul>
          </div>

          <!-- Uploading progress -->
          <div v-if="uploadStatus === 'uploading'" class="uploading-list">
            <h4><i class="pi pi-spin pi-spinner"></i> Uploading files...</h4>
            <ul v-if="uploadProgress.length > 0">
              <li v-for="(progress, index) in uploadProgress" :key="index">
                <i
                  :class="{
                    'pi pi-clock': progress.status === 'pending',
                    'pi pi-spin pi-spinner': progress.status === 'uploading',
                    'pi pi-check-circle': progress.status === 'complete',
                  }"
                ></i>
                {{ selectedFiles[index]?.name || `File ${index + 1}` }}
              </li>
            </ul>
          </div>
        </PvFieldset>
      </div>

      <div class="form-section">
        <PvFieldset legend="[Optional] Video Hyperlink">
          <p class="upload-description">
            If your submission video is hosted on a service (e.g. YouTube or Vimeo) please provide
            the link here versus uploading the native file.
          </p>
          <PvIftaLabel class="w-full">
            <PvInputText
              id="videoLink"
              v-model="videoLink"
              class="w-full"
              :invalid="!!errors.videoLink"
            />
            <label for="videoLink">Video URL</label>
          </PvIftaLabel>
          <small v-if="errors.videoLink" class="error-text">
            {{ errors.videoLink }}
          </small>
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
          <small v-if="errors.selectedReference" class="error-text">
            {{ errors.selectedReference }}
          </small>
        </PvFieldset>
      </div>
    </div>
  </PvPanel>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { string, number } from 'yup'
import { useFormStore } from '@/stores/formStore'
import axios from 'axios'

const formStore = useFormStore()

interface UploadedFile {
  source_name: string
  uploaded_name: string
  bucket: string
}

interface UploadProgress {
  status: 'pending' | 'uploading' | 'complete'
}

const uploadedFilesList = ref<UploadedFile[]>([])
const uploadStatus = ref<'success' | 'error' | 'uploading' | null>(null)
const uploadError = ref<string>('')
const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFiles = ref<File[]>([])
const uploadProgress = ref<UploadProgress[]>([])

const MAX_FILES = 5

const referenceOptions = [
  { value: 298, label: 'Reference provided' },
  { value: 299, label: 'Case study provided' },
  { value: 300, label: 'Reference and case study provided' },
  { value: 301, label: 'Neither provided' },
]

const { errors, validate, setFieldError } = useForm({
  initialValues: {
    videoLink: formStore.formData.step4[166] || '',
    selectedReference: formStore.formData.step4[167] || null,
  },
  validateOnMount: false,
})

const isValidUrl = (value: string | undefined): boolean => {
  if (!value) return true

  // Regex pattern for URL validation - accepts with or without protocol
  const urlPattern =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/

  return urlPattern.test(value)
}

const { value: videoLink } = useField<string>(
  'videoLink',
  string()
    .test('is-url', 'Please enter a valid URL', isValidUrl)
    .transform((value) => value || undefined)
    .optional(),
  { validateOnValueUpdate: false },
)

const { value: selectedReference } = useField<number | null>(
  'selectedReference',
  number().required('Please select an option').typeError('Please select an option'),
  { validateOnValueUpdate: false },
)

uploadedFilesList.value = formStore.formData.step4.uploadedFiles || []

const clearError = () => {
  uploadStatus.value = null
  uploadError.value = ''
}

const openFileDialog = () => {
  if (selectedFiles.value.length >= MAX_FILES) {
    uploadStatus.value = 'error'
    uploadError.value = `Maximum ${MAX_FILES} files allowed. Please remove some files before adding more.`
    return
  }
  fileInputRef.value?.click()
}

const onFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newFiles = Array.from(target.files || [])

  newFiles.forEach((newFile) => {
    if (selectedFiles.value.length >= MAX_FILES) {
      uploadStatus.value = 'error'
      uploadError.value = `Maximum ${MAX_FILES} files allowed. Only the first ${MAX_FILES} files were added.`
      return
    }

    const isDuplicate = selectedFiles.value.some(
      (f) => f.name === newFile.name && f.size === newFile.size,
    )
    if (!isDuplicate) {
      selectedFiles.value.push(newFile)
    }
  })

  console.log('Files selected:', selectedFiles.value)

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1)
  if (uploadStatus.value === 'error' && uploadError.value.includes('Maximum')) {
    uploadStatus.value = null
    uploadError.value = ''
  }
}

const clearFiles = () => {
  selectedFiles.value = []
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  if (uploadStatus.value === 'error' && uploadError.value.includes('Maximum')) {
    uploadStatus.value = null
    uploadError.value = ''
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const uploadFiles = async () => {
  if (selectedFiles.value.length === 0) {
    return
  }

  if (selectedFiles.value.length > MAX_FILES) {
    uploadStatus.value = 'error'
    uploadError.value = `Maximum ${MAX_FILES} files allowed`
    return
  }

  uploadStatus.value = 'uploading'
  uploadError.value = ''
  uploadProgress.value = selectedFiles.value.map(() => ({ status: 'pending' as const }))

  console.log('Starting upload process for', selectedFiles.value.length, 'files...')

  try {
    const uploadedFiles: UploadedFile[] = []

    for (let i = 0; i < selectedFiles.value.length; i++) {
      const file = selectedFiles.value[i]
      uploadProgress.value[i].status = 'uploading'

      console.log(`Processing file ${i + 1}/${selectedFiles.value.length}:`, file.name)

      const presignedResponse = await formStore.getPresignedUrl({
        'file-name': file.name,
        'file-type': file.type,
      })

      console.log('Presigned URL response:', presignedResponse)

      await axios.put(presignedResponse.uri, file, {
        headers: {
          'Content-Type': file.type,
          'x-amz-acl': 'public-read',
        },
      })

      console.log(`File ${i + 1} uploaded to S3 successfully`)

      uploadedFiles.push({
        source_name: file.name,
        uploaded_name: presignedResponse['full-path'],
        bucket: presignedResponse.bucket,
      })

      uploadProgress.value[i].status = 'complete'
    }

    uploadedFilesList.value = [...uploadedFilesList.value, ...uploadedFiles]
    formStore.updateStep4('uploadedFiles', uploadedFilesList.value)

    uploadStatus.value = 'success'

    console.log('All files uploaded successfully:', uploadedFiles)

    setTimeout(() => {
      uploadStatus.value = null
      uploadProgress.value = []
    }, 3000)
  } catch (error: any) {
    console.error('File upload error:', error)
    console.error('Error response:', error.response)
    uploadStatus.value = 'error'
    uploadError.value = error.response?.data?.message || error.message || 'Failed to upload files'
  }
}

watch(videoLink, (newValue) => {
  formStore.updateStep4(166, newValue)
  if (newValue) setFieldError('videoLink', undefined)
})

watch(selectedReference, (newValue) => {
  formStore.updateStep4(167, newValue)
  if (newValue !== null) setFieldError('selectedReference', undefined)
})

const validateAll = async () => {
  // Check if there are files selected but not uploaded
  if (selectedFiles.value.length > 0) {
    uploadError.value =
      "Please upload the selected files before proceeding, or clear them if you don't want to upload."
    uploadStatus.value = 'error'
    return false
  }

  const result = await validate()
  return result.valid
}

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
.upload-description {
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.file-input-wrapper {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.hidden-file-input {
  display: none;
}
.file-count-text {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #059669;
  font-weight: 500;
}
.selected-files-list,
.uploading-list {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}
.selected-files-list {
  background: #fffbeb;
  border-color: #fde68a;
}
.uploading-list {
  background: #dbeafe;
  border-color: #93c5fd;
}
.selected-files-list h4,
.uploading-list h4 {
  margin: 0 0 0.5rem 0;
  font-size: 0.95rem;
}
.selected-files-list h4 {
  color: #92400e;
}
.uploading-list h4 {
  color: #1e40af;
}
.selected-files-list ul,
.uploading-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.selected-files-list li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #78350f;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.uploading-list li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  color: #1e40af;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.selected-files-list li i {
  margin-right: 0.5rem;
}
.uploading-list li i.pi-check-circle {
  color: #059669;
}
.uploading-list li i.pi-clock {
  color: #9ca3af;
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
:deep(.p-message) {
  margin-bottom: 1rem;
}

.error-text {
  display: block;
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  margin-left: 0.25rem;
}

:deep(.p-inputtext.p-invalid) {
  border-color: #dc2626;
}

:deep(.p-inputtext.p-invalid:focus) {
  border-color: #dc2626;
  box-shadow: 0 0 0 0.2rem rgba(220, 38, 38, 0.2);
}
</style>
