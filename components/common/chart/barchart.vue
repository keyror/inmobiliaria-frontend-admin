<template>
   <ClientOnly>
    <VueApexCharts
    height="340"
    type="bar"
    :options="option"
    :series="series"
  />
   </ClientOnly>
</template>

<script setup lang="ts">
import options from '@/data/chart';

    let  series = [{
            name: 'series-1',
            data: [5, 12, 15, 18, 16, 20, 16, 13, 10, 6]
          }]
    let option = options.options
</script>

<style scoped>

</style>