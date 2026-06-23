<template>
  <main class="forbidden-page">
    <section class="forbidden-panel">
      <div class="forbidden-code">403</div>
      <h1>Acceso restringido</h1>
      <p>
        Tu usuario no tiene permisos para consultar este recurso.
      </p>
      <NuxtLink class="btn btn-pill btn-gradient color-4" to="/">
        Volver a inicio
      </NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "login",
});

useHead({
  title: "Acceso restringido",
});
</script>

<style scoped>
.forbidden-page {
  align-items: center;
  background: #f7f8fa;
  display: flex;
  min-height: 100vh;
  padding: 24px;
}

.forbidden-panel {
  background: #ffffff;
  border: 1px solid rgba(28, 45, 58, 0.1);
  border-radius: 8px;
  box-shadow: 0 16px 40px rgba(28, 45, 58, 0.08);
  margin: 0 auto;
  max-width: 460px;
  padding: 32px;
  text-align: center;
}

.forbidden-code {
  color: var(--theme-default7, #586167);
  font-size: 52px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 16px;
}

h1 {
  color: #1c2d3a;
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  color: #6c757d;
  line-height: 1.6;
  margin: 0 auto 24px;
}
</style>
