<template>
    <ClientOnly>
        <VueApexCharts
       width="100%"
       height="350px"
        type="donut"
        :options="chartOptions"
        :series="series"
      />
       </ClientOnly>
</template>

<script setup lang="ts">
import options from '@/data/chart'
const series=  [50, 30, 41];
const chartOptions=options.revenue
</script>

<style scoped>

</style>