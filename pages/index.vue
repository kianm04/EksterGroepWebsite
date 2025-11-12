<script setup lang="ts">
import { ref } from 'vue'
import * as THREE from 'three'
import { TresCanvas } from '@tresjs/core'
import HouseModelRig from '~/components/HouseModelRig.vue'
import Navigation from '~/components/Navigation.vue'
import ImageOverlay from '~/components/ImageOverlay.vue'

const activeCamera = ref<THREE.PerspectiveCamera | null>(null)

const onCameraReady = (camera: THREE.PerspectiveCamera) => {
  activeCamera.value = camera
}
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <Navigation />

    <ImageOverlay
      image-src="/images/Image1-768x432.png"
      alt="Example overlay image"
      position="bottom"
      size="medium"
      :show-glassmorphism="true"
    />

    <TresCanvas
      clear-color="#82DBC5"
      window-size
      :camera="activeCamera || undefined"
      class="!z-0"
      :style="{ position: 'absolute', inset: 0 }"
    >
      <HouseModelRig @camera-ready="onCameraReady" />
    </TresCanvas>
  </div>
</template>
