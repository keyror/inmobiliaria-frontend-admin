<template>
  <div class="page-wrapper">
    <div class="authentication-box">
      <div class="container-fluid">
        <div class="row log-in">
          <div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 form-login">
            <div class="card">
              <div class="card-body">
                <div class="title-3 text-start">
                  <h2>Restablecer contraseña</h2>
                </div>
                <form autocomplete="off" @submit.prevent="sendResetEmail">
                  <div class="form-group">
                    <div class="input-group">
                      <div class="input-group-prepend">
                        <div class="input-group-text">
                          <Icon name="material-symbols:mail-outline"/>
                        </div>
                      </div>
                      <input v-model="email" type="email" class="form-control" placeholder="Enter email address">
                    </div>
                  </div>
                  <div>
                    <button type="submit" class="btn btn-gradient btn-pill color-2 me-sm-3 me-2">Enviar solicitud</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-xxl-7 col-xl-7 offset-xxl-1 col-lg-6 auth-img bg-size background_wrapper" style="background-image:url('/image/svg/2.jpg')">
            <img src="/image/svg/2.jpg" class="bg-img d-none" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AutenticacionService from '~/services/AuthenticationService';
import LoadingService from "~/services/LoadingService";
import AlertaService from "~/services/AlertService";

const email = ref('');

const sendResetEmail = async () => {
  LoadingService.show()
  AutenticacionService.sendResetEmail(email.value)
      .then((response) => {
        LoadingService.hide()
        AlertaService.showSuccess('Operación exitosa', response.message);
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

</script>

<style scoped></style>
