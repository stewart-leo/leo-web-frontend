<template>
  <PvPanel>
    <div class="form-container">
      <PvFloatLabel>
        <PvInputText id="title" v-model="title" />
        <label for="title">Innovation Title</label>
      </PvFloatLabel>
      <PvFloatLabel>
        <PvTextArea id="descripton" v-model="value1" :autoResize="true" rows="3" cols="137" />
        <label for="descripton">Short description of your innovation submission</label>
      </PvFloatLabel>

      <PvFieldset legend="What client challenge is your innovation solving?">
        <div v-for="challenge of challenges" :key="challenge" class="flex align-items-center">
          <PvCheckbox
            v-model="selectedChallenges"
            :inputId="challenge"
            name="challenge"
            :value="challenge"
          />
          <label :for="challenge" class="ml-2">{{ challenge }}</label>
        </div>
      </PvFieldset>

      <PvFieldset legend="Is the proposed solution available in multiple countries?">
        <div
          v-for="option of availabilityOptions"
          :key="option.value"
          class="flex align-items-center"
        >
          <PvRadioButton
            v-model="selectedAvailability"
            :inputId="option.value"
            name="availability"
            :value="option.value"
          />
          <label :for="option.value" class="ml-2">{{ option.label }}</label>
        </div>
      </PvFieldset>

      <PvFieldset
        v-if="selectedAvailability === 'select_regions'"
        legend="What is the regional application of this innovation?"
      >
        <div v-for="region of regions" :key="region" class="flex align-items-center">
          <PvCheckbox v-model="selectedRegions" :inputId="region" name="region" :value="region" />
          <label :for="region" class="ml-2">{{ region }}</label>
        </div>
      </PvFieldset>

      <PvFloatLabel v-if="selectedAvailability === 'specific_countries'" class="w-full md:w-80">
        <PvMultiSelect
          id="country"
          v-model="selectedCountries"
          :options="countryOptions"
          display="chip"
          optionLabel="name"
          filter
          :maxSelectedLabels="3"
          class="w-full"
        />
        <label for="country"> Please list specific countries your innovation is applicable </label>
      </PvFloatLabel>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref, watch } from 'vue'
import challenges from '@/assets/json/challenges.json'
import regions from '@/assets/json/regions.json'
import countries from '@/assets/json/countries.json'

const title = ref('')
const value1 = ref('')
const selectedChallenges = ref([])
const selectedRegions = ref([])
const selectedCountries = ref([])
const selectedAvailability = ref('')

const availabilityOptions = [
  { value: 'globally_available', label: 'Yes, globally available' },
  { value: 'select_regions', label: 'Available in select regions' },
  { value: 'specific_countries', label: 'Not currently available outside specific countries' },
  { value: 'unknown', label: 'Availability unknown' },
]

const countryOptions = countries.map((country) => ({ name: country.name }))

// Clear dependent fields when availability changes
watch(selectedAvailability, (newValue) => {
  if (newValue !== 'select_regions') {
    selectedRegions.value = []
  }
  if (newValue !== 'specific_countries') {
    selectedCountries.value = []
  }
})
</script>

<style scoped>
.p-panel {
  border: 2px solid #e2e8f0;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
}
:deep(.p-inputtext),
:deep(.p-autocomplete) {
  width: 100%;
}
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 0.3rem;
  margin-top: -1rem;
}
.p-checkbox,
.p-radiobutton {
  width: 2rem;
  height: 1.5rem;
}
.p-fieldset {
  border-color: #cbd5e1;
  margin-top: -1rem;
}
.p-multiselect {
  width: 100%;
}
:deep(.p-fieldset-legend-label) {
  font-weight: unset;
}
</style>
