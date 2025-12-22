import { ref, computed, markRaw } from 'vue'
import * as THREE from 'three'

export interface CameraControlConfig {
  baseRadius?: number
  autoRotationSpeed?: number
  sensitivity?: number
  damping?: number
  minPhi?: number
  maxPhi?: number
}

export interface SphericalCoordinates {
  radius: number
  theta: number
  phi: number
}

/**
 * Shared camera control logic for both desktop and mobile modes
 * Handles spherical coordinate system, auto-rotation, and user interaction
 */
export function useCameraControls(config: CameraControlConfig = {}) {
  const {
    baseRadius = 45,
    autoRotationSpeed = (2 * Math.PI) / 90, // Full rotation in 90 seconds
    sensitivity = 0.003,
    damping = 0.08,
    minPhi = 0.05,
    maxPhi = Math.PI / 2 - 0.05
  } = config

  // Camera and target references
  const runtimeCamera = ref<THREE.PerspectiveCamera | null>(null)
  const lookAtTarget = ref<THREE.Object3D | null>(null)

  // Spherical coordinate system
  const sphericalCoords = ref<SphericalCoordinates>({
    radius: baseRadius,
    theta: 0,
    phi: Math.PI / 4 // Higher initial camera position (45 degrees vs 60)
  })

  // Target and current spherical coords for smooth transitions
  const targetSpherical = ref({
    theta: 0,
    phi: Math.PI / 4
  })

  const currentSpherical = ref({
    theta: 0,
    phi: Math.PI / 4
  })

  // Interaction state
  const isInteracting = ref(false)
  const isAutoRotating = ref(true)
  const previousInteractionPosition = ref({ x: 0, y: 0 })

  // Animation clock
  const clock = markRaw(new THREE.Clock())

  /**
   * Convert spherical coordinates to cartesian position
   */
  const sphericalToCartesian = (
    radius: number,
    theta: number,
    phi: number
  ): THREE.Vector3 => {
    const x = radius * Math.sin(phi) * Math.cos(theta)
    const z = radius * Math.sin(phi) * Math.sin(theta)
    const y = radius * Math.cos(phi)
    return new THREE.Vector3(x, y, z)
  }

  /**
   * Clamp phi angle to valid range
   */
  const clampPhi = (phi: number): number => {
    return Math.max(minPhi, Math.min(maxPhi, phi))
  }

  /**
   * Initialize spherical coordinates from a camera position
   */
  const initializeFromCamera = (
    camera: THREE.PerspectiveCamera,
    target: THREE.Object3D
  ) => {
    runtimeCamera.value = markRaw(camera)
    lookAtTarget.value = markRaw(target)

    // Calculate initial spherical angles from camera position
    const targetPos = new THREE.Vector3()
    target.getWorldPosition(targetPos)
    const cameraPos = new THREE.Vector3()
    camera.getWorldPosition(cameraPos)

    const offset = cameraPos.clone().sub(targetPos)
    const distance = offset.length()

    sphericalCoords.value = {
      radius: distance || baseRadius,
      theta: Math.atan2(offset.z, offset.x),
      phi: Math.acos(Math.max(-1, Math.min(1, offset.y / distance)))
    }

    // Sync all coordinate systems
    targetSpherical.value.theta = sphericalCoords.value.theta
    targetSpherical.value.phi = sphericalCoords.value.phi
    currentSpherical.value.theta = sphericalCoords.value.theta
    currentSpherical.value.phi = sphericalCoords.value.phi
  }

  /**
   * Update camera and target references without recalculating angles.
   * Use this when switching between models to preserve the current viewing angle.
   */
  const updateCameraReference = (
    camera: THREE.PerspectiveCamera,
    target: THREE.Object3D
  ) => {
    runtimeCamera.value = markRaw(camera)
    lookAtTarget.value = markRaw(target)
    // Keep current spherical coordinates - don't recalculate from camera position
  }

  /**
   * Create a default camera if none exists
   */
  const createDefaultCamera = (): THREE.PerspectiveCamera => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000)
    camera.position.set(30, 20, 30)

    // Create default look-at target
    const target = new THREE.Object3D()
    target.position.set(0, 0, 0)

    initializeFromCamera(camera, target)
    return camera
  }

  /**
   * Start interaction (mouse/touch down)
   */
  const startInteraction = (x: number, y: number) => {
    isInteracting.value = true
    isAutoRotating.value = false
    previousInteractionPosition.value = { x, y }
  }

  /**
   * Update interaction (mouse/touch move)
   */
  const updateInteraction = (x: number, y: number) => {
    if (!isInteracting.value) return

    const deltaX = x - previousInteractionPosition.value.x
    const deltaY = y - previousInteractionPosition.value.y

    targetSpherical.value.theta -= deltaX * sensitivity
    targetSpherical.value.phi += deltaY * sensitivity
    targetSpherical.value.phi = clampPhi(targetSpherical.value.phi)

    previousInteractionPosition.value = { x, y }
  }

  /**
   * End interaction (mouse/touch up)
   */
  const endInteraction = () => {
    isInteracting.value = false
    // Re-enable auto rotation after a delay
    setTimeout(() => {
      if (!isInteracting.value) {
        isAutoRotating.value = true
      }
    }, 1000)
  }

  /**
   * Update camera position based on current spherical coordinates
   */
  const updateCameraPosition = (
    effectiveRadius?: number,
    deltaTime?: number,
    phiAdjustment?: number,
    yOffset?: number
  ) => {
    if (!runtimeCamera.value || !lookAtTarget.value) return

    const delta = deltaTime ?? clock.getDelta()

    // Handle auto-rotation
    if (isAutoRotating.value && !isInteracting.value) {
      targetSpherical.value.theta += autoRotationSpeed * delta
    }

    // Smooth interpolation of spherical coordinates
    currentSpherical.value.theta +=
      (targetSpherical.value.theta - currentSpherical.value.theta) * damping
    currentSpherical.value.phi +=
      (targetSpherical.value.phi - currentSpherical.value.phi) * damping

    // Get look-at target world position (original position for camera placement)
    const targetWorldPos = new THREE.Vector3()
    lookAtTarget.value.getWorldPosition(targetWorldPos)

    // Apply phi adjustment if provided (for mobile viewport angle adjustment)
    const adjustedPhi = phiAdjustment !== undefined
      ? currentSpherical.value.phi + phiAdjustment
      : currentSpherical.value.phi

    // Calculate camera position from spherical coordinates (with adjusted phi)
    const radius = effectiveRadius ?? sphericalCoords.value.radius
    const cameraOffset = sphericalToCartesian(
      radius,
      currentSpherical.value.theta,
      adjustedPhi
    )

    // Apply Y offset to compensate for different lookAtTarget heights between models
    if (yOffset) {
      cameraOffset.y += yOffset
    }

    // Set camera position relative to look-at target
    runtimeCamera.value.position.copy(targetWorldPos).add(cameraOffset)

    // Make camera look at the target
    runtimeCamera.value.lookAt(targetWorldPos)
    runtimeCamera.value.updateMatrixWorld()
  }

  /**
   * Set auto-rotation state
   */
  const setAutoRotation = (enabled: boolean) => {
    isAutoRotating.value = enabled
  }

  /**
   * Reset camera to initial position
   */
  const resetCamera = () => {
    targetSpherical.value.theta = 0
    targetSpherical.value.phi = Math.PI / 4
  }

  /**
   * Set target spherical coordinates directly (for page-based camera control)
   * This bypasses auto-rotation and sets the target for smooth interpolation.
   */
  const setTargetCoordinates = (coords: {
    theta?: number
    phi?: number
    radius?: number
  }) => {
    if (coords.theta !== undefined) {
      targetSpherical.value.theta = coords.theta
    }
    if (coords.phi !== undefined) {
      targetSpherical.value.phi = clampPhi(coords.phi)
    }
    if (coords.radius !== undefined) {
      sphericalCoords.value.radius = coords.radius
    }
  }

  /**
   * Set current spherical coordinates immediately (no interpolation)
   * Used for instant camera positioning.
   */
  const setImmediateCoordinates = (coords: {
    theta?: number
    phi?: number
    radius?: number
  }) => {
    if (coords.theta !== undefined) {
      targetSpherical.value.theta = coords.theta
      currentSpherical.value.theta = coords.theta
    }
    if (coords.phi !== undefined) {
      const clampedPhi = clampPhi(coords.phi)
      targetSpherical.value.phi = clampedPhi
      currentSpherical.value.phi = clampedPhi
    }
    if (coords.radius !== undefined) {
      sphericalCoords.value.radius = coords.radius
    }
  }

  /**
   * Get current spherical coordinates (for transition starting point)
   */
  const getCurrentCoordinates = () => ({
    theta: currentSpherical.value.theta,
    phi: currentSpherical.value.phi,
    radius: sphericalCoords.value.radius
  })

  return {
    // Camera references (exposed as refs for direct access)
    runtimeCamera,
    lookAtTarget,

    // Coordinate systems
    sphericalCoords: computed(() => sphericalCoords.value),
    targetSpherical: computed(() => targetSpherical.value),
    currentSpherical: computed(() => currentSpherical.value),

    // Interaction state
    isInteracting: computed(() => isInteracting.value),
    isAutoRotating: computed(() => isAutoRotating.value),

    // Functions
    initializeFromCamera,
    updateCameraReference,
    createDefaultCamera,
    startInteraction,
    updateInteraction,
    endInteraction,
    updateCameraPosition,
    setAutoRotation,
    resetCamera,
    setTargetCoordinates,
    setImmediateCoordinates,
    getCurrentCoordinates,
    sphericalToCartesian,
    clampPhi
  }
}