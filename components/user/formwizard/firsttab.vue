<template>
    <form class="row gx-3">
        <CommonInputfieldsTextfield label="First name" placeholder="enter your name" classes="col-md-4 col-sm-6" star="*"/>
        <CommonInputfieldsTextfield label="Last name" placeholder="enter your surname" classes="col-md-4 col-sm-6" star="*"/>
        <CommonInputfieldsStatusfield label="Gender" show="Gender" classes="col-md-4 col-sm-6" :data="Gender" star="*"/>
        <CommonInputfieldsNumberfield label="Phone number" placeholder="enter your mobile number" classes=" col-sm-6" star="*"/>
        <div class="form-group col-md-6">
            <label>Date of birth <span class="font-danger">*</span></label>
            <VueDatePicker v-model="date"></VueDatePicker>                                    
        </div>
    </form>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
let Gender:string[] = ['Male' , 'Female']
let date = ref()
</script>

<style scoped>

</style>