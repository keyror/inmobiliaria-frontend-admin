<template>
    <div class="col-xl-6 xl-6 col-lg-12 col-md-7">
        <div class="recent-properties">
            <div class="card">
                <div class="card-body">
                    <div class="title-about">
                        <h5>Recent properties</h5>
                    </div>
                    <div class="table-responsive custom-scrollbar">
                        <table class="table table-bordernone mb-0">
                            <thead>
                                <tr>
                                    <th>Property</th>
                                    <th>Rate</th>
                                    <th>Deposit</th>
                                    <th>Start date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item , index) in allproperty" :key="index">
                                    <td>
                                        <div class="media">
                                            <img :src="item.src" class="img-fluid img-80" alt="">
                                            <div class="media-body">
                                                <h6>{{ item.title }}</h6>
                                                <span class="light-font">{{ item.country }}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <h6>${{ item.rent }}</h6>
                                        <span class="light-font">monthly rent</span>
                                    </td>
                                    <td>
                                        <h6>${{ item.deposit }}</h6>
                                        <span class="light-font">deposit</span>
                                    </td>
                                    <td>
                                        <h6>{{ item.date }}</h6>
                                        <span class="light-font">start date</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="earning-chart card">
            <div class="card-body">
                <div class="title-about">
                    <h5>Recent earnings</h5>
                </div>
                <div class="earnings">
                    <CommonChartEarning/>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { baseUrl } from "~/composables/apiurl";

interface property{
    src:string;
    title:string;
    country:string;
    rent:string;
    deposit:string;
    date:string;
}
const allproperty = ref<property[]>([]);
const {data} = await useFetch(baseUrl+'/data/user.json');
watchEffect(() => {
  if (data.value) {
    allproperty.value = data.value.property|| [];
  }
});
</script>

<style scoped>

</style>
