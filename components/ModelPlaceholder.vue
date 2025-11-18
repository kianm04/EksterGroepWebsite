<script setup lang="ts">
import type { ModelConfig } from '~/types/models';
import { MODEL_DEFAULTS } from '~/types/models';

// Props
interface Props {
  /** Model configuration (optional - uses defaults if not provided) */
  modelConfig?: ModelConfig | null;

  /** Override visibility */
  visible?: boolean;

  /** Override opacity (0-1) */
  opacity?: number;

  /** Override dimensions [width, height, depth] */
  dimensions?: [number, number, number];

  /** Override rotation [x, y, z] in radians */
  rotation?: [number, number, number];

  /** Override color */
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelConfig: null,
  visible: true,
  opacity: 1,
  dimensions: undefined,
  rotation: undefined,
  color: undefined,
});

// Compute final dimensions
const finalDimensions = computed(() => {
  if (props.dimensions) return props.dimensions;
  if (props.modelConfig?.placeholder?.dimensions) return props.modelConfig.placeholder.dimensions;
  return MODEL_DEFAULTS.placeholder.dimensions;
});

// Compute final rotation
const finalRotation = computed(() => {
  if (props.rotation) return props.rotation;
  if (props.modelConfig?.placeholder?.rotation) return props.modelConfig.placeholder.rotation;
  return MODEL_DEFAULTS.placeholder.rotation;
});

// Compute final color
const finalColor = computed(() => {
  if (props.color) return props.color;
  if (props.modelConfig?.placeholder?.color) return props.modelConfig.placeholder.color;
  return MODEL_DEFAULTS.placeholder.color;
});
</script>

<template>
  <TresMesh
    v-if="visible"
    :position="[0, 0, 0]"
    :rotation="finalRotation"
  >
    <!-- Box geometry with configurable size -->
    <TresBoxGeometry :args="finalDimensions" />

    <!-- Clean white material with subtle shading and opacity support -->
    <TresMeshStandardMaterial
      :color="finalColor"
      :roughness="0.8"
      :metalness="0.1"
      :emissive="finalColor"
      :emissiveIntensity="0.02"
      :transparent="true"
      :opacity="props.opacity"
    />
  </TresMesh>
</template>

<style scoped>
/* No additional styles needed for 3D component */
</style>