<template>
    <div class="col-xl-5 xl-12">
        <div class="card expiring-card">
            <div class="card-header">
                <div class="d-flex">
                    <h5>Sold out</h5>
                    <nuxt-link to="/type/appartment" class="arrow-animated">
                        See Details
                       <Icon name="material-symbols:chevron-right" class="fs-3"/>
                    </nuxt-link>
                </div>
            </div>
            <div class="card-body pt-0 expiring-details">
                <div class="expiring-chart">
                    <ClientOnly>
                        <VueApexCharts
                        height="380"
                        type="radialBar"
                        :options="option"
                        :series="series"/>
                       </ClientOnly>
                </div>
                <div class="chart-detail">
                    <div class="d-flex">
                        <div class="media">
                           <div class="with-reload">
                                <img src="/image/svg/icon/1.svg" class="img-fluid" alt="">
                           </div>
                            <div class="media-body">
                                <h5>78</h5>
                                <span class="light-font">Properties</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="legend-exiring">
                    <ul>
                        <li>
                            <div class="d-flex">
                                <span class="square-series bg-primary"></span>
                                <h6>10</h6>
                            </div>
                            <span class="light-font">> 20 Days</span>
                        </li>
                        <li>
                            <div class="d-flex">
                                <span class="square-series bg-success"></span>
                                <h6>50</h6>
                            </div>
                            <span class="light-font">21 - 40 Days</span>
                        </li>
                        <li>
                            <div class="d-flex">
                                <span class="square-series bg-warning"></span>
                                <h6>75</h6>
                            </div>
                            <span class="light-font">41 - 80 Days</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import options from '@/data/chart';

let  series = [76, 67, 90];
let option = options.options3
</script>

<style scoped>

</style>