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

                                <!-- EMAIL -->
                                <div class="form-group">
                                  <div class="input-group">
                                    <div class="input-group-prepend">
                                      <div class="input-group-text">
                                        <Icon name="material-symbols:mail-outline"/>
                                      </div>
                                    </div>
                                    <input
                                        v-model="email"
                                        type="email"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.email }"
                                        placeholder="Enter email address"
                                    >
                                  </div>
                                  <small class="text-danger">{{ errors.email }}</small>
                                </div>

                                <!-- PASSWORD -->
                                <div class="form-group">
                                  <div class="input-group">
                                    <div class="input-group-prepend">
                                      <div class="input-group-text">
                                        <Icon name="material-symbols:lock-outline"/>
                                      </div>
                                    </div>
                                    <input
                                        v-model="pwd"
                                        :type="password ? 'text' : 'password'"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.password }"
                                        placeholder="Contraseña"
                                    >
                                    <div class="input-group-apend">
                                      <div class="input-group-text" @click="password = !password">
                                        <i :class="password ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                                      </div>
                                    </div>
                                  </div>
                                  <small class="text-danger">{{ errors.password }}</small>
                                </div>

                                <!-- CONFIRM PASSWORD -->
                                <div class="form-group">
                                  <div class="input-group">
                                    <div class="input-group-prepend">
                                      <div class="input-group-text">
                                        <Icon name="material-symbols:lock-outline"/>
                                      </div>
                                    </div>
                                    <input
                                        v-model="pwdConfirmation"
                                        :type="passwordConfirmation ? 'text' : 'password'"
                                        class="form-control"
                                        :class="{ 'is-invalid': errors.password_confirmation }"
                                        placeholder="Confirmar contraseña"
                                    >
                                    <div class="input-group-apend">
                                      <div class="input-group-text" @click="passwordConfirmation = !passwordConfirmation">
                                        <i :class="passwordConfirmation ? 'far fa-eye' : 'far fa-eye-slash'"></i>
                                      </div>
                                    </div>
                                  </div>
                                  <small class="text-danger">{{ errors.password_confirmation }}</small>

                                  <div class="important-note">
                                    password should be a minimum of 8 characters and should contains letters and numbers
                                  </div>
                                </div>

                                <div>
                                  <button type="submit" class="btn btn-gradient btn-pill color-2">
                                    Cambiar contraseña
                                  </button>
                                </div>

                              </form>
                            </div>
                        </div>
                    </div>
                  <div class="col-xxl-7 col-xl-7 offset-xxl-1 col-lg-6 auth-img bg-size background_wrapper"
                       :style="{ backgroundImage: 'url(/image/svg/2.jpg)' }">
                    <img :src="'/image/svg/2.jpg'" class="bg-img d-none" alt="">
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import AutenticacionService from "~/services/AuthenticationService";
import {useAuthForms} from "~/composables/forms/useAuthForms";

const route = useRoute();
const { useResetPasswordForm } = useAuthForms();
const { run } = useApiHandler();

const password = ref(false);
const passwordConfirmation = ref(false);

const { handleSubmit, errors, defineField, setErrors } = useResetPasswordForm({
  email: route.query.email as string,
  token: route.query.token as string
});

const [email] = defineField('email');
const [pwd] = defineField('password');
const [pwdConfirmation] = defineField('password_confirmation');

const resetPassword = handleSubmit(async (values) => {

  const response = await run(
      AutenticacionService.resetPassword(values),
      {
        setErrors,
        showSuccess: true,
        successMessage: 'Contraseña actualizada correctamente'
      }
  );

  if (response) {
    navigateTo('Authentication/login');
  }
});
</script>

<style scoped>

</style>
