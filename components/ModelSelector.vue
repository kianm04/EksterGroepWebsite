<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ModelConfig } from '~/types/models';

interface Props {
  /** Available models to choose from */
  models: ModelConfig[];

  /** Currently selected model ID */
  selectedModelId?: string | null;

  /** Currently loading model ID */
  loadingModelId?: string | null;

  /** Loaded model IDs */
  loadedModelIds?: string[];

  /** Whether any model is currently loading */
  isAnyLoading?: boolean;

  /** Layout variant */
  variant?: 'horizontal' | 'vertical' | 'grid';

  /** Show model descriptions */
  showDescriptions?: boolean;

  /** Show file sizes */
  showFileSizes?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  selectedModelId: null,
  loadingModelId: null,
  loadedModelIds: () => [],
  isAnyLoading: false,
  variant: 'horizontal',
  showDescriptions: false,
  showFileSizes: true,
});

const emit = defineEmits<{
  'select-model': [modelId: string];
  'load-model': [modelId: string];
}>();

// Track which models have been initiated by user
const userInitiatedModels = ref<Set<string>>(new Set());

/**
 * Handle model button click
 */
const handleModelClick = (model: ModelConfig) => {
  if (props.loadingModelId === model.id) {
    // Already loading this model
    return;
  }

  if (userInitiatedModels.value.has(model.id) && props.loadedModelIds.includes(model.id)) {
    // Model already loaded, just select it
    emit('select-model', model.id);
  } else {
    // Load the model
    userInitiatedModels.value.add(model.id);
    emit('load-model', model.id);
  }
};

/**
 * Get button state for a model
 */
const getButtonState = (model: ModelConfig) => {
  const isLoading = props.loadingModelId === model.id;
  const isLoaded = props.loadedModelIds.includes(model.id);
  const isSelected = props.selectedModelId === model.id;
  const hasInitiated = userInitiatedModels.value.has(model.id);

  return {
    isLoading,
    isLoaded,
    isSelected,
    hasInitiated,
    isDisabled: props.isAnyLoading && !isLoading,
  };
};

/**
 * Get button label for a model
 */
const getButtonLabel = (model: ModelConfig) => {
  const state = getButtonState(model);

  if (state.isLoading) {
    return 'Laden...';
  }

  if (state.isLoaded && state.isSelected) {
    return 'Actief';
  }

  if (state.isLoaded) {
    return 'Bekijk';
  }

  return model.buttonLabel;
};

/**
 * Computed layout classes
 */
const containerClasses = computed(() => {
  const baseClasses = 'flex gap-3';

  switch (props.variant) {
    case 'vertical':
      return `${baseClasses} flex-col`;
    case 'grid':
      return 'grid grid-cols-2 md:grid-cols-3 gap-3';
    case 'horizontal':
    default:
      return `${baseClasses} flex-row flex-wrap`;
  }
});
</script>

<template>
  <div class="model-selector">
    <div :class="containerClasses">
      <div
        v-for="model in models"
        :key="model.id"
        class="model-item"
      >
        <button
          @click="handleModelClick(model)"
          :disabled="getButtonState(model).isDisabled"
          :class="[
            'model-button',
            'relative px-6 py-3',
            'bg-white border border-gray-200 rounded-lg',
            'transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
            {
              'shadow-sm hover:shadow-md hover:scale-102 active:scale-98': !getButtonState(model).isDisabled && !getButtonState(model).isLoading,
              'opacity-50 cursor-not-allowed': getButtonState(model).isDisabled,
              'cursor-wait': getButtonState(model).isLoading,
              'ring-2 ring-gray-400 shadow-md': getButtonState(model).isSelected,
            }
          ]"
          :style="{ boxShadow: getButtonState(model).isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)' }"
        >
          <!-- Loading spinner -->
          <span
            v-if="getButtonState(model).isLoading"
            class="flex items-center gap-2 text-gray-600"
          >
            <svg
              class="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {{ getButtonLabel(model) }}
          </span>

          <!-- Normal state -->
          <span
            v-else
            :class="[
              'font-medium',
              getButtonState(model).isSelected ? 'text-gray-900' : 'text-gray-700'
            ]"
          >
            {{ getButtonLabel(model) }}
          </span>

          <!-- Optional file size badge -->
          <span
            v-if="showFileSizes && model.loading?.fileSize && !getButtonState(model).hasInitiated"
            class="absolute -top-2 -right-2 px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-500"
          >
            {{ model.loading.fileSize }}
          </span>

          <!-- Loaded indicator -->
          <span
            v-if="getButtonState(model).isLoaded && !getButtonState(model).isSelected"
            class="absolute -top-2 -right-2 w-3 h-3 bg-green-400 border-2 border-white rounded-full"
          />

          <!-- Selected indicator -->
          <span
            v-if="getButtonState(model).isSelected"
            class="absolute -top-2 -right-2 w-3 h-3 bg-gray-700 border-2 border-white rounded-full animate-pulse"
          />
        </button>

        <!-- Optional description -->
        <p
          v-if="showDescriptions && model.description"
          class="mt-2 text-sm text-gray-600 max-w-xs"
        >
          {{ model.description }}
        </p>
      </div>
    </div>

    <!-- Loading progress hint -->
    <Transition
      name="fade"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="loadingModelId"
        class="mt-4 text-xs text-gray-500 tracking-wider uppercase font-medium flex items-center gap-2"
      >
        <span>Loading model</span>
        <div class="flex gap-1">
          <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" />
          <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s" />
          <div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Additional clean styling following CLAUDE.md guidelines */
.model-button {
  min-width: 120px;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Ensure proper transform origin for scaling */
.model-button:not(:disabled) {
  transform-origin: center;
  will-change: transform;
  backface-visibility: hidden;
}

/* Clean transition for all states */
.model-button * {
  transition: inherit;
}
</style>