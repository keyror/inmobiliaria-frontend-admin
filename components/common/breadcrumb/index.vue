<template>
    <div class="container-fluid">
        <div class="page-header">
            <div class="row">
                <div class="col-sm-6">
                    <div class="page-header-left">
                        <h3>{{ title }}
                            <small>Welcome to admin panel</small>
                        </h3>
                    </div>
                </div>
                <div class="col-sm-6">
                    <ol class="breadcrumb pull-right">
                        <li class="breadcrumb-item">
                            <nuxt-link href="/">
                                <i class="fa fa-home"></i>
                            </nuxt-link>
                        </li>
                        <li class="breadcrumb-item active">{{ page }}</li>
                    </ol>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    title:String,
    page:String,
})
</script>

<style scoped>

</style>