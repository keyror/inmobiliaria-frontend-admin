<template>
  <nav>
    <div class="nav nav-tabs" id="nav-tab" role="tablist">
      <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Roles</button>
      <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Permisos</button>
    </div>
  </nav>
  <div class="tab-content" id="nav-tabContent">
    <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">Roles : aquí debo poder crear roles y listarlo en una tabla, adicional a
      ello mediante un modal al cual se puede acceder mediante un icono de cada fila, ver los permisson que tiene asignados y asu vez poder asignar los permisos aun rol</div>
    <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">Permisos: aqui debo poder crear los permisos</div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Sheltos - Admin Dashboard Page'
})
</script>

<style scoped>

</style>
