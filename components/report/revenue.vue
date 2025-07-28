<template>
    <div class="col-xl-4 xl-6">
        <div class="card">
            <div class="card-header pb-0">
                <h5>Management Reports</h5>
            </div>
            <div class="card-body management-table">
                <div class="table-responsive custom-scrollbar">
                    <table class="table table-bordernone">
                        <tbody>
                            <tr v-for="(item , index) in alldata" :key="index"> 
                                <td>
                                    <div class="media">
                                        <img :src="item.src" class="img-fluid" alt="">
                                        <div class="media-body">
                                            <h6>{{ item.date }}</h6>
                                            <span>{{ item.create }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <a href="/text_file.txt" download ><Icon name="material-symbols:download-rounded" class="light-font fs-2" /></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    <div class="col-xl-4 xl-6">
        <div class="card">
            <div class="card-header">
                <h5>Revenue</h5>
            </div>
            <div class="card-body pt-0">
                <div class="revenue-container">
                    <div id="revenuechart">
                        <CommonChartRevenue/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface manege{
    src:string;
    date:string;
    create:string;
}
const alldata = ref<manege[]>([]);
const {data} = await useFetch(baseUrl+'/data/report.json')
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value.report || [];
  }
});
</script>

<style scoped>

</style>