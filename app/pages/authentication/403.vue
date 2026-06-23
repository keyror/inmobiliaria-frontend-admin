<template>
  <div class="page-wrapper">
    <div class="page-not-found">
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-6 col-md-8 col-sm-10">
            <div class="not-found-img">
              <img src="/image/svg/3.svg" class="img-fluid" alt="" />
              <div class="animation-error">
                <img src="/image/svg/error.svg" class="img-fluid" alt="" />
              </div>
            </div>
          </div>
          <div class="col-lg-6 col-md-8 col-sm-10">
            <div class="not-found-content">
              <h2>No tienes permisos para acceder a este recurso.</h2>
              <p class="font-roboto light-font">
                Contacta con el administrador o soporte del sistema si necesitas mas información.
              </p>
              <div class="btns">
                <nuxt-link to="/" class="btn btn-pill btn-gradient color-4"
                >Volver al inicio</nuxt-link
                >
<!--                <nuxt-link to="/" class="btn btn-pill btn-dashed color-4 ms-2"
                >Report problem</nuxt-link
                >-->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<Page404 />

<script setup lang="ts">
definePageMeta({
  layout: "login",
});

useHead({
  title: "Acceso denegado",
});
</script>
