<template>
    <div class="col-xl-3 xl-6 col-lg-6 col-md-6">
        <div class="card">
            <div class="card-header pb-0">
                <div class="d-flex">
                    <h5>My properties</h5>
                    <nuxt-link to="/myproperties/addproperty">+ New</nuxt-link>
                </div>
            </div>
            <div class="card-body properties-list">
                <div class="media" v-for="(item ,index) in alldata" :key="index">
                    <img :src="item.src" class="img-fluid" alt="">
                    <div class="media-body">
                        <nuxt-link to="/myproperties/propertylist"><h6>{{ item.name }}</h6></nuxt-link>
                        <ul>
                            <li v-for="(icons, index) in item.icon" :key="index">
                                <img :src="icons.src" class="img-fluid" alt="">
                                <span>{{ icons.qty }}</span>
                            </li>
                        </ul>
                        <div>
                            <span class="light-font">Status: </span>
                            <span class="label label-light" :class="item.statuscolor">{{ item.status }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "~/composables/apiurl";
interface main{
    src:string;
    name:string;
    status:string;
    statuscolor:string;
    icon:icon[];
}
interface icon{
    src:string;
    qty:string;
}
const alldata = ref<main[]>([]);
const {data} = await useFetch(baseUrl+'/data/dashboard.json');
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value.my_property|| [];
  }
});
</script>

<style scoped>

</style>
