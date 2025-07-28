<template>
    <div class="page-body">
        <CommonBreadcrumb title="Add property" page="My properties"/>
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card"> 
                        <div class="card-header pb-0">
                            <h5>Add property details</h5>
                        </div>
                        <div class="card-body admin-form">
                            <form class="row gx-3">
                                <CommonInputfieldsTextfield classes="col-sm-4" placeholder="office,villa,apartment" label="Property Type"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.status" label="Property Status" show="For Sale"/>
                                <CommonInputfieldsTextfield classes="col-sm-4" placeholder="$2800" label="Property Price"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.rooms" label="Max Rooms" show="1"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.rooms" label="Beds" show="1"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.rooms" label="Baths" show="1"/>
                                <CommonInputfieldsTextfield classes="col-sm-4" placeholder="85 sq ft" label="Area"/>
                                <CommonInputfieldsTextfield classes="col-sm-4" placeholder="$3000" label="Price"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.agency" label="Agencies" show="Premiere"/>
                                <CommonInputfieldsTextarea classes="col-sm-12" label="Description" />
                                <CommonInputfieldsTextfield classes="col-sm-6" placeholder="Address of your property" label="Address"/>
                                <CommonInputfieldsTextfield classes="col-sm-6" placeholder="39702" label="Zip code"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.country" label="Any Country" show="Austria"/>
                                <CommonInputfieldsStatusfield class="col-sm-4" :data="inputsData.city" label="Any City" show="Amreli"/>
                                <CommonInputfieldsTextfield classes="col-sm-4" placeholder="landmark place name " label="Landmark"/>
                            </form>
                            <div class="dropzone-admin">
                                <label>Media</label>
                                <ClientOnly>
                                <DropZone  :maxFiles="Number(10000000000)" :uploadOnDrop="true" :multipleUpload="true" class="p-3" :parallelUpload="3"/>
                                </ClientOnly>
                            </div>
                            <form class="row gx-3">
                                <div class="form-group col-sm-12">
                                    <label>video (mp4)</label>
                                    <input type="text" class="form-control" placeholder="mp4 video link">
                                </div>
                                <div class="form-group col-sm-12 mb-0">
                                    <label>Additional features</label>
                                    <div class="additional-checkbox">
                                        <label :for="item.c_id" v-for="(item , index) in inputsData.features" :key="index">
                                            <input class="checkbox_animated color-4" :id="item.c_id" type="checkbox" :checked="item.checked"> {{ item.name }}
                                        </label>
                                        
                                    </div>
                                </div>
                                <div class="form-btn col-sm-12">
                                    <button type="button" class="btn btn-pill btn-gradient color-4">Submit</button>
                                    <button type="button" class="btn btn-pill btn-dashed color-4">Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface check{
    c_id:string;
    name:string;
    checked:boolean
}
const inputsData = ref({
  status: [] as string[],
  rooms: [] as number[],
  agency: [] as string[],
  country: [] as string[],
  city: [] as string[],
  features: [] as check[],
});

const {data} = await useFetch(baseUrl+'/data/inputs.json')

watchEffect(() => {
  if (data.value) {
    inputsData.value = {
      status: data.value.status || [],
      rooms: data.value.room || [],
      agency: data.value.agencies || [],
      country: data.value.country || [],
      city: data.value.city || [],
      features: data.value.features || [],
    };
  }
});
</script>

<style scoped>

</style>