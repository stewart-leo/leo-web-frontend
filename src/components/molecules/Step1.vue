<template>
  <PvPanel>
    <div class="form-container">
      <PvFloatLabel>
        <PvInputText id="name" v-model="name" />
        <label for="name">Name</label>
      </PvFloatLabel>
      <PvFloatLabel>
        <PvInputText id="companyName" v-model="companyName" />
        <label for="companyName">Company Name</label>
      </PvFloatLabel>
      <PvFloatLabel>
        <PvAutoComplete
          id="countries"
          v-model="selectedCountry"
          inputId="country"
          :suggestions="filteredCountries"
          @complete="searchCountries"
          optionLabel="name"
          dropdown
        />
        <label for="country">Select a Country</label>
      </PvFloatLabel>
    </div>
  </PvPanel>
</template>

<script setup>
import { ref } from 'vue'
import countries from '@/assets/json/countries.json'

const name = ref()
const companyName = ref()
const selectedCountry = ref()
const filteredCountries = ref([])

const searchCountries = (event) => {
  const query = event.query.toLowerCase()
  filteredCountries.value = countries.filter((country) =>
    country.name.toLowerCase().includes(query),
  )
}
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
</style>
