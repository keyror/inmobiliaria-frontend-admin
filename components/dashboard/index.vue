<template>
    <div class="page-body">
        <CommonBreadcrumb title="Dashboard" page="Dashboard"/>
        <div class="container-fluid">
            <div class="row">
                <div class="col-xl-4 large-12">
                    <div class="row">
                        <div class="large-6 col-xl-12 col-md-6">
                            <div class="card all-properties">
                                <div class="card-body">
                                    <div class="media">
                                        <img src="/image/svg/icon/1.svg" class="img-fluid" alt="">
                                        <div class="media-body">
                                            <h4 class="mb-0">45</h4>
                                            <h6 class="light-font">Properties</h6>
                                        </div>
                                        <nuxt-link to="/myproperties/propertylist" class="arrow-animated">
                                            See all properties
                                           <Icon name="material-symbols:chevron-right"  class="fs-2"/>
                                        </nuxt-link>
                                    </div>
                                    <ul class="light-box">
                                        <li v-for="(item , index) in propertydata" :key="index">
                                            <img :src="item.src" class="img-fluid" alt="">
                                            <div>
                                                <h5>{{ item.totle }}</h5>  
                                                <span class="light-font">{{ item.type }}</span>                                                                                                          
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="large-6 col-xl-12 col-md-6">
                            <div class="card invoice-card">
                                <div class="card-header pb-0">
                                   <div>
                                        <h5>Last Month</h5>
                                   </div>
                                </div>
                                <div class="card-body calculations">
                                    <ul>
                                        <li>
                                            <h5 class="font-success">$47,215</h5>
                                            <h6 class="light-font mb-0">Paid invoices</h6>
                                        </li>
                                        <li>
                                            <h5 class="font-danger">$5,780</h5>
                                            <h6 class="light-font mb-0">Open invoices</h6>
                                        </li>
                                    </ul>
                                    <div class="d-flex">
                                        <nuxt-link to="/agent/invoice" class="label label-light color-4">
                                            <i class="fas fa-hand-holding-usd me-1"></i>
                                             Payments Receive</nuxt-link>
                                        <nuxt-link href="/agent/invoice" class="arrow-animated">
                                            View all
                                            <Icon name="material-symbols:chevron-right"  class="fs-2"/>
                                        </nuxt-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <DashboardChart/>
                <DashboardSalesdetails/>
                <DashboardTimeline/>
                <DashboardMyproperties/>
                <DashboardReport/>
                <DashboardSoldout/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface property{
    src:string;
    totle:string;
    type:string
}
const propertydata = ref<property[]>([]);
const {data} = await useFetch(baseUrl+'/data/dashboard.json');
watchEffect(() => {
  if (data.value) {
    propertydata.value = data.value.properties || [];
  }
});
</script>

<style scoped>

</style>