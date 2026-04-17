import { MapsPlugin } from "@syncfusion/ej2-vue-maps";
import VueDatePicker from "@vuepic/vue-datepicker";
import DropZone from "dropzone-vue";
import VueDatamaps from "vue-datamaps";
import VueApexCharts from "vue3-apexcharts";
import OpenLayersMap from "vue3-openlayers";
import "dropzone-vue/dist/dropzone-vue.common.css";

import "@vuepic/vue-datepicker/dist/main.css";

import "vue3-openlayers/styles.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VueApexCharts", VueApexCharts);
  nuxtApp.vueApp.use(DropZone);
  nuxtApp.vueApp.use(VueDatamaps);
  nuxtApp.vueApp.use(OpenLayersMap);
  nuxtApp.vueApp.use(MapsPlugin);
  nuxtApp.vueApp.component("vue-date-picker", VueDatePicker);
});
