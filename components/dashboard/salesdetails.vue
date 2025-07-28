<template>
    <div class="col-xl-3 xl-6 col-md-6 project-widgets" v-for="(item , index) in alldata" :key="index">
        <div class="card">
            <div class="card-body">
                <div class="media">
                    <div v-if="item.bgcolor" class="widget-icon" :class="item.bgcolor">
                        <i :class="item.icon"></i>
                    </div>
                    <i v-else :class="item.icon"></i>
                    <div class="media-body">
                        <span>                           
                            {{ item.pers?item.task:null }}
                            <span class="font-success">
                                {{ item.pers?null: item.task }}
                               {{ item.pers?'+'+ item.pers + '%':null}}
                               <Icon v-if="item.arrow" :name="item.arrow"/>
                            </span>
                        </span>
                        <h4>{{ item.head }}</h4>
                        <span class="status-history">{{ item.status }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface details{
    icon:string;
    bgcolor?:string;
    task:string;
    pers?:string;
    arrow?:string;
    head:string;
    status:string;
}
const { data } = await useAsyncData('widgetsOne', () => 
  $fetch(baseUrl + '/data/dashboard.json')
);

const alldata = computed(() => data.value?.widgetsOne || []);
</script>

<style scoped>

</style>