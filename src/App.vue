<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/molecules/AppHeader.vue'
import { useFormStore } from '@/stores/formStore'

const formStore = useFormStore()

onMounted(async () => {
  await formStore.fetchQuestions()
})
</script>

<template>
  <AppHeader />
  <RouterView />
</template>
