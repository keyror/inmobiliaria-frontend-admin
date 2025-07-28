<template>
    <div>
        <h6>{{ title }}</h6>
        <div class="row social-connect">
            <div class="col-6">
                <a href="https://www.facebook.com/" class="btn btn-social btn-flat facebook p-0" target="_blank">
                    <i class="fab fa-facebook-f"></i>
                    <span>Facebook</span>
                </a>
            </div>
            <div class="col-6">
                <a href="https://twitter.com/" class="btn btn-social btn-flat twitter p-0" target="_blank">
                    <i class="fab fa-twitter"></i>
                    <span>Twitter</span>
                </a>
            </div>
            <div class="col-6">
                <a href="https://accounts.google.com/" class="btn btn-social btn-flat google p-0" target="_blank">
                    <i class="fab fa-google"></i>
                    <span>Google</span>
                </a>
            </div>
            <div class="col-6">
                <a href="https://www.linkedin.com/" class="btn btn-social btn-flat linkedin p-0" target="_blank">
                    <i class="fab fa-linkedin-in"></i>
                    <span>Linkedin</span>
                </a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title:String,
})
</script>

<style scoped>

</style>