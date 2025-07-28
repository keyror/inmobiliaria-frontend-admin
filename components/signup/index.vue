<template>
    <div class="page-wrapper">
        <div class="authentication-box">
            <div class="container-fluid">
                <div class="row log-in">
                    <div class="col-xxl-3 col-xl-4 col-lg-5 col-md-6 col-sm-8 form-login">
                        <div class="card">
                            <div class="card-body">
                                <div class="title-3 text-start">
                                    <h2>Sign up</h2>
                                </div>
                                <form>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <Icon name="material-symbols:person-outline" class="fs-5"/>
                                                </div>
                                            </div>
                                            <input type="text" class="form-control" placeholder="Enter your name">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <Icon name="material-symbols:mail-outline"/>
                                                </div>
                                            </div>
                                            <input type="email" class="form-control" placeholder="Enter email address">
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <div class="input-group-text">
                                                    <Icon name="material-symbols:lock-outline"/>
                                                </div>
                                            </div>
                                            <input :type="password?'text':'password'" id="pwd-input" class="form-control"  maxlength="8" placeholder="Password">
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
                                    <div>
                                        <button type="button" class="btn btn-gradient btn-pill color-2 me-sm-3 me-2">Create Account</button>
                                        <nuxt-link to="/Authentication/login" target="_parent" class="btn btn-dashed btn-pill color-2">Log in</nuxt-link>
                                    </div>
                                    <div class="divider">
                                        <h6>or</h6>
                                    </div>
                                    <CommonSocialicon title="Sign up with"/>
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
let password = ref<boolean>(false)
</script>

<style scoped>

</style>