<template>
<div class="col-xl-4 xl-6 col-md-6">
    <div class="about-profile">
        <div class="about-info">
            <div class="card">
                <div class="card-body">
                    <div class="title-about">
                        <h5>About</h5>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-bordernone mb-0">
                            <tbody>
                                <tr>
                                    <td class="pt-0">Email:</td>
                                    <td class="light-font pt-0">brockle@gmail.com</td>
                                </tr>
                                <tr>
                                    <td>Mobile Number:</td>
                                    <td class="light-font">+ 61 1545812570</td>
                                </tr>
                                <tr>
                                    <td>Gender:</td>
                                    <td class="light-font">Male</td>
                                </tr>
                                <tr>
                                    <td class="pb-0">DOB:</td>
                                    <td class="light-font pb-0">Dec, 10 1990</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="col-xl-3 xl-6 col-lg-12 col-md-5 xl-index-10">
    <div class="about-profile row">
        <div class="col-xl-12 xl-12 col-lg-6">
            <div class="card">
                <div class="card-body">
                    <div class="partner-info">
                        <div class="title-about">
                            <h5>Project meetings</h5>
                        </div>
                        <div class="time-details agent-time-details">
                            <div>
                                <ul>
                                    <li v-for="(item , index) in inputsData.avtar" :key="index">
                                        <img :src="item" class="img-fluid" alt="">
                                    </li>
                                </ul>
                                <nuxt-link to="/users/allusers" class="arrow-animated">
                                    Join now
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
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
        <div class="about-info xl-none col-xl-12 xl-6 col-lg-6">
            <div class="card">
                <div class="card-body">
                    <div class="title-about">
                        <h5>Friends</h5>
                    </div>
                    <div class="friend-list">
                        <ul class="row">
                            <li class="col-md-4 col-sm-3 col-4" v-for="(item , index) in inputsData.friends" :key="index">
                                <img :src="item.src" class="img-fluid img-50" alt="">
                                <h6>{{ item.title }}</h6>
                                <nuxt-link to="/users/adduser" class="label label-light label-flat color-4">Message</nuxt-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { baseUrl} from "@/composable/apiurl";
interface friend{
    src:string;
    title:string;
}
const inputsData = ref({
    avtar: [] as string[],
    friends: [] as friend[],
});
const { data} = await useFetch(baseUrl + '/data/user.json');
watchEffect(() => {
  if (data.value) {
    inputsData.value = {
        avtar: data.value.meetings || [],
        friends: data.value.friends || []
    };
  }
});
</script>