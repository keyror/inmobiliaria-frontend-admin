<template>
    <li class="onhover-dropdown message-box">
        <a href="javascript:void(0)">
            <Icon name="material-symbols:mail-outline-rounded" class="fs-3"/>
        </a>
        <div class="notification-dropdown chat-dropdown onhover-show-div">
            <div class="dropdown-title">
                <h6>Messages</h6>
                <nuxt-link to="/users/profile">View all</nuxt-link>
            </div>
            <ul>
                <li v-for="(item , index) in alldata" :key="index">
                    <div class="media">
                        <div class="chat-user">
                            <img :src="item.src" class="img-fluid" alt="">
                        </div>
                        <div class="media-body">
                            <nuxt-link to="/users/profile">
                                <h6>{{ item.title }}</h6>
                            </nuxt-link>
                            <span>{{ item.desc }}</span>
                        </div>
                        <div class="status text-capitalize" :class="item.status">{{ item.status }}</div>
                    </div>
                </li>
            </ul>
        </div>
    </li>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface message{
    src:string;
    title:string;
    desc:string;
    status:string;
}
const alldata = ref<message[]>([]);
const {data} = await useFetch(baseUrl+'/data/header.json')
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value?.message|| [];
  }
});
</script>

<style scoped>

</style>