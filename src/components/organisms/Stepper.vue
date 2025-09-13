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
          @click="(!linear || activeStepIndex >= index) && setActiveStep(step.value)"
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
      <div
        v-for="(step, index) in steps"
        :key="step.value"
        v-show="activeStepIndex === index"
        class="step-panel"
      >
        <slot :name="`step-${step.value}`"></slot>

        <div class="step-navigation">
          <PvButton
            v-if="index > 0"
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="setActiveStep(steps[index - 1].value)"
          />

          <PvButton
            v-if="index < steps.length - 1"
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="setActiveStep(steps[index + 1].value)"
          />

          <PvButton
            v-if="index === steps.length - 1"
            label="Submit"
            icon="pi pi-check"
            severity="success"
            @click="$emit('submit')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  steps: {
    type: Array,
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
})

defineEmits(['submit'])

const activeStep = ref(props.initialStep)

const activeStepIndex = computed(() =>
  props.steps.findIndex((step) => step.value === activeStep.value),
)

const progressWidth = computed(() => {
  if (activeStepIndex.value === -1) return '0%'
  return `${((activeStepIndex.value + 1) / props.steps.length) * 100}%`
})

const setActiveStep = (stepValue) => {
  activeStep.value = stepValue
}

const getStepIcon = (index) => {
  const icons = [
    'pi pi-user',
    'pi pi-cog',
    'pi pi-bullseye',
    'pi pi-file',
    'pi pi-eye',
    'pi pi-send',
  ]
  return icons[index] || null
}
</script>

<style scoped>
.stepper-container {
  width: 100%;
}

/* Progress Section */
.step-indicators {
  position: relative;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.progress-line {
  height: 4px;
  background: var(--surface-border, #e5e7eb);
  border-radius: 2px;
  margin-top: 1.5rem;
}

.progress-active {
  height: 100%;
  background: linear-gradient(
    90deg,
    #10b981 0%,
    #10b981 50%,
    rgba(16, 185, 129, 0.6) 75%,
    rgba(16, 185, 129, 0.3) 90%,
    rgba(16, 185, 129, 0) 100%
  );
  border-radius: 2px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

/* Steps */
.steps-wrapper {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 200px;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.step-item.clickable {
  cursor: pointer;
}

.step-item.clickable:hover {
  background: var(--surface-hover, #f8f9fa);
}

.step-number {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-ground, #ffffff);
  border: 2px solid var(--surface-border, #e5e7eb);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-color-secondary, #6b7280);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-item.active .step-number {
  background: var(--primary-color, #10b981);
  border-color: var(--primary-color, #10b981);
  color: white;
}

.step-item.completed .step-number {
  background: var(--primary-color, #10b981);
  border-color: var(--primary-color, #10b981);
  color: white;
}

.step-content {
  flex: 1;
  min-width: 0;
}

.step-label {
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-color, #374151);
  margin-bottom: 0.25rem;
}

.step-item.active .step-label {
  color: var(--primary-color, #10b981);
}

.step-description {
  font-size: 0.75rem;
  color: var(--text-color-secondary, #9ca3af);
  line-height: 1.4;
}

/* Panels */
.step-panels {
  background: var(--surface-card, #ffffff);
  border: 1px solid var(--surface-border, #e5e7eb);
  border-radius: 8px;
  padding: 2rem;
  min-height: 400px;
}

.step-panel {
  animation: fadeIn 0.3s ease;
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
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--surface-border, #e5e7eb);
}

.step-navigation:only-child {
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
  }
}
</style>
