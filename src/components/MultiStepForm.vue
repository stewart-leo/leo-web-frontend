<template>
  <PvStepper value="1" linear class="basis-[50rem]">
    <PvStepList>
      <PvStep value="1">Supplier Details</PvStep>
      <PvStep value="2">Innovation Details</PvStep>
      <PvStep value="3">Innovation Relevance</PvStep>
      <PvStep value="4">Supporting Materials</PvStep>
      <PvStep value="5">Review</PvStep>
      <PvStep value="6">Submit</PvStep>
    </PvStepList>
    <PvStepPanels>
      <PvStepPanel v-slot="{ activateCallback }" value="1">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content I
          </div>
        </div>
        <div class="flex pt-6 justify-end">
          <PvButton label="Next" icon="pi pi-arrow-right" @click="activateCallback('2')" />
        </div>
      </PvStepPanel>
      <PvStepPanel v-slot="{ activateCallback }" value="2">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content II
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <PvButton
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('1')"
          />
          <PvButton
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="activateCallback('3')"
          />
        </div>
      </PvStepPanel>
      <PvStepPanel v-slot="{ activateCallback }" value="3">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content III
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <PvButton
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('2')"
          />
          <PvButton
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="activateCallback('4')"
          />
        </div>
      </PvStepPanel>
      <PvStepPanel v-slot="{ activateCallback }" value="4">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content IV
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <PvButton
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('3')"
          />
          <PvButton
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="activateCallback('5')"
          />
        </div>
      </PvStepPanel>
      <PvStepPanel v-slot="{ activateCallback }" value="5">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content V
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <PvButton
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('4')"
          />
          <PvButton
            label="Next"
            icon="pi pi-arrow-right"
            iconPos="right"
            @click="activateCallback('6')"
          />
        </div>
      </PvStepPanel>
      <PvStepPanel v-slot="{ activateCallback }" value="6">
        <div class="flex flex-col h-48">
          <div
            class="border-2 border-dashed border-surface-200 dark:border-surface-700 rounded bg-surface-50 dark:bg-surface-950 flex-auto flex justify-center items-center font-medium"
          >
            Content VI
          </div>
        </div>
        <div class="flex pt-6 justify-between">
          <PvButton
            label="Back"
            severity="secondary"
            icon="pi pi-arrow-left"
            @click="activateCallback('5')"
          />
          <PvButton label="Submit" icon="pi pi-check" @click="submitForm" />
        </div>
      </PvStepPanel>
    </PvStepPanels>
  </PvStepper>
</template>

<script setup>
function submitForm() {
  // Handle form submission logic here
  alert('Form submitted!')
}
</script>
