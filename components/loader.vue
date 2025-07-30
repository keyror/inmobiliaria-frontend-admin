<template>
    <!--div class="loader-wrapper" v-if="loader || loadingService.isLoading"--->
  <div class="loader-wrapper" v-if="isLoading">
        <div class="row loader-img">
            <div class="col-12">
                <img src="/image/loader/loader-2.gif" class="img-fluid" alt="">
            </div>
        </div>
  </div>
</template>

<script setup lang="ts">
import loadingService from "~/services/LoadingService";

const isLoading = computed(() => loadingService.isLoading)

let router = useRouter();
let loader = ref<boolean>(true);
onMounted(() => {
  setTimeout(() => {
        loader.value = false;
    }, 3000);
})
watch(() => router , ()=>{
    loader.value = true;
    setTimeout(() => {
        loader.value = false;
    }, 3000);
} ,{ deep: true },)
</script>

<style scoped>

</style>
