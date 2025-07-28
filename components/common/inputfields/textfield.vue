<template>
    <div class="form-group" :class="classes">
        <label>{{ label }} <span class="font-danger" v-if="star">{{ star }}</span></label>
        <input :type="type?type:'text'" class="form-control" :value="value" :placeholder="placeholder" required>
    </div>
</template>

<script setup lang="ts">
defineProps({
    classes:String,
    placeholder:String,
    label:String,
    value:String,
    star:String,
    type:String
})
</script>

<style scoped>

</style>