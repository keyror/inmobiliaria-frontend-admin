<template>
    <li class="onhover-dropdown notification-box">
        <a href="javascript:void(0)">
            <Icon name="material-symbols:notifications-outline" class="fs-2"/>
            <span class="label label-shadow label-pill notification-badge">3</span>
        </a>
        <div class="notification-dropdown onhover-show-div">
            <div class="dropdown-title">
                <h6>Notifications</h6>
                <nuxt-link to="/myproperties/favourites">Show all</nuxt-link>
            </div>
            <ul>
                <li v-for="(item , index) in alldata" :key="index">
                    <div class="media">
                        <div class="icon-notification" :class="item.color">
                            <i :class="item.icon"></i>
                        </div>
                        <div class="media-body">
                            <h6>{{ item.title }}</h6>
                            <span>{{ item.time }}</span>
                            <p class="mb-0" v-if="item.desc">"{{ item.desc }}"</p>
                            <ul class="user-group">
                                <li v-for="(user ,index) in item.user" :key="index">
                                    <nuxt-link to="javascript:void(0)">
                                        <img :src="user.src" class="img-fluid" alt="">
                                    </nuxt-link>
                                </li>
                                <li class="reply" v-if="item.reply">
                                    <nuxt-link to="javascript:void(0)">
                                        Reply
                                    </nuxt-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </li>
</template>

<script setup lang="ts">
import { baseUrl } from '~/composables/apiurl';
interface notific{
    title:string;
    reply:boolean
    color:string;
    icon:string
    time:string;
    desc?:string;
    user:user[]
}
interface user{
    src:string;
}
const alldata = ref<notific[]>([]);
const {data} = await useFetch(baseUrl+'/data/header.json');
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value?.notification|| [];
  }
});
</script>

<style scoped>

</style>
