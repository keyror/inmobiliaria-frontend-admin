<template>
<div class="page-main-header row" id="main-page">
    <div id="sidebar-toggle" class="toggle-sidebar col-auto" @click="sidebartoggle()">
        <Icon name="mdi:chevron-double-left" />
    </div>
    <div class="nav-right col p-0">
        <ul class="header-menu">
            <li>
                <div class="d-md-none mobile-search" @click="open = !open">
                   <Icon name="uil:search" class="fs-3" />
                </div>
                <div class="form-group search-form" :class="open?'open':''">
                    <input type="text" class="form-control" placeholder="Search here...">
                </div>
            </li>
            <li>
                <a href="#!" @click="toggleFullScreen()">
                    <Icon name="humbleicons:maximize" class="fs-3" />
                </a>
            </li>
            <ClientOnly>
            <LayoutHeaderAttachment/>
            <LayoutHeaderNotification/>
            <LayoutHeaderMessage/>
            </ClientOnly>
            <li class="profile-avatar onhover-dropdown">
                <div>
                    <img src="/image/avatar/3.jpg" class="img-fluid" alt="">
                </div>
                <ul class="profile-dropdown onhover-show-div">
                    <li><nuxt-link to="/users/profile"><span>Account </span><Icon name="mdi:account-outline" class="fs-3" /></nuxt-link></li>
                    <li><nuxt-link to="/myproperties/propertylist"><span>Listing</span><Icon name="mdi:file-document-outline" class="fs-3"/></nuxt-link></li>
                    <li><nuxt-link @click="submitForm"><span>Log in</span><Icon name="mdi:login" class="fs-3"/></nuxt-link></li>
                </ul>
            </li>
        </ul>
    </div>
</div>
</template>

<script setup lang="ts">
let open = ref<boolean>(false)
import {useAuthStore} from "~/store/authStore";

const auth = useAuthStore();

function submitForm() {
  auth.logout()
}
function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
let sidebartoggles = ref<boolean>(false)
function sidebartoggle(){
    sidebartoggles.value = !sidebartoggles.value
   if(window.screen.width > 991){
        if(sidebartoggles.value == true){
            document.getElementById('main-page')?.classList.add('close_icon')
            document.getElementById('sidebar')?.classList.add('close_icon')
        }
        else{
            document.getElementById('main-page')?.classList.remove('close_icon')
            document.getElementById('sidebar')?.classList.remove('close_icon')
        }
   }
   else{
    document.getElementById('main-page')?.classList.remove('close_icon')
    document.getElementById('sidebar')?.classList.remove('close_icon')
   }
}
</script>

<style scoped>

</style>
