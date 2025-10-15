<template>
  <div class="loader-wrapper" v-if="isLoading">
    <div class="loader-backdrop"></div>
    <div class="loader-content">
      <div class="row loader-img">
        <div class="col-12">
          <img alt="" class="img-fluid" src="/image/loader/loader-5.gif">
        </div>
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
  },);
})
watch(() => router , ()=>{
  loader.value = true;
  setTimeout(() => {
    loader.value = false;
  },);
} ,{ deep: true },)
</script>

<style scoped>
.loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.loader-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
      circle at center,
      rgba(0, 0, 0, 0.5) 0%,
      rgba(0, 0, 0, 0.7) 100%
  );
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-in-out;
}

.loader-content {
  position: relative;
  z-index: 10000;
  animation: scaleIn 0.3s ease-in-out;
}

.loader-img {
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.5));
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
