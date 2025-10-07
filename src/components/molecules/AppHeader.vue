<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left">
        <img src="/images/cbre-logo-white.svg" alt="CBRE" class="cbre-logo" />
      </div>
      <div class="header-center">
        <h1 class="header-title">UK Supplier Partner Innovation Challenge</h1>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
// No props or logic needed for now
</script>

<style scoped>
.app-header {
  background: #003f2d;
  color: white;
  padding: 1.5rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  margin: 0 auto;
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  align-items: center;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.cbre-logo {
  height: 25px;
  width: auto;
}

.header-center {
  text-align: center;
}

.header-title {
  font-family: 'Financier Display', Georgia, serif;
  font-size: 2rem;
  font-weight: 400;
  margin: 0;
  line-height: 1.4;
}

/* Responsive design */
@media (max-width: 1024px) {
  .header-content {
    grid-template-columns: auto 1fr auto;
  }

  .header-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem 1.5rem;
  }

  .header-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }

  .header-left {
    justify-content: center;
  }

  .header-title {
    font-size: 1rem;
  }

  .cbre-logo {
    height: 40px;
    width: auto;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 1rem 1.5rem;
  }

  .header-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }

  .header-left {
    justify-content: center;
  }

  .header-title {
    font-size: 1rem;
  }

  .cbre-logo {
    height: 32px;
  }
}
</style>
