<template>
    <ClientOnly>
        <VueApexCharts
       width="100%"
       height="320"
        type="area"
        :options="chartOptions"
        :series="series"
      />
       </ClientOnly>
</template>

<script setup lang="ts">
import options from '@/data/chart'
const series=  [{
            name: "Rent income",
            data: [20, 25, 20, 30, 20, 50, 30, 35, 25, 60, 0]
        },
        {
            name: "Sale income",
            data: [10, 20, 10, 15, 10, 20, 15, 10, 15, 20, 0]
        }
    ];
const chartOptions=options.incomechart
</script>

<style scoped>

</style>