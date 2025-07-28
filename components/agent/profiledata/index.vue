<template>
    <div class="page-body">
        <CommonBreadcrumb title="Agent profile" page="Agents"/>
        <div class="container-fluid">
            <div class="row">
                <div class="col-lg-12">
                    <div class="row user-info">
                        <div class="col-xl-5 xl-6">
                            <div class="card">
                                <div class="card-body">
                                    <div class="media contact-media">
                                        <img src="/image/avatar/5.jpg" class="img-fluid img-80" alt="">
                                        <div class="media-body">
                                            <h4>Good Evening , Zack Lee</h4>
                                            <span class="light-font">My current address <a href="javascript:void(0)">Mina Road, Dubai, United Arab Emirates</a></span>
                                            <ul class="agent-social mt-2">
                                                <li><a href="https://www.facebook.com/" class="facebook" target="_blank"><i class="fab fa-facebook-f"></i></a></li>
                                                <li><a href="https://twitter.com/" class="twitter" target="_blank"><i class="fab fa-twitter"></i></a></li>
                                                <li><a href="https://account.google.com" class="google" target="_blank"><i class="fab fa-google"></i></a></li>
                                                <li><a href="https://www.linkedin.com/" class="linkedin" target="_blank"><i class="fab fa-linkedin-in"></i></a></li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="all-properties mt-3">
                                        <ul class="light-box user-info-icon">
                                            <li v-for="(item , index) in inputsData.info" :key="index">
                                                <div class="media">
                                                    <img :src="item.src" class="img-fluid" alt="">
                                                    <div class="media-body">
                                                        <h5>{{ item.count }}</h5>
                                                        <span class="light-font">{{ item.type }}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="contact-btn">
                                        <button type="button" onclick="document.location='/users/allusers'" class="btn btn-gradient color-4 btn-pill">Email</button>
                                        <button type="button" onclick="document.location='/users/adduser'" class="btn btn-dashed color-4 ms-2 btn-pill">Message</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-xl-3 xl-6 follow-list-item col-md-6">
                            <div class="follow-list ">
                                <div class="card">
                                    <div class="card-body">
                                        <div class="title-about">
                                            <h5>Following</h5>
                                        </div>
                                        <ul>
                                            <li v-for="(item , index) in inputsData.following" :key="index">
                                                <div class="media">
                                                    <img :src="item.src" class="img-fluid img-50" alt="">
                                                    <div class="media-body">
                                                        <h6>{{ item.name }}</h6>
                                                        <span class="light-font">{{ item.email }}</span>
                                                    </div>
                                                    <div class="status text-capitalize" :class="item.status">{{ item.status }}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AgentProfiledataAbout/>
                        <AgentProfiledataPropertyandearning/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { baseUrl } from "@/composable/apiurl";
interface info{
    src:string;
    count?:number;
    type:string
}
interface follow{
    src:string;
    name:string;
    email:string;
    status:string;
}
const inputsData = ref({
    info: [] as info[],
    following: [] as follow[],
});
const {data} = await useFetch(baseUrl+'/data/agent.json');
const {data:follow} = await useFetch(baseUrl+'/data/user.json')
watchEffect(() => {
  if (data.value && follow.value) {
    inputsData.value = {
        info: data.value.agentinfo || [],
        following: follow.value.following.slice(0 , 3) || []
    };
  }
});
</script>

<style scoped>

</style>