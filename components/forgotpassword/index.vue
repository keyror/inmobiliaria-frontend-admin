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
                      <input
                          v-model="email"
                          type="email"
                          class="form-control"
                          :class="{ 'is-invalid': errors.email }"
                          placeholder="Enter email address"
                      />

                      <small class="text-danger">{{ errors.email }}</small>
                    </div>
                  </div>
                  <div>
                    <button type="submit" class="btn btn-gradient btn-pill color-2 me-sm-3 me-2">Enviar solicitud</button>
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
import { useApiHandler } from '~/composables/useApiHandler'
import { useAuthForms } from '~/composables/forms/useAuthForms'
import AutenticacionService from '~/services/AuthenticationService'

const { run } = useApiHandler()

// 👇 reutilizas tu sistema de forms
const { useForgotPasswordForm } = useAuthForms()

const { handleSubmit, errors, defineField, setErrors } = useForgotPasswordForm()

const [email] = defineField('email')

// 🔥 submit limpio
const sendResetEmail = handleSubmit(async (values) => {

  const response = await run(
      AutenticacionService.sendResetEmail(values.email),
      {
        setErrors,
        showSuccess: true,
        successMessage: 'Correo de recuperación enviado'
      }
  )

  if (response) {
    email.value = ''
  }
})
</script>

<style scoped></style>
