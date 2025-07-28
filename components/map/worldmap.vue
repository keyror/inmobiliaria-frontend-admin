<template>
    <div class="page-body">
        <CommonBreadcrumb title="Map" page="Map"/>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h5>World Map</h5>
                        </div>
                        <div class="card-body">
                            <GoogleMap api-key="AIzaSyDGCQvcXUsXwCdYArPXo72dLZ31WS3WQRw" style="width: 100%; height: 500px" :center="center" :zoom="1.1">
                              </GoogleMap>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h5>USA Map</h5>
                        </div>
                        <div class="card-body">
                            <GoogleMap api-key="AIzaSyDGCQvcXUsXwCdYArPXo72dLZ31WS3WQRw" style="width: 100%; height: 500px" :center="USA" :zoom="4">
                              </GoogleMap>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h5>Asia Map</h5>
                        </div>
                        <div class="card-body">
                            <GoogleMap api-key="AIzaSyDGCQvcXUsXwCdYArPXo72dLZ31WS3WQRw" style="width: 100%; height: 500px" :center="Asia" :zoom="2.3">
                              </GoogleMap>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header pb-0">
                            <h5>India Map</h5>
                        </div>
                        <div class="card-body">
                            <GoogleMap api-key="AIzaSyDGCQvcXUsXwCdYArPXo72dLZ31WS3WQRw" style="width: 100%; height: 500px" :center="India" :zoom="4.2">
                              </GoogleMap>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { GoogleMap, Marker } from "vue3-google-map";
const center = { lat: 25.229721, lng: 55.338229 };
const USA = { lat: 	37.09024, lng: 	-95.712891 };
const Asia = { lat: 34.0479, lng: 	100.6197 };
const India = { lat: 20.593684, lng: 78.96288 };
</script>

<style scoped>

</style>