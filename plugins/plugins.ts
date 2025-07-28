import { defineNuxtPlugin } from '#app';
import VueApexCharts from "vue3-apexcharts";
import DropZone from 'dropzone-vue';
import 'dropzone-vue/dist/dropzone-vue.common.css';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import VueDatamaps from 'vue-datamaps'
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/styles.css";
import { MapsPlugin } from '@syncfusion/ej2-vue-maps';
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('VueApexCharts',VueApexCharts);
    nuxtApp.vueApp.use(DropZone)
    nuxtApp.vueApp.use(VueDatamaps)
    nuxtApp.vueApp.use(OpenLayersMap)
    nuxtApp.vueApp.use(MapsPlugin)
    nuxtApp.vueApp.component("vue-date-picker", VueDatePicker);
  });