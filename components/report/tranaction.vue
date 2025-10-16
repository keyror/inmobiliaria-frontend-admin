<template>
    <div class="col-xl-6">
        <div class="card">
            <div class="card-header">
                <h5>Visitors Location</h5>
            </div>
            <div class="card-body">
                <div class="jvector-map-report" id="asia">
                    <CommonMapsWorldmap/>
                </div>
            </div>
        </div>
    </div>
    <div class="col-sm-12">
        <div class="card">
            <div class="card-header pb-0">
                <h5>Recent transactions</h5>
            </div>
            <div class="card-body report-table">
                <div class="table-responsive transactions-table custom-scrollbar">
                    <table class="table table-bordernone m-0">
                        <thead>
                            <tr>
                                <th class="light-font">#</th>
                                <th class="light-font">Property</th>
                                <th class="light-font">Type</th>
                                <th class="light-font">Amount</th>
                                <th class="light-font">Price</th>
                                <th class="light-font">Date</th>
                                <th class="light-font">Status</th>
                                <th class="light-font">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item , index) in alltransctions" :key="index">
                                <td>{{ index+1 }}</td>
                                <td>
                                    <div class="media">
                                        <img :src="item.src" class="img-fluid img-80" alt="">
                                        <div class="media-body">
                                            <h6>{{ item.name }}</h6>
                                            <span class="light-font">{{ item.country }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>{{ item.status }}</td>
                                <td>{{ item.amount }}</td>
                                <td>${{ item.price }}</td>
                                <td>{{ item.date }}</td>
                                <td><span class="label label-light" :class="item.type == 'Pending'?'color-4':'color-3'">{{ item.type }}</span></td>
                                <td><Icon name="uiw:more" class="text-secondary fs-5" /></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "~/composables/apiurl";
interface transactions{
    src:string;
    name:string;
    country:string;
    status:string;
    amount:string;
    price:string;
    date:string;
    type:string;
}
const alltransctions = ref<transactions[]>([]);
const {data} = await useFetch(baseUrl+'/data/report.json')
watchEffect(() => {
  if (data.value) {
    alltransctions.value = data.value.transction || [];
  }
});
</script>

<style scoped>

</style>
