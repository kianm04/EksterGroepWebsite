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
    <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-20">
      <!-- Left column - Content -->
      <div class="flex items-center justify-center p-8 lg:p-12">
        <div class="max-w-lg space-y-8">
          <div class="space-y-6">
            <h1 class="text-4xl lg:text-5xl font-light text-gray-900 leading-tight">
              Ekster Groep
            </h1>
            
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                De Ekstergroep doet beheer, exploitatie, renovatie en verbeteiring van zowel monumentaal 
                als gewoon vastgoed.
              </p>
              
              <p>
                Wij leggen de focus op esthetiek, waarbij degelijkheid en levensduur als vereisten worden 
                meegenomen.
              </p>
              
              <p>
                We werken samen als team en pakken jaarlijks een aantal totalrenovaties op. Daarin 
                begeleiden we de client van begin tot eind. Samen met de architect zetten we de dromen 
                op papier, die we vervolgens door de constructeur laten doorrekenen. Na het uitgeebreid 
                bespreken en plannen van de uit te voeren taken komt het team ten tonele en streven we 
                er naar alles naar planning uit te voeren.
              </p>
              
              <p>
                Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen, neem 
                dan contact met ons op via <strong>info@ekstergroep.nl</strong>
              </p>
            </div>
          </div>
          
          <div class="pt-4">
            <div class="text-sm text-gray-500 italic">
              Start scrolling to explore
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right column - 3D Model -->
      <div class="relative h-screen lg:h-auto">
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
