<template>
  <div class="property-details">
    <span class="font-roboto">{{ data?.country }}</span>
    <nuxt-link to="https://sheltos-vue.vercel.app/property/single-property-8">
      <h3>{{ data?.title }}</h3>
    </nuxt-link>
    <h6>${{ data?.price }}*</h6>
    <p class="font-roboto light-font">{{ data?.details }}</p>
    <ul>
      <li>
        <img src="/image/svg/icon/double-bed.svg" class="img-fluid" alt="" />Bed
        : {{ data?.bed }}
      </li>
      <li>
        <img src="/image/svg/icon/bathroom.svg" class="img-fluid" alt="" />Baths
        : {{ data?.bath }}
      </li>
      <li>
        <img
          src="/image/svg/icon/square-ruler-tool.svg"
          class="img-fluid ruler-tool"
          alt=""
        />Sq Ft : {{ data?.sqft }}
      </li>
    </ul>
    <div class="property-btn d-flex">
      <span>{{ data?.date }}</span>
      <nuxt-link to="https://sheltos-vue.vercel.app/property/single-property-8">
        <button type="button" class="btn btn-dashed btn-pill color-2">
          Details
        </button>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup lang="ts">
interface dataItems {
  label: string[];
  country: string;
  propertyStatus: string;
  title: string;
  price: string;
  details: string;
  home: string;
  bed: string;
  bath: string;
  sqft: string;
  rooms: string;
  date: string;
  rent: string;
  sale: string;
  id: string;
  propertyType: string;
  agencies: string;
}

let props = defineProps<{
  data: dataItems;
}>();
</script>

<style scoped></style>
