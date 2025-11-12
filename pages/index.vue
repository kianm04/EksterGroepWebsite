<script setup lang="ts">
import { ref } from "vue";
import * as THREE from "three";
import { TresCanvas } from "@tresjs/core";
import HouseModelRig from "~/components/HouseModelRig.vue";
import Navigation from "~/components/Navigation.vue";
import ImageOverlay from "~/components/ImageOverlay.vue";

const activeCamera = ref<THREE.PerspectiveCamera | null>(null);

const onCameraReady = (camera: THREE.PerspectiveCamera) => {
  activeCamera.value = camera;
};
</script>

<template>
  <div class="min-h-screen bg-[#F7F9F7]">
    <Navigation />

    <!-- Main content grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-16 lg:pt-20">
      <!-- Left column - Content -->
      <div class="flex items-center justify-center">
        <div class="max-w-xl space-y-8 lg:space-y-12">
          <!-- Header section -->

          <!-- Content section -->
          <div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed">
            <p class="text-base lg:text-lg font-light leading-relaxed">
              De Ekstergroep doet beheer, exploitatie, renovatie en verbetering
              van zowel monumentaal als gewoon vastgoed.
            </p>

            <p class="text-sm lg:text-base leading-relaxed">
              Wij leggen de focus op esthetiek, waarbij degelijkheid en
              levensduur als vereisten worden meegenomen.
            </p>

            <p class="text-sm lg:text-base leading-relaxed">
              We werken samen als team en pakken jaarlijks een aantal
              totalrenovaties op. Daarin begeleiden we de client van begin tot
              eind. Samen met de architect zetten we de dromen op papier, die we
              vervolgens door de constructeur laten doorrekenen. Na het
              uitgeebreid bespreken en plannen van de uit te voeren taken komt
              het team ten tonele en streven we er naar alles naar planning uit
              te voeren.
            </p>
          </div>

          <!-- Call to action -->
          <div class="space-y-3 lg:space-y-4 pt-4 lg:pt-6">
            <p class="text-sm lg:text-base leading-relaxed text-gray-700">
              Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw
              te brengen?
            </p>
            <div
              class="flex flex-col sm:inline-flex sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 group"
            >
              <span class="text-sm text-gray-600">Neem contact op via</span>
              <a
                href="mailto:info@ekstergroep.nl"
                class="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 hover:shadow-md transition-all duration-200 hover:scale-102 text-sm"
                style="box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)"
              >
                info@ekstergroep.nl
              </a>
            </div>
          </div>

          <!-- Scroll indicator -->
          <div class="pt-6 lg:pt-8 border-t border-gray-200 relative">
            <div
              class="text-xs text-gray-500 tracking-wider uppercase font-medium flex items-center space-x-2"
            >
              <span>Start scrolling to explore</span>
              <div class="flex space-x-1">
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                ></div>
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                  style="animation-delay: 0.2s"
                ></div>
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                  style="animation-delay: 0.4s"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column - 3D Model -->
      <div class="relative h-96 sm:h-[500px] lg:h-auto lg:min-h-screen">
        <TresCanvas
          clear-color="#82DBC5"
          :camera="activeCamera || undefined"
          class="w-full h-full"
        >
          <HouseModelRig @camera-ready="onCameraReady" />
        </TresCanvas>
      </div>
    </div>
  </div>
</template>
