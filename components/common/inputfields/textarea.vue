<template>
    <div class="form-group" :class="classes">
        <label>{{ label }}</label>
        <textarea class="form-control" rows="4" :value="value"></textarea>
    </div>
</template>

<script setup lang="ts">
defineProps({
    classes:String,
    label:String,
    value:String
})
</script>

<style scoped>

</style>