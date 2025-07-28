<template>
    <div class="col-xl-4 col-md-6 xl-6" v-for="(item , index) in data" :key="index">
        <div class="property-box">
            <div class="property-image">
                <swiper class="property-slider"  navigation :loop="true" :modules="modules" :pagination="{clickable : true}">
                   <swiper-slide v-for="(img , index) in item.img" :key="index">
                    <nuxt-link to="javascript:void(0)" class="bg-size background_wrapper" :style="'background-image:url('+img+')'">
                        <img :src="img" class="bg-img d-none" alt="">                        
                    </nuxt-link>
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
            <MypropertiesPropertyDetails :data="item"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide  } from "swiper/vue"
import { Navigation, Pagination } from 'swiper/modules';
defineProps({
    data:Object
})
let modules = [Navigation , Pagination]
</script>

<style scoped>

</style>