<template>
  <Stepper ref="stepperRef" :steps="steps" :step6-submitted="isStep6Submitted" @submit="submitForm">
    <template #step-1>
      <Step1 ref="step-1Ref" />
    </template>
    <template #step-2>
      <Step2 ref="step-2Ref" />
    </template>
    <template #step-3>
      <Step3 ref="step-3Ref" />
    </template>
    <template #step-4>
      <Step4 ref="step-4Ref" />
    </template>
    <template #step-5>
      <Step5 ref="step-5Ref" />
    </template>
    <template #step-6>
      <Step6 ref="step6Ref" @update:is-submitted="handleSubmissionUpdate" />
    </template>
  </Stepper>
</template>

<script setup>
import { ref } from 'vue'
import Stepper from '@/components/organisms/Stepper.vue'
import Step1 from '@/components/molecules/Step1.vue'
import Step2 from '@/components/molecules/Step2.vue'
import Step3 from '@/components/molecules/Step3.vue'
import Step4 from '@/components/molecules/Step4.vue'
import Step5 from '@/components/molecules/Step5.vue'
import Step6 from '@/components/molecules/Step6.vue'

const stepperRef = ref(null)
const step6Ref = ref(null)
const isStep6Submitted = ref(false)

const steps = [
  {
    value: '1',
    label: 'Supplier Details',
    description: 'Enter your contact information',
  },
  {
    value: '2',
    label: 'Innovation Details',
    description: 'Configure your preferences',
  },
  {
    value: '3',
    label: 'Innovation Relevance',
    description: 'Define relevance and impact',
  },
  {
    value: '4',
    label: 'Supporting Materials',
    description: 'Upload documents and files',
  },
  {
    value: '5',
    label: 'Review',
    description: 'Review your submission',
  },
  {
    value: '6',
    label: 'Submit',
    description: 'Complete your application',
  },
]

function submitForm() {
  console.log('Form submission initiated from MultiStepForm')
  if (step6Ref.value) {
    step6Ref.value.handleSubmit()
  }
}

function handleSubmissionUpdate(value) {
  isStep6Submitted.value = value
}
</script>
