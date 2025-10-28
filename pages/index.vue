<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { ref } from 'vue'
import * as THREE from 'three'
import HouseModel from '~/components/HouseModel.vue'
import Navigation from '~/components/Navigation.vue'
import ImageOverlay from '~/components/ImageOverlay.vue'

const canvasRef = ref<InstanceType<typeof TresCanvas> | null>(null)
const activeCamera = ref<THREE.PerspectiveCamera | null>(null)

// Handle when the GLTF camera is ready
const onCameraReady = (camera: THREE.PerspectiveCamera) => {
  console.log('GLTF camera received in parent:', camera)

  // Set this camera as the active camera for the canvas
  activeCamera.value = camera
}
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Navigation overlay -->
    <Navigation />

    <!-- Image overlay at bottom -->
    <ImageOverlay
      image-src="/images/Image1-768x432.png"
      alt="Example overlay image"
      position="bottom"
      size="medium"
      :show-glassmorphism="true"
    />

    <!-- 3D Canvas background -->
    <TresCanvas
      clear-color="#82DBC5"
      window-size
      ref="canvasRef"
    >
      <!-- <FirstExperience /> -->
      <HouseModel @camera-ready="onCameraReady"></HouseModel>
    </TresCanvas>
  </div>
</template>
