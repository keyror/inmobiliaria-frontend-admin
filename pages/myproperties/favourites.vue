<template>
    <div class="page-body">
        <CommonBreadcrumb title="Favourites" page="My properties" />
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="property-admin">
                        <div class="property-section section-sm">
                            <div class="row ratio_55 property-grid-2 property-map map-with-back">
                                <div class="col-12">
                                    <div class="filter-panel">
                                        <div class="listing-option">
                                            <h5 class="mb-0">Showing <span>1-15 of 69</span> Listings</h5>
                                            <div>
                                                <div class="d-flex">
                                                    <span class="m-r-10">Map view</span>
                                                    <label class="switch">
                                                        <input type="checkbox" class="option-list" name="step_1" value="ani1" checked><span class="switch-state"></span>
                                                    </label>
                                                    <span class="m-l-10">List view</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-xl-12">
                                    <div class="property-2 row column-sm property-label property-grid">
                                        <MypropertiesFavourites :data="alldata" />
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
    useHead({
  title: 'Sheltos - Admin Dashboard Page'
})
    import {baseUrl} from "@/composable/apiurl";

    interface data {
        img: string[];
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
        rent: string
        sale: string;
        id: string;
        propertyType: string;
        agencies: string;
    }
    const alldata = ref<data[]>([]);
    const {data} = await useFetch(baseUrl + '/data/data.json')
    watchEffect(() => {
  if (data.value) {
    alldata.value = data.value.proertylisting|| [];
  }
});
    </script>
    
    <style scoped>
    
    </style>
    