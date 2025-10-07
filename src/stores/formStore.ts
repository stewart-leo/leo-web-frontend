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
  step4: Record<number, any> // question_id -> answer
}

export const useFormStore = defineStore('form', () => {
  // All questions from backend
  const allQuestions = ref<Question[]>([])
  const questionsLoading = ref(false)
  const questionsError = ref<string | null>(null)

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
    return allQuestions.value.filter((q) => q.question_id >= 156 && q.question_id <= 161)
  })

  const step3Questions = computed(() => {
    return allQuestions.value.filter((q) => q.question_id >= 162 && q.question_id <= 165)
  })

  const step4Questions = computed(() => {
    return allQuestions.value.filter((q) => q.question_id >= 166 && q.question_id <= 167)
  })

  // Fetch questions from backend
  const fetchQuestions = async () => {
    questionsLoading.value = true
    questionsError.value = null

    try {
      const response = await apiClient.get('/supplier-to-expert-mapper-questions')
      allQuestions.value = response.data
      console.log('Questions loaded:', response.data)
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

  const updateStep4 = (questionId: number, answer: any) => {
    formData.value.step4[questionId] = answer
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
      step2: {},
      step3: {},
      step4: {},
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

  return {
    // State
    allQuestions,
    questionsLoading,
    questionsError,
    formData,

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
  }
})
