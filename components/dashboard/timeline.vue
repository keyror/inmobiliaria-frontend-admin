<template>
    <div class="col-lg-6">
        <div class="card">
            <div class="card-header">
                <div class="d-flex">
                    <h5>Project timeline</h5>
                    <nuxt-link to="/myproperties/addproperty">+ Add project</nuxt-link>
                </div>
            </div>
            <div class="card-body pt-0">
                <div class="timeline-container">
                    <ClientOnly>
                        <VueApexCharts
                        height="370"
                        type="rangeBar"
                        :options="option"
                        :series="series"
                      />
                       </ClientOnly>
                </div>
            </div>
        </div>
    </div>
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h5>Assignees</h5>
            </div>
            <div class="card-body assign-table pt-0">
                <div class="table-responsive custom-scrollbar">
                    <table class="table table-bordernone">
                        <tbody>
                            <tr v-for="(item , index) in alldata" :key="index">
                                <td v-for="(trs , index) in item.tr" :key="index">
                                    <div class="media" v-if="trs.src">
                                        <img v-if="trs.src" :src="trs.src" class="img-fluid" alt="">
                                        <div class="media-body" v-if="trs.name">
                                            <nuxt-link href="/users/profile"><h6>{{ trs.name }}</h6></nuxt-link>
                                            <span>{{ trs.sub }}</span>
                                        </div>
                                    </div>
                                    <h6 :class="trs.textcolor" v-if="trs.count">{{ trs.count }}</h6>
                                    <span v-if="trs.status">{{ trs.status }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import options from '@/data/chart';
import { baseUrl } from '@/composable/apiurl';
interface main{
    tr:table[]
}
interface table{
    src?:string;
    name?:string
    sub?:string;
    textcolor?:string;
    count?:string;
    status?:string;
}
let series = options.series
let option = options.options2
const alldata = ref<main[]>([]);
const {data} = await useFetch(baseUrl+'/data/dashboard.json')
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value.assignees|| [];
  }
});
</script>

<style scoped>

</style>