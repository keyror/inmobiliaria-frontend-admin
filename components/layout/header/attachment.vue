<template>
    <li class="onhover-dropdown">
        <a href="javascript:void(0)">
            <Icon name="lucide:save"  class="fs-3"/>
        </a>
        <div class="notification-dropdown onhover-show-div">
            <div class="dropdown-title">
                <h6>Recent Attachments</h6>
                <nuxt-link to="/report">Show all</nuxt-link>
            </div>
            <ul>
                <li v-for="(item , index) in alldata" :key="index">
                    <div class="media">
                        <div class="icon-notification" :class="item.color">
                            <i :class="item.icon"></i>
                        </div>
                        <div class="media-body">
                            <nuxt-link to="/report">
                                <h6>{{ item.name }}</h6>
                            </nuxt-link>
                            <span>{{ item.size }}</span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </li>
</template>

<script setup lang="ts">
import {baseUrl} from '~/composables/apiurl'
interface attch{
    icon:string;
    name:string;
    size:string;
    color:string
}
const alldata = ref<attch[]>([]);
const {data} = await useFetch(baseUrl+'/data/header.json')
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value.attachment|| [];
  }
});
</script>

<style scoped>

</style>
