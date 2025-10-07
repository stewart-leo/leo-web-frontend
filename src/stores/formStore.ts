import { defineStore } from 'pinia'
import { ref } from 'vue'
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
  step2: {
    title: string
    description: string
    selectedChallenges: string[]
    selectedAvailability: string
    selectedRegions: string[]
    selectedCountries: { name: string }[]
  }
  step3: {
    answers: Record<string, string>
  }
  step4: {
    uploadedFiles: File[]
    videoLink: string
    selectedReference: string
  }
}

export const useFormStore = defineStore('form', () => {
  // Questions from backend
  const questions = ref<Question[]>([])
  const questionsLoading = ref(false)
  const questionsError = ref<string | null>(null)

  // Form data
  const formData = ref<FormData>({
    step1: {
      name: '',
      companyName: '',
      selectedCountry: null,
    },
    step2: {
      title: '',
      description: '',
      selectedChallenges: [],
      selectedAvailability: '',
      selectedRegions: [],
      selectedCountries: [],
    },
    step3: {
      answers: {},
    },
    step4: {
      uploadedFiles: [],
      videoLink: '',
      selectedReference: '',
    },
  })

  // Fetch questions from backend
  const fetchQuestions = async () => {
    questionsLoading.value = true
    questionsError.value = null

    try {
      const response = await apiClient.get('/supplier-to-expert-mapper-questions')
      questions.value = response.data
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

  const updateStep2 = (data: Partial<FormData['step2']>) => {
    formData.value.step2 = { ...formData.value.step2, ...data }
  }

  const updateStep3 = (data: Partial<FormData['step3']>) => {
    formData.value.step3 = { ...formData.value.step3, ...data }
  }

  const updateStep4 = (data: Partial<FormData['step4']>) => {
    formData.value.step4 = { ...formData.value.step4, ...data }
  }

  // Submit form data to backend
  const submitForm = async () => {
    try {
      const response = await apiClient.post(
        '/supplier-to-expert-mapper-handle-data',
        formData.value,
      )
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

      const response = await apiClient.post(
        '/supplier-to-expert-mapper-handle-file-uploads',
        formDataObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response.data
    } catch (error: any) {
      console.error('Error uploading files:', error)
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
      step2: {
        title: '',
        description: '',
        selectedChallenges: [],
        selectedAvailability: '',
        selectedRegions: [],
        selectedCountries: [],
      },
      step3: {
        answers: {},
      },
      step4: {
        uploadedFiles: [],
        videoLink: '',
        selectedReference: '',
      },
    }
  }

  // Get question by ID
  const getQuestionById = (questionId: number) => {
    return questions.value.find((q) => q.question_id === questionId)
  }

  // Get questions by type
  const getQuestionsByType = (typeId: number) => {
    return questions.value.filter((q) => q.question_type_id === typeId)
  }

  return {
    // State
    questions,
    questionsLoading,
    questionsError,
    formData,

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
  }
})
