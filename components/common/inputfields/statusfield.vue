<template>
    <div class="form-group" :class="classes">
        <label>{{ label }}  <span class="font-danger" v-if="star">{{ star }}</span></label>
        <div class="dropdown">
            <span class="dropdown-toggle font-rubik" data-bs-toggle="dropdown"><span>{{ selectedstatus }}</span> <i class="fas fa-angle-down"></i></span>
            <div class="dropdown-menu text-start">
                <nuxt-link class="dropdown-item" to="javascript:void(0)" v-for="(item , index) in data" :key="index" @click="getsatus(item)">{{ item }}</nuxt-link>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
 let props = defineProps({
    classes:String,
    label:String,
    data:Array,
    show:String,
    star:String
})
let selectedstatus = ref<string>('')
selectedstatus.value = props?.show
function getsatus(status:string) {
    selectedstatus.value = status
}
</script>

<style scoped>

</style>