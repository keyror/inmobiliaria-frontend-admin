<template>
    <div class="col-xl-8 xl-12">
        <div class="card">
            <div class="card-header pb-0">
                <h5>Property sales</h5>
            </div>
            <div class="card-body report-table">
                <div class="table-responsive recent-properties custom-scrollbar">
                    <table class="table table-bordernone m-0">
                        <thead>
                            <tr>
                                <th class="light-font">Property</th>
                                <th class="light-font">Type</th>
                                <th class="light-font">Date</th>
                                <th class="light-font">Status</th>
                                <th class="light-font">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item , index) in saless" :key="index">
                                <td>
                                    <div class="media">
                                        <img :src="item.src" class="img-fluid img-80" alt="">
                                        <div class="media-body">
                                            <h6>{{ item.name }}</h6>
                                            <span class="light-font">{{ item.country }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="light-font">{{ item.status }}</td>
                                <td class="light-font">{{ item.date }}</td>
                                <td><span class="label label-light color-3">{{ item.paymentstatus }}</span></td>
                                <td><Icon name="uiw:more" class="text-secondary fs-5" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-6">
        <div class="card">
            <div class="card-header pb-0">
                <h5>Income Analysis</h5>
            </div>
            <div class="card-body income-wrap">
                <ul class="overview-content">
                    <li>
                        <div class="d-flex">
                            <div>
                                <p class="mb-0 light-font">Rent income</p>
                                <h4>$31415</h4>
                            </div>
                            <span><span class="label label-success">+30%</span></span>
                        </div>
                    </li>
                    <li>
                        <div class="d-flex">
                            <div>
                                <p class="mb-0 light-font">Sale income</p>
                                <h4>$78812</h4>
                            </div>
                            <span><span class="label label-success">+20%</span></span>
                        </div>
                    </li>
                </ul>
                <div class="income-container">
                    <div id="incomechart">
                        <CommonChartIncomechart/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface sales{
    src:string;
    name:string;
    country:string;
    status:string;
    date:string;
    paymentstatus:string;
}
const saless = ref<sales[]>([]);
const {data} = await useFetch(baseUrl+'/data/report.json');
watchEffect(() => {
  if (data.value) {
    saless.value = data.value.sales || [];
  }
});
</script>

<style scoped>

</style>