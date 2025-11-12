<script setup lang="ts">
import { computed, onUnmounted, ref, watch, nextTick } from "vue";
import * as THREE from "three";
import { useGLTF } from "@tresjs/cientos";

const { state } = useGLTF("/models/ok12b_circle_rig.glb", { draco: true });

const emit = defineEmits<{
  "camera-ready": [camera: THREE.PerspectiveCamera];
}>();

const scene = computed(() => state.value?.scene ?? null);
const pathMover = ref<THREE.Object3D | null>(null);

// 🚨 start as null so the template does NOT try to attach too early
const runtimeCamera = ref<THREE.PerspectiveCamera | null>(null);

const lookAtTarget = ref<THREE.Object3D | null>(null);

const mixer = ref<THREE.AnimationMixer | null>(null);
const clock = new THREE.Clock();
let rafId: number | null = null;

watch(
  scene,
  async (loadedScene) => {
    if (!loadedScene) return;

    // find rig
    loadedScene.traverse((child) => {
      console.log(child.name);
      if (child.name === "EmptyCameraRig") {
        pathMover.value = child as THREE.Object3D;
      }
      if (child.name === "EmptyLookAtTarget") {
        lookAtTarget.value = child as THREE.Object3D;
      }
      if (child.name === "Camera") {
        runtimeCamera.value = child as THREE.PerspectiveCamera;
      }
    });

    // only now create the camera, when we actually have the rig
    if (pathMover.value && runtimeCamera.value) {
      // parent under rig so it follows the baked animation
      pathMover.value.add(runtimeCamera.value);

      // tell parent
      emit("camera-ready", runtimeCamera.value);

      // await one tick so Vue/Tres can mount scene first
      await nextTick();
    }

    // set up animation
    if (state.value?.animations?.length) {
      const _mixer = new THREE.AnimationMixer(loadedScene);
      _mixer.timeScale = 0.1;
      console.log(state.value.animations);

      state.value.animations.forEach((clip) => {
        if (clip.name == "CircleMove.001") {
          _mixer.clipAction(clip).play();
        }
        // if (clip.name == "ZoomOut") {
        //   _mixer.clipAction(clip).play();
        // }
      });

      mixer.value = _mixer;
    }

    startLoop();
  },
  { immediate: true }
);

function startLoop() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(loop);
}

const tempVec = new THREE.Vector3();

function loop() {
  const delta = clock.getDelta();

  if (mixer.value) mixer.value.update(delta);
  if (scene.value) scene.value.updateMatrixWorld(true);

  // 👇 add this
  if (runtimeCamera.value && lookAtTarget.value) {
    // get target's world position
    lookAtTarget.value.getWorldPosition(tempVec);
    // make the camera look at it (this sets camera's local rotation
    // relative to its parent, so it's fine that it's parented to the rig)
    runtimeCamera.value.lookAt(tempVec);
    runtimeCamera.value.updateMatrixWorld();
  }

  rafId = requestAnimationFrame(loop);
}

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (mixer.value) mixer.value.stopAllAction();
});
</script>

<template>
  <!-- draw gltf -->
  <primitive v-if="scene" :object="scene" />

  <primitive v-if="runtimeCamera" :object="runtimeCamera" attach="camera" />

  <TresAmbientLight :intensity="3" />
</template>
