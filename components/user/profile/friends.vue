<template>
    <div class="col-xl-3 xl-6 col-lg-12 col-md-5">
        <div class="about-profile row">
            <div class="about-info col-xl-12 xl-12 col-lg-6">
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
            <div class="about-info xl-none col-xl-12 xl-6 col-lg-6">
                <div class="card">
                    <div class="card-body">
                        <div class="title-about">
                            <h5>Friends</h5>
                        </div>
                        <div class="friend-list">
                            <ul class="row">
                                <li class="col-md-4 col-sm-3 col-4" v-for="(item , index) in friends" :key="index">
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
import { baseUrl } from "@/composable/apiurl";
interface friend{
    src:string;
    title:string;
}
const friends = ref<friend[]>([]);
const {data} = await useFetch(baseUrl+'/data/user.json');
watchEffect(() => {
  if (data.value) {
    friends.value = data.value.friends|| [];
  }
});
</script>

<style scoped>

</style>