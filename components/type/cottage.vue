<template>
    <div class="page-body">
        <CommonBreadcrumb title="Cottage" page="Types"/>
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="property-admin">
                        <div class="property-section section-sm">
                            <div class="row ratio_55 property-grid-2 property-map map-with-back">
                                <div class="col-xl-12">
                                    <div class="property-2 row column-sm zoom-gallery property-label property-grid mt-0">
                                        <CommonListdata :data="alldata"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "~/composables/apiurl";
interface listdata{
    id:string;
    img:string[];
    propertyStatus:string;
    label:string;
    country:string;
    title:string;
    price:string;
    details:string;
    bed:number;
    bath:number
    sqft:number;
    rooms:number;
    date:string;
    rent:boolean;
    sale:boolean;
    propertyType:string;
    agencies:string;
}
const alldata = ref<listdata[]>([]);
const {data} = await useFetch(baseUrl+'/data/data.json');
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value.typeproperty || [];
  }
});
</script>

<style scoped>

</style>
