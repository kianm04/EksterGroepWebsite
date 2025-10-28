<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import HouseModel from '~/components/HouseModel.vue'
import Navigation from '~/components/Navigation.vue'
import ImageOverlay from '~/components/ImageOverlay.vue'
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
    >
      <!-- <FirstExperience /> -->
      <HouseModel></HouseModel>
    </TresCanvas>
  </div>
</template>
