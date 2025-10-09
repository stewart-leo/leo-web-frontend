import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/api'

export interface QuestionAnswerOption {
  answer_id: number
  answer_text: string
}

export interface Question {
  question_id: number
  question_type_id: number
  question_text: string
  question_answer_options: QuestionAnswerOption[]
}

export interface FormData {
  step1: {
    name: string
    companyName: string
    selectedCountry: { id: number; name: string } | null
  }
  step2: Record<number, any> // question_id -> answer
  step3: Record<number, any> // question_id -> answer
  step4: Record<number, any> & {
    uploadedFiles?: Array<{
      source_name: string
      uploaded_name: string
      bucket: string
    }>
    sendEmailCopy?: boolean
  }
}

// Environment-specific question ID mappings
const QUESTION_ID_MAP = {
  dev: {
    INNOVATION_TITLE: 156,
    SHORT_DESCRIPTION: 157,
    CLIENT_CHALLENGE: 158,
    SOLUTION_AVAILABILITY: 159,
    REGIONAL_APPLICATION: 160,
    SPECIFIC_COUNTRIES: 161,
    ROI: 162,
    INTEGRATION: 163,
    DIFFERENTIATION: 164,
    MEASURABLE_VALUE: 165,
    VIDEO_URL: 166,
    REFERENCES: 167,
  },
  staging: {
    INNOVATION_TITLE: 165,
    SHORT_DESCRIPTION: 166,
    CLIENT_CHALLENGE: 167,
    SOLUTION_AVAILABILITY: 168,
    REGIONAL_APPLICATION: 169,
    SPECIFIC_COUNTRIES: 170,
    ROI: 171,
    INTEGRATION: 172,
    DIFFERENTIATION: 173,
    MEASURABLE_VALUE: 174,
    VIDEO_URL: 175,
    REFERENCES: 176,
  },
  production: {
    INNOVATION_TITLE: 156,
    SHORT_DESCRIPTION: 157,
    CLIENT_CHALLENGE: 158,
    SOLUTION_AVAILABILITY: 159,
    REGIONAL_APPLICATION: 160,
    SPECIFIC_COUNTRIES: 161,
    ROI: 162,
    INTEGRATION: 163,
    DIFFERENTIATION: 164,
    MEASURABLE_VALUE: 165,
    VIDEO_URL: 166,
    REFERENCES: 167,
  },
}

// Determine current environment
const getCurrentEnvironment = (): 'dev' | 'staging' | 'production' => {
  const apiUrl = import.meta.env.VITE_API_URL || ''
  console.log('API URL:', apiUrl)
  if (apiUrl.includes('127.0.0.1') || apiUrl.includes('localhost') || apiUrl.includes('dev'))
    return 'dev'
  if (apiUrl.includes('staging')) return 'staging'
  return 'production'
}

export const useFormStore = defineStore('form', () => {
  // Get environment-specific question IDs
  const environment = getCurrentEnvironment()
  const Q = QUESTION_ID_MAP[environment]

  console.log(`Form Store initialized for environment: ${environment}`)
  console.log('Question ID mapping:', Q)
  // All questions from backend
  const allQuestions = ref<Question[]>([])
  const questionsLoading = ref(false)
  const questionsError = ref<string | null>(null)
  const userId = ref<number>()

  // Form data
  const formData = ref<FormData>({
    step1: {
      name: '',
      companyName: '',
      selectedCountry: null,
    },
    step2: {}, // Innovation Details - questions 156-161
    step3: {}, // Innovation Relevance - questions 162-165
    step4: {}, // Supporting Materials - questions 166-167
  })

  // Computed: Get questions for each step based on question_id ranges
  const step2Questions = computed(() => {
    return allQuestions.value.filter(
      (q) => q.question_id >= Q.INNOVATION_TITLE && q.question_id <= Q.SPECIFIC_COUNTRIES,
    )
  })

  const step3Questions = computed(() => {
    return allQuestions.value.filter(
      (q) => q.question_id >= Q.ROI && q.question_id <= Q.MEASURABLE_VALUE,
    )
  })

  const step4Questions = computed(() => {
    return allQuestions.value.filter(
      (q) => q.question_id >= Q.VIDEO_URL && q.question_id <= Q.REFERENCES,
    )
  })

  // Fetch questions from backend
  const fetchQuestions = async () => {
    questionsLoading.value = true
    questionsError.value = null

    try {
      const response = await apiClient.get('/supplier-to-expert-mapper-questions')
      allQuestions.value = response.data

      const urlParams = new URLSearchParams(window.location.search)
      userId.value = parseInt(urlParams.get('uid') || '')
    } catch (error: any) {
      questionsError.value = error.message || 'Failed to fetch questions'
      console.error('Error fetching questions:', error)
    } finally {
      questionsLoading.value = false
    }
  }

  // Update form data for a specific step
  const updateStep1 = (data: Partial<FormData['step1']>) => {
    formData.value.step1 = { ...formData.value.step1, ...data }
  }

  const updateStep2 = (questionId: number, answer: any) => {
    formData.value.step2[questionId] = answer
  }

  const updateStep3 = (questionId: number, answer: any) => {
    formData.value.step3[questionId] = answer
  }

  const updateStep4 = (questionId: number | string, answer: any) => {
    if (typeof questionId === 'number') {
      formData.value.step4[questionId] = answer
    } else {
      // For string keys like 'uploadedFiles' or 'sendEmailCopy'
      ;(formData.value.step4 as any)[questionId] = answer
    }
  }

  // Get question by ID
  const getQuestionById = (questionId: number) => {
    return allQuestions.value.find((q) => q.question_id === questionId)
  }

  // Get questions by type
  const getQuestionsByType = (typeId: number) => {
    return allQuestions.value.filter((q) => q.question_type_id === typeId)
  }

  // Helper to get answer text from answer_id
  const getAnswerText = (questionId: number, answerId: number | number[]) => {
    const question = getQuestionById(questionId)
    if (!question) return null

    if (Array.isArray(answerId)) {
      return answerId.map((id) => {
        const option = question.question_answer_options.find((opt) => opt.answer_id === id)
        return option?.answer_text || ''
      })
    } else {
      const option = question.question_answer_options.find((opt) => opt.answer_id === answerId)
      return option?.answer_text || ''
    }
  }

  const buildSubmissionPayload = () => {
    const payload: any = {
      user_id: userId.value,
      user_company: formData.value.step1.companyName,
      user_country_id: formData.value.step1.selectedCountry?.id || null,
      questions: [],
      send_email_copy: formData.value.step4.sendEmailCopy || false,
      files: {
        'File upload 1': '',
        'File upload 2': '',
        'File upload 3': '',
        'File upload 4': '',
        'File upload 5': '',
      },
    }

    // Step 2 questions
    // Q: Innovation title (type 4 - text) - Always include
    payload.questions.push({
      question_id: Q.INNOVATION_TITLE,
      question_type_id: 4,
      answer_id: null,
      answer_text: formData.value.step2[Q.INNOVATION_TITLE] || '',
    })

    // Q: Short description (type 4 - text) - Always include
    payload.questions.push({
      question_id: Q.SHORT_DESCRIPTION,
      question_type_id: 4,
      answer_id: null,
      answer_text: formData.value.step2[Q.SHORT_DESCRIPTION] || '',
    })

    // Q: Client challenges (type 2 - checkbox/multi-select) - Always include
    const challenges =
      formData.value.step2[Q.CLIENT_CHALLENGE] &&
      Array.isArray(formData.value.step2[Q.CLIENT_CHALLENGE])
        ? formData.value.step2[Q.CLIENT_CHALLENGE]
        : []
    payload.questions.push({
      question_id: Q.CLIENT_CHALLENGE,
      question_type_id: 2,
      answer_id: challenges,
      answer_text: challenges.length > 0 ? getAnswerText(Q.CLIENT_CHALLENGE, challenges) : [],
    })

    // Q: Solution availability (type 3 - dropdown/radio) - Only include if answered
    if (formData.value.step2[Q.SOLUTION_AVAILABILITY]) {
      payload.questions.push({
        question_id: Q.SOLUTION_AVAILABILITY,
        question_type_id: 3,
        answer_id: formData.value.step2[Q.SOLUTION_AVAILABILITY],
        answer_text: getAnswerText(
          Q.SOLUTION_AVAILABILITY,
          formData.value.step2[Q.SOLUTION_AVAILABILITY],
        ),
      })
    }

    // Q: Regional application (type 2 - checkbox) - Only include if Q.SOLUTION_AVAILABILITY = 270 (or staging equivalent)
    const regions =
      formData.value.step2[Q.REGIONAL_APPLICATION] &&
      Array.isArray(formData.value.step2[Q.REGIONAL_APPLICATION])
        ? formData.value.step2[Q.REGIONAL_APPLICATION]
        : []

    // Get the answer_id for "Available in select regions" dynamically
    const availabilityQuestion = getQuestionById(Q.SOLUTION_AVAILABILITY)
    const selectRegionsAnswer = availabilityQuestion?.question_answer_options.find((opt) =>
      opt.answer_text.toLowerCase().includes('select regions'),
    )

    if (formData.value.step2[Q.SOLUTION_AVAILABILITY] === selectRegionsAnswer?.answer_id) {
      payload.questions.push({
        question_id: Q.REGIONAL_APPLICATION,
        question_type_id: 2,
        answer_id: regions,
        answer_text: regions.length > 0 ? getAnswerText(Q.REGIONAL_APPLICATION, regions) : [],
      })
    }

    // Q: Specific countries (type 4 - text) - Only include if Q.SOLUTION_AVAILABILITY = 271 (or staging equivalent)
    const specificCountriesAnswer = availabilityQuestion?.question_answer_options.find((opt) =>
      opt.answer_text.toLowerCase().includes('specific countries'),
    )

    if (formData.value.step2[Q.SOLUTION_AVAILABILITY] === specificCountriesAnswer?.answer_id) {
      const countryNames =
        formData.value.step2[Q.SPECIFIC_COUNTRIES] &&
        Array.isArray(formData.value.step2[Q.SPECIFIC_COUNTRIES])
          ? formData.value.step2[Q.SPECIFIC_COUNTRIES].map((c: any) => c.name).join(', ')
          : ''
      payload.questions.push({
        question_id: Q.SPECIFIC_COUNTRIES,
        question_type_id: 4,
        answer_id: null,
        answer_text: countryNames,
      })
    }

    // Step 3 questions (all type 1 - radio)
    const step3QuestionIds = [Q.ROI, Q.INTEGRATION, Q.DIFFERENTIATION, Q.MEASURABLE_VALUE]
    step3QuestionIds.forEach((questionId) => {
      if (formData.value.step3[questionId]) {
        payload.questions.push({
          question_id: questionId,
          question_type_id: 1,
          answer_id: formData.value.step3[questionId],
          answer_text: getAnswerText(questionId, formData.value.step3[questionId]),
        })
      }
    })

    // Q: Video URL (type 4 - text)
    // Include even if empty to maintain consistency
    payload.questions.push({
      question_id: Q.VIDEO_URL,
      question_type_id: 4,
      answer_id: null,
      answer_text: formData.value.step4[Q.VIDEO_URL] || '',
    })

    // Q: References/case studies (type 3 - dropdown/radio)
    if (formData.value.step4[Q.REFERENCES]) {
      payload.questions.push({
        question_id: Q.REFERENCES,
        question_type_id: 3,
        answer_id: formData.value.step4[Q.REFERENCES],
        answer_text: getAnswerText(Q.REFERENCES, formData.value.step4[Q.REFERENCES]),
      })
    }

    if (formData.value.step4.uploadedFiles && formData.value.step4.uploadedFiles.length > 0) {
      formData.value.step4.uploadedFiles.forEach((file: any, index: number) => {
        const fileKey = `File upload ${index + 1}`
        if (index < 5) {
          // Backend expects max 5 file slots
          payload.files[fileKey] = {
            source_name: file.source_name || '',
            uploaded_name: file.uploaded_name || '',
          }
        }
      })
    }

    return payload
  }

  // Submit form data to backend
  const submitForm = async () => {
    try {
      const payload = buildSubmissionPayload()
      const response = await apiClient.post('/supplier-to-expert-mapper', payload)
      return response.data
    } catch (error: any) {
      console.error('Error submitting form:', error)
      throw error
    }
  }

  // Upload files to backend
  const uploadFiles = async (files: File[]) => {
    try {
      const formDataObj = new FormData()
      files.forEach((file) => {
        formDataObj.append('files[]', file)
      })

      const response = await apiClient.post('/supplier-to-expert-mapper-files', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      console.log('File upload response:', response.data)
      return response.data
    } catch (error: any) {
      console.error('Error uploading files:', error)
      throw error
    }
  }

  // Get presigned URL for S3 upload
  const getPresignedUrl = async (fileData: { 'file-name': string; 'file-type': string }) => {
    try {
      const response = await apiClient.post('/supplier-to-expert-mapper-files', fileData)
      return response.data
    } catch (error: any) {
      console.error('Error getting presigned URL:', error)
      throw error
    }
  }

  // Reset form
  const resetForm = () => {
    formData.value = {
      step1: {
        name: '',
        companyName: '',
        selectedCountry: null,
      },
      step2: {},
      step3: {},
      step4: {},
    }
  }

  return {
    // State
    allQuestions,
    questionsLoading,
    questionsError,
    formData,
    userId,

    // Environment-specific question IDs
    Q,
    environment,

    // Computed
    step2Questions,
    step3Questions,
    step4Questions,

    // Actions
    fetchQuestions,
    updateStep1,
    updateStep2,
    updateStep3,
    updateStep4,
    submitForm,
    uploadFiles,
    resetForm,

    // Getters
    getQuestionById,
    getQuestionsByType,
    getPresignedUrl,
    buildSubmissionPayload,
  }
})
