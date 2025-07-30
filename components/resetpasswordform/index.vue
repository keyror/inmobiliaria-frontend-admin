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
                                <form autocomplete="off" @submit.prevent="resetPassword">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <Icon name="material-symbols:mail-outline"/>
                                                </div>
                                            </div>
                                            <input v-model="form.email" type="email" class="form-control" placeholder="Enter email address">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <Icon name="material-symbols:lock-outline"/>
                                                </div>
                                            </div>
                                            <input v-model="form.password" :type="password?'text':'password'" id="pwd-input" class="form-control"  placeholder="Contraseña">
                                            <div class="input-group-apend">
                                                <div class="input-group-text" @click="password = !password">
                                                    <i id="pwd-icon" :class="password?'far fa-eye':'far fa-eye-slash'"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                      <div class="input-group">
                                        <div class="input-group-prepend">
                                          <div class="input-group-text">
                                            <Icon name="material-symbols:lock-outline"/>
                                          </div>
                                        </div>
                                        <input v-model="form.password_confirmation" :type="passwordConfirmation?'text':'password'" id="pwd-confirmation-input" class="form-control"  placeholder="Confirmar contraseña">
                                        <div class="input-group-apend">
                                          <div class="input-group-text" @click="passwordConfirmation = !passwordConfirmation">
                                            <i id="pwd-icon" :class="passwordConfirmation?'far fa-eye':'far fa-eye-slash'"></i>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="important-note">
                                        password should be a minimum of 8 characters and should contains letters and numbers
                                      </div>
                                    </div>
                                    <div>
                                        <button type="submit" class="btn btn-gradient btn-pill color-2 me-sm-3 me-2">Cambiar contraseña</button>
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
import { useRoute } from 'vue-router'
import LoadingService from "~/services/LoadingService";
import AutenticacionService from "~/services/AutenticacionService";
import AlertaService from "~/services/AlertService";

const route = useRoute()

const form = ref({
  email: route.query.email as string ?? '',
  token: route.query.token as string ?? '',
  password: '',
  password_confirmation: '',
})

const resetPassword = async () => {
  LoadingService.show()
  AutenticacionService.resetPassword(form.value)
      .then((response) => {
        LoadingService.hide()
        AlertaService.showSuccess('Operación exitosa', response.message).then((result) => {
          if (result.isConfirmed) {
            navigateTo('Authentication/login')
          }
        });
      }).catch((error) => {
    LoadingService.hide()
    AlertaService.showError('Ha ocurrido un error', error);
  })
}

let password = ref<boolean>(false)
let passwordConfirmation = ref<boolean>(false)
</script>

<style scoped>

</style>
