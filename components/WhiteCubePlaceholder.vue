<script setup lang="ts">
// Props
interface Props {
  visible?: boolean
  opacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  visible: true,
  opacity: 1
})
</script>

<template>
  <TresMesh
    v-if="visible"
    :position="[0, 0, 0]"
    :rotation="[0, Math.PI / 6, 0]"
  >
    <!-- Box geometry with appropriate size to match house scale -->
    <TresBoxGeometry :args="[15, 12, 15]" />

    <!-- Clean white material with subtle shading and opacity support -->
    <TresMeshStandardMaterial
      :color="'#FFFFFF'"
      :roughness="0.8"
      :metalness="0.1"
      :emissive="'#FFFFFF'"
      :emissiveIntensity="0.02"
      :transparent="true"
      :opacity="props.opacity"
    />
  </TresMesh>
</template>

<style scoped>
/* No additional styles needed for 3D component */
</style>