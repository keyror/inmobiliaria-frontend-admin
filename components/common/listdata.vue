<template>
    <div class="col-xl-4 col-md-6 xl-6" v-for="(item , index) in getdata()" :key="index">
        <div class="property-box">
            <div class="property-image">
                <swiper class="property-slider" navigation :loop="true" :modules="modules" :pagination="{clickable : true}">
                    <swiper-slide v-for="(img , index) in item.img" :key="index">
                        <a href="javascript:void(0)" class="bg-size background_wrapper" :style="'background-image:url('+img+')'">
                            <img :src="img" class="bg-img d-none" alt="">                        
                        </a>
                    </swiper-slide>
                </swiper>
                <div class="labels-left">
                    <div>
                        <span :class="item.label[0] == 'no fees'?'label-dark' :'label-shadow'" class="label">{{ item.label[0] }}</span>
                    </div>
                    <span v-if="item.label[1]" class="label label-success">{{ item.label[1] }}</span>
                </div>
                <div class="seen-data">
                    <Icon name="material-symbols:android-camera-outline"/>
                    <span>{{'25'}}</span>
                </div>               
                <div class="overlay-property-box">
                    <nuxt-link to="javascript:void(0)" class="effect-round" data-bs-toggle="tooltip" data-bs-placement="left" title="compare">
                        <Icon name="material-symbols:shuffle" class="text-black"/>
                    </nuxt-link>
                    <nuxt-link to="javascript:void(0)" class="effect-round like added" data-bs-toggle="tooltip" data-bs-placement="left" title="wishlist">
                        <Icon :name="'ph:heart-straight-thin'" class="text-black"/>
                    </nuxt-link>
                </div>
            </div>
            <div class="property-details">
                <span class="font-roboto">France</span>
                <nuxt-link to="https://sheltos-vue.vercel.app/property/single-property-8">
                    <h3>{{ item.title }}</h3>
                </nuxt-link>
                <h6>${{ item.price }}*</h6>
                <p class="font-roboto light-font">{{ item.details }}</p>
                <ul>
                    <li><img src="/image/svg/icon/double-bed.svg" class="img-fluid" alt="">Bed : {{ item.bed }}</li>
                    <li><img src="/image/svg/icon/bathroom.svg" class="img-fluid" alt="">Baths : {{ item.bath }}</li>
                    <li><img src="/image/svg/icon/square-ruler-tool.svg" class="img-fluid ruler-tool" alt="">Sq Ft : {{ item.sqft }}</li>
                </ul>
                <div class="property-btn d-flex">
                    <span>{{ item.date }}</span>
                    <nuxt-link to="https://sheltos-vue.vercel.app/property/single-property-8">
                        <button type="button" class="btn btn-dashed btn-pill color-2">Details</button>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </div>
    <nav class="theme-pagination">
        <ul class="pagination">
            <li class="page-item">
                <nuxt-link class="page-link" to="javascript:void(0)" aria-label="Previous" @click="currentpage--">
                    <span aria-hidden="true">«</span>
                </nuxt-link>
            </li>
            <li class="page-item" :class="currentpage == page?'active':''" v-for="(page , index) in  totalpage" :key="index"><nuxt-link class="page-link" to="javascript:void(0)" @click="pageview(page)">{{ page }}</nuxt-link></li>
            <li class="page-item">
                <nuxt-link class="page-link" to="javascript:void(0)" aria-label="Next" @click="currentpage++">
                    <span aria-hidden="true">»</span>
                </nuxt-link>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide  } from "swiper/vue"
import { Navigation, Pagination } from 'swiper/modules';
let props = defineProps({
    data:Array
})
let modules = [Navigation , Pagination]
let parpagedata = ref<number>(6)
let currentpage = ref<number>(1)
let totalpage:number = Math.ceil(props.data.length / parpagedata.value)
function getdata(){
    let start = (currentpage.value - 1) * parpagedata.value;
    let end = start + parpagedata.value
    return props.data.slice(start , end)
}
function pageview(page:number){
currentpage.value = page
}
</script>

<style scoped>

</style>