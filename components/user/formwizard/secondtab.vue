<template>
    <form class="row" id="needs-validation1" novalidate="">
        <CommonInputfieldsTextfield label="Email Address" placeholder="enter your email" classes="col-md-4 col-sm-6" star="*"/>
        <CommonInputfieldsTextfield label="Password" placeholder="Enter your password" classes="col-md-4 col-sm-6" star="*"/>
        <CommonInputfieldsTextfield label="Confirm Password" placeholder="Enter your password" classes="col-md-4  col-sm-6" star="*"/>
        <CommonInputfieldsTextarea classes="col-sm-12" label="Description" />
        <CommonInputfieldsTextfield label="Address" placeholder="Enter your Address" classes=" col-sm-6" star="*"/>
        <CommonInputfieldsNumberfield label="Zip code" placeholder="Enter pin code" classes="col-sm-6" star="*"/>
    </form>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>