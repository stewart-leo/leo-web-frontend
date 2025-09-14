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

      <PvFieldset legend="What is the global or regional reach of this innovation?">
        <div v-for="region of regions" :key="region" class="flex align-items-center">
          <PvCheckbox v-model="selectedRegions" :inputId="region" name="region" :value="region" />
          <label :for="region" class="ml-2">{{ region }}</label>
        </div>
      </PvFieldset>

      <PvFloatLabel class="w-full md:w-80">
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
        <label for="country"> Please list specific countries your innovation is applicable</label>
      </PvFloatLabel>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref } from 'vue'
import challenges from '@/assets/json/challenges.json'
import regions from '@/assets/json/regions.json'
import countries from '@/assets/json/countries.json'

const title = ref('')
const value1 = ref('')
const selectedChallenges = ref([])
const selectedRegions = ref([])
const selectedCountries = ref([]) // This should be an array to hold selected values
const countryOptions = countries.map((country) => ({ name: country.name })) // Options for the multiselect
</script>

<style scoped>
.p-panel {
  border: 2px solid #e2e8f0;
}
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
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
.p-checkbox {
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
