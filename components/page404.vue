<template>
    <div class="page-wrapper">
        <div class="page-not-found">
            <div class="container-fluid">
               <div class="row">
                    <div class="col-lg-6 col-md-8 col-sm-10">
                        <div class="not-found-img">
                            <img src="/image/svg/3.svg" class="img-fluid" alt="">
                            <div class="animation-error">
                                <img src="/image/svg/error.svg" class="img-fluid" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-8 col-sm-10">
                        <div class="not-found-content">
                            <h2>Sorry...This page is gone.</h2>
                            <p class="font-roboto light-font">We are sorry but the page you are looking for doesn't exist or has been removed. please check or search again.</p>
                            <div class="btns">
                                <nuxt-link to="/" class="btn btn-pill btn-gradient color-4">go to home page</nuxt-link>
                                <nuxt-link to="/" class="btn btn-pill btn-dashed color-4 ms-2">Report problem</nuxt-link>
                            </div>
                        </div>
                    </div>
               </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>