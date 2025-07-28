<template>
    <ClientOnly>
        <VueApexCharts
        width="100%"
        height="90%"
        type="bar"
        :options="option"
        :series="series"
      />
       </ClientOnly>
</template>

<script setup lang="ts">
import options from '@/data/chart'
 let  series = [{
            name: 'earning',
            data: [400, 900, 800, 1000, 700, 1200, 300, 400, 300, 600, 800, 400, 200,500, 400]
          }]
    let option = options.earningsoption 
</script>

<style scoped>

</style>