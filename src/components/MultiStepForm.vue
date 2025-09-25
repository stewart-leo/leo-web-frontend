<template>
  <Stepper :steps="steps" @submit="submitForm" class="basis-[50rem]">
    <template #step-1>
      <Step1 />
    </template>
    <template #step-2>
      <Step2 />
    </template>
    <template #step-3>
      <Step3 />
    </template>
    <template #step-4>
      <Step4 />
    </template>
    <template #step-5>
      <Step5 />
    </template>
    <template #step-6>
      <Step6 ref="step6Ref" />
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

const step6Ref = ref(null)

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
  console.log('Form submission initiated from Step6')
  if (step6Ref.value) {
    step6Ref.value.handleSubmit()
  }
}
</script>
