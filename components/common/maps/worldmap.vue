<template>
  <ClientOnly>
    <ol-map
    :loadTilesWhileAnimating="true"
    :loadTilesWhileInteracting="true"
    style="height: 100%"
  >
    <ol-view
      ref="view"
      :center="center"
      :rotation="rotation"
      :zoom="zoom"
      :projection="projection"
    />

    <ol-tile-layer>
      <ol-source-osm />
    </ol-tile-layer>
  </ol-map></ClientOnly>
</template>

<script setup lang="ts">
const center = ref([40, 40]);
const projection = ref("EPSG:4326");
const zoom = ref(0);
const rotation = ref(0);

</script>

<style scoped>

</style>