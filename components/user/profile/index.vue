<template>
    <div class="page-body">
        <CommonBreadcrumb title="User profile" page="Manage users"/>
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="row user-info">
                        <div class="col-xl-5 xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="media contact-media">
                                        <img src="/image/avatar/7.jpg" class="img-fluid img-80" alt="">
                                        <div class="media-body">
                                            <h4>Good Evening , Brock Lee</h4>
                                            <span class="light-font">My current address <a href="javascript:void(0)">Mina Road, Dubai, United Arab Emirates</a></span>
                                            <ul class="agent-social mt-2">
                                                <li><a href="https://www.facebook.com/" class="facebook" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                                                <li><a href="https://twitter.com/" class="twitter" target="_blank"><i class="fab fa-twitter"></i></a></li>
                                                <li><a href="https://account.google.com" class="google" target="_blank"><i class="fab fa-google"></i></a></li>
                                                <li><a href="https://www.linkedin.com/" class="linkedin" target="_blank"><i class="fab fa-linkedin-in"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="contact-btn">
                                    <button type="button" onclick="document.location='/users/allusers'" class="btn btn-gradient color-4 btn-pill">Email</button>
                                    <button type="button" onclick="document.location='/users/adduser'" class="btn btn-dashed color-4 ms-2 btn-pill">Message</button>
                                    </div>
                                </div>
                             </div>
                        </div>
                        <div class="col-xl-4 xl-6">
                            <div class="card">
                                <div class="card-body">
                                   <div class="partner-info">
                                       <div class="title-about">
                                           <h5>Project meetings</h5>
                                       </div>
                                       <div class="time-details">
                                           <div>
                                                <ul>
                                                    <li v-for="(item , index) in avtar" :key="index">
                                                        <img :src="item" class="img-fluid" alt="">
                                                    </li>
                                                </ul>
                                                <nuxt-link to="/users/allusers" class="arrow-animated">
                                                    Join now
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                                </nuxt-link>
                                           </div>
                                           <div>
                                                <h6>4:00 - 5:00 PM</h6>
                                                <span class="label label-light color-4">10 mins left</span>
                                           </div>
                                       </div>
                                   </div>
                                </div>
                           </div>
                        </div>
                        <UserProfileInstallment/>
                        <UserProfileFriends/>
                        <UserProfilePropertyandlearning/>
                        <UserProfileUserfollowing/>
                    </div>
                </div>
            </div>
        </div>                
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
const avtar = ref<string[]>([]);
const {data} = await useFetch(baseUrl+'/data/user.json');
watchEffect(() => {
  if (data.value) {
    avtar.value = data.value.meetings|| [];
  }
});
</script>

<style scoped>

</style>