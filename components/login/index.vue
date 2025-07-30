<template>
    <div class="page-wrapper">
        <div class="authentication-box">
            <div class="container-fluid">
                <div class="row log-in">
                    <div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 form-login">
                        <div class="card">
                            <div class="card-body">
                                <div class="title-3 text-start">
                                    <h2>Log in</h2>
                                </div>
                                <form autocomplete="off" @submit.prevent="submitForm">
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                <Icon name="material-symbols:person-outline"/>
                                                </div>
                                            </div>
                                            <input v-model="form.email" type="email" class="form-control" placeholder="Enter Email" autocomplete="off">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <Icon name="material-symbols:lock-outline"/>
                                                </div>
                                            </div>
                                            <input v-model="form.password" :type="password?'text':'password'" id="pwd-input" class="form-control" placeholder="Password" autocomplete="off">
                                            <div class="input-group-apend">
                                                <div class="input-group-text" @click="password = !password">
                                                    <i id="pwd-icon" :class="password?'far fa-eye':'far fa-eye-slash'"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="important-note">
                                            password should be a minimum of 8 characters and should contains letters and numbers
                                        </div>
                                    </div>
                                    <div class="d-flex">
                                        <label class="d-block mb-0" for="chk-ani">
                                            <input v-model="form.remember_me" class="checkbox_animated color-2" id="chk-ani" type="checkbox"> Recuérdame
                                        </label>
                                        <a href="https://sheltos-vue.vercel.app/page/otherpages/forgot-password" class="font-rubik text-color-2">Forgot password ?</a>
                                    </div>
                                    <div>
                                        <button class="btn btn-gradient btn-pill color-2 me-sm-3 me-2">Log in</button>
                                        <nuxt-link to="/Authentication/signup" target="_parent" class="btn btn-dashed btn-pill color-2">Create Account</nuxt-link>
                                    </div>
                                    <div class="divider">
                                        <h6>or</h6>
                                    </div>
                                    <CommonSocialicon title="Log in with"/>
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
import {useAuthStore} from "~/store/authStore";


const auth = useAuthStore();

let password = ref<boolean>(false)

const form = ref({
  email: '',
  password:'',
  remember_me: false
})

function submitForm() {
  auth.login(form.value)
}
</script>

<style scoped>

</style>
