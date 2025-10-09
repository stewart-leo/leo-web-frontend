<template>
  <div class="stepper-container">
    <div class="step-indicators">
      <div class="steps-wrapper">
        <div
          v-for="(step, index) in steps"
          :key="step.value"
          class="step-item"
          :class="{
            active: activeStepIndex === index,
            completed: activeStepIndex > index,
            clickable: !linear || activeStepIndex >= index,
          }"
          @click="(!linear || activeStepIndex >= index) && handleStepClick(step.value)"
        >
          <div class="step-number">
            <i v-if="activeStepIndex > index" class="pi pi-check"></i>
            <i v-else-if="getStepIcon(index)" :class="getStepIcon(index)"></i>
            <span v-else>{{ index + 1 }}</span>
          </div>

          <div class="step-content">
            <div class="step-label">{{ step.label }}</div>
            <div v-if="step.description" class="step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>
      <div class="progress-line">
        <div class="progress-active" :style="{ width: progressWidth }"></div>
      </div>
    </div>

    <div class="step-panels">
      <div class="step-panels-wrapper">
        <div
          v-for="(step, index) in steps"
          :key="step.value"
          v-show="activeStepIndex === index"
          class="step-panel"
        >
          <div class="step-panel-content">
            <slot :name="`step-${step.value}`"></slot>
          </div>

          <div class="step-navigation" v-if="!isLastStepSubmitted(index)">
            <PvButton
              v-if="index > 0"
              label="Back"
              severity="secondary"
              icon="pi pi-arrow-left"
              @click="handleBack(step, index)"
            />

            <PvButton
              v-if="index < steps.length - 1"
              label="Next"
              icon="pi pi-arrow-right"
              iconPos="right"
              @click="handleNext(step, index)"
            />

            <PvButton
              v-if="index === steps.length - 1"
              label="Submit"
              icon="pi pi-check"
              severity="success"
              @click="handleSubmit"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, getCurrentInstance } from 'vue'

interface Step {
  value: string
  label: string
  description?: string
}

interface StepComponent {
  validateAll?: () => Promise<boolean>
  isValid?: () => Promise<boolean>
}

const props = defineProps({
  steps: {
    type: Array as () => Step[],
    required: true,
  },
  initialStep: {
    type: String,
    default: '1',
  },
  linear: {
    type: Boolean,
    default: false,
  },
  step6Submitted: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const activeStep = ref(props.initialStep)
const instance = getCurrentInstance()

const activeStepIndex = computed(() =>
  props.steps.findIndex((step) => step.value === activeStep.value),
)

const progressWidth = computed(() => {
  if (activeStepIndex.value === -1) return '0%'
  return `${((activeStepIndex.value + 1) / props.steps.length) * 100}%`
})

// Get step component ref
const getStepComponentRef = (stepValue: string): StepComponent | null => {
  const slotName = `step-${stepValue}`
  const parentComponent = instance?.parent

  if (!parentComponent) return null

  // Try to find the component in the parent's refs
  const refs = parentComponent.refs
  if (refs && refs[`${slotName}Ref`]) {
    return refs[`${slotName}Ref`] as StepComponent
  }

  return null
}

// Handle Next button click
const handleNext = async (step: Step, index: number) => {
  // Validate Step 1 or Step 2
  if (step.value === '1' || step.value === '2') {
    const stepComponent = getStepComponentRef(step.value)

    if (stepComponent && typeof stepComponent.validateAll === 'function') {
      const isValid = await stepComponent.validateAll()

      if (!isValid) {
        console.log(`Step ${step.value} validation failed`)
        return
      }
    }
  }

  // Proceed to next step
  setActiveStep(props.steps[index + 1].value)
}

// Handle Back button click
const handleBack = (step: Step, index: number) => {
  setActiveStep(props.steps[index - 1].value)
}

// Handle step indicator click
const handleStepClick = async (stepValue: string) => {
  const currentStepValue = activeStep.value
  const targetStepValue = parseInt(stepValue)
  const currentStepNum = parseInt(currentStepValue)

  // If trying to go forward, validate current step if it's Step 1 or Step 2
  if (targetStepValue > currentStepNum && (currentStepValue === '1' || currentStepValue === '2')) {
    const stepComponent = getStepComponentRef(currentStepValue)

    if (stepComponent && typeof stepComponent.validateAll === 'function') {
      const isValid = await stepComponent.validateAll()

      if (!isValid) {
        console.log(`Step ${currentStepValue} validation failed`)
        return
      }
    }
  }

  setActiveStep(stepValue)
}

const setActiveStep = (stepValue: string) => {
  activeStep.value = stepValue
}

// Check if the last step has been submitted
const isLastStepSubmitted = (index: number) => {
  return index === props.steps.length - 1 && props.step6Submitted
}

const handleSubmit = () => {
  emit('submit')
}

const getStepIcon = (index: number) => {
  const icons = [
    'pi pi-user',
    'pi pi-cog',
    'pi pi-bullseye',
    'pi pi-file',
    'pi pi-eye',
    'pi pi-check-circle',
  ]
  return icons[index] || null
}
</script>

<style scoped>
.stepper-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Progress Section */
.step-indicators {
  position: relative;
  margin-bottom: 2rem;
  flex-shrink: 0;
}

.progress-line {
  height: 4px;
  background: var(--cbre-light-grey, #e5e7eb);
  border-radius: 2px;
  margin-top: 1.5rem;
}

.progress-active {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--cbre-green, #003f2d) 0%,
    var(--cbre-green, #003f2d) 50%,
    rgba(0, 63, 45, 0.6) 75%,
    rgba(0, 63, 45, 0.3) 90%,
    rgba(0, 63, 45, 0) 100%
  );
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(0, 63, 45, 0.4);
}

/* Steps */
.steps-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  overflow-x: auto;
  margin-top: 20px;
  width: 100%;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.step-item.clickable {
  cursor: pointer;
}

.step-item.clickable:hover {
  background: #f8f9fa;
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border: 2px solid var(--cbre-light-grey, #e5e7eb);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--cbre-dark-grey, #6b7280);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-item.active .step-number {
  background: var(--cbre-green, #003f2d);
  border-color: var(--cbre-green, #003f2d);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 63, 45, 0.3);
}

.step-item.completed .step-number {
  background: var(--cbre-green, #003f2d);
  border-color: var(--cbre-green, #003f2d);
  color: white;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-label {
  font-weight: 600;
  font-size: 1.25rem;
  color: var(--cbre-dark-grey, #374151);
  margin-bottom: 0.25rem;
}

.step-item.active .step-label {
  color: var(--cbre-green, #003f2d);
}

.step-description {
  font-size: 1rem;
  color: #9ca3af;
  line-height: 1.4;
}

/* Panels */
.step-panels {
  background: #ffffff;
  border: 2px solid var(--cbre-light-grey, #e5e7eb);
  border-radius: 8px;
  padding: 2rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 600px;
  height: 600px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 63, 45, 0.05);
}

.step-panels-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.step-panel {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  animation: fadeIn 0.3s ease;
}

.step-panel-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.5rem;
}

/* Custom scrollbar */
.step-panel-content::-webkit-scrollbar {
  width: 8px;
}

.step-panel-content::-webkit-scrollbar-track {
  background: #f1f3f5;
  border-radius: 4px;
}

.step-panel-content::-webkit-scrollbar-thumb {
  background: var(--cbre-cement, #888);
  border-radius: 4px;
}

.step-panel-content::-webkit-scrollbar-thumb:hover {
  background: var(--cbre-dark-grey, #555);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.step-navigation {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
  padding-top: 2rem;
  border-top: 2px solid var(--cbre-light-grey, #e5e7eb);
  flex-shrink: 0;
}

.step-navigation:has(> :only-child) {
  justify-content: flex-end;
}

/* Responsive */
@media (max-width: 768px) {
  .step-indicators {
    padding: 0 1rem;
  }

  .step-item {
    min-width: 160px;
  }

  .step-number {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-panels {
    padding: 1rem;
    min-height: 500px;
    height: 500px;
  }
}

@media (min-width: 1024px) {
  .step-panels {
    min-height: 650px;
    height: 650px;
  }
}
</style>
