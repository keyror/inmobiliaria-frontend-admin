<template>
    <div class="col-xl-3 xl-6 col-md-12">
        <div class="row">
            <div class="buyer-chart col-xl-12 col-md-6">
                <div class="card">
                    <div class="card-body">
                        <div class="title-about">
                            <h5>Total users</h5>
                        </div>
                        <div class="total-container">
                            <div id="userchart">
                                <CommonChartUsers/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="follow-list col-xl-12 col-md-6 manage-follow">
                <div class="card">
                    <div class="card-body">
                        <div class="title-about">
                            <h5>Following</h5>
                        </div>
                        <ul>
                            <li v-for="(item , index) in followdata" :key="index">
                                <div class="media">
                                    <img :src="item.src" class="img-fluid img-50" alt="">
                                    <div class="media-body">
                                        <h6>{{ item.name }}</h6>
                                        <span class="light-font">{{ item.email }}</span>
                                    </div>
                                    <div class="status text-capitalize" :class="item.status">{{ item.status }}</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "~/composables/apiurl";
interface follow{
    src:string;
    name:string;
    email:string;
    status:string;
}
const followdata = ref<follow[]>([]);
const {data} = await useFetch(baseUrl+'/data/user.json')
watchEffect(() => {
  if (data.value) {
    followdata.value = data.value.following|| [];
  }
});
</script>

<style scoped>

</style>
