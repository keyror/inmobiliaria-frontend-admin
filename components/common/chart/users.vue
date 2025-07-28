<template>
    <ClientOnly>
        <VueApexCharts
        type="donut"
        :options="chartOptions"
        :series="series"
      />
       </ClientOnly>
</template>

<script setup lang="ts">
import options from '@/data/chart'
const series=[44, 55, 41, 17]
const chartOptions=options.useroptions
</script>

<style scoped>

</style>