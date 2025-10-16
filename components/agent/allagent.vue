<template>
    <div class="page-body">
        <CommonBreadcrumb title="All agents" page="Agents"/>
        <div class="container-fluid">
            <div class="row agent-section property-section agent-lists">
                <div class="col-lg-12">
                    <div class="property-grid-3 agent-grids ratio2_3">
                        <div class="property-2 row column-sm property-label property-grid">
                            <div class="col-md-6 col-12 col-xl-4" v-for="(agent , index) in allagents" :key="index">
                                <div class="property-box">
                                    <div class="agent-image">
                                        <div :style="'background-image:url('+agent.src+')'" class="background_wrapper bg-size">
                                            <img :src="agent.src" class="bg-img d-none" alt="">
                                            <span class="label label-shadow" v-if="agent.label">{{ agent.label }}</span>
                                            <div class="agent-overlay"></div>
                                            <div class="overlay-content">
                                                <ul>
                                                    <li v-for="(icon , index) in agent.icon" :key="index"><nuxt-link :to="icon.to" target="_blank"><img :src="icon.img" alt=""></nuxt-link>
                                                    </li>
                                                </ul>
                                                <span>Connect</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="agent-content">
                                        <h3><nuxt-link to="/agent/agentprofile">{{ agent.name }}</nuxt-link></h3>
                                        <p class="font-roboto">{{ agent.detail }}</p>
                                        <ul class="agent-contact">
                                            <li v-for="(content , index) in agent.content" :key="index" class="d-flex align-items-center">
                                                <i :class="content.icon"></i>
                                                {{ content.content }}
                                                <span class="phone-number d-block" v-if="agent.name == agentname  && show">{{ content.contact }}</span>
                                                <span class="character" v-else>{{ content.contact1 }}</span>
                                                <span class="label label-light label-flat color-2" v-if="content.labels" @click="shownumber(agent.name)">
                                                   <span style="font-size:14px;"> {{ agent.name == agentname && show?'hide':'show' }} </span>
                                                </span>
                                            </li>
                                        </ul>
                                        <nuxt-link to="/agent/agentprofile">View profile <i class="fas fa-arrow-right"></i></nuxt-link>
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
import {baseUrl} from '~/composables/apiurl'
interface users{
    src: string;
    label:boolean;
    icon:{
        to:string;
        img:string;
    }[],
    span:string;
    name:string;
    detail:string;
    content:{
        icon:string;
        contact?:string;
        contact1?:string;
        labels?:string;
        labels2?:string;
        content?:string;

    }[]
}
const allagents = ref<users[]>([]);
let {data} = await useFetch(baseUrl+'/data/agent.json')
let show = ref<boolean>(false)
    let agentname = ref('')
    watchEffect(() => {
  if (data.value) {
    allagents.value = data.value.allagents|| [];
  }
});
    function shownumber(name:string){
    show.value = !show.value
    if(show.value ==true){
        agentname.value = name
    }
    else{
        agentname.value = ''
    }
}
</script>

<style scoped>

</style>
