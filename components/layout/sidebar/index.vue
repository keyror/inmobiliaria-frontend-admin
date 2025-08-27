<template>
        <div class="page-sidebar" id="sidebar">
            <div class="logo-wrap">
                <nuxt-link href="/">
                    <img src="/image/logo/4.png" class="img-fluid for-light" alt="">
                    <img src="/image/logo/9.png" class="img-fluid for-dark" alt="">
                </nuxt-link>
                <div class="back-btn d-lg-none d-inline-block" @click="removesidebar()">
                   <Icon name="mdi:chevron-double-left" class="fs-3" />
                </div>
            </div>
            <div class="main-sidebar">
                <div class="user-profile">
                    <div class="media">
                        <div class="change-pic">
                            <img src="/image/avatar/3.jpg" class="img-fluid" alt="">
                        </div>
                        <div class="media-body">
                            <nuxt-link to="/users/profile"><h6>Zack Lee</h6></nuxt-link>
                            <span class="font-roboto">zackle@gmail.com</span>
                        </div>
                    </div>
                </div>
                <div id="mainsidebar">
                    <ul class="sidebar-menu custom-scrollbar">
                        <li class="sidebar-item" v-for="(item , index) in alldata" :key="index">
                            <nuxt-link :to="item.link?item.link:'javascript:void(0)'" class="sidebar-link" :class="{ active: item.link === route.path || activemenu === item.title,
                            'only-link': item.link,}" @click="getactivevalue(item.title)">
                               <Icon :name="item.icon" class="fs-3"/>
                                <span>{{ item.title }}</span>
                                <div class="according-menu" v-if="item.children"><i class="fa fa-angle-right"></i></div>
                            </nuxt-link>
                            <ul class="nav-submenu menu-content" v-if="item.children" :class="item.title == activemenu && active?'d-block':'d-none'">
                                <li v-for="(child , index) in item.children" :key="index">
                                    <nuxt-link :to="child.link" :class="child.link == route.path?'active':''">
                                        <Icon :name="child.icon"/>
                                        {{ child.title }}<span class="label label-shadow ms-2" v-if="child.label">{{ child.label }}</span>
                                    </nuxt-link>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <div class="upgrade-box">
                                <img src="/image/svg/1.svg" class="img-fluid" alt="">
                                <h6>Need Help</h6>
                                <a href="https://support.pixelstrap.com/" target="_blank" class="p-0 m-0">
                                    <span class="d-block">Raise ticket at "support@pixelstrap.com"</span></a>

                                <button type="button" onclick=" window.open('https://themeforest.net/user/pixelstrap/portfolio', '_blank');" class="btn btn-pill btn-gradient color-4 btn-sm mt-2 fw-bold">Buy Now</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
</template>
<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface sidebar{
    link?:string;
    icon:string;
    title:string;
    collapse:boolean;
    children?:children[]
}
interface children{
    link:string;
    title:string;
    icon:string;
    label?:string;
}
const route = useRoute();
const alldata = ref<sidebar[]>([]);
//const {data} = await useFetch(baseUrl+'/data/sidebar.json')
import sidebar from '@/public/data/sidebar.json';

const data = ref(sidebar);

let activemenu = ref<string>('')
let active = ref<boolean>(false)
function getactivevalue(value:string) {
    if (activemenu.value === value) {
    active.value = !active.value;
  } else {
    active.value = true;
  }
  activemenu.value = value;
}
watchEffect(() => {
  if (data.value) {
    alldata.value = data.value?.sidebar || [];
  }
});
watchEffect(() => {
  alldata.value.forEach((menuItem) => {
    if (menuItem.children) {
      menuItem.children.forEach((subItem) => {
        if (route.path === subItem.link) {
          activemenu.value = menuItem.title;
          active.value = true;
        }
      });
    }
  });
});
function removesidebar(){
    document.getElementById('main-page')?.classList.add('close_icon')
    document.getElementById('sidebar')?.classList.add('close_icon')
}
</script>
