import { ref, defineComponent, watch, shallowRef, toRefs, createElementBlock, openBlock, unref, renderSlot, createElementVNode, watchEffect, useSlots, useAttrs, computed, isRef, createVNode, render, createCommentVNode, createBlock, useSSRContext, toValue, mergeProps, withCtx, getCurrentScope, onScopeDispose, markRaw, nextTick, getCurrentInstance, normalizeStyle, normalizeClass, hasInjectionContext, inject, reactive, provide, readonly, shallowReadonly } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrRenderClass, ssrRenderList, ssrRenderStyle, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
import * as Ki from 'three';
import { Vector3, SphereGeometry, Object3D, Triangle, Vector2, Matrix4, Line3, Plane, Ray, Quaternion, Sphere, AudioListener, Audio, AudioLoader, BufferGeometry, InterleavedBuffer, InterleavedBufferAttribute, MathUtils, REVISION, Color, WebGLRenderer, PlaneGeometry, Raycaster, ShaderMaterial, DoubleSide, PerspectiveCamera, OrthographicCamera, UniformsUtils, Mesh, Vector4, WebGLRenderTarget, HalfFloatType, NoToneMapping, PCFSoftShadowMap, ACESFilmicToneMapping, Scene, Loader, FileLoader, BufferAttribute, LoaderUtils, MeshPhysicalMaterial, SpotLight, PointLight, DirectionalLight, InstancedMesh, InstancedBufferAttribute, TextureLoader, ImageBitmapLoader, LinearMipmapLinearFilter, NearestMipmapLinearFilter, LinearMipmapNearestFilter, NearestMipmapNearestFilter, LinearFilter, NearestFilter, RepeatWrapping, MirroredRepeatWrapping, ClampToEdgeWrapping, Texture, PointsMaterial, Material, LineBasicMaterial, MeshStandardMaterial, MeshBasicMaterial, PropertyBinding, SkinnedMesh, LineSegments, Line, LineLoop, Points, Group, Skeleton, AnimationClip, Bone, InterpolateDiscrete, InterpolateLinear, VectorKeyframeTrack, NumberKeyframeTrack, QuaternionKeyframeTrack, FrontSide, TrianglesDrawMode, TriangleFanDrawMode, TriangleStripDrawMode, Interpolant, Box3, Clock } from 'three';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

function tryOnScopeDispose(fn2) {
  if (getCurrentScope()) {
    onScopeDispose(fn2);
    return true;
  }
  return false;
}
// @__NO_SIDE_EFFECTS__
function createEventHook() {
  const fns = /* @__PURE__ */ new Set();
  const off = (fn2) => {
    fns.delete(fn2);
  };
  const clear = () => {
    fns.clear();
  };
  const on2 = (fn2) => {
    fns.add(fn2);
    const offFn = () => off(fn2);
    tryOnScopeDispose(offFn);
    return {
      off: offFn
    };
  };
  const trigger = (...args) => {
    return Promise.all(Array.from(fns).map((fn2) => fn2(...args)));
  };
  return {
    on: on2,
    off,
    trigger,
    clear
  };
}
const localProvidedStateMap = /* @__PURE__ */ new WeakMap();
const injectLocal = /* @__NO_SIDE_EFFECTS__ */ (...args) => {
  var _a2;
  const key = args[0];
  const instance = (_a2 = getCurrentInstance()) == null ? void 0 : _a2.proxy;
  if (instance == null && !hasInjectionContext())
    throw new Error("injectLocal must be called in setup");
  if (instance && localProvidedStateMap.has(instance) && key in localProvidedStateMap.get(instance))
    return localProvidedStateMap.get(instance)[key];
  return inject(...args);
};
function provideLocal(key, value) {
  var _a2;
  const instance = (_a2 = getCurrentInstance()) == null ? void 0 : _a2.proxy;
  if (instance == null)
    throw new Error("provideLocal must be called in setup");
  if (!localProvidedStateMap.has(instance))
    localProvidedStateMap.set(instance, /* @__PURE__ */ Object.create(null));
  const localProvidedState = localProvidedStateMap.get(instance);
  localProvidedState[key] = value;
  return provide(key, value);
}
// @__NO_SIDE_EFFECTS__
function createInjectionState(composable, options) {
  const key = (options == null ? void 0 : options.injectionKey) || Symbol(composable.name || "InjectionState");
  const defaultValue = options == null ? void 0 : options.defaultValue;
  const useProvidingState = (...args) => {
    const state = composable(...args);
    provideLocal(key, state);
    return state;
  };
  const useInjectedState = () => /* @__PURE__ */ injectLocal(key, defaultValue);
  return [useProvidingState, useInjectedState];
}
typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const toString = Object.prototype.toString;
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
function createFilterWrapper(filter, fn2) {
  function wrapper(...args) {
    return new Promise((resolve, reject) => {
      Promise.resolve(filter(() => fn2.apply(this, args), { fn: fn2, thisArg: this, args })).then(resolve).catch(reject);
    });
  }
  return wrapper;
}
function debounceFilter(ms2, options = {}) {
  let timer;
  let maxTimer;
  let lastRejector = noop;
  const _clearTimeout = (timer2) => {
    clearTimeout(timer2);
    lastRejector();
    lastRejector = noop;
  };
  let lastInvoker;
  const filter = (invoke2) => {
    const duration = toValue(ms2);
    const maxDuration = toValue(options.maxWait);
    if (timer)
      _clearTimeout(timer);
    if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
      if (maxTimer) {
        _clearTimeout(maxTimer);
        maxTimer = void 0;
      }
      return Promise.resolve(invoke2());
    }
    return new Promise((resolve, reject) => {
      lastRejector = options.rejectOnCancel ? reject : resolve;
      lastInvoker = invoke2;
      if (maxDuration && !maxTimer) {
        maxTimer = setTimeout(() => {
          if (timer)
            _clearTimeout(timer);
          maxTimer = void 0;
          resolve(lastInvoker());
        }, maxDuration);
      }
      timer = setTimeout(() => {
        if (maxTimer)
          _clearTimeout(maxTimer);
        maxTimer = void 0;
        resolve(invoke2());
      }, duration);
    });
  };
  return filter;
}
function promiseTimeout(ms2, throwOnTimeout = false, reason = "Timeout") {
  return new Promise((resolve, reject) => {
    if (throwOnTimeout)
      setTimeout(() => reject(reason), ms2);
    else
      setTimeout(resolve, ms2);
  });
}
function pxValue(px2) {
  return px2.endsWith("rem") ? Number.parseFloat(px2) * 16 : Number.parseFloat(px2);
}
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
function getLifeCycleTarget(target) {
  return getCurrentInstance();
}
// @__NO_SIDE_EFFECTS__
function useDebounceFn(fn2, ms2 = 200, options = {}) {
  return createFilterWrapper(
    debounceFilter(ms2, options),
    fn2
  );
}
function refDebounced(value, ms2 = 200, options = {}) {
  const debounced = ref(toValue(value));
  const updater = /* @__PURE__ */ useDebounceFn(() => {
    debounced.value = value.value;
  }, ms2, options);
  watch(value, () => updater());
  return shallowReadonly(debounced);
}
function tryOnMounted(fn2, sync = true, target) {
  const instance = getLifeCycleTarget();
  if (instance)
    ;
  else if (sync)
    fn2();
  else
    nextTick(fn2);
}
function createUntil(r, isNot = false) {
  function toMatch(condition, { flush = "sync", deep = false, timeout, throwOnTimeout } = {}) {
    let stop = null;
    const watcher = new Promise((resolve) => {
      stop = watch(
        r,
        (v) => {
          if (condition(v) !== isNot) {
            if (stop)
              stop();
            else
              nextTick(() => stop == null ? void 0 : stop());
            resolve(v);
          }
        },
        {
          flush,
          deep,
          immediate: true
        }
      );
    });
    const promises = [watcher];
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout).then(() => toValue(r)).finally(() => stop == null ? void 0 : stop())
      );
    }
    return Promise.race(promises);
  }
  function toBe(value, options) {
    if (!isRef(value))
      return toMatch((v) => v === value, options);
    const { flush = "sync", deep = false, timeout, throwOnTimeout } = options != null ? options : {};
    let stop = null;
    const watcher = new Promise((resolve) => {
      stop = watch(
        [r, value],
        ([v1, v22]) => {
          if (isNot !== (v1 === v22)) {
            if (stop)
              stop();
            else
              nextTick(() => stop == null ? void 0 : stop());
            resolve(v1);
          }
        },
        {
          flush,
          deep,
          immediate: true
        }
      );
    });
    const promises = [watcher];
    if (timeout != null) {
      promises.push(
        promiseTimeout(timeout, throwOnTimeout).then(() => toValue(r)).finally(() => {
          stop == null ? void 0 : stop();
          return toValue(r);
        })
      );
    }
    return Promise.race(promises);
  }
  function toBeTruthy(options) {
    return toMatch((v) => Boolean(v), options);
  }
  function toBeNull(options) {
    return toBe(null, options);
  }
  function toBeUndefined(options) {
    return toBe(void 0, options);
  }
  function toBeNaN(options) {
    return toMatch(Number.isNaN, options);
  }
  function toContains(value, options) {
    return toMatch((v) => {
      const array = Array.from(v);
      return array.includes(value) || array.includes(toValue(value));
    }, options);
  }
  function changed(options) {
    return changedTimes(1, options);
  }
  function changedTimes(n = 1, options) {
    let count = -1;
    return toMatch(() => {
      count += 1;
      return count >= n;
    }, options);
  }
  if (Array.isArray(toValue(r))) {
    const instance = {
      toMatch,
      toContains,
      changed,
      changedTimes,
      get not() {
        return createUntil(r, !isNot);
      }
    };
    return instance;
  } else {
    const instance = {
      toMatch,
      toBe,
      toBeTruthy,
      toBeNull,
      toBeNaN,
      toBeUndefined,
      changed,
      changedTimes,
      get not() {
        return createUntil(r, !isNot);
      }
    };
    return instance;
  }
}
function until(r) {
  return createUntil(r);
}
function useTimeoutFn(cb, interval, options = {}) {
  const {
    immediate = true,
    immediateCallback = false
  } = options;
  const isPending = shallowRef(false);
  let timer;
  function clear() {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
  }
  function stop() {
    isPending.value = false;
    clear();
  }
  function start(...args) {
    if (immediateCallback)
      cb();
    clear();
    isPending.value = true;
    timer = setTimeout(() => {
      isPending.value = false;
      timer = void 0;
      cb(...args);
    }, toValue(interval));
  }
  if (immediate) {
    isPending.value = true;
  }
  tryOnScopeDispose(stop);
  return {
    isPending: shallowReadonly(isPending),
    start,
    stop
  };
}
function useTimeout(interval = 1e3, options = {}) {
  const {
    controls: exposeControls = false,
    callback
  } = options;
  const controls = useTimeoutFn(
    callback != null ? callback : noop,
    interval,
    options
  );
  const ready = computed(() => !controls.isPending.value);
  if (exposeControls) {
    return {
      ready,
      ...controls
    };
  } else {
    return ready;
  }
}
function watchImmediate(source, cb, options) {
  return watch(
    source,
    cb,
    {
      ...options,
      immediate: true
    }
  );
}
const defaultWindow = void 0;
function unrefElement(elRef) {
  var _a2;
  const plain = toValue(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
function useEventListener(...args) {
  const cleanups = [];
  const cleanup = () => {
    cleanups.forEach((fn2) => fn2());
    cleanups.length = 0;
  };
  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options);
    return () => el.removeEventListener(event, listener, options);
  };
  const firstParamTargets = computed(() => {
    const test = toArray(toValue(args[0])).filter((e) => e != null);
    return test.every((e) => typeof e !== "string") ? test : void 0;
  });
  const stopWatch = watchImmediate(
    () => {
      var _a2, _b;
      return [
        (_b = (_a2 = firstParamTargets.value) == null ? void 0 : _a2.map((e) => unrefElement(e))) != null ? _b : [defaultWindow].filter((e) => e != null),
        toArray(toValue(firstParamTargets.value ? args[1] : args[0])),
        toArray(unref(firstParamTargets.value ? args[2] : args[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(firstParamTargets.value ? args[3] : args[2])
      ];
    },
    ([raw_targets, raw_events, raw_listeners, raw_options]) => {
      cleanup();
      if (!(raw_targets == null ? void 0 : raw_targets.length) || !(raw_events == null ? void 0 : raw_events.length) || !(raw_listeners == null ? void 0 : raw_listeners.length))
        return;
      const optionsClone = isObject(raw_options) ? { ...raw_options } : raw_options;
      cleanups.push(
        ...raw_targets.flatMap(
          (el) => raw_events.flatMap(
            (event) => raw_listeners.map((listener) => register(el, event, listener, optionsClone))
          )
        )
      );
    },
    { flush: "post" }
  );
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(cleanup);
  return stop;
}
// @__NO_SIDE_EFFECTS__
function useMounted() {
  const isMounted = shallowRef(false);
  getCurrentInstance();
  return isMounted;
}
// @__NO_SIDE_EFFECTS__
function useSupported(callback) {
  const isMounted = /* @__PURE__ */ useMounted();
  return computed(() => {
    isMounted.value;
    return Boolean(callback());
  });
}
function useRafFn(fn2, options = {}) {
  const {
    immediate = true,
    fpsLimit = void 0,
    window: window2 = defaultWindow,
    once = false
  } = options;
  const isActive = shallowRef(false);
  const intervalLimit = computed(() => {
    return fpsLimit ? 1e3 / toValue(fpsLimit) : null;
  });
  let previousFrameTimestamp = 0;
  let rafId = null;
  function loop(timestamp2) {
    if (!isActive.value || !window2)
      return;
    if (!previousFrameTimestamp)
      previousFrameTimestamp = timestamp2;
    const delta = timestamp2 - previousFrameTimestamp;
    if (intervalLimit.value && delta < intervalLimit.value) {
      rafId = window2.requestAnimationFrame(loop);
      return;
    }
    previousFrameTimestamp = timestamp2;
    fn2({ delta, timestamp: timestamp2 });
    if (once) {
      isActive.value = false;
      rafId = null;
      return;
    }
    rafId = window2.requestAnimationFrame(loop);
  }
  function resume() {
    if (!isActive.value && window2) {
      isActive.value = true;
      previousFrameTimestamp = 0;
      rafId = window2.requestAnimationFrame(loop);
    }
  }
  function pause() {
    isActive.value = false;
    if (rafId != null && window2) {
      window2.cancelAnimationFrame(rafId);
      rafId = null;
    }
  }
  if (immediate)
    resume();
  tryOnScopeDispose(pause);
  return {
    isActive: readonly(isActive),
    pause,
    resume
  };
}
function useAsyncState(promise, initialState, options) {
  var _a2;
  const {
    immediate = true,
    delay = 0,
    onError = (_a2 = globalThis.reportError) != null ? _a2 : noop,
    onSuccess = noop,
    resetOnExecute = true,
    shallow = true,
    throwError
  } = options != null ? options : {};
  const state = shallow ? shallowRef(initialState) : ref(initialState);
  const isReady = shallowRef(false);
  const isLoading = shallowRef(false);
  const error = shallowRef(void 0);
  async function execute(delay2 = 0, ...args) {
    if (resetOnExecute)
      state.value = toValue(initialState);
    error.value = void 0;
    isReady.value = false;
    isLoading.value = true;
    if (delay2 > 0)
      await promiseTimeout(delay2);
    const _promise = typeof promise === "function" ? promise(...args) : promise;
    try {
      const data = await _promise;
      state.value = data;
      isReady.value = true;
      onSuccess(data);
    } catch (e) {
      error.value = e;
      onError(e);
      if (throwError)
        throw e;
    } finally {
      isLoading.value = false;
    }
    return state.value;
  }
  if (immediate) {
    execute(delay);
  }
  const shell = {
    state,
    isReady,
    isLoading,
    error,
    execute,
    executeImmediate: (...args) => execute(0, ...args)
  };
  function waitUntilIsLoaded() {
    return new Promise((resolve, reject) => {
      until(isLoading).toBe(false).then(() => resolve(shell)).catch(reject);
    });
  }
  return {
    ...shell,
    then(onFulfilled, onRejected) {
      return waitUntilIsLoaded().then(onFulfilled, onRejected);
    }
  };
}
const ssrWidthSymbol = Symbol("vueuse-ssr-width");
// @__NO_SIDE_EFFECTS__
function useSSRWidth() {
  const ssrWidth = hasInjectionContext() ? /* @__PURE__ */ injectLocal(ssrWidthSymbol, null) : null;
  return typeof ssrWidth === "number" ? ssrWidth : void 0;
}
function useMediaQuery(query, options = {}) {
  const { window: window2 = defaultWindow, ssrWidth = /* @__PURE__ */ useSSRWidth() } = options;
  const isSupported = /* @__PURE__ */ useSupported(() => window2 && "matchMedia" in window2 && typeof window2.matchMedia === "function");
  const ssrSupport = shallowRef(typeof ssrWidth === "number");
  const mediaQuery = shallowRef();
  const matches = shallowRef(false);
  const handler = (event) => {
    matches.value = event.matches;
  };
  watchEffect(() => {
    if (ssrSupport.value) {
      ssrSupport.value = !isSupported.value;
      const queryStrings = toValue(query).split(",");
      matches.value = queryStrings.some((queryString) => {
        const not = queryString.includes("not all");
        const minWidth = queryString.match(/\(\s*min-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        const maxWidth = queryString.match(/\(\s*max-width:\s*(-?\d+(?:\.\d*)?[a-z]+\s*)\)/);
        let res = Boolean(minWidth || maxWidth);
        if (minWidth && res) {
          res = ssrWidth >= pxValue(minWidth[1]);
        }
        if (maxWidth && res) {
          res = ssrWidth <= pxValue(maxWidth[1]);
        }
        return not ? !res : res;
      });
      return;
    }
    if (!isSupported.value)
      return;
    mediaQuery.value = window2.matchMedia(toValue(query));
    matches.value = mediaQuery.value.matches;
  });
  useEventListener(mediaQuery, "change", handler, { passive: true });
  return computed(() => matches.value);
}
// @__NO_SIDE_EFFECTS__
function useDevicePixelRatio(options = {}) {
  const {
    window: window2 = defaultWindow
  } = options;
  const pixelRatio = shallowRef(1);
  const query = useMediaQuery(() => `(resolution: ${pixelRatio.value}dppx)`, options);
  let stop = noop;
  if (window2) {
    stop = watchImmediate(query, () => pixelRatio.value = window2.devicePixelRatio);
  }
  return {
    pixelRatio: readonly(pixelRatio),
    stop
  };
}
function useResizeObserver(target, callback, options = {}) {
  const { window: window2 = defaultWindow, ...observerOptions } = options;
  let observer;
  const isSupported = /* @__PURE__ */ useSupported(() => window2 && "ResizeObserver" in window2);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const targets = computed(() => {
    const _targets = toValue(target);
    return Array.isArray(_targets) ? _targets.map((el) => unrefElement(el)) : [unrefElement(_targets)];
  });
  const stopWatch = watch(
    targets,
    (els) => {
      cleanup();
      if (isSupported.value && window2) {
        observer = new ResizeObserver(callback);
        for (const _el of els) {
          if (_el)
            observer.observe(_el, observerOptions);
        }
      }
    },
    { immediate: true, flush: "post" }
  );
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
function useElementSize(target, initialSize = { width: 0, height: 0 }, options = {}) {
  const { window: window2 = defaultWindow, box = "content-box" } = options;
  const isSVG = computed(() => {
    var _a2, _b;
    return (_b = (_a2 = unrefElement(target)) == null ? void 0 : _a2.namespaceURI) == null ? void 0 : _b.includes("svg");
  });
  const width = shallowRef(initialSize.width);
  const height = shallowRef(initialSize.height);
  const { stop: stop1 } = useResizeObserver(
    target,
    ([entry]) => {
      const boxSize = box === "border-box" ? entry.borderBoxSize : box === "content-box" ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
      if (window2 && isSVG.value) {
        const $elem = unrefElement(target);
        if ($elem) {
          const rect = $elem.getBoundingClientRect();
          width.value = rect.width;
          height.value = rect.height;
        }
      } else {
        if (boxSize) {
          const formatBoxSize = toArray(boxSize);
          width.value = formatBoxSize.reduce((acc, { inlineSize }) => acc + inlineSize, 0);
          height.value = formatBoxSize.reduce((acc, { blockSize }) => acc + blockSize, 0);
        } else {
          width.value = entry.contentRect.width;
          height.value = entry.contentRect.height;
        }
      }
    },
    options
  );
  tryOnMounted(() => {
    const ele = unrefElement(target);
    if (ele) {
      width.value = "offsetWidth" in ele ? ele.offsetWidth : initialSize.width;
      height.value = "offsetHeight" in ele ? ele.offsetHeight : initialSize.height;
    }
  });
  const stop2 = watch(
    () => unrefElement(target),
    (ele) => {
      width.value = ele ? initialSize.width : 0;
      height.value = ele ? initialSize.height : 0;
    }
  );
  function stop() {
    stop1();
    stop2();
  }
  return {
    width,
    height,
    stop
  };
}
// @__NO_SIDE_EFFECTS__
function useWindowSize(options = {}) {
  const {
    window: window2 = defaultWindow,
    initialWidth = Number.POSITIVE_INFINITY,
    initialHeight = Number.POSITIVE_INFINITY,
    listenOrientation = true,
    includeScrollbar = true,
    type = "inner"
  } = options;
  const width = shallowRef(initialWidth);
  const height = shallowRef(initialHeight);
  const update = () => {
    if (window2) {
      if (type === "outer") {
        width.value = window2.outerWidth;
        height.value = window2.outerHeight;
      } else if (type === "visual" && window2.visualViewport) {
        const { width: visualViewportWidth, height: visualViewportHeight, scale } = window2.visualViewport;
        width.value = Math.round(visualViewportWidth * scale);
        height.value = Math.round(visualViewportHeight * scale);
      } else if (includeScrollbar) {
        width.value = window2.innerWidth;
        height.value = window2.innerHeight;
      } else {
        width.value = window2.document.documentElement.clientWidth;
        height.value = window2.document.documentElement.clientHeight;
      }
    }
  };
  update();
  tryOnMounted(update);
  const listenerOptions = { passive: true };
  useEventListener("resize", update, listenerOptions);
  if (window2 && type === "visual" && window2.visualViewport) {
    useEventListener(window2.visualViewport, "resize", update, listenerOptions);
  }
  if (listenOrientation) {
    const matches = useMediaQuery("(orientation: portrait)");
    watch(matches, () => update());
  }
  return { width, height };
}
const _i$1 = "@tresjs/core", mi$1 = "module", gi$1 = "5.1.0", Ei$1 = "pnpm@10.17.0", vi = "Declarative ThreeJS using Vue Components", yi$1 = "Alvaro Saburido <hola@alvarosaburido.dev> (https://github.com/alvarosabu/)", Ci = "MIT", bi = { type: "git", url: "git+https://github.com/Tresjs/tres.git", directory: "packages/core" }, wi = ["vue", "3d", "threejs", "three", "threejs-vue"], Ai = false, Ti$1 = { ".": { types: "./dist/index.d.ts", import: "./dist/tres.js", default: "./dist/tres.js" }, "./components": { types: "./dist/src/components/index.d.ts" }, "./composables": { types: "./dist/src/composables/index.d.ts" }, "./types": { types: "./dist/src/types/index.d.ts" }, "./utils": { types: "./dist/src/utils/index.d.ts" }, "./*": "./*" }, Oi = "./dist/tres.js", Si = "./dist/index.d.ts", Pi$1 = ["*.d.ts", "dist"], Ii = { access: "public" }, Di = { build: "vite build", test: "vitest", "test:ci": "vitest run", "test:ui": "vitest --ui --coverage.enabled=true", coverage: "vitest run --coverage", lint: "eslint .", "lint:fix": "eslint . --fix", typecheck: "vue-tsc --noEmit" }, ki = { three: ">=0.133", vue: ">=3.4" }, xi = { "@pmndrs/pointer-events": "^6.6.17", "@vue/devtools-api": "^7.7.2", "@vueuse/core": "catalog:", radashi: "^12.6.2" }, Ri = { "@tresjs/eslint-config": "workspace:*", "@types/three": "catalog:", "@typescript-eslint/eslint-plugin": "catalog:", "@typescript-eslint/parser": "catalog:", "@vitejs/plugin-vue": "catalog:", "@vitest/coverage-v8": "3.2.4", "@vitest/ui": "catalog:", "@vue/test-utils": "catalog:", eslint: "catalog:", "eslint-plugin-vue": "catalog:", jsdom: "catalog:", kolorist: "catalog:", pathe: "catalog:", "rollup-plugin-analyzer": "catalog:", "rollup-plugin-copy": "^3.5.0", "rollup-plugin-visualizer": "catalog:", three: "catalog:", vite: "catalog:", "vite-plugin-banner": "catalog:", "vite-plugin-dts": "catalog:", "vite-plugin-inspect": "^11.3.3", vitest: "catalog:", vue: "catalog:", "vue-demi": "^0.14.10", "vue-tsc": "catalog:" }, Li = { implicitDependencies: ["!@tresjs/core-*"] }, Fi = {
  name: _i$1,
  type: mi$1,
  version: gi$1,
  packageManager: Ei$1,
  description: vi,
  author: yi$1,
  license: Ci,
  repository: bi,
  keywords: wi,
  sideEffects: Ai,
  exports: Ti$1,
  module: Oi,
  types: Si,
  files: Pi$1,
  publishConfig: Ii,
  scripts: Di,
  peerDependencies: ki,
  dependencies: xi,
  devDependencies: Ri,
  nx: Li
};
function Q(e) {
  return typeof e == "function";
}
function Sr(e) {
  return typeof e == "number" && !Number.isNaN(e);
}
function Tt$1(e) {
  return Ui(e, "[object Object]");
}
function Ui(e, t) {
  return Object.prototype.toString.call(e) === t;
}
const B = (e) => (t) => Tt$1(t) && e in t && !!t[e], $e = B("isMesh"), Pr$1 = B("isCamera"), Ir$1 = B("isPerspectiveCamera"), Fe = "[TresJS ▲ ■ ●] ";
function Me(...e) {
  typeof e[0] == "string" ? e[0] = Fe + e[0] : e.unshift(Fe), console.warn(...e);
}
function en$1(e) {
  ((n) => "map" in n && !!n.map)(e) && e.map.dispose(), e.dispose();
}
function Ne(e) {
  if (e.parent && e.removeFromParent?.(), delete e.__tres, [...e.children].forEach((n) => Ne(n)), !(e instanceof Scene)) {
    const n = e;
    e && e.dispose?.(), n.geometry && n.geometry.dispose(), Array.isArray(n.material) ? n.material.forEach((r) => en$1(r)) : n.material && en$1(n.material);
  }
}
function Zi(e, t, n) {
  const r = new e(n?.manager), o = reactive({
    loaded: 0,
    total: 0,
    percentage: 0
  });
  n?.extensions && n.extensions(r);
  const i = toValue(t), s = useAsyncState(
    (u) => new Promise((l, c) => {
      const f = u || i || "";
      r.load(f, (h) => {
        l(h);
      }, (h) => {
        o.loaded = h.loaded, o.total = h.total, o.percentage = o.loaded / o.total * 100;
      }, (h) => {
        c(h);
      });
    }),
    n?.initialValue ?? null,
    {
      ...n?.asyncOptions,
      immediate: n?.asyncOptions?.immediate ?? true
    }
  );
  watch(() => toValue(t), (u) => {
    if (u) {
      const l = s.state.value;
      l && typeof l == "object" && "scene" in l && l.scene && Ne(l.scene), s.execute(0, u);
    }
  });
  return {
    ...s,
    load: (u) => {
      s.execute(0, u);
    },
    progress: o
  };
}
const Ji$1 = ({ sizes: e }) => {
  const t = ref([]), n = computed(() => t.value[0]), r = (s) => {
    const a = Pr$1(s) ? s : t.value.find((l) => l.uuid === s);
    if (!a)
      return;
    const u = t.value.filter(({ uuid: l }) => l !== a.uuid);
    t.value = [a, ...u];
  }, o = (s, a = false) => {
    t.value.some(({ uuid: u }) => u === s.uuid) || (t.value.push(s), a && r(s.uuid));
  }, i = (s) => {
    t.value = t.value.filter(({ uuid: a }) => a !== s.uuid);
  };
  return watchEffect(() => {
    e.aspectRatio.value && t.value.forEach((s) => {
      Ir$1(s) && (s.aspect = e.aspectRatio.value, s.updateProjectionMatrix());
    });
  }), {
    activeCamera: n,
    cameras: t,
    registerCamera: o,
    deregisterCamera: i,
    setActiveCamera: r
  };
};
function es$1(e) {
  const t = { nodes: {}, materials: {}, meshes: {} };
  return e && e.traverse((n) => {
    n.name && (t.nodes[n.name] = n), $e(n) && (t.meshes[n.name] || (t.meshes[n.name] = n), (Array.isArray(n.material) ? n.material : [n.material]).forEach((r) => {
      r.name && !t.materials[r.name] && (t.materials[r.name] = r);
    }));
  }), t;
}
function nn$1() {
  const e = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set();
  let n = 0, r = false;
  const o = () => {
    const l = Array.from(e.entries()).sort((c, f) => {
      const h = c[1].priority - f[1].priority;
      return h === 0 ? c[1].addI - f[1].addI : h;
    });
    t.clear(), l.forEach((c) => t.add(c[0]));
  }, i = (l) => {
    e.delete(l), t.delete(l);
  };
  return { on: (l, c = 0) => {
    e.set(l, { priority: c, addI: n++ });
    const f = () => i(l);
    return tryOnScopeDispose(f), r = true, {
      off: f
    };
  }, off: i, trigger: (...l) => (r && (o(), r = false), Promise.all(
    Array.from(t).map((c) => c(...l))
  )), dispose: () => {
    e.clear(), t.clear();
  }, get count() {
    return e.size;
  } };
}
const dt$1 = ref({}), pt$1 = (e) => Object.assign(dt$1.value, e), ts = (e, t, n) => {
  if (!Q(e.setPixelRatio))
    return;
  let r = 0;
  if (n && Array.isArray(n) && n.length >= 2) {
    const [o, i] = n;
    r = MathUtils.clamp(t, o, i);
  } else Sr(n) ? r = n : r = t;
  r !== e.getPixelRatio?.() && e.setPixelRatio(r);
}, ns = (e) => {
  const t = new Clock(), n = {
    before: /* @__PURE__ */ createEventHook(),
    after: /* @__PURE__ */ createEventHook()
  }, { pause: r, resume: o, isActive: i } = useRafFn(() => {
    const u = () => ({
      delta: t.getDelta(),
      elapsed: t.elapsedTime
    });
    n.before.trigger(u()), e(), n.after.trigger(u());
  }, {
    immediate: false
  });
  return {
    start: () => {
      t.start(), o();
    },
    stop: () => {
      t.stop(), r();
    },
    isActive: i,
    onBeforeLoop: n.before.on,
    onLoop: n.after.on
  };
};
function rs({
  scene: e,
  canvas: t,
  options: n,
  contextParts: { sizes: r, camera: o }
}) {
  const s = Q(n.renderer) ? n.renderer({
    sizes: r,
    scene: e,
    camera: o,
    canvas: t
  }) : new WebGLRenderer({
    ...n,
    canvas: unrefElement(t)
  }), a = ref(toValue(n.renderMode) === "manual" ? 0 : 1), u = 60, l = computed(() => toValue(n.renderMode) === "on-demand" && a.value === 0), c = () => e.value.traverse((E) => {
    E instanceof Mesh && E.material instanceof Material && (E.material.needsUpdate = true);
  }), f = (E = 1) => {
    l.value && (a.value = Math.min(u, a.value + E));
  }, h = () => {
    if (toValue(n.renderMode) !== "manual")
      throw new Error("advance can only be called in manual render mode.");
    a.value = 1;
  }, d = () => {
    toValue(n.renderMode) === "on-demand" && f();
  }, _ = computed(() => toValue(n.renderMode) === "always"), v = (E) => Tt$1(E) && "isRenderer" in E && !!E.isRenderer, p = /* @__PURE__ */ createEventHook();
  let g = false;
  v(s) && (s.init(), p.trigger(s));
  const C = /* @__PURE__ */ createEventHook(), b = () => {
    a.value = _.value ? 1 : Math.max(0, a.value - 1), C.trigger(s);
  };
  let P = (E) => {
    o.activeCamera.value && (s.render(e.value, o.activeCamera.value), E());
  };
  const M = (E) => {
    P = E;
  }, A = ns(() => {
    a.value && P(b);
  });
  p.on(A.start), watch([r.width, r.height], () => {
    s.setSize(r.width.value, r.height.value), !g && s.domElement.width && s.domElement.height && (p.trigger(s), g = true), d();
  }, {
    immediate: true
  });
  const { pixelRatio: O } = /* @__PURE__ */ useDevicePixelRatio();
  watchEffect(() => {
    ts(s, O.value, toValue(n.dpr));
  }), toValue(n.renderMode) === "on-demand" && f(), toValue(n.renderMode) === "manual" && useTimeout(100, {
    callback: h
  });
  const T = computed(() => {
    const E = toValue(n.clearColor), x = toValue(n.clearAlpha), R = typeof E == "string" && E.length === 9 && E.startsWith("#");
    return R && x !== void 0 && Me(`clearColor with alpha (e.g. ${E}) and clearAlpha cannot both be set, using clearColor as source of truth`), R ? {
      alpha: Number.parseInt(E.slice(7, 9), 16) / 255,
      color: E.slice(0, 7)
    } : {
      alpha: x,
      color: E
    };
  });
  return watchEffect(() => {
    const E = T.value;
    E.color === void 0 || E.alpha === void 0 || s.setClearColor(E.color, E.alpha);
  }), watchEffect(() => {
    const E = n.toneMapping;
    E && (s.toneMapping = E);
  }), watchEffect(() => {
    const E = n.toneMappingExposure;
    E && (s.toneMappingExposure = E);
  }), watchEffect(() => {
    const E = n.outputColorSpace;
    E && (s.outputColorSpace = E);
  }), watchEffect(() => {
    const E = n.shadows;
    E !== void 0 && (s.shadowMap.enabled = E, c());
  }), watchEffect(() => {
    const E = n.shadowMapType;
    E !== void 0 && (s.shadowMap.type = E, c());
  }), {
    loop: A,
    instance: s,
    advance: h,
    onReady: p.on,
    onRender: C.on,
    invalidate: f,
    canBeInvalidated: l,
    mode: toValue(n.renderMode),
    replaceRenderFunction: M
  };
}
function os(e, t, n = 10) {
  const r = toValue(e) ? /* @__PURE__ */ useWindowSize() : useElementSize(computed(() => toValue(t).parentElement)), o = readonly(refDebounced(r.width, n)), i = readonly(refDebounced(r.height, n)), s = computed(() => o.value / i.value);
  return {
    height: i,
    width: o,
    aspectRatio: s
  };
}
class is {
  nativeEvent;
  NONE = 0;
  CAPTURING_PHASE = 1;
  AT_TARGET = 2;
  BUBBLING_PHASE = 3;
  relatedTarget = null;
  get altKey() {
    return this.getFromNative("altKey", false);
  }
  get button() {
    return this.getFromNative("button", 0);
  }
  get buttons() {
    return this.getFromNative("buttons", 0);
  }
  get clientX() {
    return this.getFromNative("clientX", 0);
  }
  get clientY() {
    return this.getFromNative("clientY", 0);
  }
  get ctrlKey() {
    return this.getFromNative("ctrlKey", false);
  }
  get layerX() {
    return this.getFromNative("layerX", 0);
  }
  get layerY() {
    return this.getFromNative("layerY", 0);
  }
  get metaKey() {
    return this.getFromNative("metaKey", false);
  }
  get movementX() {
    return this.getFromNative("movementX", 0);
  }
  get movementY() {
    return this.getFromNative("movementY", 0);
  }
  get offsetX() {
    return this.getFromNative("offsetX", 0);
  }
  get offsetY() {
    return this.getFromNative("offsetY", 0);
  }
  get pageX() {
    return this.getFromNative("pageX", 0);
  }
  get pageY() {
    return this.getFromNative("pageY", 0);
  }
  get screenX() {
    return this.getFromNative("screenX", 0);
  }
  get screenY() {
    return this.getFromNative("screenY", 0);
  }
  get shiftKey() {
    return this.getFromNative("shiftKey", false);
  }
  get x() {
    return this.getFromNative("x", 0);
  }
  get y() {
    return this.getFromNative("y", 0);
  }
  get detail() {
    return this.getFromNative("detail", 0);
  }
  get view() {
    return this.getFromNative("view", null);
  }
  get which() {
    return this.getFromNative("which", 0);
  }
  get cancelBubble() {
    return this.getFromNative("cancelBubble", false);
  }
  get composed() {
    return this.getFromNative("composed", false);
  }
  get eventPhase() {
    return this.getFromNative("eventPhase", 0);
  }
  get isTrusted() {
    return this.getFromNative("isTrusted", false);
  }
  get returnValue() {
    return this.getFromNative("returnValue", false);
  }
  get timeStamp() {
    return this.getFromNative("timeStamp", 0);
  }
  get cancelable() {
    return this.getFromNative("cancelable", false);
  }
  get defaultPrevented() {
    return this.getFromNative("defaultPrevented", false);
  }
  constructor(t) {
    this.nativeEvent = t;
  }
  getFromNative(t, n) {
    return t in this.nativeEvent ? this.nativeEvent[t] : n;
  }
}
const Xe$1 = new Vector3();
class L extends is {
  type;
  bubbles;
  internalPointer;
  intersection;
  camera;
  currentObject;
  object;
  propagationState;
  //--- pointer events data
  get pointerId() {
    return this.internalPointer.id;
  }
  get pointerType() {
    return this.internalPointer.type;
  }
  get pointerState() {
    return this.internalPointer.state;
  }
  //--- intersection data
  get distance() {
    return this.intersection.distance;
  }
  get distanceToRay() {
    return this.intersection.distanceToRay;
  }
  get point() {
    return this.intersection.point;
  }
  get index() {
    return this.intersection.index;
  }
  get face() {
    return this.intersection.face;
  }
  get faceIndex() {
    return this.intersection.faceIndex;
  }
  get uv() {
    return this.intersection.uv;
  }
  get uv1() {
    return this.intersection.uv1;
  }
  get normal() {
    return this.intersection.normal;
  }
  get instanceId() {
    return this.intersection.instanceId;
  }
  get pointOnLine() {
    return this.intersection.pointOnLine;
  }
  get batchId() {
    return this.intersection.batchId;
  }
  get pointerPosition() {
    return this.intersection.pointerPosition;
  }
  get pointerQuaternion() {
    return this.intersection.pointerQuaternion;
  }
  get pointOnFace() {
    return this.intersection.pointOnFace;
  }
  get localPoint() {
    return this.intersection.localPoint;
  }
  get details() {
    return this.intersection.details;
  }
  /** same as object */
  get target() {
    return this.object;
  }
  /** same as currentObject */
  get currentTarget() {
    return this.currentObject;
  }
  /** same as currentObject */
  get eventObject() {
    return this.currentObject;
  }
  /** same as object */
  get srcElement() {
    return this.currentObject;
  }
  _pointer;
  get pointer() {
    return this._pointer == null && (Xe$1.copy(this.intersection.point).project(this.camera), this._pointer = new Vector2(Xe$1.x, Xe$1.y)), this._pointer;
  }
  _ray;
  get ray() {
    if (this._ray != null)
      return this._ray;
    switch (this.intersection.details.type) {
      case "screen-ray":
      case "ray":
      case "sphere":
        return this._ray = new Ray(this.intersection.pointerPosition, new Vector3(0, 0, -1).applyQuaternion(this.intersection.pointerQuaternion));
      case "lines":
        return this._ray = new Ray(this.intersection.details.line.start, this.intersection.details.line.end.clone().sub(this.intersection.details.line.start).normalize());
    }
  }
  _intersections = [];
  get intersections() {
    return this._intersections == null && (this._intersections = [{ ...this.intersection, eventObject: this.currentObject }]), this._intersections;
  }
  _unprojectedPoint;
  get unprojectedPoint() {
    if (this._unprojectedPoint == null) {
      const t = this.pointer;
      this._unprojectedPoint = new Vector3(t.x, t.y, 0).unproject(this.camera);
    }
    return this._unprojectedPoint;
  }
  get stopped() {
    return this.propagationState.stoppedImmediate || this.propagationState.stopped;
  }
  get stoppedImmediate() {
    return this.propagationState.stoppedImmediate;
  }
  get delta() {
    throw new Error("not supported");
  }
  constructor(t, n, r, o, i, s, a = i.object, u = a, l = {
    stopped: !n,
    stoppedImmediate: false
  }) {
    super(r), this.type = t, this.bubbles = n, this.internalPointer = o, this.intersection = i, this.camera = s, this.currentObject = a, this.object = u, this.propagationState = l;
  }
  stopPropagation() {
    this.propagationState.stopped = true;
  }
  stopImmediatePropagation() {
    this.propagationState.stoppedImmediate = true;
  }
  /**
   * for internal use
   */
  retarget(t) {
    return new L(this.type, this.bubbles, this.nativeEvent, this.internalPointer, this.intersection, this.camera, t, this.target, this.propagationState);
  }
}
class Be extends L {
  get deltaX() {
    return this.nativeEvent.deltaX;
  }
  get deltaY() {
    return this.nativeEvent.deltaY;
  }
  get deltaZ() {
    return this.nativeEvent.deltaZ;
  }
  constructor(t, n, r, o, i, s) {
    super("wheel", true, t, n, r, o, i, s);
  }
  /**
   * for internal use
   */
  retarget(t) {
    return new Be(this.nativeEvent, this.internalPointer, this.intersection, this.camera, t, this.target);
  }
}
function N(e) {
  Vr(e, e.currentObject);
}
function Vr(e, t) {
  if (t == null)
    return;
  const n = as(t, e.type);
  if (n != null && n.length > 0) {
    const r = e.retarget(t), o = n.length;
    for (let i = 0; i < o && !r.stoppedImmediate; i++)
      n[i](r);
  }
  e.stopped || Vr(e, t.parent);
}
const Br = {
  click: "onClick",
  contextmenu: "onContextMenu",
  dblclick: "onDoubleClick",
  pointercancel: "onPointerCancel",
  pointerdown: "onPointerDown",
  pointerenter: "onPointerEnter",
  pointerleave: "onPointerLeave",
  pointermove: "onPointerMove",
  pointerout: "onPointerOut",
  pointerover: "onPointerOver",
  pointerup: "onPointerUp",
  wheel: "onWheel"
}, ss = Object.keys(Br);
function as(e, t) {
  if (e._listeners != null && t in e._listeners)
    return e._listeners[t];
  let n;
  if (e.isVoidObject && t === "click" && e.parent?.__r3f != null && (n = e.parent.__r3f.root.getState().onPointerMissed), e.__r3f != null && (n = e.__r3f.handlers[Br[t]]), n != null)
    return [n];
}
const us$1 = 1e10, ls = new SphereGeometry(us$1), rn$1 = /* @__PURE__ */ new Map();
function Ur(e) {
  let t = rn$1.get(e);
  return t == null && (t = new Mesh(ls), t.isVoidObject = true, t.parent = e, t.pointerEventsOrder = -1 / 0, rn$1.set(e, t)), t;
}
function cs(e, t, n) {
  const r = t.normal ?? t.face?.normal;
  return r == null ? false : (e.setFromNormalAndCoplanarPoint(r, t.localPoint), e.applyMatrix4(n), true);
}
function fs$1(e, t, n) {
  if (t === "none" || t === "listener" && !e)
    return false;
  if (n === "all")
    return true;
  if (typeof n == "function")
    return ({ id: i, type: s, state: a }) => n(i, s, a);
  let r, o;
  return "deny" in n ? (o = true, r = n.deny) : (o = false, r = n.allow), Array.isArray(r) ? (i) => on(r.includes(i.type), o) : (i) => on(r === i.type, o);
}
function on(e, t) {
  return t ? !e : e;
}
function Hr(e, t, n, r = false, o, i, s) {
  const a = r || ds(e, t), u = t.pointerEvents ?? o, l = u ?? t.defaultPointerEvents ?? "listener", c = t.pointerEventsType ?? i ?? "all", f = t.pointerEventsOrder ?? s ?? 0, h = fs$1(a, l, c), d = n.length;
  if (d === 1)
    (h === true || typeof h == "function" && h(n[0])) && Qe(n[0], t, l, c, f);
  else if (h === true)
    for (let p = 0; p < d; p++)
      Qe(n[p], t, l, c, f);
  else if (typeof h == "function")
    for (let p = 0; p < d; p++) {
      const g = n[p];
      h(g) && Qe(g, t, l, c, f);
    }
  if (t.children.length === 0 || t.intersectChildren === false)
    return;
  const _ = t.interactableDescendants ?? t.children, v = _.length;
  for (let p = 0; p < v; p++)
    Hr(e, _[p], n, a, u, c, f);
}
function ds(e, t) {
  if (t.ancestorsHaveListeners || e === "pointer" && t.ancestorsHavePointerListeners || e === "wheel" && t.ancestorsHaveWheelListeners || t.__r3f != null && t.__r3f?.eventCount > 0 && (e === "wheel" && t.__r3f.handlers.onWheel != null || e === "pointer" && Object.keys(t.__r3f.handlers).some((o) => o != "onWheel")))
    return true;
  if (t._listeners == null)
    return false;
  if (e === "wheel") {
    const o = t._listeners.wheel;
    return o != null && o.length > 0;
  }
  const n = Object.entries(t._listeners), r = n.length;
  for (let o = 0; o < r; o++) {
    const i = n[o];
    if (i[0] !== "wheel" && ss.includes(i[0]) && i[1] != null && i[1].length > 0)
      return true;
  }
  return false;
}
function Qe({ intersector: e, options: t }, n, r, o, i) {
  t.filter?.(n, r, o, i) !== false && e.executeIntersection(n, i);
}
function ps(e, t, { customSort: n = hs$1 } = {}, r) {
  let o, i, s;
  const a = e.length;
  for (let u = 0; u < a; u++) {
    const l = e[u], c = t?.[u];
    (o == null || n(l, c, o, i) < 0) && (s = u, o = l, i = c);
  }
  return s;
}
function hs$1(e, t = 0, n, r = 0) {
  return t != r ? r - t : e.distance - n.distance;
}
const sn = 1e7;
function _s$1(e, t, n, r, o, i = 0) {
  const s = t.direction.clone().multiplyScalar(sn), a = sn;
  return {
    distance: a + i,
    object: Ur(e),
    point: s,
    normal: t.origin.clone().sub(s).normalize(),
    details: n(s, a),
    pointerPosition: r,
    pointerQuaternion: o,
    pointOnFace: s,
    localPoint: s
  };
}
function ms(e, t, n) {
  for (; n > 0; )
    e.push(t), --n;
}
const Ze = Symbol("buttonsDownTime"), gs$1 = Symbol("buttonsClickTime");
globalThis.pointerEventspointerMap ??= /* @__PURE__ */ new Map();
Object3D.prototype.setPointerCapture = function(e) {
  St$1(e)?.setCapture(this);
};
Object3D.prototype.releasePointerCapture = function(e) {
  const t = St$1(e);
  t == null || !t.hasCaptured(this) || t.setCapture(void 0);
};
Object3D.prototype.hasPointerCapture = function(e) {
  return St$1(e)?.hasCaptured(this) ?? false;
};
function St$1(e) {
  return globalThis.pointerEventspointerMap?.get(e);
}
let Es$1 = class Es {
  id;
  type;
  state;
  intersector;
  getCamera;
  onMoveCommited;
  parentSetPointerCapture;
  parentReleasePointerCapture;
  options;
  //state
  prevIntersection;
  intersection;
  prevEnabled = true;
  enabled = true;
  wheelIntersection;
  //derived state
  /**
   * ordered leaf -> root (bottom -> top)
   */
  pointerEntered = [];
  pointerEnteredHelper = [];
  pointerCapture;
  buttonsDownTime = /* @__PURE__ */ new Map();
  buttonsDown = /* @__PURE__ */ new Set();
  //to handle interaction before first move (after exit)
  wasMoved = false;
  onFirstMove = [];
  constructor(t, n, r, o, i, s, a, u, l = {}) {
    this.id = t, this.type = n, this.state = r, this.intersector = o, this.getCamera = i, this.onMoveCommited = s, this.parentSetPointerCapture = a, this.parentReleasePointerCapture = u, this.options = l, globalThis.pointerEventspointerMap?.set(t, this);
  }
  getPointerCapture() {
    return this.pointerCapture;
  }
  hasCaptured(t) {
    return this.pointerCapture?.object === t;
  }
  setCapture(t) {
    this.pointerCapture?.object !== t && (this.pointerCapture != null && (this.parentReleasePointerCapture?.(), this.pointerCapture = void 0), t != null && this.intersection != null && (this.pointerCapture = { object: t, intersection: this.intersection }, this.parentSetPointerCapture?.()));
  }
  getButtonsDown() {
    return this.buttonsDown;
  }
  /**
   * @returns undefined if no intersection was executed yet
   */
  getIntersection() {
    return this.intersection;
  }
  getEnabled() {
    return this.enabled;
  }
  setEnabled(t, n, r = true) {
    this.enabled !== t && (!t && this.pointerCapture != null && (this.parentReleasePointerCapture?.(), this.pointerCapture = void 0), this.enabled = t, r && this.commit(n, false));
  }
  computeIntersection(t, n, r) {
    return this.pointerCapture != null ? this.intersector.intersectPointerCapture(this.pointerCapture, r) : (this.intersector.startIntersection(r), Hr(t, n, [this]), this.intersector.finalizeIntersection(n));
  }
  setIntersection(t) {
    this.intersection = t;
  }
  commit(t, n) {
    const r = this.getCamera(), o = this.prevEnabled ? this.prevIntersection : void 0, i = this.enabled ? this.intersection : void 0;
    o != null && o.object != i?.object && N(new L("pointerout", true, t, this, o, r));
    const s = this.pointerEntered;
    this.pointerEntered = [], this.pointerEnteredHelper.length = 0, jr(i?.object, this.pointerEntered, s, this.pointerEnteredHelper);
    const a = s.length;
    for (let u = 0; u < a; u++) {
      const l = s[u];
      N(new L("pointerleave", false, t, this, o, r, l));
    }
    i != null && o?.object != i.object && N(new L("pointerover", true, t, this, i, r));
    for (let u = this.pointerEnteredHelper.length - 1; u >= 0; u--) {
      const l = this.pointerEnteredHelper[u];
      N(new L("pointerenter", false, t, this, i, r, l));
    }
    if (n && i != null && N(new L("pointermove", true, t, this, i, r)), this.prevIntersection = this.intersection, this.prevEnabled = this.enabled, !this.wasMoved && this.intersector.isReady()) {
      this.wasMoved = true;
      const u = this.onFirstMove.length;
      for (let l = 0; l < u; l++)
        this.onFirstMove[l](r);
      this.onFirstMove.length = 0;
    }
    this.onMoveCommited?.(this);
  }
  /**
   * computes and commits a move
   */
  move(t, n) {
    this.intersection = this.computeIntersection("pointer", t, n), this.commit(n, true);
  }
  /**
   * emits a move without (re-)computing the intersection
   * just emitting a move event to the current intersection
   */
  emitMove(t) {
    this.intersection != null && N(new L("pointermove", true, t, this, this.intersection, this.getCamera()));
  }
  down(t) {
    if (this.buttonsDown.add(t.button), !this.enabled)
      return;
    if (!this.wasMoved) {
      this.onFirstMove.push(this.down.bind(this, t));
      return;
    }
    if (this.intersection == null)
      return;
    N(new L("pointerdown", true, t, this, this.intersection, this.getCamera()));
    const { object: n } = this.intersection;
    n[Ze] ??= /* @__PURE__ */ new Map(), n[Ze].set(t.button, t.timeStamp), this.buttonsDownTime.set(t.button, t.timeStamp);
  }
  up(t) {
    if (this.buttonsDown.delete(t.button), !this.enabled)
      return;
    if (!this.wasMoved) {
      this.onFirstMove.push(this.up.bind(this, t));
      return;
    }
    if (this.intersection == null)
      return;
    const { clickThesholdMs: n, contextMenuButton: r = 2, dblClickThresholdMs: o = 500, clickThresholdMs: i = n ?? 300 } = this.options;
    this.pointerCapture = void 0;
    const s = vs$1(this.buttonsDownTime, this.intersection.object[Ze], t.button, t.timeStamp, i), a = this.getCamera();
    if (s && t.button === r && N(new L("contextmenu", true, t, this, this.intersection, a)), N(new L("pointerup", true, t, this, this.intersection, a)), !s || t.button === r)
      return;
    N(new L("click", true, t, this, this.intersection, a));
    const { object: u } = this.intersection, l = u[gs$1] ??= /* @__PURE__ */ new Map(), c = l.get(t.button);
    if (c == null || t.timeStamp - c > o) {
      l.set(t.button, t.timeStamp);
      return;
    }
    N(new L("dblclick", true, t, this, this.intersection, a)), l.delete(t.button);
  }
  cancel(t) {
    if (this.enabled) {
      if (!this.wasMoved) {
        this.onFirstMove.push(this.cancel.bind(this, t));
        return;
      }
      this.intersection != null && N(new L("pointercancel", true, t, this, this.intersection, this.getCamera()));
    }
  }
  wheel(t, n, r = false) {
    if (!this.enabled)
      return;
    if (!this.wasMoved && r) {
      this.onFirstMove.push(this.wheel.bind(this, t, n, r));
      return;
    }
    r || (this.wheelIntersection = this.computeIntersection("wheel", t, n));
    const o = r ? this.intersection : this.wheelIntersection;
    o != null && N(new Be(n, this, o, this.getCamera()));
  }
  emitWheel(t, n = false) {
    if (!this.enabled)
      return;
    if (!this.wasMoved && n) {
      this.onFirstMove.push(this.emitWheel.bind(this, t, n));
      return;
    }
    const r = n ? this.intersection : this.wheelIntersection;
    r != null && N(new Be(t, this, r, this.getCamera()));
  }
  exit(t) {
    this.wasMoved && (this.pointerCapture != null && (this.parentReleasePointerCapture?.(), this.pointerCapture = void 0), this.intersection = void 0, this.commit(t, false)), this.onFirstMove.length = 0, this.wasMoved = false;
  }
};
function jr(e, t, n, r) {
  if (e == null)
    return;
  const o = n.indexOf(e);
  o != -1 ? n.splice(o, 1) : r.push(e), t.push(e), jr(e.parent, t, n, r);
}
function vs$1(e, t, n, r, o) {
  if (t == null)
    return false;
  const i = t.get(n);
  return !(i == null || r - i > o || i != e.get(n));
}
const he$1 = new Triangle(), Je$1 = new Triangle(), an = new Vector2(), un$1 = new Vector2(), ln$1 = new Vector2(), et$1 = new Vector3(), ys$1 = new Matrix4(), Pe = new Vector3();
function Cs$1(e, t, n) {
  Pe.copy(t).applyMatrix4(ys$1.copy(n.matrixWorld).invert());
  const r = n.geometry.attributes.uv;
  if (r == null || !(r instanceof BufferAttribute))
    return false;
  let o;
  return bs$1(n, (i, s, a) => {
    n.getVertexPosition(i, he$1.a), n.getVertexPosition(s, he$1.b), n.getVertexPosition(a, he$1.c);
    const u = he$1.closestPointToPoint(Pe, et$1).distanceTo(Pe);
    o != null && u >= o || (o = u, Je$1.copy(he$1), an.fromBufferAttribute(r, i), un$1.fromBufferAttribute(r, s), ln$1.fromBufferAttribute(r, a));
  }), o == null ? false : (Je$1.closestPointToPoint(Pe, et$1), Je$1.getInterpolation(et$1, an, un$1, ln$1, e), true);
}
function bs$1(e, t) {
  const n = e.geometry.drawRange;
  if (e.geometry.index != null) {
    const s = e.geometry.index, a = Math.max(0, n.start), u = Math.min(s.count, n.start + n.count);
    for (let l = a; l < u; l += 3)
      t(s.getX(l), s.getX(l + 1), s.getX(l + 2));
    return;
  }
  const r = e.geometry.attributes.position;
  if (r == null)
    return;
  const o = Math.max(0, n.start), i = Math.min(r.count, n.start + n.count);
  for (let s = o; s < i; s += 3)
    t(s, s + 1, s + 2);
}
new Matrix4();
new Line3();
new Vector3();
new Plane();
new Ray();
new Vector2();
new Vector3(0, 0, 0), new Vector3(0, 0, 1);
const cn$1 = new Matrix4(), ws$1 = new Vector3();
new Vector3(0, 0, -1);
new Plane();
const fn = new Vector2(), As = new Vector3();
class Ts {
  prepareTransformation;
  options;
  raycaster = new Raycaster();
  cameraQuaternion = new Quaternion();
  fromPosition = new Vector3();
  fromQuaternion = new Quaternion();
  coords = new Vector2();
  viewPlane = new Plane();
  intersects = [];
  pointerEventsOrders = [];
  constructor(t, n) {
    this.prepareTransformation = t, this.options = n;
  }
  isReady() {
    return true;
  }
  intersectPointerCapture({ intersection: t, object: n }, r) {
    const o = t.details;
    if (o.type != "screen-ray")
      throw new Error(`unable to process a pointer capture of type "${t.details.type}" with a camera ray intersector`);
    if (!this.startIntersection(r))
      return t;
    this.viewPlane.constant -= o.distanceViewPlane;
    const i = this.raycaster.ray.intersectPlane(this.viewPlane, new Vector3());
    if (i == null)
      return t;
    t.object.updateWorldMatrix(true, false), cs(this.viewPlane, t, t.object.matrixWorld);
    let s = t.uv;
    return t.object instanceof Mesh && Cs$1(fn, i, t.object) && (s = fn.clone()), {
      ...t,
      details: {
        ...o,
        direction: this.raycaster.ray.direction.clone(),
        screenPoint: this.coords.clone()
      },
      uv: s,
      object: n,
      point: i,
      pointOnFace: i,
      pointerPosition: this.raycaster.ray.origin.clone(),
      pointerQuaternion: this.cameraQuaternion.clone()
    };
  }
  startIntersection(t) {
    const n = this.prepareTransformation(t, this.coords);
    return n == null ? false : (n.updateWorldMatrix(true, false), n.matrixWorld.decompose(this.fromPosition, this.fromQuaternion, ws$1), this.raycaster.setFromCamera(this.coords, n), this.viewPlane.setFromNormalAndCoplanarPoint(n.getWorldDirection(As), this.raycaster.ray.origin), true);
  }
  executeIntersection(t, n) {
    const r = this.intersects.length;
    t.raycast(this.raycaster, this.intersects), ms(this.pointerEventsOrders, n, this.intersects.length - r);
  }
  finalizeIntersection(t) {
    const n = this.fromPosition.clone(), r = this.cameraQuaternion.clone(), o = this.raycaster.ray.direction.clone(), i = ps(this.intersects, this.pointerEventsOrders, this.options), s = i == null ? void 0 : this.intersects[i];
    return this.intersects.length = 0, this.pointerEventsOrders.length = 0, s == null ? _s$1(t, this.raycaster.ray, (a, u) => ({
      type: "screen-ray",
      distanceViewPlane: u,
      screenPoint: this.coords.clone(),
      direction: o
    }), n, r) : (s.object.updateWorldMatrix(true, false), cn$1.copy(s.object.matrixWorld).invert(), Object.assign(s, {
      details: {
        type: "screen-ray",
        distanceViewPlane: this.viewPlane.distanceToPoint(s.point),
        screenPoint: this.coords.clone(),
        direction: o
      },
      pointOnFace: s.point,
      pointerPosition: n,
      pointerQuaternion: r,
      localPoint: s.point.clone().applyMatrix4(cn$1)
    }));
  }
}
new Vector3();
new Vector2();
new Matrix4();
new Vector3();
new Quaternion();
new Plane();
new Sphere();
new Vector3();
new Vector3();
new Vector3();
new Vector3(1e-4, 1e-4, 1e-4);
new Matrix4();
let Os$1 = 23412;
function Ss$1() {
  return Os$1++;
}
function Ps(e, t, n) {
  if (!(t instanceof globalThis.MouseEvent))
    return n.set(0, 0);
  const { width: r, height: o, top: i, left: s } = e.getBoundingClientRect(), a = t.clientX - s, u = t.clientY - i;
  return n.set(a / r * 2 - 1, -(u / o) * 2 + 1);
}
function Is(e, t, n, r) {
  return Ds$1(
    e,
    //backwards compatibility
    typeof t == "function" ? t : () => t,
    n,
    Ps.bind(null, e),
    e.setPointerCapture.bind(e),
    (o) => {
      e.hasPointerCapture(o) && e.releasePointerCapture(o);
    },
    {
      pointerTypePrefix: "screen-",
      ...r
    }
  );
}
function Ds$1(e, t, n, r, o, i, s = {}) {
  const a = s?.forwardPointerCapture ?? true, u = /* @__PURE__ */ new Map(), l = s.pointerTypePrefix ?? "forward-", c = (O, T) => {
    let E = u.get(O.pointerId);
    return E != null || (E = new Es$1(Ss$1(), `${l}${O.pointerType}`, O.pointerState, new Ts((x, R) => (r(x, R), t()), s), t, void 0, a ? o.bind(null, O.pointerId) : void 0, a ? i.bind(null, O.pointerId) : void 0, s), T != "move" && T != "wheel" && (E.setIntersection(E.computeIntersection("pointer", n, O)), E.commit(O, false)), u.set(O.pointerId, E)), E;
  }, f = /* @__PURE__ */ new Map(), h = /* @__PURE__ */ new Map(), d = [], _ = [], v = (O, T, E) => {
    switch (O) {
      case "move":
        E.move(n, T);
        return;
      case "wheel":
        E.wheel(n, T);
        return;
      case "cancel":
        E.cancel(T);
        return;
      case "down":
        if (!dn(T))
          return;
        E.down(T);
        return;
      case "up":
        if (!dn(T))
          return;
        E.up(T);
        return;
      case "exit":
        h.delete(E), f.delete(E), E.exit(T);
        return;
    }
  }, p = (O, T) => {
    const E = c(T, O);
    O === "move" && h.set(E, T), O === "wheel" && f.set(E, T), s.batchEvents ?? true ? _.push({ type: O, event: T }) : v(O, T, E);
  }, g = p.bind(null, "move"), C = p.bind(null, "cancel"), b = p.bind(null, "down"), P = p.bind(null, "up"), M = p.bind(null, "wheel"), A = p.bind(null, "exit");
  return e.addEventListener("pointermove", g), e.addEventListener("pointercancel", C), e.addEventListener("pointerdown", b), e.addEventListener("pointerup", P), e.addEventListener("wheel", M), e.addEventListener("pointerleave", A), {
    destroy() {
      e.removeEventListener("pointermove", g), e.removeEventListener("pointercancel", C), e.removeEventListener("pointerdown", b), e.removeEventListener("pointerup", P), e.removeEventListener("wheel", M), e.removeEventListener("pointerleave", A), h.clear(), f.clear();
    },
    update() {
      const O = _.length;
      for (let T = 0; T < O; T++) {
        const { type: E, event: x } = _[T], R = c(x, E);
        if (E === "move" && (d.push(R), h.get(R) != x)) {
          R.emitMove(x);
          continue;
        }
        if (E === "wheel" && f.get(R) != x) {
          R.emitWheel(x);
          continue;
        }
        v(E, x, R);
      }
      if (_.length = 0, s.intersectEveryFrame ?? false)
        for (const [T, E] of h.entries())
          d.includes(T) || T.move(n, E);
      d.length = 0;
    }
  };
}
function dn(e) {
  return e.button != null;
}
function ks$1({
  canvas: e,
  contextParts: { scene: t, camera: n, renderer: r }
}) {
  const { update: o } = Is(toValue(e), () => toValue(n.activeCamera), t.value), { off: s } = r.loop.onLoop(o);
  const a = Ur(t.value), u = /* @__PURE__ */ createEventHook();
  return a.addEventListener("click", u.trigger), {
    onPointerMissed: u.on
  };
}
const [Rs, Ls$1] = /* @__PURE__ */ createInjectionState(({
  scene: e,
  canvas: t,
  windowSize: n,
  rendererOptions: r
}) => {
  const o = shallowRef(e), i = os(n, t), s = Ji$1({ sizes: i }), a = rs(
    {
      scene: o,
      canvas: t,
      options: r,
      contextParts: { sizes: i, camera: s }
    }
  ), u = ks$1({
    canvas: t,
    contextParts: { scene: o, camera: s, renderer: a }
  }), l = {
    sizes: i,
    scene: o,
    camera: s,
    renderer: a,
    controls: ref(null),
    extend: pt$1,
    events: u
  };
  return l.scene.value.__tres = {
    root: l
  }, l;
}, {
  injectionKey: "useTres"
}), zr = () => {
  const e = Ls$1();
  if (!e)
    throw new Error(`useTresContext must be used together with useTresContextProvider.
 You probably tried to use it above or on the same level as a TresCanvas component.
 It should be used in child components of a TresCanvas instance.`);
  return e;
};
function Fs() {
  const { scene: e, renderer: t, camera: n, sizes: r, controls: o, extend: i, events: s } = zr();
  return {
    scene: e,
    renderer: t.instance,
    camera: n.activeCamera,
    sizes: r,
    controls: o,
    extend: i,
    events: s,
    invalidate: t.invalidate,
    advance: t.advance
  };
}
const _l$1 = () => {
  const e = Fs(), { renderer: t } = zr(), n = nn$1(), r = nn$1();
  t.loop.onBeforeLoop((i) => {
    n.trigger({ ...e, ...i });
  }), t.loop.onLoop((i) => {
    r.trigger({ ...e, ...i });
  });
  const o = t.replaceRenderFunction;
  return {
    stop: t.loop.stop,
    start: t.loop.start,
    isActive: t.loop.isActive,
    onBeforeRender: n.on,
    onRender: r.on,
    render: o
  };
};
var js$1 = Object.create, $r$1 = Object.defineProperty, zs$1 = Object.getOwnPropertyDescriptor, Pt = Object.getOwnPropertyNames, $s = Object.getPrototypeOf, Ks$1 = Object.prototype.hasOwnProperty, Ws = (e, t) => function() {
  return e && (t = (0, e[Pt(e)[0]])(e = 0)), t;
}, Gs$1 = (e, t) => function() {
  return t || (0, e[Pt(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, Ys = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of Pt(t))
      !Ks$1.call(e, o) && o !== n && $r$1(e, o, { get: () => t[o], enumerable: !(r = zs$1(t, o)) || r.enumerable });
  return e;
}, qs = (e, t, n) => (n = e != null ? js$1($s(e)) : {}, Ys(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  $r$1(n, "default", { value: e, enumerable: true }),
  e
)), Oe = Ws({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), Xs = Gs$1({
  "../../node_modules/.pnpm/rfdc@1.4.1/node_modules/rfdc/index.js"(e, t) {
    Oe(), t.exports = r;
    function n(i) {
      return i instanceof Buffer ? Buffer.from(i) : new i.constructor(i.buffer.slice(), i.byteOffset, i.length);
    }
    function r(i) {
      if (i = i || {}, i.circles) return o(i);
      const s = /* @__PURE__ */ new Map();
      if (s.set(Date, (f) => new Date(f)), s.set(Map, (f, h) => new Map(u(Array.from(f), h))), s.set(Set, (f, h) => new Set(u(Array.from(f), h))), i.constructorHandlers)
        for (const f of i.constructorHandlers)
          s.set(f[0], f[1]);
      let a = null;
      return i.proto ? c : l;
      function u(f, h) {
        const d = Object.keys(f), _ = new Array(d.length);
        for (let v = 0; v < d.length; v++) {
          const p = d[v], g = f[p];
          typeof g != "object" || g === null ? _[p] = g : g.constructor !== Object && (a = s.get(g.constructor)) ? _[p] = a(g, h) : ArrayBuffer.isView(g) ? _[p] = n(g) : _[p] = h(g);
        }
        return _;
      }
      function l(f) {
        if (typeof f != "object" || f === null) return f;
        if (Array.isArray(f)) return u(f, l);
        if (f.constructor !== Object && (a = s.get(f.constructor)))
          return a(f, l);
        const h = {};
        for (const d in f) {
          if (Object.hasOwnProperty.call(f, d) === false) continue;
          const _ = f[d];
          typeof _ != "object" || _ === null ? h[d] = _ : _.constructor !== Object && (a = s.get(_.constructor)) ? h[d] = a(_, l) : ArrayBuffer.isView(_) ? h[d] = n(_) : h[d] = l(_);
        }
        return h;
      }
      function c(f) {
        if (typeof f != "object" || f === null) return f;
        if (Array.isArray(f)) return u(f, c);
        if (f.constructor !== Object && (a = s.get(f.constructor)))
          return a(f, c);
        const h = {};
        for (const d in f) {
          const _ = f[d];
          typeof _ != "object" || _ === null ? h[d] = _ : _.constructor !== Object && (a = s.get(_.constructor)) ? h[d] = a(_, c) : ArrayBuffer.isView(_) ? h[d] = n(_) : h[d] = c(_);
        }
        return h;
      }
    }
    function o(i) {
      const s = [], a = [], u = /* @__PURE__ */ new Map();
      if (u.set(Date, (d) => new Date(d)), u.set(Map, (d, _) => new Map(c(Array.from(d), _))), u.set(Set, (d, _) => new Set(c(Array.from(d), _))), i.constructorHandlers)
        for (const d of i.constructorHandlers)
          u.set(d[0], d[1]);
      let l = null;
      return i.proto ? h : f;
      function c(d, _) {
        const v = Object.keys(d), p = new Array(v.length);
        for (let g = 0; g < v.length; g++) {
          const C = v[g], b = d[C];
          if (typeof b != "object" || b === null)
            p[C] = b;
          else if (b.constructor !== Object && (l = u.get(b.constructor)))
            p[C] = l(b, _);
          else if (ArrayBuffer.isView(b))
            p[C] = n(b);
          else {
            const P = s.indexOf(b);
            P !== -1 ? p[C] = a[P] : p[C] = _(b);
          }
        }
        return p;
      }
      function f(d) {
        if (typeof d != "object" || d === null) return d;
        if (Array.isArray(d)) return c(d, f);
        if (d.constructor !== Object && (l = u.get(d.constructor)))
          return l(d, f);
        const _ = {};
        s.push(d), a.push(_);
        for (const v in d) {
          if (Object.hasOwnProperty.call(d, v) === false) continue;
          const p = d[v];
          if (typeof p != "object" || p === null)
            _[v] = p;
          else if (p.constructor !== Object && (l = u.get(p.constructor)))
            _[v] = l(p, f);
          else if (ArrayBuffer.isView(p))
            _[v] = n(p);
          else {
            const g = s.indexOf(p);
            g !== -1 ? _[v] = a[g] : _[v] = f(p);
          }
        }
        return s.pop(), a.pop(), _;
      }
      function h(d) {
        if (typeof d != "object" || d === null) return d;
        if (Array.isArray(d)) return c(d, h);
        if (d.constructor !== Object && (l = u.get(d.constructor)))
          return l(d, h);
        const _ = {};
        s.push(d), a.push(_);
        for (const v in d) {
          const p = d[v];
          if (typeof p != "object" || p === null)
            _[v] = p;
          else if (p.constructor !== Object && (l = u.get(p.constructor)))
            _[v] = l(p, h);
          else if (ArrayBuffer.isView(p))
            _[v] = n(p);
          else {
            const g = s.indexOf(p);
            g !== -1 ? _[v] = a[g] : _[v] = h(p);
          }
        }
        return s.pop(), a.pop(), _;
      }
    }
  }
});
Oe();
Oe();
Oe();
var y = typeof globalThis < "u" ? globalThis : typeof global < "u" ? global : {};
typeof y.chrome < "u" && y.chrome.devtools;
Oe();
var Qs$1 = qs(Xs()), Zs$1 = /(?:^|[-_/])(\w)/g;
function Js(e, t) {
  return t ? t.toUpperCase() : "";
}
function ea$1(e) {
  return e && `${e}`.replace(Zs$1, Js);
}
function ta$1(e, t) {
  let n = e.replace(/^[a-z]:/i, "").replace(/\\/g, "/");
  n.endsWith(`index${t}`) && (n = n.replace(`/index${t}`, t));
  const r = n.lastIndexOf("/"), o = n.substring(r + 1);
  {
    const i = o.lastIndexOf(t);
    return o.substring(0, i);
  }
}
var _n$1 = (0, Qs$1.default)({ circles: true });
const na$1 = {
  trailing: true
};
function ae$1(e, t = 25, n = {}) {
  if (n = { ...na$1, ...n }, !Number.isFinite(t))
    throw new TypeError("Expected `wait` to be a finite number");
  let r, o, i = [], s, a;
  const u = (l, c) => (s = ra$1(e, l, c), s.finally(() => {
    if (s = null, n.trailing && a && !o) {
      const f = u(l, a);
      return a = null, f;
    }
  }), s);
  return function(...l) {
    return s ? (n.trailing && (a = l), s) : new Promise((c) => {
      const f = !o && n.leading;
      clearTimeout(o), o = setTimeout(() => {
        o = null;
        const h = n.leading ? r : u(this, l);
        for (const d of i)
          d(h);
        i = [];
      }, t), f ? (r = u(this, l), c(r)) : i.push(c);
    });
  };
}
async function ra$1(e, t, n) {
  return await e.apply(t, n);
}
function ht(e, t = {}, n) {
  for (const r in e) {
    const o = e[r], i = n ? `${n}:${r}` : r;
    typeof o == "object" && o !== null ? ht(o, t, i) : typeof o == "function" && (t[i] = o);
  }
  return t;
}
const oa$1 = { run: (e) => e() }, ia = () => oa$1, Wr$1 = typeof console.createTask < "u" ? console.createTask : ia;
function sa(e, t) {
  const n = t.shift(), r = Wr$1(n);
  return e.reduce(
    (o, i) => o.then(() => r.run(() => i(...t))),
    Promise.resolve()
  );
}
function aa(e, t) {
  const n = t.shift(), r = Wr$1(n);
  return Promise.all(e.map((o) => r.run(() => o(...t))));
}
function tt(e, t) {
  for (const n of [...e])
    n(t);
}
class ua {
  constructor() {
    this._hooks = {}, this._before = void 0, this._after = void 0, this._deprecatedMessages = void 0, this._deprecatedHooks = {}, this.hook = this.hook.bind(this), this.callHook = this.callHook.bind(this), this.callHookWith = this.callHookWith.bind(this);
  }
  hook(t, n, r = {}) {
    if (!t || typeof n != "function")
      return () => {
      };
    const o = t;
    let i;
    for (; this._deprecatedHooks[t]; )
      i = this._deprecatedHooks[t], t = i.to;
    if (i && !r.allowDeprecated) {
      let s = i.message;
      s || (s = `${o} hook has been deprecated` + (i.to ? `, please use ${i.to}` : "")), this._deprecatedMessages || (this._deprecatedMessages = /* @__PURE__ */ new Set()), this._deprecatedMessages.has(s) || (console.warn(s), this._deprecatedMessages.add(s));
    }
    if (!n.name)
      try {
        Object.defineProperty(n, "name", {
          get: () => "_" + t.replace(/\W+/g, "_") + "_hook_cb",
          configurable: true
        });
      } catch {
      }
    return this._hooks[t] = this._hooks[t] || [], this._hooks[t].push(n), () => {
      n && (this.removeHook(t, n), n = void 0);
    };
  }
  hookOnce(t, n) {
    let r, o = (...i) => (typeof r == "function" && r(), r = void 0, o = void 0, n(...i));
    return r = this.hook(t, o), r;
  }
  removeHook(t, n) {
    if (this._hooks[t]) {
      const r = this._hooks[t].indexOf(n);
      r !== -1 && this._hooks[t].splice(r, 1), this._hooks[t].length === 0 && delete this._hooks[t];
    }
  }
  deprecateHook(t, n) {
    this._deprecatedHooks[t] = typeof n == "string" ? { to: n } : n;
    const r = this._hooks[t] || [];
    delete this._hooks[t];
    for (const o of r)
      this.hook(t, o);
  }
  deprecateHooks(t) {
    Object.assign(this._deprecatedHooks, t);
    for (const n in t)
      this.deprecateHook(n, t[n]);
  }
  addHooks(t) {
    const n = ht(t), r = Object.keys(n).map(
      (o) => this.hook(o, n[o])
    );
    return () => {
      for (const o of r.splice(0, r.length))
        o();
    };
  }
  removeHooks(t) {
    const n = ht(t);
    for (const r in n)
      this.removeHook(r, n[r]);
  }
  removeAllHooks() {
    for (const t in this._hooks)
      delete this._hooks[t];
  }
  callHook(t, ...n) {
    return n.unshift(t), this.callHookWith(sa, t, ...n);
  }
  callHookParallel(t, ...n) {
    return n.unshift(t), this.callHookWith(aa, t, ...n);
  }
  callHookWith(t, n, ...r) {
    const o = this._before || this._after ? { name: n, args: r, context: {} } : void 0;
    this._before && tt(this._before, o);
    const i = t(
      n in this._hooks ? [...this._hooks[n]] : [],
      r
    );
    return i instanceof Promise ? i.finally(() => {
      this._after && o && tt(this._after, o);
    }) : (this._after && o && tt(this._after, o), i);
  }
  beforeEach(t) {
    return this._before = this._before || [], this._before.push(t), () => {
      if (this._before !== void 0) {
        const n = this._before.indexOf(t);
        n !== -1 && this._before.splice(n, 1);
      }
    };
  }
  afterEach(t) {
    return this._after = this._after || [], this._after.push(t), () => {
      if (this._after !== void 0) {
        const n = this._after.indexOf(t);
        n !== -1 && this._after.splice(n, 1);
      }
    };
  }
}
function Gr() {
  return new ua();
}
var la$1 = Object.create, Yr$1 = Object.defineProperty, ca$1 = Object.getOwnPropertyDescriptor, It$1 = Object.getOwnPropertyNames, fa = Object.getPrototypeOf, da$1 = Object.prototype.hasOwnProperty, pa$1 = (e, t) => function() {
  return e && (t = (0, e[It$1(e)[0]])(e = 0)), t;
}, qr = (e, t) => function() {
  return t || (0, e[It$1(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, ha = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of It$1(t))
      !da$1.call(e, o) && o !== n && Yr$1(e, o, { get: () => t[o], enumerable: !(r = ca$1(t, o)) || r.enumerable });
  return e;
}, _a = (e, t, n) => (n = e != null ? la$1(fa(e)) : {}, ha(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  Yr$1(n, "default", { value: e, enumerable: true }),
  e
)), m = pa$1({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), ma$1 = qr({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/lib/speakingurl.js"(e, t) {
    m(), (function(n) {
      var r = {
        // latin
        À: "A",
        Á: "A",
        Â: "A",
        Ã: "A",
        Ä: "Ae",
        Å: "A",
        Æ: "AE",
        Ç: "C",
        È: "E",
        É: "E",
        Ê: "E",
        Ë: "E",
        Ì: "I",
        Í: "I",
        Î: "I",
        Ï: "I",
        Ð: "D",
        Ñ: "N",
        Ò: "O",
        Ó: "O",
        Ô: "O",
        Õ: "O",
        Ö: "Oe",
        Ő: "O",
        Ø: "O",
        Ù: "U",
        Ú: "U",
        Û: "U",
        Ü: "Ue",
        Ű: "U",
        Ý: "Y",
        Þ: "TH",
        ß: "ss",
        à: "a",
        á: "a",
        â: "a",
        ã: "a",
        ä: "ae",
        å: "a",
        æ: "ae",
        ç: "c",
        è: "e",
        é: "e",
        ê: "e",
        ë: "e",
        ì: "i",
        í: "i",
        î: "i",
        ï: "i",
        ð: "d",
        ñ: "n",
        ò: "o",
        ó: "o",
        ô: "o",
        õ: "o",
        ö: "oe",
        ő: "o",
        ø: "o",
        ù: "u",
        ú: "u",
        û: "u",
        ü: "ue",
        ű: "u",
        ý: "y",
        þ: "th",
        ÿ: "y",
        "ẞ": "SS",
        // language specific
        // Arabic
        ا: "a",
        أ: "a",
        إ: "i",
        آ: "aa",
        ؤ: "u",
        ئ: "e",
        ء: "a",
        ب: "b",
        ت: "t",
        ث: "th",
        ج: "j",
        ح: "h",
        خ: "kh",
        د: "d",
        ذ: "th",
        ر: "r",
        ز: "z",
        س: "s",
        ش: "sh",
        ص: "s",
        ض: "dh",
        ط: "t",
        ظ: "z",
        ع: "a",
        غ: "gh",
        ف: "f",
        ق: "q",
        ك: "k",
        ل: "l",
        م: "m",
        ن: "n",
        ه: "h",
        و: "w",
        ي: "y",
        ى: "a",
        ة: "h",
        ﻻ: "la",
        ﻷ: "laa",
        ﻹ: "lai",
        ﻵ: "laa",
        // Persian additional characters than Arabic
        گ: "g",
        چ: "ch",
        پ: "p",
        ژ: "zh",
        ک: "k",
        ی: "y",
        // Arabic diactrics
        "َ": "a",
        "ً": "an",
        "ِ": "e",
        "ٍ": "en",
        "ُ": "u",
        "ٌ": "on",
        "ْ": "",
        // Arabic numbers
        "٠": "0",
        "١": "1",
        "٢": "2",
        "٣": "3",
        "٤": "4",
        "٥": "5",
        "٦": "6",
        "٧": "7",
        "٨": "8",
        "٩": "9",
        // Persian numbers
        "۰": "0",
        "۱": "1",
        "۲": "2",
        "۳": "3",
        "۴": "4",
        "۵": "5",
        "۶": "6",
        "۷": "7",
        "۸": "8",
        "۹": "9",
        // Burmese consonants
        က: "k",
        ခ: "kh",
        ဂ: "g",
        ဃ: "ga",
        င: "ng",
        စ: "s",
        ဆ: "sa",
        ဇ: "z",
        "စျ": "za",
        ည: "ny",
        ဋ: "t",
        ဌ: "ta",
        ဍ: "d",
        ဎ: "da",
        ဏ: "na",
        တ: "t",
        ထ: "ta",
        ဒ: "d",
        ဓ: "da",
        န: "n",
        ပ: "p",
        ဖ: "pa",
        ဗ: "b",
        ဘ: "ba",
        မ: "m",
        ယ: "y",
        ရ: "ya",
        လ: "l",
        ဝ: "w",
        သ: "th",
        ဟ: "h",
        ဠ: "la",
        အ: "a",
        // consonant character combos
        "ြ": "y",
        "ျ": "ya",
        "ွ": "w",
        "ြွ": "yw",
        "ျွ": "ywa",
        "ှ": "h",
        // independent vowels
        ဧ: "e",
        "၏": "-e",
        ဣ: "i",
        ဤ: "-i",
        ဉ: "u",
        ဦ: "-u",
        ဩ: "aw",
        "သြော": "aw",
        ဪ: "aw",
        // numbers
        "၀": "0",
        "၁": "1",
        "၂": "2",
        "၃": "3",
        "၄": "4",
        "၅": "5",
        "၆": "6",
        "၇": "7",
        "၈": "8",
        "၉": "9",
        // virama and tone marks which are silent in transliteration
        "္": "",
        "့": "",
        "း": "",
        // Czech
        č: "c",
        ď: "d",
        ě: "e",
        ň: "n",
        ř: "r",
        š: "s",
        ť: "t",
        ů: "u",
        ž: "z",
        Č: "C",
        Ď: "D",
        Ě: "E",
        Ň: "N",
        Ř: "R",
        Š: "S",
        Ť: "T",
        Ů: "U",
        Ž: "Z",
        // Dhivehi
        ހ: "h",
        ށ: "sh",
        ނ: "n",
        ރ: "r",
        ބ: "b",
        ޅ: "lh",
        ކ: "k",
        އ: "a",
        ވ: "v",
        މ: "m",
        ފ: "f",
        ދ: "dh",
        ތ: "th",
        ލ: "l",
        ގ: "g",
        ޏ: "gn",
        ސ: "s",
        ޑ: "d",
        ޒ: "z",
        ޓ: "t",
        ޔ: "y",
        ޕ: "p",
        ޖ: "j",
        ޗ: "ch",
        ޘ: "tt",
        ޙ: "hh",
        ޚ: "kh",
        ޛ: "th",
        ޜ: "z",
        ޝ: "sh",
        ޞ: "s",
        ޟ: "d",
        ޠ: "t",
        ޡ: "z",
        ޢ: "a",
        ޣ: "gh",
        ޤ: "q",
        ޥ: "w",
        "ަ": "a",
        "ާ": "aa",
        "ި": "i",
        "ީ": "ee",
        "ު": "u",
        "ޫ": "oo",
        "ެ": "e",
        "ޭ": "ey",
        "ޮ": "o",
        "ޯ": "oa",
        "ް": "",
        // Georgian https://en.wikipedia.org/wiki/Romanization_of_Georgian
        // National system (2002)
        ა: "a",
        ბ: "b",
        გ: "g",
        დ: "d",
        ე: "e",
        ვ: "v",
        ზ: "z",
        თ: "t",
        ი: "i",
        კ: "k",
        ლ: "l",
        მ: "m",
        ნ: "n",
        ო: "o",
        პ: "p",
        ჟ: "zh",
        რ: "r",
        ს: "s",
        ტ: "t",
        უ: "u",
        ფ: "p",
        ქ: "k",
        ღ: "gh",
        ყ: "q",
        შ: "sh",
        ჩ: "ch",
        ც: "ts",
        ძ: "dz",
        წ: "ts",
        ჭ: "ch",
        ხ: "kh",
        ჯ: "j",
        ჰ: "h",
        // Greek
        α: "a",
        β: "v",
        γ: "g",
        δ: "d",
        ε: "e",
        ζ: "z",
        η: "i",
        θ: "th",
        ι: "i",
        κ: "k",
        λ: "l",
        μ: "m",
        ν: "n",
        ξ: "ks",
        ο: "o",
        π: "p",
        ρ: "r",
        σ: "s",
        τ: "t",
        υ: "y",
        φ: "f",
        χ: "x",
        ψ: "ps",
        ω: "o",
        ά: "a",
        έ: "e",
        ί: "i",
        ό: "o",
        ύ: "y",
        ή: "i",
        ώ: "o",
        ς: "s",
        ϊ: "i",
        ΰ: "y",
        ϋ: "y",
        ΐ: "i",
        Α: "A",
        Β: "B",
        Γ: "G",
        Δ: "D",
        Ε: "E",
        Ζ: "Z",
        Η: "I",
        Θ: "TH",
        Ι: "I",
        Κ: "K",
        Λ: "L",
        Μ: "M",
        Ν: "N",
        Ξ: "KS",
        Ο: "O",
        Π: "P",
        Ρ: "R",
        Σ: "S",
        Τ: "T",
        Υ: "Y",
        Φ: "F",
        Χ: "X",
        Ψ: "PS",
        Ω: "O",
        Ά: "A",
        Έ: "E",
        Ί: "I",
        Ό: "O",
        Ύ: "Y",
        Ή: "I",
        Ώ: "O",
        Ϊ: "I",
        Ϋ: "Y",
        // Latvian
        ā: "a",
        // 'č': 'c', // duplicate
        ē: "e",
        ģ: "g",
        ī: "i",
        ķ: "k",
        ļ: "l",
        ņ: "n",
        // 'š': 's', // duplicate
        ū: "u",
        // 'ž': 'z', // duplicate
        Ā: "A",
        // 'Č': 'C', // duplicate
        Ē: "E",
        Ģ: "G",
        Ī: "I",
        Ķ: "k",
        Ļ: "L",
        Ņ: "N",
        // 'Š': 'S', // duplicate
        Ū: "U",
        // 'Ž': 'Z', // duplicate
        // Macedonian
        Ќ: "Kj",
        ќ: "kj",
        Љ: "Lj",
        љ: "lj",
        Њ: "Nj",
        њ: "nj",
        Тс: "Ts",
        тс: "ts",
        // Polish
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        // 'ó': 'o', // duplicate
        ś: "s",
        ź: "z",
        ż: "z",
        Ą: "A",
        Ć: "C",
        Ę: "E",
        Ł: "L",
        Ń: "N",
        Ś: "S",
        Ź: "Z",
        Ż: "Z",
        // Ukranian
        Є: "Ye",
        І: "I",
        Ї: "Yi",
        Ґ: "G",
        є: "ye",
        і: "i",
        ї: "yi",
        ґ: "g",
        // Romanian
        ă: "a",
        Ă: "A",
        ș: "s",
        Ș: "S",
        // 'ş': 's', // duplicate
        // 'Ş': 'S', // duplicate
        ț: "t",
        Ț: "T",
        ţ: "t",
        Ţ: "T",
        // Russian https://en.wikipedia.org/wiki/Romanization_of_Russian
        // ICAO
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "i",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "c",
        ч: "ch",
        ш: "sh",
        щ: "sh",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
        А: "A",
        Б: "B",
        В: "V",
        Г: "G",
        Д: "D",
        Е: "E",
        Ё: "Yo",
        Ж: "Zh",
        З: "Z",
        И: "I",
        Й: "I",
        К: "K",
        Л: "L",
        М: "M",
        Н: "N",
        О: "O",
        П: "P",
        Р: "R",
        С: "S",
        Т: "T",
        У: "U",
        Ф: "F",
        Х: "Kh",
        Ц: "C",
        Ч: "Ch",
        Ш: "Sh",
        Щ: "Sh",
        Ъ: "",
        Ы: "Y",
        Ь: "",
        Э: "E",
        Ю: "Yu",
        Я: "Ya",
        // Serbian
        ђ: "dj",
        ј: "j",
        // 'љ': 'lj',  // duplicate
        // 'њ': 'nj', // duplicate
        ћ: "c",
        џ: "dz",
        Ђ: "Dj",
        Ј: "j",
        // 'Љ': 'Lj', // duplicate
        // 'Њ': 'Nj', // duplicate
        Ћ: "C",
        Џ: "Dz",
        // Slovak
        ľ: "l",
        ĺ: "l",
        ŕ: "r",
        Ľ: "L",
        Ĺ: "L",
        Ŕ: "R",
        // Turkish
        ş: "s",
        Ş: "S",
        ı: "i",
        İ: "I",
        // 'ç': 'c', // duplicate
        // 'Ç': 'C', // duplicate
        // 'ü': 'u', // duplicate, see langCharMap
        // 'Ü': 'U', // duplicate, see langCharMap
        // 'ö': 'o', // duplicate, see langCharMap
        // 'Ö': 'O', // duplicate, see langCharMap
        ğ: "g",
        Ğ: "G",
        // Vietnamese
        ả: "a",
        Ả: "A",
        ẳ: "a",
        Ẳ: "A",
        ẩ: "a",
        Ẩ: "A",
        đ: "d",
        Đ: "D",
        ẹ: "e",
        Ẹ: "E",
        ẽ: "e",
        Ẽ: "E",
        ẻ: "e",
        Ẻ: "E",
        ế: "e",
        Ế: "E",
        ề: "e",
        Ề: "E",
        ệ: "e",
        Ệ: "E",
        ễ: "e",
        Ễ: "E",
        ể: "e",
        Ể: "E",
        ỏ: "o",
        ọ: "o",
        Ọ: "o",
        ố: "o",
        Ố: "O",
        ồ: "o",
        Ồ: "O",
        ổ: "o",
        Ổ: "O",
        ộ: "o",
        Ộ: "O",
        ỗ: "o",
        Ỗ: "O",
        ơ: "o",
        Ơ: "O",
        ớ: "o",
        Ớ: "O",
        ờ: "o",
        Ờ: "O",
        ợ: "o",
        Ợ: "O",
        ỡ: "o",
        Ỡ: "O",
        Ở: "o",
        ở: "o",
        ị: "i",
        Ị: "I",
        ĩ: "i",
        Ĩ: "I",
        ỉ: "i",
        Ỉ: "i",
        ủ: "u",
        Ủ: "U",
        ụ: "u",
        Ụ: "U",
        ũ: "u",
        Ũ: "U",
        ư: "u",
        Ư: "U",
        ứ: "u",
        Ứ: "U",
        ừ: "u",
        Ừ: "U",
        ự: "u",
        Ự: "U",
        ữ: "u",
        Ữ: "U",
        ử: "u",
        Ử: "ư",
        ỷ: "y",
        Ỷ: "y",
        ỳ: "y",
        Ỳ: "Y",
        ỵ: "y",
        Ỵ: "Y",
        ỹ: "y",
        Ỹ: "Y",
        ạ: "a",
        Ạ: "A",
        ấ: "a",
        Ấ: "A",
        ầ: "a",
        Ầ: "A",
        ậ: "a",
        Ậ: "A",
        ẫ: "a",
        Ẫ: "A",
        // 'ă': 'a', // duplicate
        // 'Ă': 'A', // duplicate
        ắ: "a",
        Ắ: "A",
        ằ: "a",
        Ằ: "A",
        ặ: "a",
        Ặ: "A",
        ẵ: "a",
        Ẵ: "A",
        "⓪": "0",
        "①": "1",
        "②": "2",
        "③": "3",
        "④": "4",
        "⑤": "5",
        "⑥": "6",
        "⑦": "7",
        "⑧": "8",
        "⑨": "9",
        "⑩": "10",
        "⑪": "11",
        "⑫": "12",
        "⑬": "13",
        "⑭": "14",
        "⑮": "15",
        "⑯": "16",
        "⑰": "17",
        "⑱": "18",
        "⑲": "18",
        "⑳": "18",
        "⓵": "1",
        "⓶": "2",
        "⓷": "3",
        "⓸": "4",
        "⓹": "5",
        "⓺": "6",
        "⓻": "7",
        "⓼": "8",
        "⓽": "9",
        "⓾": "10",
        "⓿": "0",
        "⓫": "11",
        "⓬": "12",
        "⓭": "13",
        "⓮": "14",
        "⓯": "15",
        "⓰": "16",
        "⓱": "17",
        "⓲": "18",
        "⓳": "19",
        "⓴": "20",
        "Ⓐ": "A",
        "Ⓑ": "B",
        "Ⓒ": "C",
        "Ⓓ": "D",
        "Ⓔ": "E",
        "Ⓕ": "F",
        "Ⓖ": "G",
        "Ⓗ": "H",
        "Ⓘ": "I",
        "Ⓙ": "J",
        "Ⓚ": "K",
        "Ⓛ": "L",
        "Ⓜ": "M",
        "Ⓝ": "N",
        "Ⓞ": "O",
        "Ⓟ": "P",
        "Ⓠ": "Q",
        "Ⓡ": "R",
        "Ⓢ": "S",
        "Ⓣ": "T",
        "Ⓤ": "U",
        "Ⓥ": "V",
        "Ⓦ": "W",
        "Ⓧ": "X",
        "Ⓨ": "Y",
        "Ⓩ": "Z",
        "ⓐ": "a",
        "ⓑ": "b",
        "ⓒ": "c",
        "ⓓ": "d",
        "ⓔ": "e",
        "ⓕ": "f",
        "ⓖ": "g",
        "ⓗ": "h",
        "ⓘ": "i",
        "ⓙ": "j",
        "ⓚ": "k",
        "ⓛ": "l",
        "ⓜ": "m",
        "ⓝ": "n",
        "ⓞ": "o",
        "ⓟ": "p",
        "ⓠ": "q",
        "ⓡ": "r",
        "ⓢ": "s",
        "ⓣ": "t",
        "ⓤ": "u",
        "ⓦ": "v",
        "ⓥ": "w",
        "ⓧ": "x",
        "ⓨ": "y",
        "ⓩ": "z",
        // symbols
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
        "∂": "d",
        ƒ: "f",
        "™": "(TM)",
        "©": "(C)",
        œ: "oe",
        Œ: "OE",
        "®": "(R)",
        "†": "+",
        "℠": "(SM)",
        "…": "...",
        "˚": "o",
        º: "o",
        ª: "a",
        "•": "*",
        "၊": ",",
        "။": ".",
        // currency
        $: "USD",
        "€": "EUR",
        "₢": "BRN",
        "₣": "FRF",
        "£": "GBP",
        "₤": "ITL",
        "₦": "NGN",
        "₧": "ESP",
        "₩": "KRW",
        "₪": "ILS",
        "₫": "VND",
        "₭": "LAK",
        "₮": "MNT",
        "₯": "GRD",
        "₱": "ARS",
        "₲": "PYG",
        "₳": "ARA",
        "₴": "UAH",
        "₵": "GHS",
        "¢": "cent",
        "¥": "CNY",
        元: "CNY",
        円: "YEN",
        "﷼": "IRR",
        "₠": "EWE",
        "฿": "THB",
        "₨": "INR",
        "₹": "INR",
        "₰": "PF",
        "₺": "TRY",
        "؋": "AFN",
        "₼": "AZN",
        лв: "BGN",
        "៛": "KHR",
        "₡": "CRC",
        "₸": "KZT",
        ден: "MKD",
        zł: "PLN",
        "₽": "RUB",
        "₾": "GEL"
      }, o = [
        // burmese
        "်",
        // Dhivehi
        "ް"
      ], i = {
        // Burmese
        // dependent vowels
        "ာ": "a",
        "ါ": "a",
        "ေ": "e",
        "ဲ": "e",
        "ိ": "i",
        "ီ": "i",
        "ို": "o",
        "ု": "u",
        "ူ": "u",
        "ေါင်": "aung",
        "ော": "aw",
        "ော်": "aw",
        "ေါ": "aw",
        "ေါ်": "aw",
        "်": "်",
        // this is special case but the character will be converted to latin in the code
        "က်": "et",
        "ိုက်": "aik",
        "ောက်": "auk",
        "င်": "in",
        "ိုင်": "aing",
        "ောင်": "aung",
        "စ်": "it",
        "ည်": "i",
        "တ်": "at",
        "ိတ်": "eik",
        "ုတ်": "ok",
        "ွတ်": "ut",
        "ေတ်": "it",
        "ဒ်": "d",
        "ိုဒ်": "ok",
        "ုဒ်": "ait",
        "န်": "an",
        "ာန်": "an",
        "ိန်": "ein",
        "ုန်": "on",
        "ွန်": "un",
        "ပ်": "at",
        "ိပ်": "eik",
        "ုပ်": "ok",
        "ွပ်": "ut",
        "န်ုပ်": "nub",
        "မ်": "an",
        "ိမ်": "ein",
        "ုမ်": "on",
        "ွမ်": "un",
        "ယ်": "e",
        "ိုလ်": "ol",
        "ဉ်": "in",
        "ံ": "an",
        "ိံ": "ein",
        "ုံ": "on",
        // Dhivehi
        "ައް": "ah",
        "ަށް": "ah"
      }, s = {
        en: {},
        // default language
        az: {
          // Azerbaijani
          ç: "c",
          ə: "e",
          ğ: "g",
          ı: "i",
          ö: "o",
          ş: "s",
          ü: "u",
          Ç: "C",
          Ə: "E",
          Ğ: "G",
          İ: "I",
          Ö: "O",
          Ş: "S",
          Ü: "U"
        },
        cs: {
          // Czech
          č: "c",
          ď: "d",
          ě: "e",
          ň: "n",
          ř: "r",
          š: "s",
          ť: "t",
          ů: "u",
          ž: "z",
          Č: "C",
          Ď: "D",
          Ě: "E",
          Ň: "N",
          Ř: "R",
          Š: "S",
          Ť: "T",
          Ů: "U",
          Ž: "Z"
        },
        fi: {
          // Finnish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          ä: "a",
          // ok
          Ä: "A",
          // ok
          ö: "o",
          // ok
          Ö: "O"
          // ok
        },
        hu: {
          // Hungarian
          ä: "a",
          // ok
          Ä: "A",
          // ok
          // 'á': 'a', duplicate see charMap/latin
          // 'Á': 'A', duplicate see charMap/latin
          ö: "o",
          // ok
          Ö: "O",
          // ok
          // 'ő': 'o', duplicate see charMap/latin
          // 'Ő': 'O', duplicate see charMap/latin
          ü: "u",
          Ü: "U",
          ű: "u",
          Ű: "U"
        },
        lt: {
          // Lithuanian
          ą: "a",
          č: "c",
          ę: "e",
          ė: "e",
          į: "i",
          š: "s",
          ų: "u",
          ū: "u",
          ž: "z",
          Ą: "A",
          Č: "C",
          Ę: "E",
          Ė: "E",
          Į: "I",
          Š: "S",
          Ų: "U",
          Ū: "U"
        },
        lv: {
          // Latvian
          ā: "a",
          č: "c",
          ē: "e",
          ģ: "g",
          ī: "i",
          ķ: "k",
          ļ: "l",
          ņ: "n",
          š: "s",
          ū: "u",
          ž: "z",
          Ā: "A",
          Č: "C",
          Ē: "E",
          Ģ: "G",
          Ī: "i",
          Ķ: "k",
          Ļ: "L",
          Ņ: "N",
          Š: "S",
          Ū: "u",
          Ž: "Z"
        },
        pl: {
          // Polish
          ą: "a",
          ć: "c",
          ę: "e",
          ł: "l",
          ń: "n",
          ó: "o",
          ś: "s",
          ź: "z",
          ż: "z",
          Ą: "A",
          Ć: "C",
          Ę: "e",
          Ł: "L",
          Ń: "N",
          Ó: "O",
          Ś: "S",
          Ź: "Z",
          Ż: "Z"
        },
        sv: {
          // Swedish
          // 'å': 'a', duplicate see charMap/latin
          // 'Å': 'A', duplicate see charMap/latin
          ä: "a",
          // ok
          Ä: "A",
          // ok
          ö: "o",
          // ok
          Ö: "O"
          // ok
        },
        sk: {
          // Slovak
          ä: "a",
          Ä: "A"
        },
        sr: {
          // Serbian
          љ: "lj",
          њ: "nj",
          Љ: "Lj",
          Њ: "Nj",
          đ: "dj",
          Đ: "Dj"
        },
        tr: {
          // Turkish
          Ü: "U",
          Ö: "O",
          ü: "u",
          ö: "o"
        }
      }, a = {
        ar: {
          "∆": "delta",
          "∞": "la-nihaya",
          "♥": "hob",
          "&": "wa",
          "|": "aw",
          "<": "aqal-men",
          ">": "akbar-men",
          "∑": "majmou",
          "¤": "omla"
        },
        az: {},
        ca: {
          "∆": "delta",
          "∞": "infinit",
          "♥": "amor",
          "&": "i",
          "|": "o",
          "<": "menys que",
          ">": "mes que",
          "∑": "suma dels",
          "¤": "moneda"
        },
        cs: {
          "∆": "delta",
          "∞": "nekonecno",
          "♥": "laska",
          "&": "a",
          "|": "nebo",
          "<": "mensi nez",
          ">": "vetsi nez",
          "∑": "soucet",
          "¤": "mena"
        },
        de: {
          "∆": "delta",
          "∞": "unendlich",
          "♥": "Liebe",
          "&": "und",
          "|": "oder",
          "<": "kleiner als",
          ">": "groesser als",
          "∑": "Summe von",
          "¤": "Waehrung"
        },
        dv: {
          "∆": "delta",
          "∞": "kolunulaa",
          "♥": "loabi",
          "&": "aai",
          "|": "noonee",
          "<": "ah vure kuda",
          ">": "ah vure bodu",
          "∑": "jumula",
          "¤": "faisaa"
        },
        en: {
          "∆": "delta",
          "∞": "infinity",
          "♥": "love",
          "&": "and",
          "|": "or",
          "<": "less than",
          ">": "greater than",
          "∑": "sum",
          "¤": "currency"
        },
        es: {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amor",
          "&": "y",
          "|": "u",
          "<": "menos que",
          ">": "mas que",
          "∑": "suma de los",
          "¤": "moneda"
        },
        fa: {
          "∆": "delta",
          "∞": "bi-nahayat",
          "♥": "eshgh",
          "&": "va",
          "|": "ya",
          "<": "kamtar-az",
          ">": "bishtar-az",
          "∑": "majmooe",
          "¤": "vahed"
        },
        fi: {
          "∆": "delta",
          "∞": "aarettomyys",
          "♥": "rakkaus",
          "&": "ja",
          "|": "tai",
          "<": "pienempi kuin",
          ">": "suurempi kuin",
          "∑": "summa",
          "¤": "valuutta"
        },
        fr: {
          "∆": "delta",
          "∞": "infiniment",
          "♥": "Amour",
          "&": "et",
          "|": "ou",
          "<": "moins que",
          ">": "superieure a",
          "∑": "somme des",
          "¤": "monnaie"
        },
        ge: {
          "∆": "delta",
          "∞": "usasruloba",
          "♥": "siqvaruli",
          "&": "da",
          "|": "an",
          "<": "naklebi",
          ">": "meti",
          "∑": "jami",
          "¤": "valuta"
        },
        gr: {},
        hu: {
          "∆": "delta",
          "∞": "vegtelen",
          "♥": "szerelem",
          "&": "es",
          "|": "vagy",
          "<": "kisebb mint",
          ">": "nagyobb mint",
          "∑": "szumma",
          "¤": "penznem"
        },
        it: {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amore",
          "&": "e",
          "|": "o",
          "<": "minore di",
          ">": "maggiore di",
          "∑": "somma",
          "¤": "moneta"
        },
        lt: {
          "∆": "delta",
          "∞": "begalybe",
          "♥": "meile",
          "&": "ir",
          "|": "ar",
          "<": "maziau nei",
          ">": "daugiau nei",
          "∑": "suma",
          "¤": "valiuta"
        },
        lv: {
          "∆": "delta",
          "∞": "bezgaliba",
          "♥": "milestiba",
          "&": "un",
          "|": "vai",
          "<": "mazak neka",
          ">": "lielaks neka",
          "∑": "summa",
          "¤": "valuta"
        },
        my: {
          "∆": "kwahkhyaet",
          "∞": "asaonasme",
          "♥": "akhyait",
          "&": "nhin",
          "|": "tho",
          "<": "ngethaw",
          ">": "kyithaw",
          "∑": "paungld",
          "¤": "ngwekye"
        },
        mk: {},
        nl: {
          "∆": "delta",
          "∞": "oneindig",
          "♥": "liefde",
          "&": "en",
          "|": "of",
          "<": "kleiner dan",
          ">": "groter dan",
          "∑": "som",
          "¤": "valuta"
        },
        pl: {
          "∆": "delta",
          "∞": "nieskonczonosc",
          "♥": "milosc",
          "&": "i",
          "|": "lub",
          "<": "mniejsze niz",
          ">": "wieksze niz",
          "∑": "suma",
          "¤": "waluta"
        },
        pt: {
          "∆": "delta",
          "∞": "infinito",
          "♥": "amor",
          "&": "e",
          "|": "ou",
          "<": "menor que",
          ">": "maior que",
          "∑": "soma",
          "¤": "moeda"
        },
        ro: {
          "∆": "delta",
          "∞": "infinit",
          "♥": "dragoste",
          "&": "si",
          "|": "sau",
          "<": "mai mic ca",
          ">": "mai mare ca",
          "∑": "suma",
          "¤": "valuta"
        },
        ru: {
          "∆": "delta",
          "∞": "beskonechno",
          "♥": "lubov",
          "&": "i",
          "|": "ili",
          "<": "menshe",
          ">": "bolshe",
          "∑": "summa",
          "¤": "valjuta"
        },
        sk: {
          "∆": "delta",
          "∞": "nekonecno",
          "♥": "laska",
          "&": "a",
          "|": "alebo",
          "<": "menej ako",
          ">": "viac ako",
          "∑": "sucet",
          "¤": "mena"
        },
        sr: {},
        tr: {
          "∆": "delta",
          "∞": "sonsuzluk",
          "♥": "ask",
          "&": "ve",
          "|": "veya",
          "<": "kucuktur",
          ">": "buyuktur",
          "∑": "toplam",
          "¤": "para birimi"
        },
        uk: {
          "∆": "delta",
          "∞": "bezkinechnist",
          "♥": "lubov",
          "&": "i",
          "|": "abo",
          "<": "menshe",
          ">": "bilshe",
          "∑": "suma",
          "¤": "valjuta"
        },
        vn: {
          "∆": "delta",
          "∞": "vo cuc",
          "♥": "yeu",
          "&": "va",
          "|": "hoac",
          "<": "nho hon",
          ">": "lon hon",
          "∑": "tong",
          "¤": "tien te"
        }
      }, u = [";", "?", ":", "@", "&", "=", "+", "$", ",", "/"].join(""), l = [";", "?", ":", "@", "&", "=", "+", "$", ","].join(""), c = [".", "!", "~", "*", "'", "(", ")"].join(""), f = function(p, g) {
        var C = "-", b = "", P = "", M = true, A = {}, O, T, E, x, R, Ut2, de, te, Ht2, z, w, Se, H, ne2, K = "";
        if (typeof p != "string")
          return "";
        if (typeof g == "string" && (C = g), de = a.en, te = s.en, typeof g == "object") {
          O = g.maintainCase || false, A = g.custom && typeof g.custom == "object" ? g.custom : A, E = +g.truncate > 1 && g.truncate || false, x = g.uric || false, R = g.uricNoSlash || false, Ut2 = g.mark || false, M = !(g.symbols === false || g.lang === false), C = g.separator || C, x && (K += u), R && (K += l), Ut2 && (K += c), de = g.lang && a[g.lang] && M ? a[g.lang] : M ? a.en : {}, te = g.lang && s[g.lang] ? s[g.lang] : g.lang === false || g.lang === true ? {} : s.en, g.titleCase && typeof g.titleCase.length == "number" && Array.prototype.toString.call(g.titleCase) ? (g.titleCase.forEach(function(U) {
            A[U + ""] = U + "";
          }), T = true) : T = !!g.titleCase, g.custom && typeof g.custom.length == "number" && Array.prototype.toString.call(g.custom) && g.custom.forEach(function(U) {
            A[U + ""] = U + "";
          }), Object.keys(A).forEach(function(U) {
            var pe2;
            U.length > 1 ? pe2 = new RegExp("\\b" + d(U) + "\\b", "gi") : pe2 = new RegExp(d(U), "gi"), p = p.replace(pe2, A[U]);
          });
          for (w in A)
            K += w;
        }
        for (K += C, K = d(K), p = p.replace(/(^\s+|\s+$)/g, ""), H = false, ne2 = false, z = 0, Se = p.length; z < Se; z++)
          w = p[z], _(w, A) ? H = false : te[w] ? (w = H && te[w].match(/[A-Za-z0-9]/) ? " " + te[w] : te[w], H = false) : w in r ? (z + 1 < Se && o.indexOf(p[z + 1]) >= 0 ? (P += w, w = "") : ne2 === true ? (w = i[P] + r[w], P = "") : w = H && r[w].match(/[A-Za-z0-9]/) ? " " + r[w] : r[w], H = false, ne2 = false) : w in i ? (P += w, w = "", z === Se - 1 && (w = i[P]), ne2 = true) : (
            /* process symbol chars */
            de[w] && !(x && u.indexOf(w) !== -1) && !(R && l.indexOf(w) !== -1) ? (w = H || b.substr(-1).match(/[A-Za-z0-9]/) ? C + de[w] : de[w], w += p[z + 1] !== void 0 && p[z + 1].match(/[A-Za-z0-9]/) ? C : "", H = true) : (ne2 === true ? (w = i[P] + w, P = "", ne2 = false) : H && (/[A-Za-z0-9]/.test(w) || b.substr(-1).match(/A-Za-z0-9]/)) && (w = " " + w), H = false)
          ), b += w.replace(new RegExp("[^\\w\\s" + K + "_-]", "g"), C);
        return T && (b = b.replace(/(\w)(\S*)/g, function(U, pe2, jt) {
          var Ye2 = pe2.toUpperCase() + (jt !== null ? jt : "");
          return Object.keys(A).indexOf(Ye2.toLowerCase()) < 0 ? Ye2 : Ye2.toLowerCase();
        })), b = b.replace(/\s+/g, C).replace(new RegExp("\\" + C + "+", "g"), C).replace(new RegExp("(^\\" + C + "+|\\" + C + "+$)", "g"), ""), E && b.length > E && (Ht2 = b.charAt(E) === C, b = b.slice(0, E), Ht2 || (b = b.slice(0, b.lastIndexOf(C)))), !O && !T && (b = b.toLowerCase()), b;
      }, h = function(p) {
        return function(C) {
          return f(C, p);
        };
      }, d = function(p) {
        return p.replace(/[-\\^$*+?.()|[\]{}\/]/g, "\\$&");
      }, _ = function(v, p) {
        for (var g in p)
          if (p[g] === v)
            return true;
      };
      if (typeof t < "u" && t.exports)
        t.exports = f, t.exports.createSlug = h;
      else if (typeof define < "u" && define.amd)
        define([], function() {
          return f;
        });
      else
        try {
          if (n.getSlug || n.createSlug)
            throw "speakingurl: globals exists /(getSlug|createSlug)/";
          n.getSlug = f, n.createSlug = h;
        } catch {
        }
    })(e);
  }
}), ga$1 = qr({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/index.js"(e, t) {
    m(), t.exports = ma$1();
  }
});
m();
m();
m();
m();
m();
m();
m();
m();
function Ea$1(e) {
  var t;
  const n = e.name || e._componentTag || e.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || e.__name;
  return n === "index" && ((t = e.__file) != null && t.endsWith("index.vue")) ? "" : n;
}
function va(e) {
  const t = e.__file;
  if (t)
    return ea$1(ta$1(t, ".vue"));
}
function mn(e, t) {
  return e.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = t, t;
}
function Dt$1(e) {
  if (e.__VUE_DEVTOOLS_NEXT_APP_RECORD__)
    return e.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
  if (e.root)
    return e.appContext.app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
}
function Xr(e) {
  var t, n;
  const r = (t = e.subTree) == null ? void 0 : t.type, o = Dt$1(e);
  return o ? ((n = o?.types) == null ? void 0 : n.Fragment) === r : false;
}
function Ke$1(e) {
  var t, n, r;
  const o = Ea$1(e?.type || {});
  if (o)
    return o;
  if (e?.root === e)
    return "Root";
  for (const s in (n = (t = e.parent) == null ? void 0 : t.type) == null ? void 0 : n.components)
    if (e.parent.type.components[s] === e?.type)
      return mn(e, s);
  for (const s in (r = e.appContext) == null ? void 0 : r.components)
    if (e.appContext.components[s] === e?.type)
      return mn(e, s);
  const i = va(e?.type || {});
  return i || "Anonymous Component";
}
function ya$1(e) {
  var t, n, r;
  const o = (r = (n = (t = e?.appContext) == null ? void 0 : t.app) == null ? void 0 : n.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__) != null ? r : 0, i = e === e?.root ? "root" : e.uid;
  return `${o}:${i}`;
}
function _t(e, t) {
  return t = t || `${e.id}:root`, e.instanceMap.get(t) || e.instanceMap.get(":root");
}
var gn$1 = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function ee(e) {
  e.subTree.el;
  return gn$1;
}
m();
function kt(e) {
  return Xr(e) ? Ta(e.subTree) : e.subTree ? [e.subTree.el] : [];
}
function Ta(e) {
  if (!e.children)
    return [];
  const t = [];
  return e.children.forEach((n) => {
    n.component ? t.push(...kt(n.component)) : n?.el && t.push(n.el);
  }), t;
}
var Qr$1 = "__vue-devtools-component-inspector__", Zr = "__vue-devtools-component-inspector__card__", Jr$1 = "__vue-devtools-component-inspector__name__", eo = "__vue-devtools-component-inspector__indicator__", to = {
  display: "block",
  zIndex: 2147483640,
  position: "fixed",
  backgroundColor: "#42b88325",
  border: "1px solid #42b88350",
  borderRadius: "5px",
  transition: "all 0.1s ease-in",
  pointerEvents: "none"
}, Oa = {
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "5px 8px",
  borderRadius: "4px",
  textAlign: "left",
  position: "absolute",
  left: 0,
  color: "#e9e9e9",
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "24px",
  backgroundColor: "#42b883",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)"
}, Sa = {
  display: "inline-block",
  fontWeight: 400,
  fontStyle: "normal",
  fontSize: "12px",
  opacity: 0.7
};
function ce() {
  return (void 0).getElementById(Qr$1);
}
function Pa() {
  return (void 0).getElementById(Zr);
}
function Ia() {
  return (void 0).getElementById(eo);
}
function Da$1() {
  return (void 0).getElementById(Jr$1);
}
function xt(e) {
  return {
    left: `${Math.round(e.left * 100) / 100}px`,
    top: `${Math.round(e.top * 100) / 100}px`,
    width: `${Math.round(e.width * 100) / 100}px`,
    height: `${Math.round(e.height * 100) / 100}px`
  };
}
function Rt$1(e) {
  var t;
  const n = (void 0).createElement("div");
  n.id = (t = e.elementId) != null ? t : Qr$1, Object.assign(n.style, {
    ...to,
    ...xt(e.bounds),
    ...e.style
  });
  const r = (void 0).createElement("span");
  r.id = Zr, Object.assign(r.style, {
    ...Oa,
    top: e.bounds.top < 35 ? 0 : "-35px"
  });
  const o = (void 0).createElement("span");
  o.id = Jr$1, o.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`;
  const i = (void 0).createElement("i");
  return i.id = eo, i.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`, Object.assign(i.style, Sa), r.appendChild(o), r.appendChild(i), n.appendChild(r), (void 0).body.appendChild(n), n;
}
function Lt(e) {
  const t = ce(), n = Pa(), r = Da$1(), o = Ia();
  t && (Object.assign(t.style, {
    ...to,
    ...xt(e.bounds)
  }), Object.assign(n.style, {
    top: e.bounds.top < 35 ? 0 : "-35px"
  }), r.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`, o.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`);
}
function ka(e) {
  const t = ee(e);
  if (!t.width && !t.height)
    return;
  const n = Ke$1(e);
  ce() ? Lt({ bounds: t, name: n }) : Rt$1({ bounds: t, name: n });
}
function no() {
  const e = ce();
  e && (e.style.display = "none");
}
var mt = null;
function gt(e) {
  const t = e.target;
  if (t) {
    const n = t.__vueParentComponent;
    if (n && (mt = n, n.vnode.el)) {
      const o = ee(n), i = Ke$1(n);
      ce() ? Lt({ bounds: o, name: i }) : Rt$1({ bounds: o, name: i });
    }
  }
}
function xa$1(e, t) {
  if (e.preventDefault(), e.stopPropagation(), mt) {
    const n = ya$1(mt);
    t(n);
  }
}
var Ue$1 = null;
function Ra$1() {
  no(), (void 0).removeEventListener("mouseover", gt), (void 0).removeEventListener("click", Ue$1, true), Ue$1 = null;
}
function La() {
  return (void 0).addEventListener("mouseover", gt), new Promise((e) => {
    function t(n) {
      n.preventDefault(), n.stopPropagation(), xa$1(n, (r) => {
        (void 0).removeEventListener("click", t, true), Ue$1 = null, (void 0).removeEventListener("mouseover", gt);
        const o = ce();
        o && (o.style.display = "none"), e(JSON.stringify({ id: r }));
      });
    }
    Ue$1 = t, (void 0).addEventListener("click", t, true);
  });
}
function Fa(e) {
  const t = _t(F.value, e.id);
  if (t) {
    const [n] = kt(t);
    if (typeof n.scrollIntoView == "function")
      n.scrollIntoView({
        behavior: "smooth"
      });
    else {
      const r = ee(t), o = (void 0).createElement("div"), i = {
        ...xt(r),
        position: "absolute"
      };
      Object.assign(o.style, i), (void 0).body.appendChild(o), o.scrollIntoView({
        behavior: "smooth"
      }), setTimeout(() => {
        (void 0).body.removeChild(o);
      }, 2e3);
    }
    setTimeout(() => {
      const r = ee(t);
      if (r.width || r.height) {
        const o = Ke$1(t), i = ce();
        i ? Lt({ ...e, name: o, bounds: r }) : Rt$1({ ...e, name: o, bounds: r }), setTimeout(() => {
          i && (i.style.display = "none");
        }, 1500);
      }
    }, 1200);
  }
}
m();
var En;
(En = y).__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ != null || (En.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = true);
function Ma$1(e) {
  let t = 0;
  const n = setInterval(() => {
    y.__VUE_INSPECTOR__ && (clearInterval(n), t += 30, e()), t >= /* 5s */
    5e3 && clearInterval(n);
  }, 30);
}
function Na() {
  const e = y.__VUE_INSPECTOR__, t = e.openInEditor;
  e.openInEditor = async (...n) => {
    e.disable(), t(...n);
  };
}
function Va$1() {
  return new Promise((e) => {
    function t() {
      Na(), e(y.__VUE_INSPECTOR__);
    }
    y.__VUE_INSPECTOR__ ? t() : Ma$1(() => {
      t();
    });
  });
}
m();
m();
function Ba(e) {
  return !!(e && e.__v_isReadonly);
}
function ro$1(e) {
  return Ba(e) ? ro$1(e.__v_raw) : !!(e && e.__v_isReactive);
}
function nt$1(e) {
  return !!(e && e.__v_isRef === true);
}
function _e(e) {
  const t = e && e.__v_raw;
  return t ? _e(t) : e;
}
var Ua = class {
  constructor() {
    this.refEditor = new Ha$1();
  }
  set(e, t, n, r) {
    const o = Array.isArray(t) ? t : t.split(".");
    for (; o.length > 1; ) {
      const a = o.shift();
      e instanceof Map ? e = e.get(a) : e instanceof Set ? e = Array.from(e.values())[a] : e = e[a], this.refEditor.isRef(e) && (e = this.refEditor.get(e));
    }
    const i = o[0], s = this.refEditor.get(e)[i];
    r ? r(e, i, n) : this.refEditor.isRef(s) ? this.refEditor.set(s, n) : e[i] = n;
  }
  get(e, t) {
    const n = Array.isArray(t) ? t : t.split(".");
    for (let r = 0; r < n.length; r++)
      if (e instanceof Map ? e = e.get(n[r]) : e = e[n[r]], this.refEditor.isRef(e) && (e = this.refEditor.get(e)), !e)
        return;
    return e;
  }
  has(e, t, n = false) {
    if (typeof e > "u")
      return false;
    const r = Array.isArray(t) ? t.slice() : t.split("."), o = n ? 2 : 1;
    for (; e && r.length > o; ) {
      const i = r.shift();
      e = e[i], this.refEditor.isRef(e) && (e = this.refEditor.get(e));
    }
    return e != null && Object.prototype.hasOwnProperty.call(e, r[0]);
  }
  createDefaultSetCallback(e) {
    return (t, n, r) => {
      if ((e.remove || e.newKey) && (Array.isArray(t) ? t.splice(n, 1) : _e(t) instanceof Map ? t.delete(n) : _e(t) instanceof Set ? t.delete(Array.from(t.values())[n]) : Reflect.deleteProperty(t, n)), !e.remove) {
        const o = t[e.newKey || n];
        this.refEditor.isRef(o) ? this.refEditor.set(o, r) : _e(t) instanceof Map ? t.set(e.newKey || n, r) : _e(t) instanceof Set ? t.add(r) : t[e.newKey || n] = r;
      }
    };
  }
}, Ha$1 = class Ha {
  set(e, t) {
    if (nt$1(e))
      e.value = t;
    else {
      if (e instanceof Set && Array.isArray(t)) {
        e.clear(), t.forEach((o) => e.add(o));
        return;
      }
      const n = Object.keys(t);
      if (e instanceof Map) {
        const o = new Set(e.keys());
        n.forEach((i) => {
          e.set(i, Reflect.get(t, i)), o.delete(i);
        }), o.forEach((i) => e.delete(i));
        return;
      }
      const r = new Set(Object.keys(e));
      n.forEach((o) => {
        Reflect.set(e, o, Reflect.get(t, o)), r.delete(o);
      }), r.forEach((o) => Reflect.deleteProperty(e, o));
    }
  }
  get(e) {
    return nt$1(e) ? e.value : e;
  }
  isRef(e) {
    return nt$1(e) || ro$1(e);
  }
};
m();
m();
m();
function za() {
  return {
    recordingState: false,
    mouseEventEnabled: false,
    keyboardEventEnabled: false,
    componentEventEnabled: false,
    performanceEventEnabled: false,
    selected: ""
  };
}
m();
m();
m();
var yn;
(yn = y).__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS != null || (yn.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS = []);
var $a$1 = new Proxy(y.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function Ka(e, t) {
  k.timelineLayersState[t.id] = false, $a$1.push({
    ...e,
    descriptorId: t.id,
    appRecord: Dt$1(t.app)
  });
}
var bn;
(bn = y).__VUE_DEVTOOLS_KIT_INSPECTOR__ != null || (bn.__VUE_DEVTOOLS_KIT_INSPECTOR__ = []);
var Ft$1 = new Proxy(y.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
}), oo$1 = ae$1(() => {
  fe.hooks.callHook("sendInspectorToClient", io());
});
function Wa(e, t) {
  var n, r;
  Ft$1.push({
    options: e,
    descriptor: t,
    treeFilterPlaceholder: (n = e.treeFilterPlaceholder) != null ? n : "Search tree...",
    stateFilterPlaceholder: (r = e.stateFilterPlaceholder) != null ? r : "Search state...",
    treeFilter: "",
    selectedNodeId: "",
    appRecord: Dt$1(t.app)
  }), oo$1();
}
function io() {
  return Ft$1.filter((e) => e.descriptor.app === F.value.app).filter((e) => e.descriptor.id !== "components").map((e) => {
    var t;
    const n = e.descriptor, r = e.options;
    return {
      id: r.id,
      label: r.label,
      logo: n.logo,
      icon: `custom-ic-baseline-${(t = r?.icon) == null ? void 0 : t.replace(/_/g, "-")}`,
      packageName: n.packageName,
      homepage: n.homepage,
      pluginId: n.id
    };
  });
}
function Re$1(e, t) {
  return Ft$1.find((n) => n.options.id === e && (t ? n.descriptor.app === t : true));
}
function Ga() {
  const e = Gr();
  e.hook("addInspector", ({ inspector: r, plugin: o }) => {
    Wa(r, o.descriptor);
  });
  const t = ae$1(async ({ inspectorId: r, plugin: o }) => {
    var i;
    if (!r || !((i = o?.descriptor) != null && i.app) || k.highPerfModeEnabled)
      return;
    const s = Re$1(r, o.descriptor.app), a = {
      app: o.descriptor.app,
      inspectorId: r,
      filter: s?.treeFilter || "",
      rootNodes: []
    };
    await new Promise((u) => {
      e.callHookWith(
        async (l) => {
          await Promise.all(l.map((c) => c(a))), u();
        },
        "getInspectorTree"
        /* GET_INSPECTOR_TREE */
      );
    }), e.callHookWith(
      async (u) => {
        await Promise.all(u.map((l) => l({
          inspectorId: r,
          rootNodes: a.rootNodes
        })));
      },
      "sendInspectorTreeToClient"
      /* SEND_INSPECTOR_TREE_TO_CLIENT */
    );
  }, 120);
  e.hook("sendInspectorTree", t);
  const n = ae$1(async ({ inspectorId: r, plugin: o }) => {
    var i;
    if (!r || !((i = o?.descriptor) != null && i.app) || k.highPerfModeEnabled)
      return;
    const s = Re$1(r, o.descriptor.app), a = {
      app: o.descriptor.app,
      inspectorId: r,
      nodeId: s?.selectedNodeId || "",
      state: null
    }, u = {
      currentTab: `custom-inspector:${r}`
    };
    a.nodeId && await new Promise((l) => {
      e.callHookWith(
        async (c) => {
          await Promise.all(c.map((f) => f(a, u))), l();
        },
        "getInspectorState"
        /* GET_INSPECTOR_STATE */
      );
    }), e.callHookWith(
      async (l) => {
        await Promise.all(l.map((c) => c({
          inspectorId: r,
          nodeId: a.nodeId,
          state: a.state
        })));
      },
      "sendInspectorStateToClient"
      /* SEND_INSPECTOR_STATE_TO_CLIENT */
    );
  }, 120);
  return e.hook("sendInspectorState", n), e.hook("customInspectorSelectNode", ({ inspectorId: r, nodeId: o, plugin: i }) => {
    const s = Re$1(r, i.descriptor.app);
    s && (s.selectedNodeId = o);
  }), e.hook("timelineLayerAdded", ({ options: r, plugin: o }) => {
    Ka(r, o.descriptor);
  }), e.hook("timelineEventAdded", ({ options: r, plugin: o }) => {
    var i;
    const s = ["performance", "component-event", "keyboard", "mouse"];
    k.highPerfModeEnabled || !((i = k.timelineLayersState) != null && i[o.descriptor.id]) && !s.includes(r.layerId) || e.callHookWith(
      async (a) => {
        await Promise.all(a.map((u) => u(r)));
      },
      "sendTimelineEventToClient"
      /* SEND_TIMELINE_EVENT_TO_CLIENT */
    );
  }), e.hook("getComponentInstances", async ({ app: r }) => {
    const o = r.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
    if (!o)
      return null;
    const i = o.id.toString();
    return [...o.instanceMap].filter(([a]) => a.split(":")[0] === i).map(([, a]) => a);
  }), e.hook("getComponentBounds", async ({ instance: r }) => ee(r)), e.hook("getComponentName", ({ instance: r }) => Ke$1(r)), e.hook("componentHighlight", ({ uid: r }) => {
    const o = F.value.instanceMap.get(r);
    o && ka(o);
  }), e.hook("componentUnhighlight", () => {
    no();
  }), e;
}
var An;
(An = y).__VUE_DEVTOOLS_KIT_APP_RECORDS__ != null || (An.__VUE_DEVTOOLS_KIT_APP_RECORDS__ = []);
var On;
(On = y).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ != null || (On.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = {});
var Pn$1;
(Pn$1 = y).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ != null || (Pn$1.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = "");
var Dn$1;
(Dn$1 = y).__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ != null || (Dn$1.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ = []);
var xn;
(xn = y).__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ != null || (xn.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ = []);
var Z = "__VUE_DEVTOOLS_KIT_GLOBAL_STATE__";
function Ya$1() {
  return {
    connected: false,
    clientConnected: false,
    vitePluginDetected: true,
    appRecords: [],
    activeAppRecordId: "",
    tabs: [],
    commands: [],
    highPerfModeEnabled: true,
    devtoolsClientDetected: {},
    perfUniqueGroupId: 0,
    timelineLayersState: za()
  };
}
var Ln$1;
(Ln$1 = y)[Z] != null || (Ln$1[Z] = Ya$1());
var qa$1 = ae$1((e) => {
  fe.hooks.callHook("devtoolsStateUpdated", { state: e });
});
ae$1((e, t) => {
  fe.hooks.callHook("devtoolsConnectedUpdated", { state: e, oldState: t });
});
var We$1 = new Proxy(y.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(e, t, n) {
    return t === "value" ? y.__VUE_DEVTOOLS_KIT_APP_RECORDS__ : y.__VUE_DEVTOOLS_KIT_APP_RECORDS__[t];
  }
}), F = new Proxy(y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(e, t, n) {
    return t === "value" ? y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ : t === "id" ? y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ : y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[t];
  }
});
function so() {
  qa$1({
    ...y[Z],
    appRecords: We$1.value,
    activeAppRecordId: F.id,
    tabs: y.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__,
    commands: y.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__
  });
}
function Xa$1(e) {
  y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = e, so();
}
function Qa$1(e) {
  y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = e, so();
}
var k = new Proxy(y[Z], {
  get(e, t) {
    return t === "appRecords" ? We$1 : t === "activeAppRecordId" ? F.id : t === "tabs" ? y.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ : t === "commands" ? y.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ : y[Z][t];
  },
  deleteProperty(e, t) {
    return delete e[t], true;
  },
  set(e, t, n) {
    return { ...y[Z] }, e[t] = n, y[Z][t] = n, true;
  }
});
function Za(e = {}) {
  var t, n, r;
  const { file: o, host: i, baseUrl: s = (void 0).location.origin, line: a = 0, column: u = 0 } = e;
  if (o) {
    if (i === "chrome-extension") {
      const l = o.replace(/\\/g, "\\\\"), c = (n = (t = (void 0).VUE_DEVTOOLS_CONFIG) == null ? void 0 : t.openInEditorHost) != null ? n : "/";
      fetch(`${c}__open-in-editor?file=${encodeURI(o)}`).then((f) => {
        if (!f.ok) {
          const h = `Opening component ${l} failed`;
          console.log(`%c${h}`, "color:red");
        }
      });
    } else if (k.vitePluginDetected) {
      const l = (r = y.__VUE_DEVTOOLS_OPEN_IN_EDITOR_BASE_URL__) != null ? r : s;
      y.__VUE_INSPECTOR__.openInEditor(l, o, a, u);
    }
  }
}
m();
m();
m();
m();
m();
var Mn;
(Mn = y).__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ != null || (Mn.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__ = []);
var Mt$1 = new Proxy(y.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function Et$1(e) {
  const t = {};
  return Object.keys(e).forEach((n) => {
    t[n] = e[n].defaultValue;
  }), t;
}
function Nt$1(e) {
  return `__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__${e}__`;
}
function Ja(e) {
  var t, n, r;
  const o = (n = (t = Mt$1.find((i) => {
    var s;
    return i[0].id === e && !!((s = i[0]) != null && s.settings);
  })) == null ? void 0 : t[0]) != null ? n : null;
  return (r = o?.settings) != null ? r : null;
}
function ao(e, t) {
  var n, r, o;
  const i = Nt$1(e);
  if (i) {
    const s = localStorage.getItem(i);
    if (s)
      return JSON.parse(s);
  }
  if (e) {
    const s = (r = (n = Mt$1.find((a) => a[0].id === e)) == null ? void 0 : n[0]) != null ? r : null;
    return Et$1((o = s?.settings) != null ? o : {});
  }
  return Et$1(t);
}
function eu(e, t) {
  const n = Nt$1(e);
  localStorage.getItem(n) || localStorage.setItem(n, JSON.stringify(Et$1(t)));
}
function tu(e, t, n) {
  const r = Nt$1(e), o = localStorage.getItem(r), i = JSON.parse(o || "{}"), s = {
    ...i,
    [t]: n
  };
  localStorage.setItem(r, JSON.stringify(s)), fe.hooks.callHookWith(
    (a) => {
      a.forEach((u) => u({
        pluginId: e,
        key: t,
        oldValue: i[t],
        newValue: n,
        settings: s
      }));
    },
    "setPluginSettings"
    /* SET_PLUGIN_SETTINGS */
  );
}
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
var Vn, Bn$1, V = (Bn$1 = (Vn = y).__VUE_DEVTOOLS_HOOK) != null ? Bn$1 : Vn.__VUE_DEVTOOLS_HOOK = Gr(), nu = {
  vueAppInit(e) {
    V.hook("app:init", e);
  },
  vueAppUnmount(e) {
    V.hook("app:unmount", e);
  },
  vueAppConnected(e) {
    V.hook("app:connected", e);
  },
  componentAdded(e) {
    return V.hook("component:added", e);
  },
  componentEmit(e) {
    return V.hook("component:emit", e);
  },
  componentUpdated(e) {
    return V.hook("component:updated", e);
  },
  componentRemoved(e) {
    return V.hook("component:removed", e);
  },
  setupDevtoolsPlugin(e) {
    V.hook("devtools-plugin:setup", e);
  },
  perfStart(e) {
    return V.hook("perf:start", e);
  },
  perfEnd(e) {
    return V.hook("perf:end", e);
  }
}, uo$1 = {
  on: nu
}, ru = class {
  constructor({ plugin: e, ctx: t }) {
    this.hooks = t.hooks, this.plugin = e;
  }
  get on() {
    return {
      // component inspector
      visitComponentTree: (e) => {
        this.hooks.hook("visitComponentTree", e);
      },
      inspectComponent: (e) => {
        this.hooks.hook("inspectComponent", e);
      },
      editComponentState: (e) => {
        this.hooks.hook("editComponentState", e);
      },
      // custom inspector
      getInspectorTree: (e) => {
        this.hooks.hook("getInspectorTree", e);
      },
      getInspectorState: (e) => {
        this.hooks.hook("getInspectorState", e);
      },
      editInspectorState: (e) => {
        this.hooks.hook("editInspectorState", e);
      },
      // timeline
      inspectTimelineEvent: (e) => {
        this.hooks.hook("inspectTimelineEvent", e);
      },
      timelineCleared: (e) => {
        this.hooks.hook("timelineCleared", e);
      },
      // settings
      setPluginSettings: (e) => {
        this.hooks.hook("setPluginSettings", e);
      }
    };
  }
  // component inspector
  notifyComponentUpdate(e) {
    var t;
    if (k.highPerfModeEnabled)
      return;
    const n = io().find((r) => r.packageName === this.plugin.descriptor.packageName);
    if (n?.id) {
      if (e) {
        const r = [
          e.appContext.app,
          e.uid,
          (t = e.parent) == null ? void 0 : t.uid,
          e
        ];
        V.callHook("component:updated", ...r);
      } else
        V.callHook(
          "component:updated"
          /* COMPONENT_UPDATED */
        );
      this.hooks.callHook("sendInspectorState", { inspectorId: n.id, plugin: this.plugin });
    }
  }
  // custom inspector
  addInspector(e) {
    this.hooks.callHook("addInspector", { inspector: e, plugin: this.plugin }), this.plugin.descriptor.settings && eu(e.id, this.plugin.descriptor.settings);
  }
  sendInspectorTree(e) {
    k.highPerfModeEnabled || this.hooks.callHook("sendInspectorTree", { inspectorId: e, plugin: this.plugin });
  }
  sendInspectorState(e) {
    k.highPerfModeEnabled || this.hooks.callHook("sendInspectorState", { inspectorId: e, plugin: this.plugin });
  }
  selectInspectorNode(e, t) {
    this.hooks.callHook("customInspectorSelectNode", { inspectorId: e, nodeId: t, plugin: this.plugin });
  }
  visitComponentTree(e) {
    return this.hooks.callHook("visitComponentTree", e);
  }
  // timeline
  now() {
    return k.highPerfModeEnabled ? 0 : Date.now();
  }
  addTimelineLayer(e) {
    this.hooks.callHook("timelineLayerAdded", { options: e, plugin: this.plugin });
  }
  addTimelineEvent(e) {
    k.highPerfModeEnabled || this.hooks.callHook("timelineEventAdded", { options: e, plugin: this.plugin });
  }
  // settings
  getSettings(e) {
    return ao(e ?? this.plugin.descriptor.id, this.plugin.descriptor.settings);
  }
  // utilities
  getComponentInstances(e) {
    return this.hooks.callHook("getComponentInstances", { app: e });
  }
  getComponentBounds(e) {
    return this.hooks.callHook("getComponentBounds", { instance: e });
  }
  getComponentName(e) {
    return this.hooks.callHook("getComponentName", { instance: e });
  }
  highlightElement(e) {
    const t = e.__VUE_DEVTOOLS_NEXT_UID__;
    return this.hooks.callHook("componentHighlight", { uid: t });
  }
  unhighlightElement() {
    return this.hooks.callHook(
      "componentUnhighlight"
      /* COMPONENT_UNHIGHLIGHT */
    );
  }
}, ou = ru;
m();
m();
m();
m();
var iu = "__vue_devtool_undefined__", su = "__vue_devtool_infinity__", au = "__vue_devtool_negative_infinity__", uu = "__vue_devtool_nan__";
m();
m();
var lu = {
  [iu]: "undefined",
  [uu]: "NaN",
  [su]: "Infinity",
  [au]: "-Infinity"
};
Object.entries(lu).reduce((e, [t, n]) => (e[n] = t, e), {});
m();
m();
m();
m();
m();
var Un;
(Un = y).__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__ != null || (Un.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__ = /* @__PURE__ */ new Set());
function fu(e, t) {
  const [n, r] = e;
  if (n.app !== t)
    return;
  const o = new ou({
    plugin: {
      setupFn: r,
      descriptor: n
    },
    ctx: fe
  });
  n.packageName === "vuex" && o.on.editInspectorState((i) => {
    o.sendInspectorState(i.inspectorId);
  }), r(o);
}
function lo$1(e, t) {
  y.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.has(e) || k.highPerfModeEnabled && !t?.inspectingComponent || (y.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.add(e), Mt$1.forEach((n) => {
    fu(n, e);
  }));
}
m();
m();
var ve = "__VUE_DEVTOOLS_ROUTER__", ue = "__VUE_DEVTOOLS_ROUTER_INFO__", jn$1;
(jn$1 = y)[ue] != null || (jn$1[ue] = {
  currentRoute: null,
  routes: []
});
var $n;
($n = y)[ve] != null || ($n[ve] = {});
new Proxy(y[ue], {
  get(e, t) {
    return y[ue][t];
  }
});
new Proxy(y[ve], {
  get(e, t) {
    if (t === "value")
      return y[ve];
  }
});
function du(e) {
  const t = /* @__PURE__ */ new Map();
  return (e?.getRoutes() || []).filter((n) => !t.has(n.path) && t.set(n.path, 1));
}
function Vt(e) {
  return e.map((t) => {
    let { path: n, name: r, children: o, meta: i } = t;
    return o?.length && (o = Vt(o)), {
      path: n,
      name: r,
      children: o,
      meta: i
    };
  });
}
function pu$1(e) {
  if (e) {
    const { fullPath: t, hash: n, href: r, path: o, name: i, matched: s, params: a, query: u } = e;
    return {
      fullPath: t,
      hash: n,
      href: r,
      path: o,
      name: i,
      params: a,
      query: u,
      matched: Vt(s)
    };
  }
  return e;
}
function hu(e, t) {
  function n() {
    var r;
    const o = (r = e.app) == null ? void 0 : r.config.globalProperties.$router, i = pu$1(o?.currentRoute.value), s = Vt(du(o)), a = console.warn;
    console.warn = () => {
    }, y[ue] = {
      currentRoute: i ? _n$1(i) : {},
      routes: _n$1(s)
    }, y[ve] = o, console.warn = a;
  }
  n(), uo$1.on.componentUpdated(ae$1(() => {
    var r;
    ((r = t.value) == null ? void 0 : r.app) === e.app && (n(), !k.highPerfModeEnabled && fe.hooks.callHook("routerInfoUpdated", { state: y[ue] }));
  }, 200));
}
function _u(e) {
  return {
    // get inspector tree
    async getInspectorTree(t) {
      const n = {
        ...t,
        app: F.value.app,
        rootNodes: []
      };
      return await new Promise((r) => {
        e.callHookWith(
          async (o) => {
            await Promise.all(o.map((i) => i(n))), r();
          },
          "getInspectorTree"
          /* GET_INSPECTOR_TREE */
        );
      }), n.rootNodes;
    },
    // get inspector state
    async getInspectorState(t) {
      const n = {
        ...t,
        app: F.value.app,
        state: null
      }, r = {
        currentTab: `custom-inspector:${t.inspectorId}`
      };
      return await new Promise((o) => {
        e.callHookWith(
          async (i) => {
            await Promise.all(i.map((s) => s(n, r))), o();
          },
          "getInspectorState"
          /* GET_INSPECTOR_STATE */
        );
      }), n.state;
    },
    // edit inspector state
    editInspectorState(t) {
      const n = new Ua(), r = {
        ...t,
        app: F.value.app,
        set: (o, i = t.path, s = t.state.value, a) => {
          n.set(o, i, s, a || n.createDefaultSetCallback(t.state));
        }
      };
      e.callHookWith(
        (o) => {
          o.forEach((i) => i(r));
        },
        "editInspectorState"
        /* EDIT_INSPECTOR_STATE */
      );
    },
    // send inspector state
    sendInspectorState(t) {
      const n = Re$1(t);
      e.callHook("sendInspectorState", { inspectorId: t, plugin: {
        descriptor: n.descriptor,
        setupFn: () => ({})
      } });
    },
    // inspect component inspector
    inspectComponentInspector() {
      return La();
    },
    // cancel inspect component inspector
    cancelInspectComponentInspector() {
      return Ra$1();
    },
    // get component render code
    getComponentRenderCode(t) {
      const n = _t(F.value, t);
      if (n)
        return typeof n?.type != "function" ? n.render.toString() : n.type.toString();
    },
    // scroll to component
    scrollToComponent(t) {
      return Fa({ id: t });
    },
    // open in editor
    openInEditor: Za,
    // get vue inspector
    getVueInspector: Va$1,
    // toggle app
    toggleApp(t, n) {
      const r = We$1.value.find((o) => o.id === t);
      r && (Qa$1(t), Xa$1(r), hu(r, F), oo$1(), lo$1(r.app, n));
    },
    // inspect dom
    inspectDOM(t) {
      const n = _t(F.value, t);
      if (n) {
        const [r] = kt(n);
        r && (y.__VUE_DEVTOOLS_INSPECT_DOM_TARGET__ = r);
      }
    },
    updatePluginSettings(t, n, r) {
      tu(t, n, r);
    },
    getPluginSettings(t) {
      return {
        options: Ja(t),
        values: ao(t)
      };
    }
  };
}
m();
var Wn$1;
(Wn$1 = y).__VUE_DEVTOOLS_ENV__ != null || (Wn$1.__VUE_DEVTOOLS_ENV__ = {
  vitePluginDetected: false
});
var Yn = Ga(), qn$1;
(qn$1 = y).__VUE_DEVTOOLS_KIT_CONTEXT__ != null || (qn$1.__VUE_DEVTOOLS_KIT_CONTEXT__ = {
  hooks: Yn,
  get state() {
    return {
      ...k,
      activeAppRecordId: F.id,
      activeAppRecord: F.value,
      appRecords: We$1.value
    };
  },
  api: _u(Yn)
});
var fe = y.__VUE_DEVTOOLS_KIT_CONTEXT__;
m();
_a(ga$1());
var Qn;
(Qn = y).__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ != null || (Qn.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ = {
  id: 0,
  appIds: /* @__PURE__ */ new Set()
});
m();
m();
function mu$1(e) {
  k.highPerfModeEnabled = e ?? !k.highPerfModeEnabled, !e && F.value && lo$1(F.value.app);
}
m();
m();
m();
function gu$1(e) {
  k.devtoolsClientDetected = {
    ...k.devtoolsClientDetected,
    ...e
  };
  const t = Object.values(k.devtoolsClientDetected).some(Boolean);
  mu$1(!t);
}
var Jn;
(Jn = y).__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ != null || (Jn.__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ = gu$1);
m();
m();
m();
m();
m();
m();
m();
var Eu = class {
  constructor() {
    this.keyToValue = /* @__PURE__ */ new Map(), this.valueToKey = /* @__PURE__ */ new Map();
  }
  set(e, t) {
    this.keyToValue.set(e, t), this.valueToKey.set(t, e);
  }
  getByKey(e) {
    return this.keyToValue.get(e);
  }
  getByValue(e) {
    return this.valueToKey.get(e);
  }
  clear() {
    this.keyToValue.clear(), this.valueToKey.clear();
  }
}, co$1 = class co {
  constructor(e) {
    this.generateIdentifier = e, this.kv = new Eu();
  }
  register(e, t) {
    this.kv.getByValue(e) || (t || (t = this.generateIdentifier(e)), this.kv.set(t, e));
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(e) {
    return this.kv.getByValue(e);
  }
  getValue(e) {
    return this.kv.getByKey(e);
  }
}, vu = class extends co$1 {
  constructor() {
    super((e) => e.name), this.classToAllowedProps = /* @__PURE__ */ new Map();
  }
  register(e, t) {
    typeof t == "object" ? (t.allowProps && this.classToAllowedProps.set(e, t.allowProps), super.register(e, t.identifier)) : super.register(e, t);
  }
  getAllowedProps(e) {
    return this.classToAllowedProps.get(e);
  }
};
m();
m();
function yu(e) {
  if ("values" in Object)
    return Object.values(e);
  const t = [];
  for (const n in e)
    e.hasOwnProperty(n) && t.push(e[n]);
  return t;
}
function Cu(e, t) {
  const n = yu(e);
  if ("find" in n)
    return n.find(t);
  const r = n;
  for (let o = 0; o < r.length; o++) {
    const i = r[o];
    if (t(i))
      return i;
  }
}
function le$1(e, t) {
  Object.entries(e).forEach(([n, r]) => t(r, n));
}
function Le(e, t) {
  return e.indexOf(t) !== -1;
}
function tr(e, t) {
  for (let n = 0; n < e.length; n++) {
    const r = e[n];
    if (t(r))
      return r;
  }
}
var bu = class {
  constructor() {
    this.transfomers = {};
  }
  register(e) {
    this.transfomers[e.name] = e;
  }
  findApplicable(e) {
    return Cu(this.transfomers, (t) => t.isApplicable(e));
  }
  findByName(e) {
    return this.transfomers[e];
  }
};
m();
m();
var wu = (e) => Object.prototype.toString.call(e).slice(8, -1), fo = (e) => typeof e > "u", Au = (e) => e === null, ye = (e) => typeof e != "object" || e === null || e === Object.prototype ? false : Object.getPrototypeOf(e) === null ? true : Object.getPrototypeOf(e) === Object.prototype, vt = (e) => ye(e) && Object.keys(e).length === 0, G = (e) => Array.isArray(e), Tu = (e) => typeof e == "string", Ou = (e) => typeof e == "number" && !isNaN(e), Su = (e) => typeof e == "boolean", Pu = (e) => e instanceof RegExp, Ce = (e) => e instanceof Map, be$1 = (e) => e instanceof Set, po = (e) => wu(e) === "Symbol", Iu$1 = (e) => e instanceof Date && !isNaN(e.valueOf()), Du = (e) => e instanceof Error, nr$1 = (e) => typeof e == "number" && isNaN(e), ku = (e) => Su(e) || Au(e) || fo(e) || Ou(e) || Tu(e) || po(e), xu$1 = (e) => typeof e == "bigint", Ru = (e) => e === 1 / 0 || e === -1 / 0, Lu = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), Fu = (e) => e instanceof URL;
m();
var ho = (e) => e.replace(/\./g, "\\."), rt = (e) => e.map(String).map(ho).join("."), ge = (e) => {
  const t = [];
  let n = "";
  for (let o = 0; o < e.length; o++) {
    let i = e.charAt(o);
    if (i === "\\" && e.charAt(o + 1) === ".") {
      n += ".", o++;
      continue;
    }
    if (i === ".") {
      t.push(n), n = "";
      continue;
    }
    n += i;
  }
  const r = n;
  return t.push(r), t;
};
m();
function j(e, t, n, r) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: r
  };
}
var _o = [
  j(fo, "undefined", () => null, () => {
  }),
  j(xu$1, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : (console.error("Please add a BigInt polyfill."), e)),
  j(Iu$1, "Date", (e) => e.toISOString(), (e) => new Date(e)),
  j(Du, "Error", (e, t) => {
    const n = {
      name: e.name,
      message: e.message
    };
    return t.allowedErrorProps.forEach((r) => {
      n[r] = e[r];
    }), n;
  }, (e, t) => {
    const n = new Error(e.message);
    return n.name = e.name, n.stack = e.stack, t.allowedErrorProps.forEach((r) => {
      n[r] = e[r];
    }), n;
  }),
  j(Pu, "regexp", (e) => "" + e, (e) => {
    const t = e.slice(1, e.lastIndexOf("/")), n = e.slice(e.lastIndexOf("/") + 1);
    return new RegExp(t, n);
  }),
  j(
    be$1,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (e) => [...e.values()],
    (e) => new Set(e)
  ),
  j(Ce, "map", (e) => [...e.entries()], (e) => new Map(e)),
  j((e) => nr$1(e) || Ru(e), "number", (e) => nr$1(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
  j((e) => e === 0 && 1 / e === -1 / 0, "number", () => "-0", Number),
  j(Fu, "URL", (e) => e.toString(), (e) => new URL(e))
];
function Ge(e, t, n, r) {
  return {
    isApplicable: e,
    annotation: t,
    transform: n,
    untransform: r
  };
}
var mo = Ge((e, t) => po(e) ? !!t.symbolRegistry.getIdentifier(e) : false, (e, t) => ["symbol", t.symbolRegistry.getIdentifier(e)], (e) => e.description, (e, t, n) => {
  const r = n.symbolRegistry.getValue(t[1]);
  if (!r)
    throw new Error("Trying to deserialize unknown symbol");
  return r;
}), Mu = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((e, t) => (e[t.name] = t, e), {}), go = Ge(Lu, (e) => ["typed-array", e.constructor.name], (e) => [...e], (e, t) => {
  const n = Mu[t[1]];
  if (!n)
    throw new Error("Trying to deserialize unknown typed array");
  return new n(e);
});
function Eo$1(e, t) {
  return e?.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : false;
}
var vo = Ge(Eo$1, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
  const n = t.classRegistry.getAllowedProps(e.constructor);
  if (!n)
    return { ...e };
  const r = {};
  return n.forEach((o) => {
    r[o] = e[o];
  }), r;
}, (e, t, n) => {
  const r = n.classRegistry.getValue(t[1]);
  if (!r)
    throw new Error(`Trying to deserialize unknown class '${t[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  return Object.assign(Object.create(r.prototype), e);
}), yo = Ge((e, t) => !!t.customTransformerRegistry.findApplicable(e), (e, t) => ["custom", t.customTransformerRegistry.findApplicable(e).name], (e, t) => t.customTransformerRegistry.findApplicable(e).serialize(e), (e, t, n) => {
  const r = n.customTransformerRegistry.findByName(t[1]);
  if (!r)
    throw new Error("Trying to deserialize unknown custom value");
  return r.deserialize(e);
}), Nu = [vo, mo, yo, go], rr = (e, t) => {
  const n = tr(Nu, (o) => o.isApplicable(e, t));
  if (n)
    return {
      value: n.transform(e, t),
      type: n.annotation(e, t)
    };
  const r = tr(_o, (o) => o.isApplicable(e, t));
  if (r)
    return {
      value: r.transform(e, t),
      type: r.annotation
    };
}, Co$1 = {};
_o.forEach((e) => {
  Co$1[e.annotation] = e;
});
var Vu = (e, t, n) => {
  if (G(t))
    switch (t[0]) {
      case "symbol":
        return mo.untransform(e, t, n);
      case "class":
        return vo.untransform(e, t, n);
      case "custom":
        return yo.untransform(e, t, n);
      case "typed-array":
        return go.untransform(e, t, n);
      default:
        throw new Error("Unknown transformation: " + t);
    }
  else {
    const r = Co$1[t];
    if (!r)
      throw new Error("Unknown transformation: " + t);
    return r.untransform(e, n);
  }
};
m();
var oe = (e, t) => {
  if (t > e.size)
    throw new Error("index out of bounds");
  const n = e.keys();
  for (; t > 0; )
    n.next(), t--;
  return n.next().value;
};
function bo(e) {
  if (Le(e, "__proto__"))
    throw new Error("__proto__ is not allowed as a property");
  if (Le(e, "prototype"))
    throw new Error("prototype is not allowed as a property");
  if (Le(e, "constructor"))
    throw new Error("constructor is not allowed as a property");
}
var Bu = (e, t) => {
  bo(t);
  for (let n = 0; n < t.length; n++) {
    const r = t[n];
    if (be$1(e))
      e = oe(e, +r);
    else if (Ce(e)) {
      const o = +r, i = +t[++n] == 0 ? "key" : "value", s = oe(e, o);
      switch (i) {
        case "key":
          e = s;
          break;
        case "value":
          e = e.get(s);
          break;
      }
    } else
      e = e[r];
  }
  return e;
}, yt$1 = (e, t, n) => {
  if (bo(t), t.length === 0)
    return n(e);
  let r = e;
  for (let i = 0; i < t.length - 1; i++) {
    const s = t[i];
    if (G(r)) {
      const a = +s;
      r = r[a];
    } else if (ye(r))
      r = r[s];
    else if (be$1(r)) {
      const a = +s;
      r = oe(r, a);
    } else if (Ce(r)) {
      if (i === t.length - 2)
        break;
      const u = +s, l = +t[++i] == 0 ? "key" : "value", c = oe(r, u);
      switch (l) {
        case "key":
          r = c;
          break;
        case "value":
          r = r.get(c);
          break;
      }
    }
  }
  const o = t[t.length - 1];
  if (G(r) ? r[+o] = n(r[+o]) : ye(r) && (r[o] = n(r[o])), be$1(r)) {
    const i = oe(r, +o), s = n(i);
    i !== s && (r.delete(i), r.add(s));
  }
  if (Ce(r)) {
    const i = +t[t.length - 2], s = oe(r, i);
    switch (+o == 0 ? "key" : "value") {
      case "key": {
        const u = n(s);
        r.set(u, r.get(s)), u !== s && r.delete(s);
        break;
      }
      case "value": {
        r.set(s, n(r.get(s)));
        break;
      }
    }
  }
  return e;
};
function Ct(e, t, n = []) {
  if (!e)
    return;
  if (!G(e)) {
    le$1(e, (i, s) => Ct(i, t, [...n, ...ge(s)]));
    return;
  }
  const [r, o] = e;
  o && le$1(o, (i, s) => {
    Ct(i, t, [...n, ...ge(s)]);
  }), t(r, n);
}
function Uu(e, t, n) {
  return Ct(t, (r, o) => {
    e = yt$1(e, o, (i) => Vu(i, r, n));
  }), e;
}
function Hu(e, t) {
  function n(r, o) {
    const i = Bu(e, ge(o));
    r.map(ge).forEach((s) => {
      e = yt$1(e, s, () => i);
    });
  }
  if (G(t)) {
    const [r, o] = t;
    r.forEach((i) => {
      e = yt$1(e, ge(i), () => e);
    }), o && le$1(o, n);
  } else
    le$1(t, n);
  return e;
}
var ju = (e, t) => ye(e) || G(e) || Ce(e) || be$1(e) || Eo$1(e, t);
function zu(e, t, n) {
  const r = n.get(e);
  r ? r.push(t) : n.set(e, [t]);
}
function $u(e, t) {
  const n = {};
  let r;
  return e.forEach((o) => {
    if (o.length <= 1)
      return;
    t || (o = o.map((a) => a.map(String)).sort((a, u) => a.length - u.length));
    const [i, ...s] = o;
    i.length === 0 ? r = s.map(rt) : n[rt(i)] = s.map(rt);
  }), r ? vt(n) ? [r] : [r, n] : vt(n) ? void 0 : n;
}
var wo = (e, t, n, r, o = [], i = [], s = /* @__PURE__ */ new Map()) => {
  var a;
  const u = ku(e);
  if (!u) {
    zu(e, o, t);
    const _ = s.get(e);
    if (_)
      return r ? {
        transformedValue: null
      } : _;
  }
  if (!ju(e, n)) {
    const _ = rr(e, n), v = _ ? {
      transformedValue: _.value,
      annotations: [_.type]
    } : {
      transformedValue: e
    };
    return u || s.set(e, v), v;
  }
  if (Le(i, e))
    return {
      transformedValue: null
    };
  const l = rr(e, n), c = (a = l?.value) != null ? a : e, f = G(c) ? [] : {}, h = {};
  le$1(c, (_, v) => {
    if (v === "__proto__" || v === "constructor" || v === "prototype")
      throw new Error(`Detected property ${v}. This is a prototype pollution risk, please remove it from your object.`);
    const p = wo(_, t, n, r, [...o, v], [...i, e], s);
    f[v] = p.transformedValue, G(p.annotations) ? h[v] = p.annotations : ye(p.annotations) && le$1(p.annotations, (g, C) => {
      h[ho(v) + "." + C] = g;
    });
  });
  const d = vt(h) ? {
    transformedValue: f,
    annotations: l ? [l.type] : void 0
  } : {
    transformedValue: f,
    annotations: l ? [l.type, h] : h
  };
  return u || s.set(e, d), d;
};
m();
m();
function Ao$1(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function or$1(e) {
  return Ao$1(e) === "Array";
}
function Ku(e) {
  if (Ao$1(e) !== "Object")
    return false;
  const t = Object.getPrototypeOf(e);
  return !!t && t.constructor === Object && t === Object.prototype;
}
function Wu(e, t, n, r, o) {
  const i = {}.propertyIsEnumerable.call(r, t) ? "enumerable" : "nonenumerable";
  i === "enumerable" && (e[t] = n), o && i === "nonenumerable" && Object.defineProperty(e, t, {
    value: n,
    enumerable: false,
    writable: true,
    configurable: true
  });
}
function bt$1(e, t = {}) {
  if (or$1(e))
    return e.map((o) => bt$1(o, t));
  if (!Ku(e))
    return e;
  const n = Object.getOwnPropertyNames(e), r = Object.getOwnPropertySymbols(e);
  return [...n, ...r].reduce((o, i) => {
    if (or$1(t.props) && !t.props.includes(i))
      return o;
    const s = e[i], a = bt$1(s, t);
    return Wu(o, i, a, e, t.nonenumerable), o;
  }, {});
}
var S = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe: e = false } = {}) {
    this.classRegistry = new vu(), this.symbolRegistry = new co$1((t) => {
      var n;
      return (n = t.description) != null ? n : "";
    }), this.customTransformerRegistry = new bu(), this.allowedErrorProps = [], this.dedupe = e;
  }
  serialize(e) {
    const t = /* @__PURE__ */ new Map(), n = wo(e, t, this, this.dedupe), r = {
      json: n.transformedValue
    };
    n.annotations && (r.meta = {
      ...r.meta,
      values: n.annotations
    });
    const o = $u(t, this.dedupe);
    return o && (r.meta = {
      ...r.meta,
      referentialEqualities: o
    }), r;
  }
  deserialize(e) {
    const { json: t, meta: n } = e;
    let r = bt$1(t);
    return n?.values && (r = Uu(r, n.values, this)), n?.referentialEqualities && (r = Hu(r, n.referentialEqualities)), r;
  }
  stringify(e) {
    return JSON.stringify(this.serialize(e));
  }
  parse(e) {
    return this.deserialize(JSON.parse(e));
  }
  registerClass(e, t) {
    this.classRegistry.register(e, t);
  }
  registerSymbol(e, t) {
    this.symbolRegistry.register(e, t);
  }
  registerCustom(e, t) {
    this.customTransformerRegistry.register({
      name: t,
      ...e
    });
  }
  allowErrorProps(...e) {
    this.allowedErrorProps.push(...e);
  }
};
S.defaultInstance = new S();
S.serialize = S.defaultInstance.serialize.bind(S.defaultInstance);
S.deserialize = S.defaultInstance.deserialize.bind(S.defaultInstance);
S.stringify = S.defaultInstance.stringify.bind(S.defaultInstance);
S.parse = S.defaultInstance.parse.bind(S.defaultInstance);
S.registerClass = S.defaultInstance.registerClass.bind(S.defaultInstance);
S.registerSymbol = S.defaultInstance.registerSymbol.bind(S.defaultInstance);
S.registerCustom = S.defaultInstance.registerCustom.bind(S.defaultInstance);
S.allowErrorProps = S.defaultInstance.allowErrorProps.bind(S.defaultInstance);
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
m();
var ir$1;
(ir$1 = y).__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ != null || (ir$1.__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ = []);
var ar;
(ar = y).__VUE_DEVTOOLS_KIT_RPC_CLIENT__ != null || (ar.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ = null);
var lr$1;
(lr$1 = y).__VUE_DEVTOOLS_KIT_RPC_SERVER__ != null || (lr$1.__VUE_DEVTOOLS_KIT_RPC_SERVER__ = null);
var fr;
(fr = y).__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ != null || (fr.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ = null);
var pr$1;
(pr$1 = y).__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ != null || (pr$1.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ = null);
var _r$1;
(_r$1 = y).__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ != null || (_r$1.__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ = null);
m();
m();
m();
m();
m();
m();
m();
const rl = ["data-scene", "data-tres"], ol = /* @__PURE__ */ defineComponent({
  __name: "TresCanvas",
  props: {
    camera: {},
    windowSize: { type: Boolean, default: void 0 },
    enableProvideBridge: { type: Boolean, default: true },
    antialias: { type: Boolean, default: true },
    stencil: { type: Boolean, default: void 0 },
    depth: { type: Boolean, default: void 0 },
    precision: {},
    logarithmicDepthBuffer: { type: Boolean, default: void 0 },
    preserveDrawingBuffer: { type: Boolean, default: void 0 },
    powerPreference: {},
    alpha: { type: Boolean, default: void 0 },
    premultipliedAlpha: { type: Boolean },
    failIfMajorPerformanceCaveat: { type: Boolean, default: void 0 },
    clearColor: { default: "#000000" },
    clearAlpha: { default: 1 },
    shadows: { type: Boolean, default: void 0 },
    toneMapping: { default: ACESFilmicToneMapping },
    shadowMapType: { default: PCFSoftShadowMap },
    useLegacyLights: { type: Boolean, default: void 0 },
    outputColorSpace: {},
    toneMappingExposure: {},
    renderMode: { default: "always" },
    dpr: {},
    renderer: {}
  },
  emits: ["ready", "pointermissed", "render", "beforeLoop", "loop", "click", "contextmenu", "pointermove", "pointerenter", "pointerleave", "pointerover", "pointerout", "dblclick", "pointerdown", "pointerup", "pointercancel", "lostpointercapture", "wheel"],
  setup(e, { expose: t, emit: n }) {
    useSlots();
    const s = ref(), a = shallowRef(new Scene());
    getCurrentInstance();
    pt$1(Ki);
    const f = (_, v = false) => {
      Ne(_.scene.value), v && (_.renderer.instance.dispose(), _.renderer.instance instanceof WebGLRenderer && (_.renderer.instance.renderLists.dispose(), _.renderer.instance.forceContextLoss())), a.value.__tres = {
        root: _
      };
    }, h$1 = shallowRef(null);
    t({ context: h$1, dispose: () => f(h$1.value, true) });
    return (_, v) => (openBlock(), createElementBlock("canvas", {
      ref_key: "canvasRef",
      ref: s,
      "data-scene": a.value.uuid,
      class: normalizeClass(_.$attrs.class),
      "data-tres": `tresjs ${unref(Fi).version}`,
      style: normalizeStyle({
        display: "block",
        width: "100%",
        height: "100%",
        position: e.windowSize ? "fixed" : "relative",
        top: 0,
        left: 0,
        pointerEvents: "auto",
        touchAction: "none",
        ..._.$attrs.style
      })
    }, null, 14, rl));
  }
});
function mh(a) {
  return getCurrentScope() ? (onScopeDispose(a), true) : false;
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Nb = Object.prototype.toString, Pb = (a) => Nb.call(a) === "[object Object]";
function hl(a) {
  return Array.isArray(a) ? a : [a];
}
function Ob(a, e, t) {
  return watch(
    a,
    e,
    {
      ...t,
      immediate: true
    }
  );
}
const ln = void 0;
function Rn(a) {
  var e;
  const t = toValue(a);
  return (e = t?.$el) != null ? e : t;
}
function Et(...a) {
  const e = [], t = () => {
    e.forEach((o) => o()), e.length = 0;
  }, s = (o, l, c, u) => (o.addEventListener(l, c, u), () => o.removeEventListener(l, c, u)), i = computed(() => {
    const o = hl(toValue(a[0])).filter((l) => l != null);
    return o.every((l) => typeof l != "string") ? o : void 0;
  }), n = Ob(
    () => {
      var o, l;
      return [
        (l = (o = i.value) == null ? void 0 : o.map((c) => Rn(c))) != null ? l : [ln].filter((c) => c != null),
        hl(toValue(i.value ? a[1] : a[0])),
        hl(unref(i.value ? a[2] : a[1])),
        // @ts-expect-error - TypeScript gets the correct types, but somehow still complains
        toValue(i.value ? a[3] : a[2])
      ];
    },
    ([o, l, c, u]) => {
      if (t(), !o?.length || !l?.length || !c?.length)
        return;
      const h = Pb(u) ? { ...u } : u;
      e.push(
        ...o.flatMap(
          (f) => l.flatMap(
            (d) => c.map((p) => s(f, d, p, h))
          )
        )
      );
    },
    { flush: "post" }
  ), r = () => {
    n(), t();
  };
  return mh(t), r;
}
defineComponent({
  name: "GlobalAudio",
  props: [
    "src",
    "loop",
    "volume",
    "playbackRate",
    "playTrigger",
    "stopTrigger"
  ],
  async setup(a, { expose: e, emit: t }) {
    const { camera: s, renderer: i } = zr(), n = new AudioListener();
    s.activeCamera.value?.add(n);
    const r = new Audio(n), o = new AudioLoader();
    e({ instance: r }), watch(() => [a.playbackRate], () => r.setPlaybackRate(a.playbackRate ?? 1), { immediate: true }), watch(() => [a.volume], () => r.setVolume(a.volume ?? 0.5), { immediate: true }), watch(() => [a.loop], () => r.setLoop(a.loop ?? false), { immediate: true }), watch(() => [a.src], async () => {
      const h = await o.loadAsync(a.src);
      r.setBuffer(h);
    }, { immediate: true });
    const c = (void 0).getElementById(a.playTrigger ?? "") || i.instance.domElement;
    Et(c, "click", () => {
      r.isPlaying ? r.pause() : r.play(), t("isPlaying", r.isPlaying);
    });
    const u = (void 0).getElementById(a.stopTrigger ?? "");
    return u && Et(u, "click", () => {
      r.stop(), t("isPlaying", r.isPlaying);
    }), null;
  }
});
function gh(a, e, t, s) {
  const i = class extends ShaderMaterial {
    key = "";
    constructor(n = {}) {
      const r = Object.entries(a);
      super({
        uniforms: r.reduce((o, [l, c]) => {
          const u = UniformsUtils.clone({ [l]: { value: c } });
          return {
            ...o,
            ...u
          };
        }, {}),
        vertexShader: e,
        fragmentShader: t
      }), r.forEach(
        ([o]) => Object.defineProperty(this, o, {
          get: () => this.uniforms[o].value,
          set: (l) => this.uniforms[o].value = l
        })
      ), Object.assign(this, n);
    }
  };
  return i.key = MathUtils.generateUUID(), i;
}
gh(
  {
    color: /* @__PURE__ */ new Color("white"),
    scale: /* @__PURE__ */ new Vector2(1, 1),
    imageBounds: /* @__PURE__ */ new Vector2(1, 1),
    resolution: 1024,
    map: null,
    zoom: 1,
    radius: 0,
    grayscale: 0,
    opacity: 1
  },
  /* glsl */
  `
    varying vec2 vUv;
    varying vec2 vPos;
    void main() {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
      vUv = uv;
      vPos = position.xy;
    }
  `,
  /* glsl */
  `
    // mostly from https://gist.github.com/statico/df64c5d167362ecf7b34fca0b1459a44
    varying vec2 vUv;
    varying vec2 vPos;
    uniform vec2 scale;
    uniform vec2 imageBounds;
    uniform float resolution;
    uniform vec3 color;
    uniform sampler2D map;
    uniform float radius;
    uniform float zoom;
    uniform float grayscale;
    uniform float opacity;
    const vec3 luma = vec3(.299, 0.587, 0.114);
    vec4 toGrayscale(vec4 color, float intensity) {
      return vec4(mix(color.rgb, vec3(dot(color.rgb, luma)), intensity), color.a);
    }
    vec2 aspect(vec2 size) {
      return size / min(size.x, size.y);
    }
    
    const float PI = 3.14159265;
      
    // from https://iquilezles.org/articles/distfunctions
    float udRoundBox( vec2 p, vec2 b, float r ) {
      return length(max(abs(p)-b+r,0.0))-r;
    }
  
    void main() {
      vec2 s = aspect(scale);
      vec2 i = aspect(imageBounds);
      float rs = s.x / s.y;
      float ri = i.x / i.y;
      vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
      vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2.0, 0.0) : vec2(0.0, (new.y - s.y) / 2.0)) / new;
      vec2 uv = vUv * s / new + offset;
      vec2 zUv = (uv - vec2(0.5, 0.5)) / zoom + vec2(0.5, 0.5);
  
      vec2 res = vec2(scale * resolution);
      vec2 halfRes = 0.5 * res;
      float b = udRoundBox(vUv.xy * res - halfRes, halfRes, resolution * radius);    
        vec3 a = mix(vec3(1.0,0.0,0.0), vec3(0.0,0.0,0.0), smoothstep(0.0, 1.0, b));
      gl_FragColor = toGrayscale(texture2D(map, zUv) * vec4(color, opacity * a), grayscale);
      
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `
);
(function() {
  const a = new BufferGeometry(), e = new Float32Array([
    -1,
    -1,
    0,
    0,
    0,
    1,
    -1,
    0,
    1,
    0,
    1,
    1,
    0,
    1,
    1,
    -1,
    1,
    0,
    0,
    1
  ]), t = new InterleavedBuffer(e, 5);
  return a.setIndex([0, 1, 2, 0, 2, 3]), a.setAttribute("position", new InterleavedBufferAttribute(t, 3, 0, false)), a.setAttribute("uv", new InterleavedBufferAttribute(t, 2, 3, false)), a;
})();
MathUtils.clamp;
MathUtils.lerp;
const lo = parseInt(REVISION.replace(/\D+/g, ""));
function gg(a, e) {
  if (e === TrianglesDrawMode)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), a;
  if (e === TriangleFanDrawMode || e === TriangleStripDrawMode) {
    let t = a.getIndex();
    if (t === null) {
      const r = [], o = a.getAttribute("position");
      if (o !== void 0) {
        for (let l = 0; l < o.count; l++)
          r.push(l);
        a.setIndex(r), t = a.getIndex();
      } else
        return console.error(
          "THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."
        ), a;
    }
    const s = t.count - 2, i = [];
    if (t)
      if (e === TriangleFanDrawMode)
        for (let r = 1; r <= s; r++)
          i.push(t.getX(0)), i.push(t.getX(r)), i.push(t.getX(r + 1));
      else
        for (let r = 0; r < s; r++)
          r % 2 === 0 ? (i.push(t.getX(r)), i.push(t.getX(r + 1)), i.push(t.getX(r + 2))) : (i.push(t.getX(r + 2)), i.push(t.getX(r + 1)), i.push(t.getX(r)));
    i.length / 3 !== s && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const n = a.clone();
    return n.setIndex(i), n.clearGroups(), n;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", e), a;
}
var li = Uint8Array, lr = Uint16Array, Qf = Uint32Array, nx = new li([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  /* unused */
  0,
  0,
  /* impossible */
  0
]), rx = new li([
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13,
  /* unused */
  0,
  0
]), ox = function(a, e) {
  for (var t = new lr(31), s = 0; s < 31; ++s)
    t[s] = e += 1 << a[s - 1];
  for (var i = new Qf(t[30]), s = 1; s < 30; ++s)
    for (var n = t[s]; n < t[s + 1]; ++n)
      i[n] = n - t[s] << 5 | s;
  return [t, i];
}, ax = ox(nx, 2), lx = ax[0], qw = ax[1];
lx[28] = 258, qw[258] = 28;
ox(rx, 0);
var Jf = new lr(32768);
for (var Ft = 0; Ft < 32768; ++Ft) {
  var Wn = (Ft & 43690) >>> 1 | (Ft & 21845) << 1;
  Wn = (Wn & 52428) >>> 2 | (Wn & 13107) << 2, Wn = (Wn & 61680) >>> 4 | (Wn & 3855) << 4, Jf[Ft] = ((Wn & 65280) >>> 8 | (Wn & 255) << 8) >>> 1;
}
var Hl = new li(288);
for (var Ft = 0; Ft < 144; ++Ft)
  Hl[Ft] = 8;
for (var Ft = 144; Ft < 256; ++Ft)
  Hl[Ft] = 9;
for (var Ft = 256; Ft < 280; ++Ft)
  Hl[Ft] = 7;
for (var Ft = 280; Ft < 288; ++Ft)
  Hl[Ft] = 8;
var cx = new li(32);
for (var Ft = 0; Ft < 32; ++Ft)
  cx[Ft] = 5;
var tS = /* @__PURE__ */ new li(0);
var nS = typeof TextDecoder < "u" && /* @__PURE__ */ new TextDecoder(), rS = 0;
try {
  nS.decode(tS, { stream: true }), rS = 1;
} catch {
}
var oS = Object.defineProperty, aS = (a, e, t) => e in a ? oS(a, e, { enumerable: true, configurable: true, writable: true, value: t }) : a[e] = t, lS = (a, e, t) => (aS(a, e + "", t), t);
const Sg = /* @__PURE__ */ (() => {
  const a = class extends Mesh {
    constructor(t, s = {}) {
      super(t), this.isReflector = true, this.type = "Reflector", this.camera = new PerspectiveCamera();
      const i = this, n = s.color !== void 0 ? new Color(s.color) : new Color(8355711), r = s.textureWidth || 512, o = s.textureHeight || 512, l = s.clipBias || 0, c = s.shader || a.ReflectorShader, u = s.multisample !== void 0 ? s.multisample : 4, h = new Plane(), f = new Vector3(), d = new Vector3(), p = new Vector3(), m3 = new Matrix4(), g = new Vector3(0, 0, -1), y3 = new Vector4(), x = new Vector3(), v = new Vector3(), w = new Vector4(), A = new Matrix4(), b = this.camera, M = new WebGLRenderTarget(r, o, {
        samples: u,
        type: HalfFloatType
      }), _ = new ShaderMaterial({
        uniforms: UniformsUtils.clone(c.uniforms),
        fragmentShader: c.fragmentShader,
        vertexShader: c.vertexShader
      });
      _.uniforms.tDiffuse.value = M.texture, _.uniforms.color.value = n, _.uniforms.textureMatrix.value = A, this.material = _, this.onBeforeRender = function(T, S3, E) {
        if (d.setFromMatrixPosition(i.matrixWorld), p.setFromMatrixPosition(E.matrixWorld), m3.extractRotation(i.matrixWorld), f.set(0, 0, 1), f.applyMatrix4(m3), x.subVectors(d, p), x.dot(f) > 0)
          return;
        x.reflect(f).negate(), x.add(d), m3.extractRotation(E.matrixWorld), g.set(0, 0, -1), g.applyMatrix4(m3), g.add(p), v.subVectors(d, g), v.reflect(f).negate(), v.add(d), b.position.copy(x), b.up.set(0, 1, 0), b.up.applyMatrix4(m3), b.up.reflect(f), b.lookAt(v), b.far = E.far, b.updateMatrixWorld(), b.projectionMatrix.copy(E.projectionMatrix), A.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1), A.multiply(b.projectionMatrix), A.multiply(b.matrixWorldInverse), A.multiply(i.matrixWorld), h.setFromNormalAndCoplanarPoint(f, d), h.applyMatrix4(b.matrixWorldInverse), y3.set(
          h.normal.x,
          h.normal.y,
          h.normal.z,
          h.constant
        );
        const C = b.projectionMatrix;
        w.x = (Math.sign(y3.x) + C.elements[8]) / C.elements[0], w.y = (Math.sign(y3.y) + C.elements[9]) / C.elements[5], w.z = -1, w.w = (1 + C.elements[10]) / C.elements[14], y3.multiplyScalar(2 / y3.dot(w)), C.elements[2] = y3.x, C.elements[6] = y3.y, C.elements[10] = y3.z + 1 - l, C.elements[14] = y3.w, i.visible = false;
        const B3 = T.getRenderTarget(), D = T.xr.enabled, G3 = T.shadowMap.autoUpdate, O = T.toneMapping;
        let ce2 = false;
        "outputColorSpace" in T ? ce2 = T.outputColorSpace === "srgb" : ce2 = T.outputEncoding === 3001, T.xr.enabled = false, T.shadowMap.autoUpdate = false, "outputColorSpace" in T ? T.outputColorSpace = "srgb-linear" : T.outputEncoding = 3e3, T.toneMapping = NoToneMapping, T.setRenderTarget(M), T.state.buffers.depth.setMask(true), T.autoClear === false && T.clear(), T.render(S3, b), T.xr.enabled = D, T.shadowMap.autoUpdate = G3, T.toneMapping = O, "outputColorSpace" in T ? T.outputColorSpace = ce2 ? "srgb" : "srgb-linear" : T.outputEncoding = ce2 ? 3001 : 3e3, T.setRenderTarget(B3);
        const te = E.viewport;
        te !== void 0 && T.state.viewport(te), i.visible = true;
      }, this.getRenderTarget = function() {
        return M;
      }, this.dispose = function() {
        M.dispose(), i.material.dispose();
      };
    }
  };
  let e = a;
  return lS(e, "ReflectorShader", {
    uniforms: {
      color: {
        value: null
      },
      tDiffuse: {
        value: null
      },
      textureMatrix: {
        value: null
      }
    },
    vertexShader: (
      /* glsl */
      `
		uniform mat4 textureMatrix;
		varying vec4 vUv;

		#include <common>
		#include <logdepthbuf_pars_vertex>

		void main() {

			vUv = textureMatrix * vec4( position, 1.0 );

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			#include <logdepthbuf_vertex>

		}`
    ),
    fragmentShader: (
      /* glsl */
      `
		uniform vec3 color;
		uniform sampler2D tDiffuse;
		varying vec4 vUv;

		#include <logdepthbuf_pars_fragment>

		float blendOverlay( float base, float blend ) {

			return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );

		}

		vec3 blendOverlay( vec3 base, vec3 blend ) {

			return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );

		}

		void main() {

			#include <logdepthbuf_fragment>

			vec4 base = texture2DProj( tDiffuse, vUv );
			gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );

			#include <tonemapping_fragment>
			#include <${lo >= 154 ? "colorspace_fragment" : "encodings_fragment"}>

		}`
    )
  }), e;
})();
function da(a) {
  if (typeof TextDecoder < "u")
    return new TextDecoder().decode(a);
  let e = "";
  for (let t = 0, s = a.length; t < s; t++)
    e += String.fromCharCode(a[t]);
  try {
    return decodeURIComponent(escape(e));
  } catch {
    return e;
  }
}
const Yr = "srgb", Cn = "srgb-linear", Ng = 3001, BS = 3e3;
class Pg extends Loader {
  constructor(e) {
    super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new US(t);
    }), this.register(function(t) {
      return new kS(t);
    }), this.register(function(t) {
      return new XS(t);
    }), this.register(function(t) {
      return new YS(t);
    }), this.register(function(t) {
      return new KS(t);
    }), this.register(function(t) {
      return new GS(t);
    }), this.register(function(t) {
      return new VS(t);
    }), this.register(function(t) {
      return new HS(t);
    }), this.register(function(t) {
      return new $S(t);
    }), this.register(function(t) {
      return new OS(t);
    }), this.register(function(t) {
      return new WS(t);
    }), this.register(function(t) {
      return new zS(t);
    }), this.register(function(t) {
      return new qS(t);
    }), this.register(function(t) {
      return new jS(t);
    }), this.register(function(t) {
      return new DS(t);
    }), this.register(function(t) {
      return new ZS(t);
    }), this.register(function(t) {
      return new QS(t);
    });
  }
  load(e, t, s, i) {
    const n = this;
    let r;
    if (this.resourcePath !== "")
      r = this.resourcePath;
    else if (this.path !== "") {
      const c = LoaderUtils.extractUrlBase(e);
      r = LoaderUtils.resolveURL(c, this.path);
    } else
      r = LoaderUtils.extractUrlBase(e);
    this.manager.itemStart(e);
    const o = function(c) {
      i ? i(c) : console.error(c), n.manager.itemError(e), n.manager.itemEnd(e);
    }, l = new FileLoader(this.manager);
    l.setPath(this.path), l.setResponseType("arraybuffer"), l.setRequestHeader(this.requestHeader), l.setWithCredentials(this.withCredentials), l.load(
      e,
      function(c) {
        try {
          n.parse(
            c,
            r,
            function(u) {
              t(u), n.manager.itemEnd(e);
            },
            o
          );
        } catch (u) {
          o(u);
        }
      },
      s,
      o
    );
  }
  setDRACOLoader(e) {
    return this.dracoLoader = e, this;
  }
  setDDSLoader() {
    throw new Error('THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".');
  }
  setKTX2Loader(e) {
    return this.ktx2Loader = e, this;
  }
  setMeshoptDecoder(e) {
    return this.meshoptDecoder = e, this;
  }
  register(e) {
    return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
  }
  unregister(e) {
    return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
  }
  parse(e, t, s, i) {
    let n;
    const r = {}, o = {};
    if (typeof e == "string")
      n = JSON.parse(e);
    else if (e instanceof ArrayBuffer)
      if (da(new Uint8Array(e.slice(0, 4))) === fx) {
        try {
          r[nt.KHR_BINARY_GLTF] = new JS(e);
        } catch (u) {
          i && i(u);
          return;
        }
        n = JSON.parse(r[nt.KHR_BINARY_GLTF].content);
      } else
        n = JSON.parse(da(new Uint8Array(e)));
    else
      n = e;
    if (n.asset === void 0 || n.asset.version[0] < 2) {
      i && i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const l = new dM(n, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    l.fileLoader.setRequestHeader(this.requestHeader);
    for (let c = 0; c < this.pluginCallbacks.length; c++) {
      const u = this.pluginCallbacks[c](l);
      u.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[u.name] = u, r[u.name] = true;
    }
    if (n.extensionsUsed)
      for (let c = 0; c < n.extensionsUsed.length; ++c) {
        const u = n.extensionsUsed[c], h = n.extensionsRequired || [];
        switch (u) {
          case nt.KHR_MATERIALS_UNLIT:
            r[u] = new LS();
            break;
          case nt.KHR_DRACO_MESH_COMPRESSION:
            r[u] = new eM(n, this.dracoLoader);
            break;
          case nt.KHR_TEXTURE_TRANSFORM:
            r[u] = new tM();
            break;
          case nt.KHR_MESH_QUANTIZATION:
            r[u] = new sM();
            break;
          default:
            h.indexOf(u) >= 0 && o[u] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + u + '".');
        }
      }
    l.setExtensions(r), l.setPlugins(o), l.parse(s, i);
  }
  parseAsync(e, t) {
    const s = this;
    return new Promise(function(i, n) {
      s.parse(e, t, i, n);
    });
  }
}
function FS() {
  let a = {};
  return {
    get: function(e) {
      return a[e];
    },
    add: function(e, t) {
      a[e] = t;
    },
    remove: function(e) {
      delete a[e];
    },
    removeAll: function() {
      a = {};
    }
  };
}
const nt = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_MATERIALS_BUMP: "EXT_materials_bump",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_TEXTURE_AVIF: "EXT_texture_avif",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class DS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const e = this.parser, t = this.parser.json.nodes || [];
    for (let s = 0, i = t.length; s < i; s++) {
      const n = t[s];
      n.extensions && n.extensions[this.name] && n.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, n.extensions[this.name].light);
    }
  }
  _loadLight(e) {
    const t = this.parser, s = "light:" + e;
    let i = t.cache.get(s);
    if (i)
      return i;
    const n = t.json, l = ((n.extensions && n.extensions[this.name] || {}).lights || [])[e];
    let c;
    const u = new Color(16777215);
    l.color !== void 0 && u.setRGB(l.color[0], l.color[1], l.color[2], Cn);
    const h = l.range !== void 0 ? l.range : 0;
    switch (l.type) {
      case "directional":
        c = new DirectionalLight(u), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new PointLight(u), c.distance = h;
        break;
      case "spot":
        c = new SpotLight(u), c.distance = h, l.spot = l.spot || {}, l.spot.innerConeAngle = l.spot.innerConeAngle !== void 0 ? l.spot.innerConeAngle : 0, l.spot.outerConeAngle = l.spot.outerConeAngle !== void 0 ? l.spot.outerConeAngle : Math.PI / 4, c.angle = l.spot.outerConeAngle, c.penumbra = 1 - l.spot.innerConeAngle / l.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + l.type);
    }
    return c.position.set(0, 0, 0), c.decay = 2, _n(c, l), l.intensity !== void 0 && (c.intensity = l.intensity), c.name = t.createUniqueName(l.name || "light_" + e), i = Promise.resolve(c), t.cache.add(s, i), i;
  }
  getDependency(e, t) {
    if (e === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(e) {
    const t = this, s = this.parser, n = s.json.nodes[e], o = (n.extensions && n.extensions[this.name] || {}).light;
    return o === void 0 ? null : this._loadLight(o).then(function(l) {
      return s._getNodeRef(t.cache, o, l);
    });
  }
}
class LS {
  constructor() {
    this.name = nt.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return MeshBasicMaterial;
  }
  extendParams(e, t, s) {
    const i = [];
    e.color = new Color(1, 1, 1), e.opacity = 1;
    const n = t.pbrMetallicRoughness;
    if (n) {
      if (Array.isArray(n.baseColorFactor)) {
        const r = n.baseColorFactor;
        e.color.setRGB(r[0], r[1], r[2], Cn), e.opacity = r[3];
      }
      n.baseColorTexture !== void 0 && i.push(s.assignTexture(e, "map", n.baseColorTexture, Yr));
    }
    return Promise.all(i);
  }
}
class OS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = i.extensions[this.name].emissiveStrength;
    return n !== void 0 && (t.emissiveIntensity = n), Promise.resolve();
  }
}
class US {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    if (r.clearcoatFactor !== void 0 && (t.clearcoat = r.clearcoatFactor), r.clearcoatTexture !== void 0 && n.push(s.assignTexture(t, "clearcoatMap", r.clearcoatTexture)), r.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = r.clearcoatRoughnessFactor), r.clearcoatRoughnessTexture !== void 0 && n.push(s.assignTexture(t, "clearcoatRoughnessMap", r.clearcoatRoughnessTexture)), r.clearcoatNormalTexture !== void 0 && (n.push(s.assignTexture(t, "clearcoatNormalMap", r.clearcoatNormalTexture)), r.clearcoatNormalTexture.scale !== void 0)) {
      const o = r.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new Vector2(o, o);
    }
    return Promise.all(n);
  }
}
class kS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_DISPERSION;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = i.extensions[this.name];
    return t.dispersion = n.dispersion !== void 0 ? n.dispersion : 0, Promise.resolve();
  }
}
class zS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    return r.iridescenceFactor !== void 0 && (t.iridescence = r.iridescenceFactor), r.iridescenceTexture !== void 0 && n.push(s.assignTexture(t, "iridescenceMap", r.iridescenceTexture)), r.iridescenceIor !== void 0 && (t.iridescenceIOR = r.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), r.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = r.iridescenceThicknessMinimum), r.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = r.iridescenceThicknessMaximum), r.iridescenceThicknessTexture !== void 0 && n.push(
      s.assignTexture(t, "iridescenceThicknessMap", r.iridescenceThicknessTexture)
    ), Promise.all(n);
  }
}
class GS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [];
    t.sheenColor = new Color(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const r = i.extensions[this.name];
    if (r.sheenColorFactor !== void 0) {
      const o = r.sheenColorFactor;
      t.sheenColor.setRGB(o[0], o[1], o[2], Cn);
    }
    return r.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = r.sheenRoughnessFactor), r.sheenColorTexture !== void 0 && n.push(s.assignTexture(t, "sheenColorMap", r.sheenColorTexture, Yr)), r.sheenRoughnessTexture !== void 0 && n.push(s.assignTexture(t, "sheenRoughnessMap", r.sheenRoughnessTexture)), Promise.all(n);
  }
}
class VS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    return r.transmissionFactor !== void 0 && (t.transmission = r.transmissionFactor), r.transmissionTexture !== void 0 && n.push(s.assignTexture(t, "transmissionMap", r.transmissionTexture)), Promise.all(n);
  }
}
class HS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    t.thickness = r.thicknessFactor !== void 0 ? r.thicknessFactor : 0, r.thicknessTexture !== void 0 && n.push(s.assignTexture(t, "thicknessMap", r.thicknessTexture)), t.attenuationDistance = r.attenuationDistance || 1 / 0;
    const o = r.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new Color().setRGB(
      o[0],
      o[1],
      o[2],
      Cn
    ), Promise.all(n);
  }
}
class $S {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_IOR;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const i = this.parser.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = i.extensions[this.name];
    return t.ior = n.ior !== void 0 ? n.ior : 1.5, Promise.resolve();
  }
}
class WS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    t.specularIntensity = r.specularFactor !== void 0 ? r.specularFactor : 1, r.specularTexture !== void 0 && n.push(s.assignTexture(t, "specularIntensityMap", r.specularTexture));
    const o = r.specularColorFactor || [1, 1, 1];
    return t.specularColor = new Color().setRGB(o[0], o[1], o[2], Cn), r.specularColorTexture !== void 0 && n.push(
      s.assignTexture(t, "specularColorMap", r.specularColorTexture, Yr)
    ), Promise.all(n);
  }
}
class jS {
  constructor(e) {
    this.parser = e, this.name = nt.EXT_MATERIALS_BUMP;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    return t.bumpScale = r.bumpFactor !== void 0 ? r.bumpFactor : 1, r.bumpTexture !== void 0 && n.push(s.assignTexture(t, "bumpMap", r.bumpTexture)), Promise.all(n);
  }
}
class qS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_MATERIALS_ANISOTROPY;
  }
  getMaterialType(e) {
    const s = this.parser.json.materials[e];
    return !s.extensions || !s.extensions[this.name] ? null : MeshPhysicalMaterial;
  }
  extendMaterialParams(e, t) {
    const s = this.parser, i = s.json.materials[e];
    if (!i.extensions || !i.extensions[this.name])
      return Promise.resolve();
    const n = [], r = i.extensions[this.name];
    return r.anisotropyStrength !== void 0 && (t.anisotropy = r.anisotropyStrength), r.anisotropyRotation !== void 0 && (t.anisotropyRotation = r.anisotropyRotation), r.anisotropyTexture !== void 0 && n.push(s.assignTexture(t, "anisotropyMap", r.anisotropyTexture)), Promise.all(n);
  }
}
class XS {
  constructor(e) {
    this.parser = e, this.name = nt.KHR_TEXTURE_BASISU;
  }
  loadTexture(e) {
    const t = this.parser, s = t.json, i = s.textures[e];
    if (!i.extensions || !i.extensions[this.name])
      return null;
    const n = i.extensions[this.name], r = t.options.ktx2Loader;
    if (!r) {
      if (s.extensionsRequired && s.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(e, n.source, r);
  }
}
class YS {
  constructor(e) {
    this.parser = e, this.name = nt.EXT_TEXTURE_WEBP, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, s = this.parser, i = s.json, n = i.textures[e];
    if (!n.extensions || !n.extensions[t])
      return null;
    const r = n.extensions[t], o = i.images[r.source];
    let l = s.textureLoader;
    if (o.uri) {
      const c = s.options.manager.getHandler(o.uri);
      c !== null && (l = c);
    }
    return this.detectSupport().then(function(c) {
      if (c)
        return s.loadTextureImage(e, r.source, l);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      return s.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class KS {
  constructor(e) {
    this.parser = e, this.name = nt.EXT_TEXTURE_AVIF, this.isSupported = null;
  }
  loadTexture(e) {
    const t = this.name, s = this.parser, i = s.json, n = i.textures[e];
    if (!n.extensions || !n.extensions[t])
      return null;
    const r = n.extensions[t], o = i.images[r.source];
    let l = s.textureLoader;
    if (o.uri) {
      const c = s.options.manager.getHandler(o.uri);
      c !== null && (l = c);
    }
    return this.detectSupport().then(function(c) {
      if (c)
        return s.loadTextureImage(e, r.source, l);
      if (i.extensionsRequired && i.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: AVIF required by asset but unsupported.");
      return s.loadTexture(e);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(e) {
      const t = new Image();
      t.src = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAABcAAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQAMAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAAB9tZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=", t.onload = t.onerror = function() {
        e(t.height === 1);
      };
    })), this.isSupported;
  }
}
class ZS {
  constructor(e) {
    this.name = nt.EXT_MESHOPT_COMPRESSION, this.parser = e;
  }
  loadBufferView(e) {
    const t = this.parser.json, s = t.bufferViews[e];
    if (s.extensions && s.extensions[this.name]) {
      const i = s.extensions[this.name], n = this.parser.getDependency("buffer", i.buffer), r = this.parser.options.meshoptDecoder;
      if (!r || !r.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return n.then(function(o) {
        const l = i.byteOffset || 0, c = i.byteLength || 0, u = i.count, h = i.byteStride, f = new Uint8Array(o, l, c);
        return r.decodeGltfBufferAsync ? r.decodeGltfBufferAsync(u, h, f, i.mode, i.filter).then(function(d) {
          return d.buffer;
        }) : r.ready.then(function() {
          const d = new ArrayBuffer(u * h);
          return r.decodeGltfBuffer(
            new Uint8Array(d),
            u,
            h,
            f,
            i.mode,
            i.filter
          ), d;
        });
      });
    } else
      return null;
  }
}
class QS {
  constructor(e) {
    this.name = nt.EXT_MESH_GPU_INSTANCING, this.parser = e;
  }
  createNodeMesh(e) {
    const t = this.parser.json, s = t.nodes[e];
    if (!s.extensions || !s.extensions[this.name] || s.mesh === void 0)
      return null;
    const i = t.meshes[s.mesh];
    for (const c of i.primitives)
      if (c.mode !== oi.TRIANGLES && c.mode !== oi.TRIANGLE_STRIP && c.mode !== oi.TRIANGLE_FAN && c.mode !== void 0)
        return null;
    const r = s.extensions[this.name].attributes, o = [], l = {};
    for (const c in r)
      o.push(
        this.parser.getDependency("accessor", r[c]).then((u) => (l[c] = u, l[c]))
      );
    return o.length < 1 ? null : (o.push(this.parser.createNodeMesh(e)), Promise.all(o).then((c) => {
      const u = c.pop(), h = u.isGroup ? u.children : [u], f = c[0].count, d = [];
      for (const p of h) {
        const m3 = new Matrix4(), g = new Vector3(), y3 = new Quaternion(), x = new Vector3(1, 1, 1), v = new InstancedMesh(p.geometry, p.material, f);
        for (let w = 0; w < f; w++)
          l.TRANSLATION && g.fromBufferAttribute(l.TRANSLATION, w), l.ROTATION && y3.fromBufferAttribute(l.ROTATION, w), l.SCALE && x.fromBufferAttribute(l.SCALE, w), v.setMatrixAt(w, m3.compose(g, y3, x));
        for (const w in l)
          if (w === "_COLOR_0") {
            const A = l[w];
            v.instanceColor = new InstancedBufferAttribute(A.array, A.itemSize, A.normalized);
          } else w !== "TRANSLATION" && w !== "ROTATION" && w !== "SCALE" && p.geometry.setAttribute(w, l[w]);
        Object3D.prototype.copy.call(v, p), this.parser.assignFinalMaterial(v), d.push(v);
      }
      return u.isGroup ? (u.clear(), u.add(...d), u) : d[0];
    }));
  }
}
const fx = "glTF", Da = 12, Ig = { JSON: 1313821514, BIN: 5130562 };
class JS {
  constructor(e) {
    this.name = nt.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(e, 0, Da);
    if (this.header = {
      magic: da(new Uint8Array(e.slice(0, 4))),
      version: t.getUint32(4, true),
      length: t.getUint32(8, true)
    }, this.header.magic !== fx)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - Da, i = new DataView(e, Da);
    let n = 0;
    for (; n < s; ) {
      const r = i.getUint32(n, true);
      n += 4;
      const o = i.getUint32(n, true);
      if (n += 4, o === Ig.JSON) {
        const l = new Uint8Array(e, Da + n, r);
        this.content = da(l);
      } else if (o === Ig.BIN) {
        const l = Da + n;
        this.body = e.slice(l, l + r);
      }
      n += r;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class eM {
  constructor(e, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = nt.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(e, t) {
    const s = this.json, i = this.dracoLoader, n = e.extensions[this.name].bufferView, r = e.extensions[this.name].attributes, o = {}, l = {}, c = {};
    for (const u in r) {
      const h = ep[u] || u.toLowerCase();
      o[h] = r[u];
    }
    for (const u in e.attributes) {
      const h = ep[u] || u.toLowerCase();
      if (r[u] !== void 0) {
        const f = s.accessors[e.attributes[u]], d = ea[f.componentType];
        c[h] = d.name, l[h] = f.normalized === true;
      }
    }
    return t.getDependency("bufferView", n).then(function(u) {
      return new Promise(function(h, f) {
        i.decodeDracoFile(
          u,
          function(d) {
            for (const p in d.attributes) {
              const m3 = d.attributes[p], g = l[p];
              g !== void 0 && (m3.normalized = g);
            }
            h(d);
          },
          o,
          c,
          Cn,
          f
        );
      });
    });
  }
}
class tM {
  constructor() {
    this.name = nt.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(e, t) {
    return (t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), e.needsUpdate = true), e;
  }
}
class sM {
  constructor() {
    this.name = nt.KHR_MESH_QUANTIZATION;
  }
}
class px extends Interpolant {
  constructor(e, t, s, i) {
    super(e, t, s, i);
  }
  copySampleValue_(e) {
    const t = this.resultBuffer, s = this.sampleValues, i = this.valueSize, n = e * i * 3 + i;
    for (let r = 0; r !== i; r++)
      t[r] = s[n + r];
    return t;
  }
  interpolate_(e, t, s, i) {
    const n = this.resultBuffer, r = this.sampleValues, o = this.valueSize, l = o * 2, c = o * 3, u = i - t, h = (s - t) / u, f = h * h, d = f * h, p = e * c, m3 = p - c, g = -2 * d + 3 * f, y3 = d - f, x = 1 - g, v = y3 - f + h;
    for (let w = 0; w !== o; w++) {
      const A = r[m3 + w + o], b = r[m3 + w + l] * u, M = r[p + w + o], _ = r[p + w] * u;
      n[w] = x * A + v * b + g * M + y3 * _;
    }
    return n;
  }
}
const iM = /* @__PURE__ */ new Quaternion();
class nM extends px {
  interpolate_(e, t, s, i) {
    const n = super.interpolate_(e, t, s, i);
    return iM.fromArray(n).normalize().toArray(n), n;
  }
}
const oi = {
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6
}, ea = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, Bg = {
  9728: NearestFilter,
  9729: LinearFilter,
  9984: NearestMipmapNearestFilter,
  9985: LinearMipmapNearestFilter,
  9986: NearestMipmapLinearFilter,
  9987: LinearMipmapLinearFilter
}, Fg = {
  33071: ClampToEdgeWrapping,
  33648: MirroredRepeatWrapping,
  10497: RepeatWrapping
}, sd = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, ep = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  // uv => uv1, 4 uv channels
  // https://github.com/mrdoob/three.js/pull/25943
  // https://github.com/mrdoob/three.js/pull/25788
  ...lo >= 152 ? {
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv1",
    TEXCOORD_2: "uv2",
    TEXCOORD_3: "uv3"
  } : {
    TEXCOORD_0: "uv",
    TEXCOORD_1: "uv2"
  },
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, jn = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, rM = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: InterpolateLinear,
  STEP: InterpolateDiscrete
}, id = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function oM(a) {
  return a.DefaultMaterial === void 0 && (a.DefaultMaterial = new MeshStandardMaterial({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: false,
    depthTest: true,
    side: FrontSide
  })), a.DefaultMaterial;
}
function Rr(a, e, t) {
  for (const s in t.extensions)
    a[s] === void 0 && (e.userData.gltfExtensions = e.userData.gltfExtensions || {}, e.userData.gltfExtensions[s] = t.extensions[s]);
}
function _n(a, e) {
  e.extras !== void 0 && (typeof e.extras == "object" ? Object.assign(a.userData, e.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + e.extras));
}
function aM(a, e, t) {
  let s = false, i = false, n = false;
  for (let c = 0, u = e.length; c < u; c++) {
    const h = e[c];
    if (h.POSITION !== void 0 && (s = true), h.NORMAL !== void 0 && (i = true), h.COLOR_0 !== void 0 && (n = true), s && i && n)
      break;
  }
  if (!s && !i && !n)
    return Promise.resolve(a);
  const r = [], o = [], l = [];
  for (let c = 0, u = e.length; c < u; c++) {
    const h = e[c];
    if (s) {
      const f = h.POSITION !== void 0 ? t.getDependency("accessor", h.POSITION) : a.attributes.position;
      r.push(f);
    }
    if (i) {
      const f = h.NORMAL !== void 0 ? t.getDependency("accessor", h.NORMAL) : a.attributes.normal;
      o.push(f);
    }
    if (n) {
      const f = h.COLOR_0 !== void 0 ? t.getDependency("accessor", h.COLOR_0) : a.attributes.color;
      l.push(f);
    }
  }
  return Promise.all([
    Promise.all(r),
    Promise.all(o),
    Promise.all(l)
  ]).then(function(c) {
    const u = c[0], h = c[1], f = c[2];
    return s && (a.morphAttributes.position = u), i && (a.morphAttributes.normal = h), n && (a.morphAttributes.color = f), a.morphTargetsRelative = true, a;
  });
}
function lM(a, e) {
  if (a.updateMorphTargets(), e.weights !== void 0)
    for (let t = 0, s = e.weights.length; t < s; t++)
      a.morphTargetInfluences[t] = e.weights[t];
  if (e.extras && Array.isArray(e.extras.targetNames)) {
    const t = e.extras.targetNames;
    if (a.morphTargetInfluences.length === t.length) {
      a.morphTargetDictionary = {};
      for (let s = 0, i = t.length; s < i; s++)
        a.morphTargetDictionary[t[s]] = s;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function cM(a) {
  let e;
  const t = a.extensions && a.extensions[nt.KHR_DRACO_MESH_COMPRESSION];
  if (t ? e = "draco:" + t.bufferView + ":" + t.indices + ":" + nd(t.attributes) : e = a.indices + ":" + nd(a.attributes) + ":" + a.mode, a.targets !== void 0)
    for (let s = 0, i = a.targets.length; s < i; s++)
      e += ":" + nd(a.targets[s]);
  return e;
}
function nd(a) {
  let e = "";
  const t = Object.keys(a).sort();
  for (let s = 0, i = t.length; s < i; s++)
    e += t[s] + ":" + a[t[s]] + ";";
  return e;
}
function tp(a) {
  switch (a) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function uM(a) {
  return a.search(/\.jpe?g($|\?)/i) > 0 || a.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : a.search(/\.webp($|\?)/i) > 0 || a.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
}
const hM = /* @__PURE__ */ new Matrix4();
class dM {
  constructor(e = {}, t = {}) {
    this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new FS(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let s = false, i = false;
    typeof createImageBitmap > "u" || s || i ? this.textureLoader = new TextureLoader(this.options.manager) : this.textureLoader = new ImageBitmapLoader(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new FileLoader(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(true);
  }
  setExtensions(e) {
    this.extensions = e;
  }
  setPlugins(e) {
    this.plugins = e;
  }
  parse(e, t) {
    const s = this, i = this.json, n = this.extensions;
    this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(r) {
      return r._markDefs && r._markDefs();
    }), Promise.all(
      this._invokeAll(function(r) {
        return r.beforeRoot && r.beforeRoot();
      })
    ).then(function() {
      return Promise.all([
        s.getDependencies("scene"),
        s.getDependencies("animation"),
        s.getDependencies("camera")
      ]);
    }).then(function(r) {
      const o = {
        scene: r[0][i.scene || 0],
        scenes: r[0],
        animations: r[1],
        cameras: r[2],
        asset: i.asset,
        parser: s,
        userData: {}
      };
      return Rr(n, o, i), _n(o, i), Promise.all(
        s._invokeAll(function(l) {
          return l.afterRoot && l.afterRoot(o);
        })
      ).then(function() {
        for (const l of o.scenes)
          l.updateMatrixWorld();
        e(o);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const e = this.json.nodes || [], t = this.json.skins || [], s = this.json.meshes || [];
    for (let i = 0, n = t.length; i < n; i++) {
      const r = t[i].joints;
      for (let o = 0, l = r.length; o < l; o++)
        e[r[o]].isBone = true;
    }
    for (let i = 0, n = e.length; i < n; i++) {
      const r = e[i];
      r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (s[r.mesh].isSkinnedMesh = true)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(e, t) {
    t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(e, t, s) {
    if (e.refs[t] <= 1)
      return s;
    const i = s.clone(), n = (r, o) => {
      const l = this.associations.get(r);
      l != null && this.associations.set(o, l);
      for (const [c, u] of r.children.entries())
        n(u, o.children[c]);
    };
    return n(s, i), i.name += "_instance_" + e.uses[t]++, i;
  }
  _invokeOne(e) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let s = 0; s < t.length; s++) {
      const i = e(t[s]);
      if (i)
        return i;
    }
    return null;
  }
  _invokeAll(e) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const s = [];
    for (let i = 0; i < t.length; i++) {
      const n = e(t[i]);
      n && s.push(n);
    }
    return s;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(e, t) {
    const s = e + ":" + t;
    let i = this.cache.get(s);
    if (!i) {
      switch (e) {
        case "scene":
          i = this.loadScene(t);
          break;
        case "node":
          i = this._invokeOne(function(n) {
            return n.loadNode && n.loadNode(t);
          });
          break;
        case "mesh":
          i = this._invokeOne(function(n) {
            return n.loadMesh && n.loadMesh(t);
          });
          break;
        case "accessor":
          i = this.loadAccessor(t);
          break;
        case "bufferView":
          i = this._invokeOne(function(n) {
            return n.loadBufferView && n.loadBufferView(t);
          });
          break;
        case "buffer":
          i = this.loadBuffer(t);
          break;
        case "material":
          i = this._invokeOne(function(n) {
            return n.loadMaterial && n.loadMaterial(t);
          });
          break;
        case "texture":
          i = this._invokeOne(function(n) {
            return n.loadTexture && n.loadTexture(t);
          });
          break;
        case "skin":
          i = this.loadSkin(t);
          break;
        case "animation":
          i = this._invokeOne(function(n) {
            return n.loadAnimation && n.loadAnimation(t);
          });
          break;
        case "camera":
          i = this.loadCamera(t);
          break;
        default:
          if (i = this._invokeOne(function(n) {
            return n != this && n.getDependency && n.getDependency(e, t);
          }), !i)
            throw new Error("Unknown type: " + e);
          break;
      }
      this.cache.add(s, i);
    }
    return i;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(e) {
    let t = this.cache.get(e);
    if (!t) {
      const s = this, i = this.json[e + (e === "mesh" ? "es" : "s")] || [];
      t = Promise.all(
        i.map(function(n, r) {
          return s.getDependency(e, r);
        })
      ), this.cache.add(e, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(e) {
    const t = this.json.buffers[e], s = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && e === 0)
      return Promise.resolve(this.extensions[nt.KHR_BINARY_GLTF].body);
    const i = this.options;
    return new Promise(function(n, r) {
      s.load(LoaderUtils.resolveURL(t.uri, i.path), n, void 0, function() {
        r(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(e) {
    const t = this.json.bufferViews[e];
    return this.getDependency("buffer", t.buffer).then(function(s) {
      const i = t.byteLength || 0, n = t.byteOffset || 0;
      return s.slice(n, n + i);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(e) {
    const t = this, s = this.json, i = this.json.accessors[e];
    if (i.bufferView === void 0 && i.sparse === void 0) {
      const r = sd[i.type], o = ea[i.componentType], l = i.normalized === true, c = new o(i.count * r);
      return Promise.resolve(new BufferAttribute(c, r, l));
    }
    const n = [];
    return i.bufferView !== void 0 ? n.push(this.getDependency("bufferView", i.bufferView)) : n.push(null), i.sparse !== void 0 && (n.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), n.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(n).then(function(r) {
      const o = r[0], l = sd[i.type], c = ea[i.componentType], u = c.BYTES_PER_ELEMENT, h = u * l, f = i.byteOffset || 0, d = i.bufferView !== void 0 ? s.bufferViews[i.bufferView].byteStride : void 0, p = i.normalized === true;
      let m3, g;
      if (d && d !== h) {
        const y3 = Math.floor(f / d), x = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + y3 + ":" + i.count;
        let v = t.cache.get(x);
        v || (m3 = new c(o, y3 * d, i.count * d / u), v = new InterleavedBuffer(m3, d / u), t.cache.add(x, v)), g = new InterleavedBufferAttribute(
          v,
          l,
          f % d / u,
          p
        );
      } else
        o === null ? m3 = new c(i.count * l) : m3 = new c(o, f, i.count * l), g = new BufferAttribute(m3, l, p);
      if (i.sparse !== void 0) {
        const y3 = sd.SCALAR, x = ea[i.sparse.indices.componentType], v = i.sparse.indices.byteOffset || 0, w = i.sparse.values.byteOffset || 0, A = new x(
          r[1],
          v,
          i.sparse.count * y3
        ), b = new c(r[2], w, i.sparse.count * l);
        o !== null && (g = new BufferAttribute(
          g.array.slice(),
          g.itemSize,
          g.normalized
        ));
        for (let M = 0, _ = A.length; M < _; M++) {
          const T = A[M];
          if (g.setX(T, b[M * l]), l >= 2 && g.setY(T, b[M * l + 1]), l >= 3 && g.setZ(T, b[M * l + 2]), l >= 4 && g.setW(T, b[M * l + 3]), l >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return g;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(e) {
    const t = this.json, s = this.options, n = t.textures[e].source, r = t.images[n];
    let o = this.textureLoader;
    if (r.uri) {
      const l = s.manager.getHandler(r.uri);
      l !== null && (o = l);
    }
    return this.loadTextureImage(e, n, o);
  }
  loadTextureImage(e, t, s) {
    const i = this, n = this.json, r = n.textures[e], o = n.images[t], l = (o.uri || o.bufferView) + ":" + r.sampler;
    if (this.textureCache[l])
      return this.textureCache[l];
    const c = this.loadImageSource(t, s).then(function(u) {
      u.flipY = false, u.name = r.name || o.name || "", u.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === false && (u.name = o.uri);
      const f = (n.samplers || {})[r.sampler] || {};
      return u.magFilter = Bg[f.magFilter] || LinearFilter, u.minFilter = Bg[f.minFilter] || LinearMipmapLinearFilter, u.wrapS = Fg[f.wrapS] || RepeatWrapping, u.wrapT = Fg[f.wrapT] || RepeatWrapping, i.associations.set(u, { textures: e }), u;
    }).catch(function() {
      return null;
    });
    return this.textureCache[l] = c, c;
  }
  loadImageSource(e, t) {
    const s = this, i = this.json, n = this.options;
    if (this.sourceCache[e] !== void 0)
      return this.sourceCache[e].then((h) => h.clone());
    const r = i.images[e], o = self.URL || self.webkitURL;
    let l = r.uri || "", c = false;
    if (r.bufferView !== void 0)
      l = s.getDependency("bufferView", r.bufferView).then(function(h) {
        c = true;
        const f = new Blob([h], { type: r.mimeType });
        return l = o.createObjectURL(f), l;
      });
    else if (r.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
    const u = Promise.resolve(l).then(function(h) {
      return new Promise(function(f, d) {
        let p = f;
        t.isImageBitmapLoader === true && (p = function(m3) {
          const g = new Texture(m3);
          g.needsUpdate = true, f(g);
        }), t.load(LoaderUtils.resolveURL(h, n.path), p, void 0, d);
      });
    }).then(function(h) {
      return c === true && o.revokeObjectURL(l), _n(h, r), h.userData.mimeType = r.mimeType || uM(r.uri), h;
    }).catch(function(h) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", l), h;
    });
    return this.sourceCache[e] = u, u;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise<Texture>}
   */
  assignTexture(e, t, s, i) {
    const n = this;
    return this.getDependency("texture", s.index).then(function(r) {
      if (!r)
        return null;
      if (s.texCoord !== void 0 && s.texCoord > 0 && (r = r.clone(), r.channel = s.texCoord), n.extensions[nt.KHR_TEXTURE_TRANSFORM]) {
        const o = s.extensions !== void 0 ? s.extensions[nt.KHR_TEXTURE_TRANSFORM] : void 0;
        if (o) {
          const l = n.associations.get(r);
          r = n.extensions[nt.KHR_TEXTURE_TRANSFORM].extendTexture(r, o), n.associations.set(r, l);
        }
      }
      return i !== void 0 && (typeof i == "number" && (i = i === Ng ? Yr : Cn), "colorSpace" in r ? r.colorSpace = i : r.encoding = i === Yr ? Ng : BS), e[t] = r, r;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(e) {
    const t = e.geometry;
    let s = e.material;
    const i = t.attributes.tangent === void 0, n = t.attributes.color !== void 0, r = t.attributes.normal === void 0;
    if (e.isPoints) {
      const o = "PointsMaterial:" + s.uuid;
      let l = this.cache.get(o);
      l || (l = new PointsMaterial(), Material.prototype.copy.call(l, s), l.color.copy(s.color), l.map = s.map, l.sizeAttenuation = false, this.cache.add(o, l)), s = l;
    } else if (e.isLine) {
      const o = "LineBasicMaterial:" + s.uuid;
      let l = this.cache.get(o);
      l || (l = new LineBasicMaterial(), Material.prototype.copy.call(l, s), l.color.copy(s.color), l.map = s.map, this.cache.add(o, l)), s = l;
    }
    if (i || n || r) {
      let o = "ClonedMaterial:" + s.uuid + ":";
      i && (o += "derivative-tangents:"), n && (o += "vertex-colors:"), r && (o += "flat-shading:");
      let l = this.cache.get(o);
      l || (l = s.clone(), n && (l.vertexColors = true), r && (l.flatShading = true), i && (l.normalScale && (l.normalScale.y *= -1), l.clearcoatNormalScale && (l.clearcoatNormalScale.y *= -1)), this.cache.add(o, l), this.associations.set(l, this.associations.get(s))), s = l;
    }
    e.material = s;
  }
  getMaterialType() {
    return MeshStandardMaterial;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(e) {
    const t = this, s = this.json, i = this.extensions, n = s.materials[e];
    let r;
    const o = {}, l = n.extensions || {}, c = [];
    if (l[nt.KHR_MATERIALS_UNLIT]) {
      const h = i[nt.KHR_MATERIALS_UNLIT];
      r = h.getMaterialType(), c.push(h.extendParams(o, n, t));
    } else {
      const h = n.pbrMetallicRoughness || {};
      if (o.color = new Color(1, 1, 1), o.opacity = 1, Array.isArray(h.baseColorFactor)) {
        const f = h.baseColorFactor;
        o.color.setRGB(f[0], f[1], f[2], Cn), o.opacity = f[3];
      }
      h.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", h.baseColorTexture, Yr)), o.metalness = h.metallicFactor !== void 0 ? h.metallicFactor : 1, o.roughness = h.roughnessFactor !== void 0 ? h.roughnessFactor : 1, h.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", h.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", h.metallicRoughnessTexture))), r = this._invokeOne(function(f) {
        return f.getMaterialType && f.getMaterialType(e);
      }), c.push(
        Promise.all(
          this._invokeAll(function(f) {
            return f.extendMaterialParams && f.extendMaterialParams(e, o);
          })
        )
      );
    }
    n.doubleSided === true && (o.side = DoubleSide);
    const u = n.alphaMode || id.OPAQUE;
    if (u === id.BLEND ? (o.transparent = true, o.depthWrite = false) : (o.transparent = false, u === id.MASK && (o.alphaTest = n.alphaCutoff !== void 0 ? n.alphaCutoff : 0.5)), n.normalTexture !== void 0 && r !== MeshBasicMaterial && (c.push(t.assignTexture(o, "normalMap", n.normalTexture)), o.normalScale = new Vector2(1, 1), n.normalTexture.scale !== void 0)) {
      const h = n.normalTexture.scale;
      o.normalScale.set(h, h);
    }
    if (n.occlusionTexture !== void 0 && r !== MeshBasicMaterial && (c.push(t.assignTexture(o, "aoMap", n.occlusionTexture)), n.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = n.occlusionTexture.strength)), n.emissiveFactor !== void 0 && r !== MeshBasicMaterial) {
      const h = n.emissiveFactor;
      o.emissive = new Color().setRGB(
        h[0],
        h[1],
        h[2],
        Cn
      );
    }
    return n.emissiveTexture !== void 0 && r !== MeshBasicMaterial && c.push(t.assignTexture(o, "emissiveMap", n.emissiveTexture, Yr)), Promise.all(c).then(function() {
      const h = new r(o);
      return n.name && (h.name = n.name), _n(h, n), t.associations.set(h, { materials: e }), n.extensions && Rr(i, h, n), h;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(e) {
    const t = PropertyBinding.sanitizeNodeName(e || "");
    return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(e) {
    const t = this, s = this.extensions, i = this.primitiveCache;
    function n(o) {
      return s[nt.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o, t).then(function(l) {
        return Dg(l, o, t);
      });
    }
    const r = [];
    for (let o = 0, l = e.length; o < l; o++) {
      const c = e[o], u = cM(c), h = i[u];
      if (h)
        r.push(h.promise);
      else {
        let f;
        c.extensions && c.extensions[nt.KHR_DRACO_MESH_COMPRESSION] ? f = n(c) : f = Dg(new BufferGeometry(), c, t), i[u] = { primitive: c, promise: f }, r.push(f);
      }
    }
    return Promise.all(r);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(e) {
    const t = this, s = this.json, i = this.extensions, n = s.meshes[e], r = n.primitives, o = [];
    for (let l = 0, c = r.length; l < c; l++) {
      const u = r[l].material === void 0 ? oM(this.cache) : this.getDependency("material", r[l].material);
      o.push(u);
    }
    return o.push(t.loadGeometries(r)), Promise.all(o).then(function(l) {
      const c = l.slice(0, l.length - 1), u = l[l.length - 1], h = [];
      for (let d = 0, p = u.length; d < p; d++) {
        const m3 = u[d], g = r[d];
        let y3;
        const x = c[d];
        if (g.mode === oi.TRIANGLES || g.mode === oi.TRIANGLE_STRIP || g.mode === oi.TRIANGLE_FAN || g.mode === void 0)
          y3 = n.isSkinnedMesh === true ? new SkinnedMesh(m3, x) : new Mesh(m3, x), y3.isSkinnedMesh === true && y3.normalizeSkinWeights(), g.mode === oi.TRIANGLE_STRIP ? y3.geometry = gg(y3.geometry, TriangleStripDrawMode) : g.mode === oi.TRIANGLE_FAN && (y3.geometry = gg(y3.geometry, TriangleFanDrawMode));
        else if (g.mode === oi.LINES)
          y3 = new LineSegments(m3, x);
        else if (g.mode === oi.LINE_STRIP)
          y3 = new Line(m3, x);
        else if (g.mode === oi.LINE_LOOP)
          y3 = new LineLoop(m3, x);
        else if (g.mode === oi.POINTS)
          y3 = new Points(m3, x);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + g.mode);
        Object.keys(y3.geometry.morphAttributes).length > 0 && lM(y3, n), y3.name = t.createUniqueName(n.name || "mesh_" + e), _n(y3, n), g.extensions && Rr(i, y3, g), t.assignFinalMaterial(y3), h.push(y3);
      }
      for (let d = 0, p = h.length; d < p; d++)
        t.associations.set(h[d], {
          meshes: e,
          primitives: d
        });
      if (h.length === 1)
        return n.extensions && Rr(i, h[0], n), h[0];
      const f = new Group();
      n.extensions && Rr(i, f, n), t.associations.set(f, { meshes: e });
      for (let d = 0, p = h.length; d < p; d++)
        f.add(h[d]);
      return f;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(e) {
    let t;
    const s = this.json.cameras[e], i = s[s.type];
    if (!i) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return s.type === "perspective" ? t = new PerspectiveCamera(
      MathUtils.radToDeg(i.yfov),
      i.aspectRatio || 1,
      i.znear || 1,
      i.zfar || 2e6
    ) : s.type === "orthographic" && (t = new OrthographicCamera(-i.xmag, i.xmag, i.ymag, -i.ymag, i.znear, i.zfar)), s.name && (t.name = this.createUniqueName(s.name)), _n(t, s), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(e) {
    const t = this.json.skins[e], s = [];
    for (let i = 0, n = t.joints.length; i < n; i++)
      s.push(this._loadNodeShallow(t.joints[i]));
    return t.inverseBindMatrices !== void 0 ? s.push(this.getDependency("accessor", t.inverseBindMatrices)) : s.push(null), Promise.all(s).then(function(i) {
      const n = i.pop(), r = i, o = [], l = [];
      for (let c = 0, u = r.length; c < u; c++) {
        const h = r[c];
        if (h) {
          o.push(h);
          const f = new Matrix4();
          n !== null && f.fromArray(n.array, c * 16), l.push(f);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new Skeleton(o, l);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(e) {
    const t = this.json, s = this, i = t.animations[e], n = i.name ? i.name : "animation_" + e, r = [], o = [], l = [], c = [], u = [];
    for (let h = 0, f = i.channels.length; h < f; h++) {
      const d = i.channels[h], p = i.samplers[d.sampler], m3 = d.target, g = m3.node, y3 = i.parameters !== void 0 ? i.parameters[p.input] : p.input, x = i.parameters !== void 0 ? i.parameters[p.output] : p.output;
      m3.node !== void 0 && (r.push(this.getDependency("node", g)), o.push(this.getDependency("accessor", y3)), l.push(this.getDependency("accessor", x)), c.push(p), u.push(m3));
    }
    return Promise.all([
      Promise.all(r),
      Promise.all(o),
      Promise.all(l),
      Promise.all(c),
      Promise.all(u)
    ]).then(function(h) {
      const f = h[0], d = h[1], p = h[2], m3 = h[3], g = h[4], y3 = [];
      for (let x = 0, v = f.length; x < v; x++) {
        const w = f[x], A = d[x], b = p[x], M = m3[x], _ = g[x];
        if (w === void 0)
          continue;
        w.updateMatrix && w.updateMatrix();
        const T = s._createAnimationTracks(w, A, b, M, _);
        if (T)
          for (let S3 = 0; S3 < T.length; S3++)
            y3.push(T[S3]);
      }
      return new AnimationClip(n, void 0, y3);
    });
  }
  createNodeMesh(e) {
    const t = this.json, s = this, i = t.nodes[e];
    return i.mesh === void 0 ? null : s.getDependency("mesh", i.mesh).then(function(n) {
      const r = s._getNodeRef(s.meshCache, i.mesh, n);
      return i.weights !== void 0 && r.traverse(function(o) {
        if (o.isMesh)
          for (let l = 0, c = i.weights.length; l < c; l++)
            o.morphTargetInfluences[l] = i.weights[l];
      }), r;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(e) {
    const t = this.json, s = this, i = t.nodes[e], n = s._loadNodeShallow(e), r = [], o = i.children || [];
    for (let c = 0, u = o.length; c < u; c++)
      r.push(s.getDependency("node", o[c]));
    const l = i.skin === void 0 ? Promise.resolve(null) : s.getDependency("skin", i.skin);
    return Promise.all([n, Promise.all(r), l]).then(function(c) {
      const u = c[0], h = c[1], f = c[2];
      f !== null && u.traverse(function(d) {
        d.isSkinnedMesh && d.bind(f, hM);
      });
      for (let d = 0, p = h.length; d < p; d++)
        u.add(h[d]);
      return u;
    });
  }
  // ._loadNodeShallow() parses a single node.
  // skin and child nodes are created and added in .loadNode() (no '_' prefix).
  _loadNodeShallow(e) {
    const t = this.json, s = this.extensions, i = this;
    if (this.nodeCache[e] !== void 0)
      return this.nodeCache[e];
    const n = t.nodes[e], r = n.name ? i.createUniqueName(n.name) : "", o = [], l = i._invokeOne(function(c) {
      return c.createNodeMesh && c.createNodeMesh(e);
    });
    return l && o.push(l), n.camera !== void 0 && o.push(
      i.getDependency("camera", n.camera).then(function(c) {
        return i._getNodeRef(i.cameraCache, n.camera, c);
      })
    ), i._invokeAll(function(c) {
      return c.createNodeAttachment && c.createNodeAttachment(e);
    }).forEach(function(c) {
      o.push(c);
    }), this.nodeCache[e] = Promise.all(o).then(function(c) {
      let u;
      if (n.isBone === true ? u = new Bone() : c.length > 1 ? u = new Group() : c.length === 1 ? u = c[0] : u = new Object3D(), u !== c[0])
        for (let h = 0, f = c.length; h < f; h++)
          u.add(c[h]);
      if (n.name && (u.userData.name = n.name, u.name = r), _n(u, n), n.extensions && Rr(s, u, n), n.matrix !== void 0) {
        const h = new Matrix4();
        h.fromArray(n.matrix), u.applyMatrix4(h);
      } else
        n.translation !== void 0 && u.position.fromArray(n.translation), n.rotation !== void 0 && u.quaternion.fromArray(n.rotation), n.scale !== void 0 && u.scale.fromArray(n.scale);
      return i.associations.has(u) || i.associations.set(u, {}), i.associations.get(u).nodes = e, u;
    }), this.nodeCache[e];
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(e) {
    const t = this.extensions, s = this.json.scenes[e], i = this, n = new Group();
    s.name && (n.name = i.createUniqueName(s.name)), _n(n, s), s.extensions && Rr(t, n, s);
    const r = s.nodes || [], o = [];
    for (let l = 0, c = r.length; l < c; l++)
      o.push(i.getDependency("node", r[l]));
    return Promise.all(o).then(function(l) {
      for (let u = 0, h = l.length; u < h; u++)
        n.add(l[u]);
      const c = (u) => {
        const h = /* @__PURE__ */ new Map();
        for (const [f, d] of i.associations)
          (f instanceof Material || f instanceof Texture) && h.set(f, d);
        return u.traverse((f) => {
          const d = i.associations.get(f);
          d != null && h.set(f, d);
        }), h;
      };
      return i.associations = c(n), n;
    });
  }
  _createAnimationTracks(e, t, s, i, n) {
    const r = [], o = e.name ? e.name : e.uuid, l = [];
    jn[n.path] === jn.weights ? e.traverse(function(f) {
      f.morphTargetInfluences && l.push(f.name ? f.name : f.uuid);
    }) : l.push(o);
    let c;
    switch (jn[n.path]) {
      case jn.weights:
        c = NumberKeyframeTrack;
        break;
      case jn.rotation:
        c = QuaternionKeyframeTrack;
        break;
      case jn.position:
      case jn.scale:
        c = VectorKeyframeTrack;
        break;
      default:
        switch (s.itemSize) {
          case 1:
            c = NumberKeyframeTrack;
            break;
          case 2:
          case 3:
          default:
            c = VectorKeyframeTrack;
            break;
        }
        break;
    }
    const u = i.interpolation !== void 0 ? rM[i.interpolation] : InterpolateLinear, h = this._getArrayFromAccessor(s);
    for (let f = 0, d = l.length; f < d; f++) {
      const p = new c(
        l[f] + "." + jn[n.path],
        t.array,
        h,
        u
      );
      i.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(p), r.push(p);
    }
    return r;
  }
  _getArrayFromAccessor(e) {
    let t = e.array;
    if (e.normalized) {
      const s = tp(t.constructor), i = new Float32Array(t.length);
      for (let n = 0, r = t.length; n < r; n++)
        i[n] = t[n] * s;
      t = i;
    }
    return t;
  }
  _createCubicSplineTrackInterpolant(e) {
    e.createInterpolant = function(s) {
      const i = this instanceof QuaternionKeyframeTrack ? nM : px;
      return new i(this.times, this.values, this.getValueSize() / 3, s);
    }, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = true;
  }
}
function fM(a, e, t) {
  const s = e.attributes, i = new Box3();
  if (s.POSITION !== void 0) {
    const o = t.json.accessors[s.POSITION], l = o.min, c = o.max;
    if (l !== void 0 && c !== void 0) {
      if (i.set(new Vector3(l[0], l[1], l[2]), new Vector3(c[0], c[1], c[2])), o.normalized) {
        const u = tp(ea[o.componentType]);
        i.min.multiplyScalar(u), i.max.multiplyScalar(u);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const n = e.targets;
  if (n !== void 0) {
    const o = new Vector3(), l = new Vector3();
    for (let c = 0, u = n.length; c < u; c++) {
      const h = n[c];
      if (h.POSITION !== void 0) {
        const f = t.json.accessors[h.POSITION], d = f.min, p = f.max;
        if (d !== void 0 && p !== void 0) {
          if (l.setX(Math.max(Math.abs(d[0]), Math.abs(p[0]))), l.setY(Math.max(Math.abs(d[1]), Math.abs(p[1]))), l.setZ(Math.max(Math.abs(d[2]), Math.abs(p[2]))), f.normalized) {
            const m3 = tp(ea[f.componentType]);
            l.multiplyScalar(m3);
          }
          o.max(l);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    i.expandByVector(o);
  }
  a.boundingBox = i;
  const r = new Sphere();
  i.getCenter(r.center), r.radius = i.min.distanceTo(i.max) / 2, a.boundingSphere = r;
}
function Dg(a, e, t) {
  const s = e.attributes, i = [];
  function n(r, o) {
    return t.getDependency("accessor", r).then(function(l) {
      a.setAttribute(o, l);
    });
  }
  for (const r in s) {
    const o = ep[r] || r.toLowerCase();
    o in a.attributes || i.push(n(s[r], o));
  }
  if (e.indices !== void 0 && !a.index) {
    const r = t.getDependency("accessor", e.indices).then(function(o) {
      a.setIndex(o);
    });
    i.push(r);
  }
  return _n(a, e), fM(a, e, t), Promise.all(i).then(function() {
    return e.targets !== void 0 ? aM(a, e.targets, t) : a;
  });
}
const cd = /* @__PURE__ */ new WeakMap();
class $M extends Loader {
  constructor(e) {
    super(e), this.decoderPath = "", this.decoderConfig = {}, this.decoderBinary = null, this.decoderPending = null, this.workerLimit = 4, this.workerPool = [], this.workerNextTaskID = 1, this.workerSourceURL = "", this.defaultAttributeIDs = {
      position: "POSITION",
      normal: "NORMAL",
      color: "COLOR",
      uv: "TEX_COORD"
    }, this.defaultAttributeTypes = {
      position: "Float32Array",
      normal: "Float32Array",
      color: "Float32Array",
      uv: "Float32Array"
    };
  }
  setDecoderPath(e) {
    return this.decoderPath = e, this;
  }
  setDecoderConfig(e) {
    return this.decoderConfig = e, this;
  }
  setWorkerLimit(e) {
    return this.workerLimit = e, this;
  }
  load(e, t, s, i) {
    const n = new FileLoader(this.manager);
    n.setPath(this.path), n.setResponseType("arraybuffer"), n.setRequestHeader(this.requestHeader), n.setWithCredentials(this.withCredentials), n.load(
      e,
      (r) => {
        const o = {
          attributeIDs: this.defaultAttributeIDs,
          attributeTypes: this.defaultAttributeTypes,
          useUniqueIDs: false
        };
        this.decodeGeometry(r, o).then(t).catch(i);
      },
      s,
      i
    );
  }
  /** @deprecated Kept for backward-compatibility with previous DRACOLoader versions. */
  decodeDracoFile(e, t, s, i) {
    const n = {
      attributeIDs: s || this.defaultAttributeIDs,
      attributeTypes: i || this.defaultAttributeTypes,
      useUniqueIDs: !!s
    };
    this.decodeGeometry(e, n).then(t);
  }
  decodeGeometry(e, t) {
    for (const l in t.attributeTypes) {
      const c = t.attributeTypes[l];
      c.BYTES_PER_ELEMENT !== void 0 && (t.attributeTypes[l] = c.name);
    }
    const s = JSON.stringify(t);
    if (cd.has(e)) {
      const l = cd.get(e);
      if (l.key === s)
        return l.promise;
      if (e.byteLength === 0)
        throw new Error(
          "THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred."
        );
    }
    let i;
    const n = this.workerNextTaskID++, r = e.byteLength, o = this._getWorker(n, r).then((l) => (i = l, new Promise((c, u) => {
      i._callbacks[n] = { resolve: c, reject: u }, i.postMessage({ type: "decode", id: n, taskConfig: t, buffer: e }, [e]);
    }))).then((l) => this._createGeometry(l.geometry));
    return o.catch(() => true).then(() => {
      i && n && this._releaseTask(i, n);
    }), cd.set(e, {
      key: s,
      promise: o
    }), o;
  }
  _createGeometry(e) {
    const t = new BufferGeometry();
    e.index && t.setIndex(new BufferAttribute(e.index.array, 1));
    for (let s = 0; s < e.attributes.length; s++) {
      const i = e.attributes[s], n = i.name, r = i.array, o = i.itemSize;
      t.setAttribute(n, new BufferAttribute(r, o));
    }
    return t;
  }
  _loadLibrary(e, t) {
    const s = new FileLoader(this.manager);
    return s.setPath(this.decoderPath), s.setResponseType(t), s.setWithCredentials(this.withCredentials), new Promise((i, n) => {
      s.load(e, i, void 0, n);
    });
  }
  preload() {
    return this._initDecoder(), this;
  }
  _initDecoder() {
    if (this.decoderPending)
      return this.decoderPending;
    const e = typeof WebAssembly != "object" || this.decoderConfig.type === "js", t = [];
    return e ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")), t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))), this.decoderPending = Promise.all(t).then((s) => {
      const i = s[0];
      e || (this.decoderConfig.wasmBinary = s[1]);
      const n = WM.toString(), r = [
        "/* draco decoder */",
        i,
        "",
        "/* worker */",
        n.substring(n.indexOf("{") + 1, n.lastIndexOf("}"))
      ].join(`
`);
      this.workerSourceURL = URL.createObjectURL(new Blob([r]));
    }), this.decoderPending;
  }
  _getWorker(e, t) {
    return this._initDecoder().then(() => {
      if (this.workerPool.length < this.workerLimit) {
        const i = new Worker(this.workerSourceURL);
        i._callbacks = {}, i._taskCosts = {}, i._taskLoad = 0, i.postMessage({ type: "init", decoderConfig: this.decoderConfig }), i.onmessage = function(n) {
          const r = n.data;
          switch (r.type) {
            case "decode":
              i._callbacks[r.id].resolve(r);
              break;
            case "error":
              i._callbacks[r.id].reject(r);
              break;
            default:
              console.error('THREE.DRACOLoader: Unexpected message, "' + r.type + '"');
          }
        }, this.workerPool.push(i);
      } else
        this.workerPool.sort(function(i, n) {
          return i._taskLoad > n._taskLoad ? -1 : 1;
        });
      const s = this.workerPool[this.workerPool.length - 1];
      return s._taskCosts[e] = t, s._taskLoad += t, s;
    });
  }
  _releaseTask(e, t) {
    e._taskLoad -= e._taskCosts[t], delete e._callbacks[t], delete e._taskCosts[t];
  }
  debug() {
    console.log(
      "Task load: ",
      this.workerPool.map((e) => e._taskLoad)
    );
  }
  dispose() {
    for (let e = 0; e < this.workerPool.length; ++e)
      this.workerPool[e].terminate();
    return this.workerPool.length = 0, this;
  }
}
function WM() {
  let a, e;
  onmessage = function(r) {
    const o = r.data;
    switch (o.type) {
      case "init":
        a = o.decoderConfig, e = new Promise(function(u) {
          a.onModuleLoaded = function(h) {
            u({ draco: h });
          }, DracoDecoderModule(a);
        });
        break;
      case "decode":
        const l = o.buffer, c = o.taskConfig;
        e.then((u) => {
          const h = u.draco, f = new h.Decoder(), d = new h.DecoderBuffer();
          d.Init(new Int8Array(l), l.byteLength);
          try {
            const p = t(h, f, d, c), m3 = p.attributes.map((g) => g.array.buffer);
            p.index && m3.push(p.index.array.buffer), self.postMessage({ type: "decode", id: o.id, geometry: p }, m3);
          } catch (p) {
            console.error(p), self.postMessage({ type: "error", id: o.id, error: p.message });
          } finally {
            h.destroy(d), h.destroy(f);
          }
        });
        break;
    }
  };
  function t(r, o, l, c) {
    const u = c.attributeIDs, h = c.attributeTypes;
    let f, d;
    const p = o.GetEncodedGeometryType(l);
    if (p === r.TRIANGULAR_MESH)
      f = new r.Mesh(), d = o.DecodeBufferToMesh(l, f);
    else if (p === r.POINT_CLOUD)
      f = new r.PointCloud(), d = o.DecodeBufferToPointCloud(l, f);
    else
      throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
    if (!d.ok() || f.ptr === 0)
      throw new Error("THREE.DRACOLoader: Decoding failed: " + d.error_msg());
    const m3 = { index: null, attributes: [] };
    for (const g in u) {
      const y3 = self[h[g]];
      let x, v;
      if (c.useUniqueIDs)
        v = u[g], x = o.GetAttributeByUniqueId(f, v);
      else {
        if (v = o.GetAttributeId(f, r[u[g]]), v === -1)
          continue;
        x = o.GetAttribute(f, v);
      }
      m3.attributes.push(i(r, o, f, g, y3, x));
    }
    return p === r.TRIANGULAR_MESH && (m3.index = s(r, o, f)), r.destroy(f), m3;
  }
  function s(r, o, l) {
    const u = l.num_faces() * 3, h = u * 4, f = r._malloc(h);
    o.GetTrianglesUInt32Array(l, h, f);
    const d = new Uint32Array(r.HEAPF32.buffer, f, u).slice();
    return r._free(f), { array: d, itemSize: 1 };
  }
  function i(r, o, l, c, u, h) {
    const f = h.num_components(), p = l.num_points() * f, m3 = p * u.BYTES_PER_ELEMENT, g = n(r, u), y3 = r._malloc(m3);
    o.GetAttributeDataArrayForAllPoints(l, h, g, m3, y3);
    const x = new u(r.HEAPF32.buffer, y3, p).slice();
    return r._free(y3), {
      name: c,
      array: x,
      itemSize: f
    };
  }
  function n(r, o) {
    switch (o) {
      case Float32Array:
        return r.DT_FLOAT32;
      case Int8Array:
        return r.DT_INT8;
      case Int16Array:
        return r.DT_INT16;
      case Int32Array:
        return r.DT_INT32;
      case Uint8Array:
        return r.DT_UINT8;
      case Uint16Array:
        return r.DT_UINT16;
      case Uint32Array:
        return r.DT_UINT32;
    }
  }
}
gh(
  {
    screenspace: false,
    color: new Color("black"),
    opacity: 1,
    thickness: 0.05,
    size: new Vector2(1, 1)
  },
  `#include <common>
   #include <morphtarget_pars_vertex>
   #include <skinning_pars_vertex>
   uniform float thickness;
   uniform bool screenspace;
   uniform vec2 size;
   void main() {
     #if defined (USE_SKINNING)
       #include <beginnormal_vertex>
       #include <morphnormal_vertex>
       #include <skinbase_vertex>
       #include <skinnormal_vertex>
       #include <defaultnormal_vertex>
     #endif
     #include <begin_vertex>
     #include <morphtarget_vertex>
     #include <skinning_vertex>
     #include <project_vertex>
     vec4 tNormal = vec4(normal, 0.0);
     vec4 tPosition = vec4(transformed, 1.0);
     #ifdef USE_INSTANCING
       tNormal = instanceMatrix * tNormal;
       tPosition = instanceMatrix * tPosition;
     #endif
     if (screenspace) {
       vec3 newPosition = tPosition.xyz + tNormal.xyz * thickness;
       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0); 
     } else {
       vec4 clipPosition = projectionMatrix * modelViewMatrix * tPosition;
       vec4 clipNormal = projectionMatrix * modelViewMatrix * tNormal;
       vec2 offset = normalize(clipNormal.xy) * thickness / size * clipPosition.w * 2.0;
       clipPosition.xy += offset;
       gl_Position = clipPosition;
     }
   }`,
  `uniform vec3 color;
   uniform float opacity;
   void main(){
     gl_FragColor = vec4(color, opacity);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
   }`
);
const tA = ["args", "material-uniforms-color-value"];
/* @__PURE__ */ defineComponent({
  __name: "Reflector",
  props: {
    color: { default: "#333" },
    textureWidth: { default: 512 },
    textureHeight: { default: 512 },
    clipBias: { default: 0 },
    multisample: { default: 4 },
    shader: { default: Sg.ReflectorShader }
  },
  setup(a, { expose: e }) {
    const t = a, { extend: s, invalidate: i } = Fs(), n = shallowRef();
    s({ Reflector: Sg });
    const { color: r, textureWidth: o, textureHeight: l, clipBias: c, multisample: u, shader: h } = toRefs(t);
    return watch(t, () => {
      i();
    }), e({
      instance: n
    }), (f, d) => (openBlock(), createElementBlock("TresReflector", {
      ref_key: "reflectorRef",
      ref: n,
      args: [void 0, {
        textureWidth: unref(o),
        textureHeight: unref(l),
        clipBias: unref(c),
        multisample: unref(u),
        shader: unref(h)
      }],
      "material-uniforms-color-value": unref(r)
    }, [
      renderSlot(f.$slots, "default", {}, () => [
        d[0] || (d[0] = createElementVNode("TresPlaneGeometry", { args: [5, 5] }, null, -1))
      ])
    ], 8, tA));
  }
});
new Ki.Vector3();
new Ki.Vector3();
new Ki.Vector3();
var gd;
/Mac/.test((gd = globalThis?.navigator) === null || gd === void 0 ? void 0 : gd.platform);
function NA(a, e) {
  const t = {};
  if (e?.draco) {
    const r = new $M();
    r.setDecoderPath(e.decoderPath || "https://www.gstatic.com/draco/versioned/decoders/1.5.6/"), t.extensions = (o) => {
      o instanceof Pg && o.setDRACOLoader(r);
    };
  }
  const s = Zi(Pg, a, t);
  e?.traverse && watch(s.state, (r) => {
    r.scene.traverse((o) => e.traverse?.(o));
  });
  const i = computed(() => s.state.value?.scene ? es$1(s.state.value?.scene).nodes : {}), n = computed(() => s.state.value?.scene ? es$1(s.state.value?.scene).materials : {});
  return {
    ...s,
    nodes: i,
    materials: n
  };
}
function $l(a) {
  return a && a.__esModule && Object.prototype.hasOwnProperty.call(a, "default") ? a.default : a;
}
function wc(a) {
  throw new Error('Could not dynamically require "' + a + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var bd = { exports: {} }, iy;
function IA() {
  return iy || (iy = 1, (function(a, e) {
    (function(t) {
      a.exports = t();
    })(function() {
      return (function t(s, i, n) {
        function r(c, u) {
          if (!i[c]) {
            if (!s[c]) {
              var h = typeof wc == "function" && wc;
              if (!u && h) return h(c, true);
              if (o) return o(c, true);
              throw new Error("Cannot find module '" + c + "'");
            }
            u = i[c] = { exports: {} }, s[c][0].call(u.exports, function(f) {
              var d = s[c][1][f];
              return r(d || f);
            }, u, u.exports, t, s, i, n);
          }
          return i[c].exports;
        }
        for (var o = typeof wc == "function" && wc, l = 0; l < n.length; l++) r(n[l]);
        return r;
      })({ 1: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          var p = t("crypto");
          function m3(b, M) {
            M = x(b, M);
            var _;
            return (_ = M.algorithm !== "passthrough" ? p.createHash(M.algorithm) : new A()).write === void 0 && (_.write = _.update, _.end = _.update), w(M, _).dispatch(b), _.update || _.end(""), _.digest ? _.digest(M.encoding === "buffer" ? void 0 : M.encoding) : (b = _.read(), M.encoding !== "buffer" ? b.toString(M.encoding) : b);
          }
          (i = s.exports = m3).sha1 = function(b) {
            return m3(b);
          }, i.keys = function(b) {
            return m3(b, { excludeValues: true, algorithm: "sha1", encoding: "hex" });
          }, i.MD5 = function(b) {
            return m3(b, { algorithm: "md5", encoding: "hex" });
          }, i.keysMD5 = function(b) {
            return m3(b, { algorithm: "md5", encoding: "hex", excludeValues: true });
          };
          var g = p.getHashes ? p.getHashes().slice() : ["sha1", "md5"], y3 = (g.push("passthrough"), ["buffer", "hex", "binary", "base64"]);
          function x(b, M) {
            var _ = {};
            if (_.algorithm = (M = M || {}).algorithm || "sha1", _.encoding = M.encoding || "hex", _.excludeValues = !!M.excludeValues, _.algorithm = _.algorithm.toLowerCase(), _.encoding = _.encoding.toLowerCase(), _.ignoreUnknown = M.ignoreUnknown === true, _.respectType = M.respectType !== false, _.respectFunctionNames = M.respectFunctionNames !== false, _.respectFunctionProperties = M.respectFunctionProperties !== false, _.unorderedArrays = M.unorderedArrays === true, _.unorderedSets = M.unorderedSets !== false, _.unorderedObjects = M.unorderedObjects !== false, _.replacer = M.replacer || void 0, _.excludeKeys = M.excludeKeys || void 0, b === void 0) throw new Error("Object argument required.");
            for (var T = 0; T < g.length; ++T) g[T].toLowerCase() === _.algorithm.toLowerCase() && (_.algorithm = g[T]);
            if (g.indexOf(_.algorithm) === -1) throw new Error('Algorithm "' + _.algorithm + '"  not supported. supported values: ' + g.join(", "));
            if (y3.indexOf(_.encoding) === -1 && _.algorithm !== "passthrough") throw new Error('Encoding "' + _.encoding + '"  not supported. supported values: ' + y3.join(", "));
            return _;
          }
          function v(b) {
            if (typeof b == "function") return /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i.exec(Function.prototype.toString.call(b)) != null;
          }
          function w(b, M, _) {
            _ = _ || [];
            function T(S3) {
              return M.update ? M.update(S3, "utf8") : M.write(S3, "utf8");
            }
            return { dispatch: function(S3) {
              return this["_" + ((S3 = b.replacer ? b.replacer(S3) : S3) === null ? "null" : typeof S3)](S3);
            }, _object: function(S3) {
              var E, C = Object.prototype.toString.call(S3), B3 = /\[object (.*)\]/i.exec(C);
              if (B3 = (B3 = B3 ? B3[1] : "unknown:[" + C + "]").toLowerCase(), 0 <= (C = _.indexOf(S3))) return this.dispatch("[CIRCULAR:" + C + "]");
              if (_.push(S3), o !== void 0 && o.isBuffer && o.isBuffer(S3)) return T("buffer:"), T(S3);
              if (B3 === "object" || B3 === "function" || B3 === "asyncfunction") return C = Object.keys(S3), b.unorderedObjects && (C = C.sort()), b.respectType === false || v(S3) || C.splice(0, 0, "prototype", "__proto__", "constructor"), b.excludeKeys && (C = C.filter(function(D) {
                return !b.excludeKeys(D);
              })), T("object:" + C.length + ":"), E = this, C.forEach(function(D) {
                E.dispatch(D), T(":"), b.excludeValues || E.dispatch(S3[D]), T(",");
              });
              if (!this["_" + B3]) {
                if (b.ignoreUnknown) return T("[" + B3 + "]");
                throw new Error('Unknown object type "' + B3 + '"');
              }
              this["_" + B3](S3);
            }, _array: function(S3, D) {
              D = D !== void 0 ? D : b.unorderedArrays !== false;
              var C = this;
              if (T("array:" + S3.length + ":"), !D || S3.length <= 1) return S3.forEach(function(G3) {
                return C.dispatch(G3);
              });
              var B3 = [], D = S3.map(function(G3) {
                var O = new A(), ce2 = _.slice();
                return w(b, O, ce2).dispatch(G3), B3 = B3.concat(ce2.slice(_.length)), O.read().toString();
              });
              return _ = _.concat(B3), D.sort(), this._array(D, false);
            }, _date: function(S3) {
              return T("date:" + S3.toJSON());
            }, _symbol: function(S3) {
              return T("symbol:" + S3.toString());
            }, _error: function(S3) {
              return T("error:" + S3.toString());
            }, _boolean: function(S3) {
              return T("bool:" + S3.toString());
            }, _string: function(S3) {
              T("string:" + S3.length + ":"), T(S3.toString());
            }, _function: function(S3) {
              T("fn:"), v(S3) ? this.dispatch("[native]") : this.dispatch(S3.toString()), b.respectFunctionNames !== false && this.dispatch("function-name:" + String(S3.name)), b.respectFunctionProperties && this._object(S3);
            }, _number: function(S3) {
              return T("number:" + S3.toString());
            }, _xml: function(S3) {
              return T("xml:" + S3.toString());
            }, _null: function() {
              return T("Null");
            }, _undefined: function() {
              return T("Undefined");
            }, _regexp: function(S3) {
              return T("regex:" + S3.toString());
            }, _uint8array: function(S3) {
              return T("uint8array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _uint8clampedarray: function(S3) {
              return T("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _int8array: function(S3) {
              return T("int8array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _uint16array: function(S3) {
              return T("uint16array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _int16array: function(S3) {
              return T("int16array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _uint32array: function(S3) {
              return T("uint32array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _int32array: function(S3) {
              return T("int32array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _float32array: function(S3) {
              return T("float32array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _float64array: function(S3) {
              return T("float64array:"), this.dispatch(Array.prototype.slice.call(S3));
            }, _arraybuffer: function(S3) {
              return T("arraybuffer:"), this.dispatch(new Uint8Array(S3));
            }, _url: function(S3) {
              return T("url:" + S3.toString());
            }, _map: function(S3) {
              return T("map:"), S3 = Array.from(S3), this._array(S3, b.unorderedSets !== false);
            }, _set: function(S3) {
              return T("set:"), S3 = Array.from(S3), this._array(S3, b.unorderedSets !== false);
            }, _file: function(S3) {
              return T("file:"), this.dispatch([S3.name, S3.size, S3.type, S3.lastModfied]);
            }, _blob: function() {
              if (b.ignoreUnknown) return T("[blob]");
              throw Error(`Hashing Blob objects is currently not supported
(see https://github.com/puleos/object-hash/issues/26)
Use "options.replacer" or "options.ignoreUnknown"
`);
            }, _domwindow: function() {
              return T("domwindow");
            }, _bigint: function(S3) {
              return T("bigint:" + S3.toString());
            }, _process: function() {
              return T("process");
            }, _timer: function() {
              return T("timer");
            }, _pipe: function() {
              return T("pipe");
            }, _tcp: function() {
              return T("tcp");
            }, _udp: function() {
              return T("udp");
            }, _tty: function() {
              return T("tty");
            }, _statwatcher: function() {
              return T("statwatcher");
            }, _securecontext: function() {
              return T("securecontext");
            }, _connection: function() {
              return T("connection");
            }, _zlib: function() {
              return T("zlib");
            }, _context: function() {
              return T("context");
            }, _nodescript: function() {
              return T("nodescript");
            }, _httpparser: function() {
              return T("httpparser");
            }, _dataview: function() {
              return T("dataview");
            }, _signal: function() {
              return T("signal");
            }, _fsevent: function() {
              return T("fsevent");
            }, _tlswrap: function() {
              return T("tlswrap");
            } };
          }
          function A() {
            return { buf: "", write: function(b) {
              this.buf += b;
            }, end: function(b) {
              this.buf += b;
            }, read: function() {
              return this.buf;
            } };
          }
          i.writeToStream = function(b, M, _) {
            return _ === void 0 && (_ = M, M = {}), w(M = x(b, M), _).dispatch(b);
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/fake_9a5aa49d.js", "/");
      }, { buffer: 3, crypto: 5, lYpoI2: 11 }], 2: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          (function(p) {
            var m3 = typeof Uint8Array < "u" ? Uint8Array : Array, g = 43, y3 = 47, x = 48, v = 97, w = 65, A = 45, b = 95;
            function M(_) {
              return _ = _.charCodeAt(0), _ === g || _ === A ? 62 : _ === y3 || _ === b ? 63 : _ < x ? -1 : _ < x + 10 ? _ - x + 26 + 26 : _ < w + 26 ? _ - w : _ < v + 26 ? _ - v + 26 : void 0;
            }
            p.toByteArray = function(_) {
              var T, S3;
              if (0 < _.length % 4) throw new Error("Invalid string. Length must be a multiple of 4");
              var E = _.length, E = _.charAt(E - 2) === "=" ? 2 : _.charAt(E - 1) === "=" ? 1 : 0, C = new m3(3 * _.length / 4 - E), B3 = 0 < E ? _.length - 4 : _.length, D = 0;
              function G3(O) {
                C[D++] = O;
              }
              for (T = 0; T < B3; T += 4, 0) G3((16711680 & (S3 = M(_.charAt(T)) << 18 | M(_.charAt(T + 1)) << 12 | M(_.charAt(T + 2)) << 6 | M(_.charAt(T + 3)))) >> 16), G3((65280 & S3) >> 8), G3(255 & S3);
              return E == 2 ? G3(255 & (S3 = M(_.charAt(T)) << 2 | M(_.charAt(T + 1)) >> 4)) : E == 1 && (G3((S3 = M(_.charAt(T)) << 10 | M(_.charAt(T + 1)) << 4 | M(_.charAt(T + 2)) >> 2) >> 8 & 255), G3(255 & S3)), C;
            }, p.fromByteArray = function(_) {
              var T, S3, E, C, B3 = _.length % 3, D = "";
              function G3(O) {
                return "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(O);
              }
              for (T = 0, E = _.length - B3; T < E; T += 3) S3 = (_[T] << 16) + (_[T + 1] << 8) + _[T + 2], D += G3((C = S3) >> 18 & 63) + G3(C >> 12 & 63) + G3(C >> 6 & 63) + G3(63 & C);
              switch (B3) {
                case 1:
                  D = (D += G3((S3 = _[_.length - 1]) >> 2)) + G3(S3 << 4 & 63) + "==";
                  break;
                case 2:
                  D = (D = (D += G3((S3 = (_[_.length - 2] << 8) + _[_.length - 1]) >> 10)) + G3(S3 >> 4 & 63)) + G3(S3 << 2 & 63) + "=";
              }
              return D;
            };
          })(i === void 0 ? this.base64js = {} : i);
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/base64-js/lib/b64.js", "/node_modules/gulp-browserify/node_modules/base64-js/lib");
      }, { buffer: 3, lYpoI2: 11 }], 3: [function(t, s, i) {
        (function(n, r, g, l, c, u, h, f, d) {
          var p = t("base64-js"), m3 = t("ieee754");
          function g(R, P, I) {
            if (!(this instanceof g)) return new g(R, P, I);
            var j3, K, ee2, J, fe2 = typeof R;
            if (P === "base64" && fe2 == "string") for (R = (J = R).trim ? J.trim() : J.replace(/^\s+|\s+$/g, ""); R.length % 4 != 0; ) R += "=";
            if (fe2 == "number") j3 = te(R);
            else if (fe2 == "string") j3 = g.byteLength(R, P);
            else {
              if (fe2 != "object") throw new Error("First argument needs to be a number, array or string.");
              j3 = te(R.length);
            }
            if (g._useTypedArrays ? K = g._augment(new Uint8Array(j3)) : ((K = this).length = j3, K._isBuffer = true), g._useTypedArrays && typeof R.byteLength == "number") K._set(R);
            else if (H(J = R) || g.isBuffer(J) || J && typeof J == "object" && typeof J.length == "number") for (ee2 = 0; ee2 < j3; ee2++) g.isBuffer(R) ? K[ee2] = R.readUInt8(ee2) : K[ee2] = R[ee2];
            else if (fe2 == "string") K.write(R, 0, P);
            else if (fe2 == "number" && !g._useTypedArrays && !I) for (ee2 = 0; ee2 < j3; ee2++) K[ee2] = 0;
            return K;
          }
          function y3(R, P, I, j3) {
            return g._charsWritten = we((function(K) {
              for (var ee2 = [], J = 0; J < K.length; J++) ee2.push(255 & K.charCodeAt(J));
              return ee2;
            })(P), R, I, j3);
          }
          function x(R, P, I, j3) {
            return g._charsWritten = we((function(K) {
              for (var ee2, J, fe2 = [], Se = 0; Se < K.length; Se++) J = K.charCodeAt(Se), ee2 = J >> 8, J = J % 256, fe2.push(J), fe2.push(ee2);
              return fe2;
            })(P), R, I, j3);
          }
          function v(R, P, I) {
            var j3 = "";
            I = Math.min(R.length, I);
            for (var K = P; K < I; K++) j3 += String.fromCharCode(R[K]);
            return j3;
          }
          function w(R, P, I, ee2) {
            ee2 || (N3(typeof I == "boolean", "missing or invalid endian"), N3(P != null, "missing offset"), N3(P + 1 < R.length, "Trying to read beyond buffer length"));
            var K, ee2 = R.length;
            if (!(ee2 <= P)) return I ? (K = R[P], P + 1 < ee2 && (K |= R[P + 1] << 8)) : (K = R[P] << 8, P + 1 < ee2 && (K |= R[P + 1])), K;
          }
          function A(R, P, I, ee2) {
            ee2 || (N3(typeof I == "boolean", "missing or invalid endian"), N3(P != null, "missing offset"), N3(P + 3 < R.length, "Trying to read beyond buffer length"));
            var K, ee2 = R.length;
            if (!(ee2 <= P)) return I ? (P + 2 < ee2 && (K = R[P + 2] << 16), P + 1 < ee2 && (K |= R[P + 1] << 8), K |= R[P], P + 3 < ee2 && (K += R[P + 3] << 24 >>> 0)) : (P + 1 < ee2 && (K = R[P + 1] << 16), P + 2 < ee2 && (K |= R[P + 2] << 8), P + 3 < ee2 && (K |= R[P + 3]), K += R[P] << 24 >>> 0), K;
          }
          function b(R, P, I, j3) {
            if (j3 || (N3(typeof I == "boolean", "missing or invalid endian"), N3(P != null, "missing offset"), N3(P + 1 < R.length, "Trying to read beyond buffer length")), !(R.length <= P)) return j3 = w(R, P, I, true), 32768 & j3 ? -1 * (65535 - j3 + 1) : j3;
          }
          function M(R, P, I, j3) {
            if (j3 || (N3(typeof I == "boolean", "missing or invalid endian"), N3(P != null, "missing offset"), N3(P + 3 < R.length, "Trying to read beyond buffer length")), !(R.length <= P)) return j3 = A(R, P, I, true), 2147483648 & j3 ? -1 * (4294967295 - j3 + 1) : j3;
          }
          function _(R, P, I, j3) {
            return j3 || (N3(typeof I == "boolean", "missing or invalid endian"), N3(P + 3 < R.length, "Trying to read beyond buffer length")), m3.read(R, P, I, 23, 4);
          }
          function T(R, P, I, j3) {
            return j3 || (N3(typeof I == "boolean", "missing or invalid endian"), N3(P + 7 < R.length, "Trying to read beyond buffer length")), m3.read(R, P, I, 52, 8);
          }
          function S3(R, P, I, j3, K) {
            if (K || (N3(P != null, "missing value"), N3(typeof j3 == "boolean", "missing or invalid endian"), N3(I != null, "missing offset"), N3(I + 1 < R.length, "trying to write beyond buffer length"), $(P, 65535)), K = R.length, !(K <= I)) for (var ee2 = 0, J = Math.min(K - I, 2); ee2 < J; ee2++) R[I + ee2] = (P & 255 << 8 * (j3 ? ee2 : 1 - ee2)) >>> 8 * (j3 ? ee2 : 1 - ee2);
          }
          function E(R, P, I, j3, K) {
            if (K || (N3(P != null, "missing value"), N3(typeof j3 == "boolean", "missing or invalid endian"), N3(I != null, "missing offset"), N3(I + 3 < R.length, "trying to write beyond buffer length"), $(P, 4294967295)), K = R.length, !(K <= I)) for (var ee2 = 0, J = Math.min(K - I, 4); ee2 < J; ee2++) R[I + ee2] = P >>> 8 * (j3 ? ee2 : 3 - ee2) & 255;
          }
          function C(R, P, I, j3, K) {
            K || (N3(P != null, "missing value"), N3(typeof j3 == "boolean", "missing or invalid endian"), N3(I != null, "missing offset"), N3(I + 1 < R.length, "Trying to write beyond buffer length"), z(P, 32767, -32768)), R.length <= I || S3(R, 0 <= P ? P : 65535 + P + 1, I, j3, K);
          }
          function B3(R, P, I, j3, K) {
            K || (N3(P != null, "missing value"), N3(typeof j3 == "boolean", "missing or invalid endian"), N3(I != null, "missing offset"), N3(I + 3 < R.length, "Trying to write beyond buffer length"), z(P, 2147483647, -2147483648)), R.length <= I || E(R, 0 <= P ? P : 4294967295 + P + 1, I, j3, K);
          }
          function D(R, P, I, j3, K) {
            K || (N3(P != null, "missing value"), N3(typeof j3 == "boolean", "missing or invalid endian"), N3(I != null, "missing offset"), N3(I + 3 < R.length, "Trying to write beyond buffer length"), F3(P, 34028234663852886e22, -34028234663852886e22)), R.length <= I || m3.write(R, P, I, j3, 23, 4);
          }
          function G3(R, P, I, j3, K) {
            K || (N3(P != null, "missing value"), N3(typeof j3 == "boolean", "missing or invalid endian"), N3(I != null, "missing offset"), N3(I + 7 < R.length, "Trying to write beyond buffer length"), F3(P, 17976931348623157e292, -17976931348623157e292)), R.length <= I || m3.write(R, P, I, j3, 52, 8);
          }
          i.Buffer = g, i.SlowBuffer = g, i.INSPECT_MAX_BYTES = 50, g.poolSize = 8192, g._useTypedArrays = (function() {
            try {
              var R = new ArrayBuffer(0), P = new Uint8Array(R);
              return P.foo = function() {
                return 42;
              }, P.foo() === 42 && typeof P.subarray == "function";
            } catch {
              return false;
            }
          })(), g.isEncoding = function(R) {
            switch (String(R).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "binary":
              case "base64":
              case "raw":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return true;
              default:
                return false;
            }
          }, g.isBuffer = function(R) {
            return !(R == null || !R._isBuffer);
          }, g.byteLength = function(R, P) {
            var I;
            switch (R += "", P || "utf8") {
              case "hex":
                I = R.length / 2;
                break;
              case "utf8":
              case "utf-8":
                I = ue2(R).length;
                break;
              case "ascii":
              case "binary":
              case "raw":
                I = R.length;
                break;
              case "base64":
                I = ge2(R).length;
                break;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                I = 2 * R.length;
                break;
              default:
                throw new Error("Unknown encoding");
            }
            return I;
          }, g.concat = function(R, P) {
            if (N3(H(R), `Usage: Buffer.concat(list, [totalLength])
list should be an Array.`), R.length === 0) return new g(0);
            if (R.length === 1) return R[0];
            if (typeof P != "number") for (K = P = 0; K < R.length; K++) P += R[K].length;
            for (var I = new g(P), j3 = 0, K = 0; K < R.length; K++) {
              var ee2 = R[K];
              ee2.copy(I, j3), j3 += ee2.length;
            }
            return I;
          }, g.prototype.write = function(R, P, I, j3) {
            isFinite(P) ? isFinite(I) || (j3 = I, I = void 0) : (Se = j3, j3 = P, P = I, I = Se), P = Number(P) || 0;
            var K, ee2, J, fe2, Se = this.length - P;
            switch ((!I || Se < (I = Number(I))) && (I = Se), j3 = String(j3 || "utf8").toLowerCase()) {
              case "hex":
                K = (function(ye2, q, L3, xe) {
                  L3 = Number(L3) || 0;
                  var Ne2 = ye2.length - L3;
                  (!xe || Ne2 < (xe = Number(xe))) && (xe = Ne2), N3((Ne2 = q.length) % 2 == 0, "Invalid hex string"), Ne2 / 2 < xe && (xe = Ne2 / 2);
                  for (var Lt2 = 0; Lt2 < xe; Lt2++) {
                    var Xt = parseInt(q.substr(2 * Lt2, 2), 16);
                    N3(!isNaN(Xt), "Invalid hex string"), ye2[L3 + Lt2] = Xt;
                  }
                  return g._charsWritten = 2 * Lt2, Lt2;
                })(this, R, P, I);
                break;
              case "utf8":
              case "utf-8":
                ee2 = this, J = P, fe2 = I, K = g._charsWritten = we(ue2(R), ee2, J, fe2);
                break;
              case "ascii":
              case "binary":
                K = y3(this, R, P, I);
                break;
              case "base64":
                ee2 = this, J = P, fe2 = I, K = g._charsWritten = we(ge2(R), ee2, J, fe2);
                break;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                K = x(this, R, P, I);
                break;
              default:
                throw new Error("Unknown encoding");
            }
            return K;
          }, g.prototype.toString = function(R, P, I) {
            var j3, K, ee2, J, fe2 = this;
            if (R = String(R || "utf8").toLowerCase(), P = Number(P) || 0, (I = I !== void 0 ? Number(I) : fe2.length) === P) return "";
            switch (R) {
              case "hex":
                j3 = (function(Se, ye2, q) {
                  var L3 = Se.length;
                  (!ye2 || ye2 < 0) && (ye2 = 0), (!q || q < 0 || L3 < q) && (q = L3);
                  for (var xe = "", Ne2 = ye2; Ne2 < q; Ne2++) xe += ie(Se[Ne2]);
                  return xe;
                })(fe2, P, I);
                break;
              case "utf8":
              case "utf-8":
                j3 = (function(Se, ye2, q) {
                  var L3 = "", xe = "";
                  q = Math.min(Se.length, q);
                  for (var Ne2 = ye2; Ne2 < q; Ne2++) Se[Ne2] <= 127 ? (L3 += W(xe) + String.fromCharCode(Se[Ne2]), xe = "") : xe += "%" + Se[Ne2].toString(16);
                  return L3 + W(xe);
                })(fe2, P, I);
                break;
              case "ascii":
              case "binary":
                j3 = v(fe2, P, I);
                break;
              case "base64":
                K = fe2, J = I, j3 = (ee2 = P) === 0 && J === K.length ? p.fromByteArray(K) : p.fromByteArray(K.slice(ee2, J));
                break;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                j3 = (function(Se, ye2, q) {
                  for (var L3 = Se.slice(ye2, q), xe = "", Ne2 = 0; Ne2 < L3.length; Ne2 += 2) xe += String.fromCharCode(L3[Ne2] + 256 * L3[Ne2 + 1]);
                  return xe;
                })(fe2, P, I);
                break;
              default:
                throw new Error("Unknown encoding");
            }
            return j3;
          }, g.prototype.toJSON = function() {
            return { type: "Buffer", data: Array.prototype.slice.call(this._arr || this, 0) };
          }, g.prototype.copy = function(R, P, I, j3) {
            if (P = P || 0, (j3 = j3 || j3 === 0 ? j3 : this.length) !== (I = I || 0) && R.length !== 0 && this.length !== 0) {
              N3(I <= j3, "sourceEnd < sourceStart"), N3(0 <= P && P < R.length, "targetStart out of bounds"), N3(0 <= I && I < this.length, "sourceStart out of bounds"), N3(0 <= j3 && j3 <= this.length, "sourceEnd out of bounds"), j3 > this.length && (j3 = this.length);
              var K = (j3 = R.length - P < j3 - I ? R.length - P + I : j3) - I;
              if (K < 100 || !g._useTypedArrays) for (var ee2 = 0; ee2 < K; ee2++) R[ee2 + P] = this[ee2 + I];
              else R._set(this.subarray(I, I + K), P);
            }
          }, g.prototype.slice = function(R, P) {
            var I = this.length;
            if (R = ce2(R, I, 0), P = ce2(P, I, I), g._useTypedArrays) return g._augment(this.subarray(R, P));
            for (var j3 = P - R, K = new g(j3, void 0, true), ee2 = 0; ee2 < j3; ee2++) K[ee2] = this[ee2 + R];
            return K;
          }, g.prototype.get = function(R) {
            return console.log(".get() is deprecated. Access using array indexes instead."), this.readUInt8(R);
          }, g.prototype.set = function(R, P) {
            return console.log(".set() is deprecated. Access using array indexes instead."), this.writeUInt8(R, P);
          }, g.prototype.readUInt8 = function(R, P) {
            if (P || (N3(R != null, "missing offset"), N3(R < this.length, "Trying to read beyond buffer length")), !(R >= this.length)) return this[R];
          }, g.prototype.readUInt16LE = function(R, P) {
            return w(this, R, true, P);
          }, g.prototype.readUInt16BE = function(R, P) {
            return w(this, R, false, P);
          }, g.prototype.readUInt32LE = function(R, P) {
            return A(this, R, true, P);
          }, g.prototype.readUInt32BE = function(R, P) {
            return A(this, R, false, P);
          }, g.prototype.readInt8 = function(R, P) {
            if (P || (N3(R != null, "missing offset"), N3(R < this.length, "Trying to read beyond buffer length")), !(R >= this.length)) return 128 & this[R] ? -1 * (255 - this[R] + 1) : this[R];
          }, g.prototype.readInt16LE = function(R, P) {
            return b(this, R, true, P);
          }, g.prototype.readInt16BE = function(R, P) {
            return b(this, R, false, P);
          }, g.prototype.readInt32LE = function(R, P) {
            return M(this, R, true, P);
          }, g.prototype.readInt32BE = function(R, P) {
            return M(this, R, false, P);
          }, g.prototype.readFloatLE = function(R, P) {
            return _(this, R, true, P);
          }, g.prototype.readFloatBE = function(R, P) {
            return _(this, R, false, P);
          }, g.prototype.readDoubleLE = function(R, P) {
            return T(this, R, true, P);
          }, g.prototype.readDoubleBE = function(R, P) {
            return T(this, R, false, P);
          }, g.prototype.writeUInt8 = function(R, P, I) {
            I || (N3(R != null, "missing value"), N3(P != null, "missing offset"), N3(P < this.length, "trying to write beyond buffer length"), $(R, 255)), P >= this.length || (this[P] = R);
          }, g.prototype.writeUInt16LE = function(R, P, I) {
            S3(this, R, P, true, I);
          }, g.prototype.writeUInt16BE = function(R, P, I) {
            S3(this, R, P, false, I);
          }, g.prototype.writeUInt32LE = function(R, P, I) {
            E(this, R, P, true, I);
          }, g.prototype.writeUInt32BE = function(R, P, I) {
            E(this, R, P, false, I);
          }, g.prototype.writeInt8 = function(R, P, I) {
            I || (N3(R != null, "missing value"), N3(P != null, "missing offset"), N3(P < this.length, "Trying to write beyond buffer length"), z(R, 127, -128)), P >= this.length || (0 <= R ? this.writeUInt8(R, P, I) : this.writeUInt8(255 + R + 1, P, I));
          }, g.prototype.writeInt16LE = function(R, P, I) {
            C(this, R, P, true, I);
          }, g.prototype.writeInt16BE = function(R, P, I) {
            C(this, R, P, false, I);
          }, g.prototype.writeInt32LE = function(R, P, I) {
            B3(this, R, P, true, I);
          }, g.prototype.writeInt32BE = function(R, P, I) {
            B3(this, R, P, false, I);
          }, g.prototype.writeFloatLE = function(R, P, I) {
            D(this, R, P, true, I);
          }, g.prototype.writeFloatBE = function(R, P, I) {
            D(this, R, P, false, I);
          }, g.prototype.writeDoubleLE = function(R, P, I) {
            G3(this, R, P, true, I);
          }, g.prototype.writeDoubleBE = function(R, P, I) {
            G3(this, R, P, false, I);
          }, g.prototype.fill = function(R, P, I) {
            if (P = P || 0, I = I || this.length, N3(typeof (R = typeof (R = R || 0) == "string" ? R.charCodeAt(0) : R) == "number" && !isNaN(R), "value is not a number"), N3(P <= I, "end < start"), I !== P && this.length !== 0) {
              N3(0 <= P && P < this.length, "start out of bounds"), N3(0 <= I && I <= this.length, "end out of bounds");
              for (var j3 = P; j3 < I; j3++) this[j3] = R;
            }
          }, g.prototype.inspect = function() {
            for (var R = [], P = this.length, I = 0; I < P; I++) if (R[I] = ie(this[I]), I === i.INSPECT_MAX_BYTES) {
              R[I + 1] = "...";
              break;
            }
            return "<Buffer " + R.join(" ") + ">";
          }, g.prototype.toArrayBuffer = function() {
            if (typeof Uint8Array > "u") throw new Error("Buffer.toArrayBuffer not supported in this browser");
            if (g._useTypedArrays) return new g(this).buffer;
            for (var R = new Uint8Array(this.length), P = 0, I = R.length; P < I; P += 1) R[P] = this[P];
            return R.buffer;
          };
          var O = g.prototype;
          function ce2(R, P, I) {
            return typeof R != "number" ? I : P <= (R = ~~R) ? P : 0 <= R || 0 <= (R += P) ? R : 0;
          }
          function te(R) {
            return (R = ~~Math.ceil(+R)) < 0 ? 0 : R;
          }
          function H(R) {
            return (Array.isArray || function(P) {
              return Object.prototype.toString.call(P) === "[object Array]";
            })(R);
          }
          function ie(R) {
            return R < 16 ? "0" + R.toString(16) : R.toString(16);
          }
          function ue2(R) {
            for (var P = [], I = 0; I < R.length; I++) {
              var j3 = R.charCodeAt(I);
              if (j3 <= 127) P.push(R.charCodeAt(I));
              else for (var K = I, ee2 = (55296 <= j3 && j3 <= 57343 && I++, encodeURIComponent(R.slice(K, I + 1)).substr(1).split("%")), J = 0; J < ee2.length; J++) P.push(parseInt(ee2[J], 16));
            }
            return P;
          }
          function ge2(R) {
            return p.toByteArray(R);
          }
          function we(R, P, I, j3) {
            for (var K = 0; K < j3 && !(K + I >= P.length || K >= R.length); K++) P[K + I] = R[K];
            return K;
          }
          function W(R) {
            try {
              return decodeURIComponent(R);
            } catch {
              return "�";
            }
          }
          function $(R, P) {
            N3(typeof R == "number", "cannot write a non-number as a number"), N3(0 <= R, "specified a negative value for writing an unsigned value"), N3(R <= P, "value is larger than maximum value for type"), N3(Math.floor(R) === R, "value has a fractional component");
          }
          function z(R, P, I) {
            N3(typeof R == "number", "cannot write a non-number as a number"), N3(R <= P, "value larger than maximum allowed value"), N3(I <= R, "value smaller than minimum allowed value"), N3(Math.floor(R) === R, "value has a fractional component");
          }
          function F3(R, P, I) {
            N3(typeof R == "number", "cannot write a non-number as a number"), N3(R <= P, "value larger than maximum allowed value"), N3(I <= R, "value smaller than minimum allowed value");
          }
          function N3(R, P) {
            if (!R) throw new Error(P || "Failed assertion");
          }
          g._augment = function(R) {
            return R._isBuffer = true, R._get = R.get, R._set = R.set, R.get = O.get, R.set = O.set, R.write = O.write, R.toString = O.toString, R.toLocaleString = O.toString, R.toJSON = O.toJSON, R.copy = O.copy, R.slice = O.slice, R.readUInt8 = O.readUInt8, R.readUInt16LE = O.readUInt16LE, R.readUInt16BE = O.readUInt16BE, R.readUInt32LE = O.readUInt32LE, R.readUInt32BE = O.readUInt32BE, R.readInt8 = O.readInt8, R.readInt16LE = O.readInt16LE, R.readInt16BE = O.readInt16BE, R.readInt32LE = O.readInt32LE, R.readInt32BE = O.readInt32BE, R.readFloatLE = O.readFloatLE, R.readFloatBE = O.readFloatBE, R.readDoubleLE = O.readDoubleLE, R.readDoubleBE = O.readDoubleBE, R.writeUInt8 = O.writeUInt8, R.writeUInt16LE = O.writeUInt16LE, R.writeUInt16BE = O.writeUInt16BE, R.writeUInt32LE = O.writeUInt32LE, R.writeUInt32BE = O.writeUInt32BE, R.writeInt8 = O.writeInt8, R.writeInt16LE = O.writeInt16LE, R.writeInt16BE = O.writeInt16BE, R.writeInt32LE = O.writeInt32LE, R.writeInt32BE = O.writeInt32BE, R.writeFloatLE = O.writeFloatLE, R.writeFloatBE = O.writeFloatBE, R.writeDoubleLE = O.writeDoubleLE, R.writeDoubleBE = O.writeDoubleBE, R.fill = O.fill, R.inspect = O.inspect, R.toArrayBuffer = O.toArrayBuffer, R;
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/buffer/index.js", "/node_modules/gulp-browserify/node_modules/buffer");
      }, { "base64-js": 2, buffer: 3, ieee754: 10, lYpoI2: 11 }], 4: [function(t, s, i) {
        (function(n, r, p, l, c, u, h, f, d) {
          var p = t("buffer").Buffer, m3 = 4, g = new p(m3);
          g.fill(0), s.exports = { hash: function(y3, x, v, w) {
            for (var A = x((function(S3, E) {
              S3.length % m3 != 0 && (C = S3.length + (m3 - S3.length % m3), S3 = p.concat([S3, g], C));
              for (var C, B3 = [], D = E ? S3.readInt32BE : S3.readInt32LE, G3 = 0; G3 < S3.length; G3 += m3) B3.push(D.call(S3, G3));
              return B3;
            })(y3 = p.isBuffer(y3) ? y3 : new p(y3), w), 8 * y3.length), x = w, b = new p(v), M = x ? b.writeInt32BE : b.writeInt32LE, _ = 0; _ < A.length; _++) M.call(b, A[_], 4 * _, true);
            return b;
          } };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/helpers.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
      }, { buffer: 3, lYpoI2: 11 }], 5: [function(t, s, i) {
        (function(n, r, p, l, c, u, h, f, d) {
          var p = t("buffer").Buffer, m3 = t("./sha"), g = t("./sha256"), y3 = t("./rng"), x = { sha1: m3, sha256: g, md5: t("./md5") }, v = 64, w = new p(v);
          function A(S3, E) {
            var C = x[S3 = S3 || "sha1"], B3 = [];
            return C || b("algorithm:", S3, "is not yet supported"), { update: function(D) {
              return p.isBuffer(D) || (D = new p(D)), B3.push(D), D.length, this;
            }, digest: function(D) {
              var G3 = p.concat(B3), G3 = E ? (function(O, ce2, te) {
                p.isBuffer(ce2) || (ce2 = new p(ce2)), p.isBuffer(te) || (te = new p(te)), ce2.length > v ? ce2 = O(ce2) : ce2.length < v && (ce2 = p.concat([ce2, w], v));
                for (var H = new p(v), ie = new p(v), ue2 = 0; ue2 < v; ue2++) H[ue2] = 54 ^ ce2[ue2], ie[ue2] = 92 ^ ce2[ue2];
                return te = O(p.concat([H, te])), O(p.concat([ie, te]));
              })(C, E, G3) : C(G3);
              return B3 = null, D ? G3.toString(D) : G3;
            } };
          }
          function b() {
            var S3 = [].slice.call(arguments).join(" ");
            throw new Error([S3, "we accept pull requests", "http://github.com/dominictarr/crypto-browserify"].join(`
`));
          }
          w.fill(0), i.createHash = function(S3) {
            return A(S3);
          }, i.createHmac = A, i.randomBytes = function(S3, E) {
            if (!E || !E.call) return new p(y3(S3));
            try {
              E.call(this, void 0, new p(y3(S3)));
            } catch (C) {
              E(C);
            }
          };
          var M, _ = ["createCredentials", "createCipher", "createCipheriv", "createDecipher", "createDecipheriv", "createSign", "createVerify", "createDiffieHellman", "pbkdf2"], T = function(S3) {
            i[S3] = function() {
              b("sorry,", S3, "is not implemented yet");
            };
          };
          for (M in _) T(_[M]);
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/index.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
      }, { "./md5": 6, "./rng": 7, "./sha": 8, "./sha256": 9, buffer: 3, lYpoI2: 11 }], 6: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          var p = t("./helpers");
          function m3(b, M) {
            b[M >> 5] |= 128 << M % 32, b[14 + (M + 64 >>> 9 << 4)] = M;
            for (var _ = 1732584193, T = -271733879, S3 = -1732584194, E = 271733878, C = 0; C < b.length; C += 16) {
              var B3 = _, D = T, G3 = S3, O = E, _ = y3(_, T, S3, E, b[C + 0], 7, -680876936), E = y3(E, _, T, S3, b[C + 1], 12, -389564586), S3 = y3(S3, E, _, T, b[C + 2], 17, 606105819), T = y3(T, S3, E, _, b[C + 3], 22, -1044525330);
              _ = y3(_, T, S3, E, b[C + 4], 7, -176418897), E = y3(E, _, T, S3, b[C + 5], 12, 1200080426), S3 = y3(S3, E, _, T, b[C + 6], 17, -1473231341), T = y3(T, S3, E, _, b[C + 7], 22, -45705983), _ = y3(_, T, S3, E, b[C + 8], 7, 1770035416), E = y3(E, _, T, S3, b[C + 9], 12, -1958414417), S3 = y3(S3, E, _, T, b[C + 10], 17, -42063), T = y3(T, S3, E, _, b[C + 11], 22, -1990404162), _ = y3(_, T, S3, E, b[C + 12], 7, 1804603682), E = y3(E, _, T, S3, b[C + 13], 12, -40341101), S3 = y3(S3, E, _, T, b[C + 14], 17, -1502002290), _ = x(_, T = y3(T, S3, E, _, b[C + 15], 22, 1236535329), S3, E, b[C + 1], 5, -165796510), E = x(E, _, T, S3, b[C + 6], 9, -1069501632), S3 = x(S3, E, _, T, b[C + 11], 14, 643717713), T = x(T, S3, E, _, b[C + 0], 20, -373897302), _ = x(_, T, S3, E, b[C + 5], 5, -701558691), E = x(E, _, T, S3, b[C + 10], 9, 38016083), S3 = x(S3, E, _, T, b[C + 15], 14, -660478335), T = x(T, S3, E, _, b[C + 4], 20, -405537848), _ = x(_, T, S3, E, b[C + 9], 5, 568446438), E = x(E, _, T, S3, b[C + 14], 9, -1019803690), S3 = x(S3, E, _, T, b[C + 3], 14, -187363961), T = x(T, S3, E, _, b[C + 8], 20, 1163531501), _ = x(_, T, S3, E, b[C + 13], 5, -1444681467), E = x(E, _, T, S3, b[C + 2], 9, -51403784), S3 = x(S3, E, _, T, b[C + 7], 14, 1735328473), _ = v(_, T = x(T, S3, E, _, b[C + 12], 20, -1926607734), S3, E, b[C + 5], 4, -378558), E = v(E, _, T, S3, b[C + 8], 11, -2022574463), S3 = v(S3, E, _, T, b[C + 11], 16, 1839030562), T = v(T, S3, E, _, b[C + 14], 23, -35309556), _ = v(_, T, S3, E, b[C + 1], 4, -1530992060), E = v(E, _, T, S3, b[C + 4], 11, 1272893353), S3 = v(S3, E, _, T, b[C + 7], 16, -155497632), T = v(T, S3, E, _, b[C + 10], 23, -1094730640), _ = v(_, T, S3, E, b[C + 13], 4, 681279174), E = v(E, _, T, S3, b[C + 0], 11, -358537222), S3 = v(S3, E, _, T, b[C + 3], 16, -722521979), T = v(T, S3, E, _, b[C + 6], 23, 76029189), _ = v(_, T, S3, E, b[C + 9], 4, -640364487), E = v(E, _, T, S3, b[C + 12], 11, -421815835), S3 = v(S3, E, _, T, b[C + 15], 16, 530742520), _ = w(_, T = v(T, S3, E, _, b[C + 2], 23, -995338651), S3, E, b[C + 0], 6, -198630844), E = w(E, _, T, S3, b[C + 7], 10, 1126891415), S3 = w(S3, E, _, T, b[C + 14], 15, -1416354905), T = w(T, S3, E, _, b[C + 5], 21, -57434055), _ = w(_, T, S3, E, b[C + 12], 6, 1700485571), E = w(E, _, T, S3, b[C + 3], 10, -1894986606), S3 = w(S3, E, _, T, b[C + 10], 15, -1051523), T = w(T, S3, E, _, b[C + 1], 21, -2054922799), _ = w(_, T, S3, E, b[C + 8], 6, 1873313359), E = w(E, _, T, S3, b[C + 15], 10, -30611744), S3 = w(S3, E, _, T, b[C + 6], 15, -1560198380), T = w(T, S3, E, _, b[C + 13], 21, 1309151649), _ = w(_, T, S3, E, b[C + 4], 6, -145523070), E = w(E, _, T, S3, b[C + 11], 10, -1120210379), S3 = w(S3, E, _, T, b[C + 2], 15, 718787259), T = w(T, S3, E, _, b[C + 9], 21, -343485551), _ = A(_, B3), T = A(T, D), S3 = A(S3, G3), E = A(E, O);
            }
            return Array(_, T, S3, E);
          }
          function g(b, M, _, T, S3, E) {
            return A((M = A(A(M, b), A(T, E))) << S3 | M >>> 32 - S3, _);
          }
          function y3(b, M, _, T, S3, E, C) {
            return g(M & _ | ~M & T, b, M, S3, E, C);
          }
          function x(b, M, _, T, S3, E, C) {
            return g(M & T | _ & ~T, b, M, S3, E, C);
          }
          function v(b, M, _, T, S3, E, C) {
            return g(M ^ _ ^ T, b, M, S3, E, C);
          }
          function w(b, M, _, T, S3, E, C) {
            return g(_ ^ (M | ~T), b, M, S3, E, C);
          }
          function A(b, M) {
            var _ = (65535 & b) + (65535 & M);
            return (b >> 16) + (M >> 16) + (_ >> 16) << 16 | 65535 & _;
          }
          s.exports = function(b) {
            return p.hash(b, m3, 16);
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/md5.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
      }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 7: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          s.exports = function(p) {
            for (var m3, g = new Array(p), y3 = 0; y3 < p; y3++) (3 & y3) == 0 && (m3 = 4294967296 * Math.random()), g[y3] = m3 >>> ((3 & y3) << 3) & 255;
            return g;
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/rng.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
      }, { buffer: 3, lYpoI2: 11 }], 8: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          var p = t("./helpers");
          function m3(x, v) {
            x[v >> 5] |= 128 << 24 - v % 32, x[15 + (v + 64 >> 9 << 4)] = v;
            for (var w, A, b, M = Array(80), _ = 1732584193, T = -271733879, S3 = -1732584194, E = 271733878, C = -1009589776, B3 = 0; B3 < x.length; B3 += 16) {
              for (var D = _, G3 = T, O = S3, ce2 = E, te = C, H = 0; H < 80; H++) {
                M[H] = H < 16 ? x[B3 + H] : y3(M[H - 3] ^ M[H - 8] ^ M[H - 14] ^ M[H - 16], 1);
                var ie = g(g(y3(_, 5), (ie = T, A = S3, b = E, (w = H) < 20 ? ie & A | ~ie & b : !(w < 40) && w < 60 ? ie & A | ie & b | A & b : ie ^ A ^ b)), g(g(C, M[H]), (w = H) < 20 ? 1518500249 : w < 40 ? 1859775393 : w < 60 ? -1894007588 : -899497514)), C = E, E = S3, S3 = y3(T, 30), T = _, _ = ie;
              }
              _ = g(_, D), T = g(T, G3), S3 = g(S3, O), E = g(E, ce2), C = g(C, te);
            }
            return Array(_, T, S3, E, C);
          }
          function g(x, v) {
            var w = (65535 & x) + (65535 & v);
            return (x >> 16) + (v >> 16) + (w >> 16) << 16 | 65535 & w;
          }
          function y3(x, v) {
            return x << v | x >>> 32 - v;
          }
          s.exports = function(x) {
            return p.hash(x, m3, 20, true);
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
      }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 9: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          function p(v, w) {
            var A = (65535 & v) + (65535 & w);
            return (v >> 16) + (w >> 16) + (A >> 16) << 16 | 65535 & A;
          }
          function m3(v, w) {
            var A, b = new Array(1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298), M = new Array(1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225), _ = new Array(64);
            v[w >> 5] |= 128 << 24 - w % 32, v[15 + (w + 64 >> 9 << 4)] = w;
            for (var T, S3, E = 0; E < v.length; E += 16) {
              for (var C = M[0], B3 = M[1], D = M[2], G3 = M[3], O = M[4], ce2 = M[5], te = M[6], H = M[7], ie = 0; ie < 64; ie++) _[ie] = ie < 16 ? v[ie + E] : p(p(p((S3 = _[ie - 2], y3(S3, 17) ^ y3(S3, 19) ^ x(S3, 10)), _[ie - 7]), (S3 = _[ie - 15], y3(S3, 7) ^ y3(S3, 18) ^ x(S3, 3))), _[ie - 16]), A = p(p(p(p(H, y3(S3 = O, 6) ^ y3(S3, 11) ^ y3(S3, 25)), O & ce2 ^ ~O & te), b[ie]), _[ie]), T = p(y3(T = C, 2) ^ y3(T, 13) ^ y3(T, 22), C & B3 ^ C & D ^ B3 & D), H = te, te = ce2, ce2 = O, O = p(G3, A), G3 = D, D = B3, B3 = C, C = p(A, T);
              M[0] = p(C, M[0]), M[1] = p(B3, M[1]), M[2] = p(D, M[2]), M[3] = p(G3, M[3]), M[4] = p(O, M[4]), M[5] = p(ce2, M[5]), M[6] = p(te, M[6]), M[7] = p(H, M[7]);
            }
            return M;
          }
          var g = t("./helpers"), y3 = function(v, w) {
            return v >>> w | v << 32 - w;
          }, x = function(v, w) {
            return v >>> w;
          };
          s.exports = function(v) {
            return g.hash(v, m3, 32, true);
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/crypto-browserify/sha256.js", "/node_modules/gulp-browserify/node_modules/crypto-browserify");
      }, { "./helpers": 4, buffer: 3, lYpoI2: 11 }], 10: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          i.read = function(p, m3, g, y3, E) {
            var v, w, A = 8 * E - y3 - 1, b = (1 << A) - 1, M = b >> 1, _ = -7, T = g ? E - 1 : 0, S3 = g ? -1 : 1, E = p[m3 + T];
            for (T += S3, v = E & (1 << -_) - 1, E >>= -_, _ += A; 0 < _; v = 256 * v + p[m3 + T], T += S3, _ -= 8) ;
            for (w = v & (1 << -_) - 1, v >>= -_, _ += y3; 0 < _; w = 256 * w + p[m3 + T], T += S3, _ -= 8) ;
            if (v === 0) v = 1 - M;
            else {
              if (v === b) return w ? NaN : 1 / 0 * (E ? -1 : 1);
              w += Math.pow(2, y3), v -= M;
            }
            return (E ? -1 : 1) * w * Math.pow(2, v - y3);
          }, i.write = function(p, m3, g, y3, x, C) {
            var w, A, b = 8 * C - x - 1, M = (1 << b) - 1, _ = M >> 1, T = x === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, S3 = y3 ? 0 : C - 1, E = y3 ? 1 : -1, C = m3 < 0 || m3 === 0 && 1 / m3 < 0 ? 1 : 0;
            for (m3 = Math.abs(m3), isNaN(m3) || m3 === 1 / 0 ? (A = isNaN(m3) ? 1 : 0, w = M) : (w = Math.floor(Math.log(m3) / Math.LN2), m3 * (y3 = Math.pow(2, -w)) < 1 && (w--, y3 *= 2), 2 <= (m3 += 1 <= w + _ ? T / y3 : T * Math.pow(2, 1 - _)) * y3 && (w++, y3 /= 2), M <= w + _ ? (A = 0, w = M) : 1 <= w + _ ? (A = (m3 * y3 - 1) * Math.pow(2, x), w += _) : (A = m3 * Math.pow(2, _ - 1) * Math.pow(2, x), w = 0)); 8 <= x; p[g + S3] = 255 & A, S3 += E, A /= 256, x -= 8) ;
            for (w = w << x | A, b += x; 0 < b; p[g + S3] = 255 & w, S3 += E, w /= 256, b -= 8) ;
            p[g + S3 - E] |= 128 * C;
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/ieee754/index.js", "/node_modules/gulp-browserify/node_modules/ieee754");
      }, { buffer: 3, lYpoI2: 11 }], 11: [function(t, s, i) {
        (function(n, r, o, l, c, u, h, f, d) {
          var p, m3, g;
          function y3() {
          }
          (n = s.exports = {}).nextTick = (m3 = "undefined" < "u", g = "undefined" < "u", m3 ? function(x) {
            return (void 0).setImmediate(x);
          } : g ? (p = [], (void 0).addEventListener("message", function(x) {
            var v = x.source;
            v !== void 0 && v !== null || x.data !== "process-tick" || (x.stopPropagation(), 0 < p.length && p.shift()());
          }, true), function(x) {
            p.push(x), (void 0).postMessage("process-tick", "*");
          }) : function(x) {
            setTimeout(x, 0);
          }), n.title = "browser", n.browser = true, n.env = {}, n.argv = [], n.on = y3, n.addListener = y3, n.once = y3, n.off = y3, n.removeListener = y3, n.removeAllListeners = y3, n.emit = y3, n.binding = function(x) {
            throw new Error("process.binding is not supported");
          }, n.cwd = function() {
            return "/";
          }, n.chdir = function(x) {
            throw new Error("process.chdir is not supported");
          };
        }).call(this, t("lYpoI2"), typeof self < "u" ? self : {}, t("buffer").Buffer, arguments[3], arguments[4], arguments[5], arguments[6], "/node_modules/gulp-browserify/node_modules/process/browser.js", "/node_modules/gulp-browserify/node_modules/process");
      }, { buffer: 3, lYpoI2: 11 }] }, {}, [1])(1);
    });
  })(bd)), bd.exports;
}
IA();
var wd, ny;
function Mx() {
  return ny || (ny = 1, wd = [
    // current
    "precision",
    "highp",
    "mediump",
    "lowp",
    "attribute",
    "const",
    "uniform",
    "varying",
    "break",
    "continue",
    "do",
    "for",
    "while",
    "if",
    "else",
    "in",
    "out",
    "inout",
    "float",
    "int",
    "uint",
    "void",
    "bool",
    "true",
    "false",
    "discard",
    "return",
    "mat2",
    "mat3",
    "mat4",
    "vec2",
    "vec3",
    "vec4",
    "ivec2",
    "ivec3",
    "ivec4",
    "bvec2",
    "bvec3",
    "bvec4",
    "sampler1D",
    "sampler2D",
    "sampler3D",
    "samplerCube",
    "sampler1DShadow",
    "sampler2DShadow",
    "struct",
    "asm",
    "class",
    "union",
    "enum",
    "typedef",
    "template",
    "this",
    "packed",
    "goto",
    "switch",
    "default",
    "inline",
    "noinline",
    "volatile",
    "public",
    "static",
    "extern",
    "external",
    "interface",
    "long",
    "short",
    "double",
    "half",
    "fixed",
    "unsigned",
    "input",
    "output",
    "hvec2",
    "hvec3",
    "hvec4",
    "dvec2",
    "dvec3",
    "dvec4",
    "fvec2",
    "fvec3",
    "fvec4",
    "sampler2DRect",
    "sampler3DRect",
    "sampler2DRectShadow",
    "sizeof",
    "cast",
    "namespace",
    "using"
  ]), wd;
}
var Sd, ry;
function DA() {
  return ry || (ry = 1, Sd = [
    "<<=",
    ">>=",
    "++",
    "--",
    "<<",
    ">>",
    "<=",
    ">=",
    "==",
    "!=",
    "&&",
    "||",
    "+=",
    "-=",
    "*=",
    "/=",
    "%=",
    "&=",
    "^^",
    "^=",
    "|=",
    "(",
    ")",
    "[",
    "]",
    ".",
    "!",
    "~",
    "*",
    "/",
    "%",
    "+",
    "-",
    "<",
    ">",
    "&",
    "^",
    "|",
    "?",
    ":",
    "=",
    ",",
    ";",
    "{",
    "}"
  ]), Sd;
}
var Md, oy;
function Ax() {
  return oy || (oy = 1, Md = [
    // Keep this list sorted
    "abs",
    "acos",
    "all",
    "any",
    "asin",
    "atan",
    "ceil",
    "clamp",
    "cos",
    "cross",
    "dFdx",
    "dFdy",
    "degrees",
    "distance",
    "dot",
    "equal",
    "exp",
    "exp2",
    "faceforward",
    "floor",
    "fract",
    "gl_BackColor",
    "gl_BackLightModelProduct",
    "gl_BackLightProduct",
    "gl_BackMaterial",
    "gl_BackSecondaryColor",
    "gl_ClipPlane",
    "gl_ClipVertex",
    "gl_Color",
    "gl_DepthRange",
    "gl_DepthRangeParameters",
    "gl_EyePlaneQ",
    "gl_EyePlaneR",
    "gl_EyePlaneS",
    "gl_EyePlaneT",
    "gl_Fog",
    "gl_FogCoord",
    "gl_FogFragCoord",
    "gl_FogParameters",
    "gl_FragColor",
    "gl_FragCoord",
    "gl_FragData",
    "gl_FragDepth",
    "gl_FragDepthEXT",
    "gl_FrontColor",
    "gl_FrontFacing",
    "gl_FrontLightModelProduct",
    "gl_FrontLightProduct",
    "gl_FrontMaterial",
    "gl_FrontSecondaryColor",
    "gl_LightModel",
    "gl_LightModelParameters",
    "gl_LightModelProducts",
    "gl_LightProducts",
    "gl_LightSource",
    "gl_LightSourceParameters",
    "gl_MaterialParameters",
    "gl_MaxClipPlanes",
    "gl_MaxCombinedTextureImageUnits",
    "gl_MaxDrawBuffers",
    "gl_MaxFragmentUniformComponents",
    "gl_MaxLights",
    "gl_MaxTextureCoords",
    "gl_MaxTextureImageUnits",
    "gl_MaxTextureUnits",
    "gl_MaxVaryingFloats",
    "gl_MaxVertexAttribs",
    "gl_MaxVertexTextureImageUnits",
    "gl_MaxVertexUniformComponents",
    "gl_ModelViewMatrix",
    "gl_ModelViewMatrixInverse",
    "gl_ModelViewMatrixInverseTranspose",
    "gl_ModelViewMatrixTranspose",
    "gl_ModelViewProjectionMatrix",
    "gl_ModelViewProjectionMatrixInverse",
    "gl_ModelViewProjectionMatrixInverseTranspose",
    "gl_ModelViewProjectionMatrixTranspose",
    "gl_MultiTexCoord0",
    "gl_MultiTexCoord1",
    "gl_MultiTexCoord2",
    "gl_MultiTexCoord3",
    "gl_MultiTexCoord4",
    "gl_MultiTexCoord5",
    "gl_MultiTexCoord6",
    "gl_MultiTexCoord7",
    "gl_Normal",
    "gl_NormalMatrix",
    "gl_NormalScale",
    "gl_ObjectPlaneQ",
    "gl_ObjectPlaneR",
    "gl_ObjectPlaneS",
    "gl_ObjectPlaneT",
    "gl_Point",
    "gl_PointCoord",
    "gl_PointParameters",
    "gl_PointSize",
    "gl_Position",
    "gl_ProjectionMatrix",
    "gl_ProjectionMatrixInverse",
    "gl_ProjectionMatrixInverseTranspose",
    "gl_ProjectionMatrixTranspose",
    "gl_SecondaryColor",
    "gl_TexCoord",
    "gl_TextureEnvColor",
    "gl_TextureMatrix",
    "gl_TextureMatrixInverse",
    "gl_TextureMatrixInverseTranspose",
    "gl_TextureMatrixTranspose",
    "gl_Vertex",
    "greaterThan",
    "greaterThanEqual",
    "inversesqrt",
    "length",
    "lessThan",
    "lessThanEqual",
    "log",
    "log2",
    "matrixCompMult",
    "max",
    "min",
    "mix",
    "mod",
    "normalize",
    "not",
    "notEqual",
    "pow",
    "radians",
    "reflect",
    "refract",
    "sign",
    "sin",
    "smoothstep",
    "sqrt",
    "step",
    "tan",
    "texture2D",
    "texture2DLod",
    "texture2DProj",
    "texture2DProjLod",
    "textureCube",
    "textureCubeLod",
    "texture2DLodEXT",
    "texture2DProjLodEXT",
    "textureCubeLodEXT",
    "texture2DGradEXT",
    "texture2DProjGradEXT",
    "textureCubeGradEXT"
  ]), Md;
}
var Ad, ay;
function LA() {
  if (ay) return Ad;
  ay = 1;
  var a = Mx();
  return Ad = a.slice().concat([
    "layout",
    "centroid",
    "smooth",
    "case",
    "mat2x2",
    "mat2x3",
    "mat2x4",
    "mat3x2",
    "mat3x3",
    "mat3x4",
    "mat4x2",
    "mat4x3",
    "mat4x4",
    "uvec2",
    "uvec3",
    "uvec4",
    "samplerCubeShadow",
    "sampler2DArray",
    "sampler2DArrayShadow",
    "isampler2D",
    "isampler3D",
    "isamplerCube",
    "isampler2DArray",
    "usampler2D",
    "usampler3D",
    "usamplerCube",
    "usampler2DArray",
    "coherent",
    "restrict",
    "readonly",
    "writeonly",
    "resource",
    "atomic_uint",
    "noperspective",
    "patch",
    "sample",
    "subroutine",
    "common",
    "partition",
    "active",
    "filter",
    "image1D",
    "image2D",
    "image3D",
    "imageCube",
    "iimage1D",
    "iimage2D",
    "iimage3D",
    "iimageCube",
    "uimage1D",
    "uimage2D",
    "uimage3D",
    "uimageCube",
    "image1DArray",
    "image2DArray",
    "iimage1DArray",
    "iimage2DArray",
    "uimage1DArray",
    "uimage2DArray",
    "image1DShadow",
    "image2DShadow",
    "image1DArrayShadow",
    "image2DArrayShadow",
    "imageBuffer",
    "iimageBuffer",
    "uimageBuffer",
    "sampler1DArray",
    "sampler1DArrayShadow",
    "isampler1D",
    "isampler1DArray",
    "usampler1D",
    "usampler1DArray",
    "isampler2DRect",
    "usampler2DRect",
    "samplerBuffer",
    "isamplerBuffer",
    "usamplerBuffer",
    "sampler2DMS",
    "isampler2DMS",
    "usampler2DMS",
    "sampler2DMSArray",
    "isampler2DMSArray",
    "usampler2DMSArray"
  ]), Ad;
}
var Ed, ly;
function OA() {
  if (ly) return Ed;
  ly = 1;
  var a = Ax();
  return a = a.slice().filter(function(e) {
    return !/^(gl\_|texture)/.test(e);
  }), Ed = a.concat([
    // the updated gl_ constants
    "gl_VertexID",
    "gl_InstanceID",
    "gl_Position",
    "gl_PointSize",
    "gl_FragCoord",
    "gl_FrontFacing",
    "gl_FragDepth",
    "gl_PointCoord",
    "gl_MaxVertexAttribs",
    "gl_MaxVertexUniformVectors",
    "gl_MaxVertexOutputVectors",
    "gl_MaxFragmentInputVectors",
    "gl_MaxVertexTextureImageUnits",
    "gl_MaxCombinedTextureImageUnits",
    "gl_MaxTextureImageUnits",
    "gl_MaxFragmentUniformVectors",
    "gl_MaxDrawBuffers",
    "gl_MinProgramTexelOffset",
    "gl_MaxProgramTexelOffset",
    "gl_DepthRangeParameters",
    "gl_DepthRange",
    "trunc",
    "round",
    "roundEven",
    "isnan",
    "isinf",
    "floatBitsToInt",
    "floatBitsToUint",
    "intBitsToFloat",
    "uintBitsToFloat",
    "packSnorm2x16",
    "unpackSnorm2x16",
    "packUnorm2x16",
    "unpackUnorm2x16",
    "packHalf2x16",
    "unpackHalf2x16",
    "outerProduct",
    "transpose",
    "determinant",
    "inverse",
    "texture",
    "textureSize",
    "textureProj",
    "textureLod",
    "textureOffset",
    "texelFetch",
    "texelFetchOffset",
    "textureProjOffset",
    "textureLodOffset",
    "textureProjLod",
    "textureProjLodOffset",
    "textureGrad",
    "textureGradOffset",
    "textureProjGrad",
    "textureProjGradOffset"
  ]), Ed;
}
var Rd, cy;
function UA() {
  if (cy) return Rd;
  cy = 1, Rd = w;
  var a = Mx(), e = DA(), t = Ax(), s = LA(), i = OA(), n = 999, r = 9999, o = 0, l = 1, c = 2, u = 3, h = 4, f = 5, d = 6, p = 7, m3 = 8, g = 9, y3 = 10, x = 11, v = [
    "block-comment",
    "line-comment",
    "preprocessor",
    "operator",
    "integer",
    "float",
    "ident",
    "builtin",
    "keyword",
    "whitespace",
    "eof",
    "integer"
  ];
  function w(A) {
    var b = 0, M = 0, _ = n, T, S3, E = [], C = [], B3 = 1, D = 0, G3 = 0, O = false, ce2 = false, te = "", H;
    A = A || {};
    var ie = t, ue2 = a;
    A.version === "300 es" && (ie = i, ue2 = s);
    for (var ge2 = {}, we = {}, b = 0; b < ie.length; b++)
      ge2[ie[b]] = true;
    for (var b = 0; b < ue2.length; b++)
      we[ue2[b]] = true;
    return function(ye2) {
      return C = [], ye2 !== null ? $(ye2) : z();
    };
    function W(ye2) {
      ye2.length && C.push({
        type: v[_],
        data: ye2,
        position: G3,
        line: B3,
        column: D
      });
    }
    function $(ye2) {
      b = 0, ye2.toString && (ye2 = ye2.toString()), te += ye2.replace(/\r\n/g, `
`), H = te.length;
      for (var q; T = te[b], b < H; ) {
        switch (q = b, _) {
          case o:
            b = I();
            break;
          case l:
            b = P();
            break;
          case c:
            b = R();
            break;
          case u:
            b = j3();
            break;
          case h:
            b = J();
            break;
          case x:
            b = ee2();
            break;
          case f:
            b = fe2();
            break;
          case r:
            b = Se();
            break;
          case g:
            b = N3();
            break;
          case n:
            b = F3();
            break;
        }
        if (q !== b)
          switch (te[q]) {
            case `
`:
              D = 0, ++B3;
              break;
            default:
              ++D;
              break;
          }
      }
      return M += b, te = te.slice(b), C;
    }
    function z(ye2) {
      return E.length && W(E.join("")), _ = y3, W("(eof)"), C;
    }
    function F3() {
      return E = E.length ? [] : E, S3 === "/" && T === "*" ? (G3 = M + b - 1, _ = o, S3 = T, b + 1) : S3 === "/" && T === "/" ? (G3 = M + b - 1, _ = l, S3 = T, b + 1) : T === "#" ? (_ = c, G3 = M + b, b) : /\s/.test(T) ? (_ = g, G3 = M + b, b) : (O = /\d/.test(T), ce2 = /[^\w_]/.test(T), G3 = M + b, _ = O ? h : ce2 ? u : r, b);
    }
    function N3() {
      return /[^\s]/g.test(T) ? (W(E.join("")), _ = n, b) : (E.push(T), S3 = T, b + 1);
    }
    function R() {
      return (T === "\r" || T === `
`) && S3 !== "\\" ? (W(E.join("")), _ = n, b) : (E.push(T), S3 = T, b + 1);
    }
    function P() {
      return R();
    }
    function I() {
      return T === "/" && S3 === "*" ? (E.push(T), W(E.join("")), _ = n, b + 1) : (E.push(T), S3 = T, b + 1);
    }
    function j3() {
      if (S3 === "." && /\d/.test(T))
        return _ = f, b;
      if (S3 === "/" && T === "*")
        return _ = o, b;
      if (S3 === "/" && T === "/")
        return _ = l, b;
      if (T === "." && E.length) {
        for (; K(E); ) ;
        return _ = f, b;
      }
      if (T === ";" || T === ")" || T === "(") {
        if (E.length) for (; K(E); ) ;
        return W(T), _ = n, b + 1;
      }
      var ye2 = E.length === 2 && T !== "=";
      if (/[\w_\d\s]/.test(T) || ye2) {
        for (; K(E); ) ;
        return _ = n, b;
      }
      return E.push(T), S3 = T, b + 1;
    }
    function K(ye2) {
      var q = 0, L3, xe;
      do {
        if (L3 = e.indexOf(ye2.slice(0, ye2.length + q).join("")), xe = e[L3], L3 === -1) {
          if (q-- + ye2.length > 0) continue;
          xe = ye2.slice(0, 1).join("");
        }
        return W(xe), G3 += xe.length, E = E.slice(xe.length), E.length;
      } while (true);
    }
    function ee2() {
      return /[^a-fA-F0-9]/.test(T) ? (W(E.join("")), _ = n, b) : (E.push(T), S3 = T, b + 1);
    }
    function J() {
      return T === "." || /[eE]/.test(T) ? (E.push(T), _ = f, S3 = T, b + 1) : T === "x" && E.length === 1 && E[0] === "0" ? (_ = x, E.push(T), S3 = T, b + 1) : /[^\d]/.test(T) ? (W(E.join("")), _ = n, b) : (E.push(T), S3 = T, b + 1);
    }
    function fe2() {
      return T === "f" && (E.push(T), S3 = T, b += 1), /[eE]/.test(T) || (T === "-" || T === "+") && /[eE]/.test(S3) ? (E.push(T), S3 = T, b + 1) : /[^\d]/.test(T) ? (W(E.join("")), _ = n, b) : (E.push(T), S3 = T, b + 1);
    }
    function Se() {
      if (/[^\d\w_]/.test(T)) {
        var ye2 = E.join("");
        return we[ye2] ? _ = m3 : ge2[ye2] ? _ = p : _ = d, W(E.join("")), _ = n, b;
      }
      return E.push(T), S3 = T, b + 1;
    }
  }
  return Rd;
}
var Cd, uy;
function kA() {
  if (uy) return Cd;
  uy = 1;
  var a = UA();
  Cd = e;
  function e(t, s) {
    var i = a(s), n = [];
    return n = n.concat(i(t)), n = n.concat(i(null)), n;
  }
  return Cd;
}
kA();
function qA(a, e) {
  if (typeof a != "object" || a === null) return a;
  var t = a[Symbol.toPrimitive];
  if (t !== void 0) {
    var s = t.call(a, e);
    if (typeof s != "object") return s;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(a);
}
function Ex(a) {
  var e = qA(a, "string");
  return typeof e == "symbol" ? e : String(e);
}
function bt(a, e, t) {
  return e = Ex(e), e in a ? Object.defineProperty(a, e, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : a[e] = t, a;
}
var He = {
  position: "csm_Position",
  positionRaw: "csm_PositionRaw",
  pointSize: "csm_PointSize",
  fragColor: "csm_FragColor",
  // PBR
  diffuseColor: "csm_DiffuseColor",
  // Color + alpha
  normal: "csm_Normal",
  // Normal
  roughness: "csm_Roughness",
  // Roughness
  metalness: "csm_Metalness",
  // Metalness
  emissive: "csm_Emissive",
  // Emissive
  ao: "csm_AO",
  // AO
  bump: "csm_Bump",
  // Bump
  depthAlpha: "csm_DepthAlpha"
  // Depth
}, Cs, Mo;
Cs = {}, bt(Cs, "".concat(He.normal), {
  "#include <beginnormal_vertex>": `
    vec3 objectNormal = `.concat(He.normal, `;
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `)
}), bt(Cs, "".concat(He.position), {
  "#include <begin_vertex>": `
    vec3 transformed = `.concat(He.position, `;
  `)
}), bt(Cs, "".concat(He.positionRaw), {
  "#include <begin_vertex>": `
    vec4 csm_internal_positionUnprojected = `.concat(He.positionRaw, `;
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `)
}), bt(Cs, "".concat(He.pointSize), {
  "gl_PointSize = size;": `
    gl_PointSize = `.concat(He.pointSize, `;
    `)
}), bt(Cs, "".concat(He.diffuseColor), {
  "#include <color_fragment>": `
    #include <color_fragment>
    diffuseColor = `.concat(He.diffuseColor, `;
  `)
}), bt(Cs, "".concat(He.fragColor), {
  "#include <dithering_fragment>": `
    #include <dithering_fragment>
    gl_FragColor  = `.concat(He.fragColor, `;
  `)
}), bt(Cs, "".concat(He.emissive), {
  "vec3 totalEmissiveRadiance = emissive;": `
    vec3 totalEmissiveRadiance = `.concat(He.emissive, `;
    `)
}), bt(Cs, "".concat(He.roughness), {
  "#include <roughnessmap_fragment>": `
    #include <roughnessmap_fragment>
    roughnessFactor = `.concat(He.roughness, `;
    `)
}), bt(Cs, "".concat(He.metalness), {
  "#include <metalnessmap_fragment>": `
    #include <metalnessmap_fragment>
    metalnessFactor = `.concat(He.metalness, `;
    `)
}), bt(Cs, "".concat(He.ao), {
  "#include <aomap_fragment>": `
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - `.concat(He.ao, `;
    `)
}), bt(Cs, "".concat(He.bump), {
  "#include <normal_fragment_maps>": `
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = `.concat(He.bump, " - (dot(").concat(He.bump, `, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `)
}), bt(Cs, "".concat(He.depthAlpha), {
  "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * `.concat(He.depthAlpha, ` );
    `),
  "gl_FragColor = packDepthToRGBA( fragCoordZ );": `
      gl_FragColor = packDepthToRGBA( fragCoordZ );
      gl_FragColor.a *= `.concat(He.depthAlpha, `;
    `)
});
Mo = {}, bt(Mo, "".concat(He.position), {
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": `
    gl_Position = projectionMatrix * modelViewMatrix * vec4( `.concat(He.position, `, 1.0 );
  `)
}), bt(Mo, "".concat(He.positionRaw), {
  "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );": `
    gl_Position = `.concat(He.position, `;
  `)
}), bt(Mo, "".concat(He.diffuseColor), {
  "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": `
    gl_FragColor = `.concat(He.diffuseColor, `;
  `)
}), bt(Mo, "".concat(He.fragColor), {
  "gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );": `
    gl_FragColor = `.concat(He.fragColor, `;
  `)
});
var Ns;
Ns = {}, bt(Ns, "".concat(He.position), "*"), bt(Ns, "".concat(He.positionRaw), "*"), bt(Ns, "".concat(He.normal), "*"), bt(Ns, "".concat(He.pointSize), ["PointsMaterial"]), bt(Ns, "".concat(He.diffuseColor), "*"), bt(Ns, "".concat(He.fragColor), "*"), bt(Ns, "".concat(He.emissive), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), bt(Ns, "".concat(He.roughness), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), bt(Ns, "".concat(He.metalness), ["MeshStandardMaterial", "MeshPhysicalMaterial"]), bt(Ns, "".concat(He.ao), ["MeshStandardMaterial", "MeshPhysicalMaterial", "MeshBasicMaterial", "MeshLambertMaterial", "MeshPhongMaterial", "MeshToonMaterial"]), bt(Ns, "".concat(He.bump), ["MeshLambertMaterial", "MeshMatcapMaterial", "MeshNormalMaterial", "MeshPhongMaterial", "MeshPhysicalMaterial", "MeshStandardMaterial", "MeshToonMaterial", "ShadowMaterial"]), bt(Ns, "".concat(He.depthAlpha), "*");
/**
 * @license
 * Copyright 2010-2025 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
const vh = "180", Ms = 1, Qr = 2, ta = 0, Qp = 300, Nl = 301, Iu = 302, pa = 1e3, cr = 1001, ma = 1002, Zt = 1003, ti = 1006, Pn = 1008, gs = 1009, fs = 1013, zt = 1014, Ds = 1015, Ks = 1016, Zs = 1023, Qi = 1026, In = 1027, mr = 0, jE = 1, gr = "", js = "srgb", cp = "srgb-linear", th = "linear", ze = "srgb", sh = 35044, Qs = 2e3, yr = 2001;
class co2 {
  /**
   * Adds the given event listener to the given event type.
   *
   * @param {string} type - The type of event to listen to.
   * @param {Function} listener - The function that gets called when the event is fired.
   */
  addEventListener(e, t) {
    this._listeners === void 0 && (this._listeners = {});
    const s = this._listeners;
    s[e] === void 0 && (s[e] = []), s[e].indexOf(t) === -1 && s[e].push(t);
  }
  /**
   * Returns `true` if the given event listener has been added to the given event type.
   *
   * @param {string} type - The type of event.
   * @param {Function} listener - The listener to check.
   * @return {boolean} Whether the given event listener has been added to the given event type.
   */
  hasEventListener(e, t) {
    const s = this._listeners;
    return s === void 0 ? false : s[e] !== void 0 && s[e].indexOf(t) !== -1;
  }
  /**
   * Removes the given event listener from the given event type.
   *
   * @param {string} type - The type of event.
   * @param {Function} listener - The listener to remove.
   */
  removeEventListener(e, t) {
    const s = this._listeners;
    if (s === void 0) return;
    const i = s[e];
    if (i !== void 0) {
      const n = i.indexOf(t);
      n !== -1 && i.splice(n, 1);
    }
  }
  /**
   * Dispatches an event object.
   *
   * @param {Object} event - The event that gets fired.
   */
  dispatchEvent(e) {
    const t = this._listeners;
    if (t === void 0) return;
    const s = t[e.type];
    if (s !== void 0) {
      e.target = this;
      const i = s.slice(0);
      for (let n = 0, r = i.length; n < r; n++)
        i[n].call(this, e);
      e.target = null;
    }
  }
}
const us = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "0a", "0b", "0c", "0d", "0e", "0f", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "1a", "1b", "1c", "1d", "1e", "1f", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "2a", "2b", "2c", "2d", "2e", "2f", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "3a", "3b", "3c", "3d", "3e", "3f", "40", "41", "42", "43", "44", "45", "46", "47", "48", "49", "4a", "4b", "4c", "4d", "4e", "4f", "50", "51", "52", "53", "54", "55", "56", "57", "58", "59", "5a", "5b", "5c", "5d", "5e", "5f", "60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "6a", "6b", "6c", "6d", "6e", "6f", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", "7a", "7b", "7c", "7d", "7e", "7f", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "8a", "8b", "8c", "8d", "8e", "8f", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99", "9a", "9b", "9c", "9d", "9e", "9f", "a0", "a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "aa", "ab", "ac", "ad", "ae", "af", "b0", "b1", "b2", "b3", "b4", "b5", "b6", "b7", "b8", "b9", "ba", "bb", "bc", "bd", "be", "bf", "c0", "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "ca", "cb", "cc", "cd", "ce", "cf", "d0", "d1", "d2", "d3", "d4", "d5", "d6", "d7", "d8", "d9", "da", "db", "dc", "dd", "de", "df", "e0", "e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "ea", "eb", "ec", "ed", "ee", "ef", "f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "fa", "fb", "fc", "fd", "fe", "ff"];
let yy = 1234567;
const xl = Math.PI / 180, ga = 180 / Math.PI;
function Bn() {
  const a = Math.random() * 4294967295 | 0, e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, s = Math.random() * 4294967295 | 0;
  return (us[a & 255] + us[a >> 8 & 255] + us[a >> 16 & 255] + us[a >> 24 & 255] + "-" + us[e & 255] + us[e >> 8 & 255] + "-" + us[e >> 16 & 15 | 64] + us[e >> 24 & 255] + "-" + us[t & 63 | 128] + us[t >> 8 & 255] + "-" + us[t >> 16 & 255] + us[t >> 24 & 255] + us[s & 255] + us[s >> 8 & 255] + us[s >> 16 & 255] + us[s >> 24 & 255]).toLowerCase();
}
function Je(a, e, t) {
  return Math.max(e, Math.min(t, a));
}
function nm(a, e) {
  return (a % e + e) % e;
}
function aR(a, e, t, s, i) {
  return s + (a - e) * (i - s) / (t - e);
}
function lR(a, e, t) {
  return a !== e ? (t - a) / (e - a) : 0;
}
function vl(a, e, t) {
  return (1 - t) * a + t * e;
}
function cR(a, e, t, s) {
  return vl(a, e, 1 - Math.exp(-t * s));
}
function uR(a, e = 1) {
  return e - Math.abs(nm(a, e * 2) - e);
}
function hR(a, e, t) {
  return a <= e ? 0 : a >= t ? 1 : (a = (a - e) / (t - e), a * a * (3 - 2 * a));
}
function dR(a, e, t) {
  return a <= e ? 0 : a >= t ? 1 : (a = (a - e) / (t - e), a * a * a * (a * (a * 6 - 15) + 10));
}
function fR(a, e) {
  return a + Math.floor(Math.random() * (e - a + 1));
}
function pR(a, e) {
  return a + Math.random() * (e - a);
}
function mR(a) {
  return a * (0.5 - Math.random());
}
function gR(a) {
  a !== void 0 && (yy = a);
  let e = yy += 1831565813;
  return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
}
function yR(a) {
  return a * xl;
}
function xR(a) {
  return a * ga;
}
function vR(a) {
  return (a & a - 1) === 0 && a !== 0;
}
function _R(a) {
  return Math.pow(2, Math.ceil(Math.log(a) / Math.LN2));
}
function TR(a) {
  return Math.pow(2, Math.floor(Math.log(a) / Math.LN2));
}
function bR(a, e, t, s, i) {
  const n = Math.cos, r = Math.sin, o = n(t / 2), l = r(t / 2), c = n((e + s) / 2), u = r((e + s) / 2), h = n((e - s) / 2), f = r((e - s) / 2), d = n((s - e) / 2), p = r((s - e) / 2);
  switch (i) {
    case "XYX":
      a.set(o * u, l * h, l * f, o * c);
      break;
    case "YZY":
      a.set(l * f, o * u, l * h, o * c);
      break;
    case "ZXZ":
      a.set(l * h, l * f, o * u, o * c);
      break;
    case "XZX":
      a.set(o * u, l * p, l * d, o * c);
      break;
    case "YXY":
      a.set(l * d, o * u, l * p, o * c);
      break;
    case "ZYZ":
      a.set(l * p, l * d, o * u, o * c);
      break;
    default:
      console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
  }
}
function ws(a, e) {
  switch (e.constructor) {
    case Float32Array:
      return a;
    case Uint32Array:
      return a / 4294967295;
    case Uint16Array:
      return a / 65535;
    case Uint8Array:
      return a / 255;
    case Int32Array:
      return Math.max(a / 2147483647, -1);
    case Int16Array:
      return Math.max(a / 32767, -1);
    case Int8Array:
      return Math.max(a / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function je(a, e) {
  switch (e.constructor) {
    case Float32Array:
      return a;
    case Uint32Array:
      return Math.round(a * 4294967295);
    case Uint16Array:
      return Math.round(a * 65535);
    case Uint8Array:
      return Math.round(a * 255);
    case Int32Array:
      return Math.round(a * 2147483647);
    case Int16Array:
      return Math.round(a * 32767);
    case Int8Array:
      return Math.round(a * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
const wR = {
  DEG2RAD: xl,
  RAD2DEG: ga,
  /**
   * Generate a [UUID]{@link https://en.wikipedia.org/wiki/Universally_unique_identifier}
   * (universally unique identifier).
   *
   * @static
   * @method
   * @return {string} The UUID.
   */
  generateUUID: Bn,
  /**
   * Clamps the given value between min and max.
   *
   * @static
   * @method
   * @param {number} value - The value to clamp.
   * @param {number} min - The min value.
   * @param {number} max - The max value.
   * @return {number} The clamped value.
   */
  clamp: Je,
  /**
   * Computes the Euclidean modulo of the given parameters that
   * is `( ( n % m ) + m ) % m`.
   *
   * @static
   * @method
   * @param {number} n - The first parameter.
   * @param {number} m - The second parameter.
   * @return {number} The Euclidean modulo.
   */
  euclideanModulo: nm,
  /**
   * Performs a linear mapping from range `<a1, a2>` to range `<b1, b2>`
   * for the given value.
   *
   * @static
   * @method
   * @param {number} x - The value to be mapped.
   * @param {number} a1 - Minimum value for range A.
   * @param {number} a2 - Maximum value for range A.
   * @param {number} b1 - Minimum value for range B.
   * @param {number} b2 - Maximum value for range B.
   * @return {number} The mapped value.
   */
  mapLinear: aR,
  /**
   * Returns the percentage in the closed interval `[0, 1]` of the given value
   * between the start and end point.
   *
   * @static
   * @method
   * @param {number} x - The start point
   * @param {number} y - The end point.
   * @param {number} value - A value between start and end.
   * @return {number} The interpolation factor.
   */
  inverseLerp: lR,
  /**
   * Returns a value linearly interpolated from two known points based on the given interval -
   * `t = 0` will return `x` and `t = 1` will return `y`.
   *
   * @static
   * @method
   * @param {number} x - The start point
   * @param {number} y - The end point.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {number} The interpolated value.
   */
  lerp: vl,
  /**
   * Smoothly interpolate a number from `x` to `y` in  a spring-like manner using a delta
   * time to maintain frame rate independent movement. For details, see
   * [Frame rate independent damping using lerp]{@link http://www.rorydriscoll.com/2016/03/07/frame-rate-independent-damping-using-lerp/}.
   *
   * @static
   * @method
   * @param {number} x - The current point.
   * @param {number} y - The target point.
   * @param {number} lambda - A higher lambda value will make the movement more sudden,
   * and a lower value will make the movement more gradual.
   * @param {number} dt - Delta time in seconds.
   * @return {number} The interpolated value.
   */
  damp: cR,
  /**
   * Returns a value that alternates between `0` and the given `length` parameter.
   *
   * @static
   * @method
   * @param {number} x - The value to pingpong.
   * @param {number} [length=1] - The positive value the function will pingpong to.
   * @return {number} The alternated value.
   */
  pingpong: uR,
  /**
   * Returns a value in the range `[0,1]` that represents the percentage that `x` has
   * moved between `min` and `max`, but smoothed or slowed down the closer `x` is to
   * the `min` and `max`.
   *
   * See [Smoothstep]{@link http://en.wikipedia.org/wiki/Smoothstep} for more details.
   *
   * @static
   * @method
   * @param {number} x - The value to evaluate based on its position between min and max.
   * @param {number} min - The min value. Any x value below min will be `0`.
   * @param {number} max - The max value. Any x value above max will be `1`.
   * @return {number} The alternated value.
   */
  smoothstep: hR,
  /**
   * A [variation on smoothstep]{@link https://en.wikipedia.org/wiki/Smoothstep#Variations}
   * that has zero 1st and 2nd order derivatives at x=0 and x=1.
   *
   * @static
   * @method
   * @param {number} x - The value to evaluate based on its position between min and max.
   * @param {number} min - The min value. Any x value below min will be `0`.
   * @param {number} max - The max value. Any x value above max will be `1`.
   * @return {number} The alternated value.
   */
  smootherstep: dR,
  /**
   * Returns a random integer from `<low, high>` interval.
   *
   * @static
   * @method
   * @param {number} low - The lower value boundary.
   * @param {number} high - The upper value boundary
   * @return {number} A random integer.
   */
  randInt: fR,
  /**
   * Returns a random float from `<low, high>` interval.
   *
   * @static
   * @method
   * @param {number} low - The lower value boundary.
   * @param {number} high - The upper value boundary
   * @return {number} A random float.
   */
  randFloat: pR,
  /**
   * Returns a random integer from `<-range/2, range/2>` interval.
   *
   * @static
   * @method
   * @param {number} range - Defines the value range.
   * @return {number} A random float.
   */
  randFloatSpread: mR,
  /**
   * Returns a deterministic pseudo-random float in the interval `[0, 1]`.
   *
   * @static
   * @method
   * @param {number} [s] - The integer seed.
   * @return {number} A random float.
   */
  seededRandom: gR,
  /**
   * Converts degrees to radians.
   *
   * @static
   * @method
   * @param {number} degrees - A value in degrees.
   * @return {number} The converted value in radians.
   */
  degToRad: yR,
  /**
   * Converts radians to degrees.
   *
   * @static
   * @method
   * @param {number} radians - A value in radians.
   * @return {number} The converted value in degrees.
   */
  radToDeg: xR,
  /**
   * Returns `true` if the given number is a power of two.
   *
   * @static
   * @method
   * @param {number} value - The value to check.
   * @return {boolean} Whether the given number is a power of two or not.
   */
  isPowerOfTwo: vR,
  /**
   * Returns the smallest power of two that is greater than or equal to the given number.
   *
   * @static
   * @method
   * @param {number} value - The value to find a POT for.
   * @return {number} The smallest power of two that is greater than or equal to the given number.
   */
  ceilPowerOfTwo: _R,
  /**
   * Returns the largest power of two that is less than or equal to the given number.
   *
   * @static
   * @method
   * @param {number} value - The value to find a POT for.
   * @return {number} The largest power of two that is less than or equal to the given number.
   */
  floorPowerOfTwo: TR,
  /**
   * Sets the given quaternion from the [Intrinsic Proper Euler Angles]{@link https://en.wikipedia.org/wiki/Euler_angles}
   * defined by the given angles and order.
   *
   * Rotations are applied to the axes in the order specified by order:
   * rotation by angle `a` is applied first, then by angle `b`, then by angle `c`.
   *
   * @static
   * @method
   * @param {Quaternion} q - The quaternion to set.
   * @param {number} a - The rotation applied to the first axis, in radians.
   * @param {number} b - The rotation applied to the second axis, in radians.
   * @param {number} c - The rotation applied to the third axis, in radians.
   * @param {('XYX'|'XZX'|'YXY'|'YZY'|'ZXZ'|'ZYZ')} order - A string specifying the axes order.
   */
  setQuaternionFromProperEuler: bR,
  /**
   * Normalizes the given value according to the given typed array.
   *
   * @static
   * @method
   * @param {number} value - The float value in the range `[0,1]` to normalize.
   * @param {TypedArray} array - The typed array that defines the data type of the value.
   * @return {number} The normalize value.
   */
  normalize: je,
  /**
   * Denormalizes the given value according to the given typed array.
   *
   * @static
   * @method
   * @param {number} value - The value to denormalize.
   * @param {TypedArray} array - The typed array that defines the data type of the value.
   * @return {number} The denormalize (float) value in the range `[0,1]`.
   */
  denormalize: ws
};
class Ke {
  /**
   * Constructs a new 2D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   */
  constructor(e = 0, t = 0) {
    Ke.prototype.isVector2 = true, this.x = e, this.y = t;
  }
  /**
   * Alias for {@link Vector2#x}.
   *
   * @type {number}
   */
  get width() {
    return this.x;
  }
  set width(e) {
    this.x = e;
  }
  /**
   * Alias for {@link Vector2#y}.
   *
   * @type {number}
   */
  get height() {
    return this.y;
  }
  set height(e) {
    this.y = e;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @return {Vector2} A reference to this vector.
   */
  set(e, t) {
    return this.x = e, this.y = t, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector2} A reference to this vector.
   */
  setScalar(e) {
    return this.x = e, this.y = e, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setX(e) {
    return this.x = e, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setY(e) {
    return this.y = e, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y.
   * @param {number} value - The value to set.
   * @return {Vector2} A reference to this vector.
   */
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y.
   * @return {number} A vector component value.
   */
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector2} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector2} v - The vector to copy.
   * @return {Vector2} A reference to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector2} v - The vector to add.
   * @return {Vector2} A reference to this vector.
   */
  add(e) {
    return this.x += e.x, this.y += e.y, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector2} A reference to this vector.
   */
  addScalar(e) {
    return this.x += e, this.y += e, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector2} a - The first vector.
   * @param {Vector2} b - The second vector.
   * @return {Vector2} A reference to this vector.
   */
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector2} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector2} A reference to this vector.
   */
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector2} v - The vector to subtract.
   * @return {Vector2} A reference to this vector.
   */
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector2} A reference to this vector.
   */
  subScalar(e) {
    return this.x -= e, this.y -= e, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector2} a - The first vector.
   * @param {Vector2} b - The second vector.
   * @return {Vector2} A reference to this vector.
   */
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector2} v - The vector to multiply.
   * @return {Vector2} A reference to this vector.
   */
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector2} A reference to this vector.
   */
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this;
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector2} v - The vector to divide.
   * @return {Vector2} A reference to this vector.
   */
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector2} A reference to this vector.
   */
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  /**
   * Multiplies this vector (with an implicit 1 as the 3rd component) by
   * the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to apply.
   * @return {Vector2} A reference to this vector.
   */
  applyMatrix3(e) {
    const t = this.x, s = this.y, i = e.elements;
    return this.x = i[0] * t + i[3] * s + i[6], this.y = i[1] * t + i[4] * s + i[7], this;
  }
  /**
   * If this vector's x or y value is greater than the given vector's x or y
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector2} v - The vector.
   * @return {Vector2} A reference to this vector.
   */
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
  }
  /**
   * If this vector's x or y value is less than the given vector's x or y
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector2} v - The vector.
   * @return {Vector2} A reference to this vector.
   */
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
  }
  /**
   * If this vector's x or y value is greater than the max vector's x or y
   * value, it is replaced by the corresponding value.
   * If this vector's x or y value is less than the min vector's x or y value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector2} min - The minimum x and y values.
   * @param {Vector2} max - The maximum x and y values in the desired range.
   * @return {Vector2} A reference to this vector.
   */
  clamp(e, t) {
    return this.x = Je(this.x, e.x, t.x), this.y = Je(this.y, e.y, t.y), this;
  }
  /**
   * If this vector's x or y values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x or y values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector2} A reference to this vector.
   */
  clampScalar(e, t) {
    return this.x = Je(this.x, e, t), this.y = Je(this.y, e, t), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector2} A reference to this vector.
   */
  clampLength(e, t) {
    const s = this.length();
    return this.divideScalar(s || 1).multiplyScalar(Je(s, e, t));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector2} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector2} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x and y = -y.
   *
   * @return {Vector2} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector2} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this.x * e.x + this.y * e.y;
  }
  /**
   * Calculates the cross product of the given vector with this instance.
   *
   * @param {Vector2} v - The vector to compute the cross product with.
   * @return {number} The result of the cross product.
   */
  cross(e) {
    return this.x * e.y - this.y * e.x;
  }
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0) to (x, y). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0) to (x, y).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector2} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Computes the angle in radians of this vector with respect to the positive x-axis.
   *
   * @return {number} The angle in radians.
   */
  angle() {
    return Math.atan2(-this.y, -this.x) + Math.PI;
  }
  /**
   * Returns the angle between the given vector and this instance in radians.
   *
   * @param {Vector2} v - The vector to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const s = this.dot(e) / t;
    return Math.acos(Je(s, -1, 1));
  }
  /**
   * Computes the distance from the given vector to this instance.
   *
   * @param {Vector2} v - The vector to compute the distance to.
   * @return {number} The distance.
   */
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  /**
   * Computes the squared distance from the given vector to this instance.
   * If you are just comparing the distance with another distance, you should compare
   * the distance squared instead as it is slightly more efficient to calculate.
   *
   * @param {Vector2} v - The vector to compute the squared distance to.
   * @return {number} The squared distance.
   */
  distanceToSquared(e) {
    const t = this.x - e.x, s = this.y - e.y;
    return t * t + s * s;
  }
  /**
   * Computes the Manhattan distance from the given vector to this instance.
   *
   * @param {Vector2} v - The vector to compute the Manhattan distance to.
   * @return {number} The Manhattan distance.
   */
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector2} A reference to this vector.
   */
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector2} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector2} A reference to this vector.
   */
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector2} v1 - The first vector.
   * @param {Vector2} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector2} A reference to this vector.
   */
  lerpVectors(e, t, s) {
    return this.x = e.x + (t.x - e.x) * s, this.y = e.y + (t.y - e.y) * s, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector2} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(e) {
    return e.x === this.x && e.y === this.y;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]` and y
   * value to be `array[ offset + 1 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector2} A reference to this vector.
   */
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector2} A reference to this vector.
   */
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this;
  }
  /**
   * Rotates this vector around the given center by the given angle.
   *
   * @param {Vector2} center - The point around which to rotate.
   * @param {number} angle - The angle to rotate, in radians.
   * @return {Vector2} A reference to this vector.
   */
  rotateAround(e, t) {
    const s = Math.cos(t), i = Math.sin(t), n = this.x - e.x, r = this.y - e.y;
    return this.x = n * s - r * i + e.x, this.y = n * i + r * s + e.y, this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector2} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
class Ma {
  /**
   * Constructs a new quaternion.
   *
   * @param {number} [x=0] - The x value of this quaternion.
   * @param {number} [y=0] - The y value of this quaternion.
   * @param {number} [z=0] - The z value of this quaternion.
   * @param {number} [w=1] - The w value of this quaternion.
   */
  constructor(e = 0, t = 0, s = 0, i = 1) {
    this.isQuaternion = true, this._x = e, this._y = t, this._z = s, this._w = i;
  }
  /**
   * Interpolates between two quaternions via SLERP. This implementation assumes the
   * quaternion data are managed  in flat arrays.
   *
   * @param {Array<number>} dst - The destination array.
   * @param {number} dstOffset - An offset into the destination array.
   * @param {Array<number>} src0 - The source array of the first quaternion.
   * @param {number} srcOffset0 - An offset into the first source array.
   * @param {Array<number>} src1 -  The source array of the second quaternion.
   * @param {number} srcOffset1 - An offset into the second source array.
   * @param {number} t - The interpolation factor in the range `[0,1]`.
   * @see {@link Quaternion#slerp}
   */
  static slerpFlat(e, t, s, i, n, r, o) {
    let l = s[i + 0], c = s[i + 1], u = s[i + 2], h = s[i + 3];
    const f = n[r + 0], d = n[r + 1], p = n[r + 2], m3 = n[r + 3];
    if (o === 0) {
      e[t + 0] = l, e[t + 1] = c, e[t + 2] = u, e[t + 3] = h;
      return;
    }
    if (o === 1) {
      e[t + 0] = f, e[t + 1] = d, e[t + 2] = p, e[t + 3] = m3;
      return;
    }
    if (h !== m3 || l !== f || c !== d || u !== p) {
      let g = 1 - o;
      const y3 = l * f + c * d + u * p + h * m3, x = y3 >= 0 ? 1 : -1, v = 1 - y3 * y3;
      if (v > Number.EPSILON) {
        const A = Math.sqrt(v), b = Math.atan2(A, y3 * x);
        g = Math.sin(g * b) / A, o = Math.sin(o * b) / A;
      }
      const w = o * x;
      if (l = l * g + f * w, c = c * g + d * w, u = u * g + p * w, h = h * g + m3 * w, g === 1 - o) {
        const A = 1 / Math.sqrt(l * l + c * c + u * u + h * h);
        l *= A, c *= A, u *= A, h *= A;
      }
    }
    e[t] = l, e[t + 1] = c, e[t + 2] = u, e[t + 3] = h;
  }
  /**
   * Multiplies two quaternions. This implementation assumes the quaternion data are managed
   * in flat arrays.
   *
   * @param {Array<number>} dst - The destination array.
   * @param {number} dstOffset - An offset into the destination array.
   * @param {Array<number>} src0 - The source array of the first quaternion.
   * @param {number} srcOffset0 - An offset into the first source array.
   * @param {Array<number>} src1 -  The source array of the second quaternion.
   * @param {number} srcOffset1 - An offset into the second source array.
   * @return {Array<number>} The destination array.
   * @see {@link Quaternion#multiplyQuaternions}.
   */
  static multiplyQuaternionsFlat(e, t, s, i, n, r) {
    const o = s[i], l = s[i + 1], c = s[i + 2], u = s[i + 3], h = n[r], f = n[r + 1], d = n[r + 2], p = n[r + 3];
    return e[t] = o * p + u * h + l * d - c * f, e[t + 1] = l * p + u * f + c * h - o * d, e[t + 2] = c * p + u * d + o * f - l * h, e[t + 3] = u * p - o * h - l * f - c * d, e;
  }
  /**
   * The x value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  /**
   * The y value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  /**
   * The z value of this quaternion.
   *
   * @type {number}
   * @default 0
   */
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  /**
   * The w value of this quaternion.
   *
   * @type {number}
   * @default 1
   */
  get w() {
    return this._w;
  }
  set w(e) {
    this._w = e, this._onChangeCallback();
  }
  /**
   * Sets the quaternion components.
   *
   * @param {number} x - The x value of this quaternion.
   * @param {number} y - The y value of this quaternion.
   * @param {number} z - The z value of this quaternion.
   * @param {number} w - The w value of this quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  set(e, t, s, i) {
    return this._x = e, this._y = t, this._z = s, this._w = i, this._onChangeCallback(), this;
  }
  /**
   * Returns a new quaternion with copied values from this instance.
   *
   * @return {Quaternion} A clone of this instance.
   */
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._w);
  }
  /**
   * Copies the values of the given quaternion to this instance.
   *
   * @param {Quaternion} quaternion - The quaternion to copy.
   * @return {Quaternion} A reference to this quaternion.
   */
  copy(e) {
    return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the rotation specified by the given
   * Euler angles.
   *
   * @param {Euler} euler - The Euler angles.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromEuler(e, t = true) {
    const s = e._x, i = e._y, n = e._z, r = e._order, o = Math.cos, l = Math.sin, c = o(s / 2), u = o(i / 2), h = o(n / 2), f = l(s / 2), d = l(i / 2), p = l(n / 2);
    switch (r) {
      case "XYZ":
        this._x = f * u * h + c * d * p, this._y = c * d * h - f * u * p, this._z = c * u * p + f * d * h, this._w = c * u * h - f * d * p;
        break;
      case "YXZ":
        this._x = f * u * h + c * d * p, this._y = c * d * h - f * u * p, this._z = c * u * p - f * d * h, this._w = c * u * h + f * d * p;
        break;
      case "ZXY":
        this._x = f * u * h - c * d * p, this._y = c * d * h + f * u * p, this._z = c * u * p + f * d * h, this._w = c * u * h - f * d * p;
        break;
      case "ZYX":
        this._x = f * u * h - c * d * p, this._y = c * d * h + f * u * p, this._z = c * u * p - f * d * h, this._w = c * u * h + f * d * p;
        break;
      case "YZX":
        this._x = f * u * h + c * d * p, this._y = c * d * h + f * u * p, this._z = c * u * p - f * d * h, this._w = c * u * h - f * d * p;
        break;
      case "XZY":
        this._x = f * u * h - c * d * p, this._y = c * d * h - f * u * p, this._z = c * u * p + f * d * h, this._w = c * u * h + f * d * p;
        break;
      default:
        console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + r);
    }
    return t === true && this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the given axis and angle.
   *
   * @param {Vector3} axis - The normalized axis.
   * @param {number} angle - The angle in radians.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromAxisAngle(e, t) {
    const s = t / 2, i = Math.sin(s);
    return this._x = e.x * i, this._y = e.y * i, this._z = e.z * i, this._w = Math.cos(s), this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion from the given rotation matrix.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromRotationMatrix(e) {
    const t = e.elements, s = t[0], i = t[4], n = t[8], r = t[1], o = t[5], l = t[9], c = t[2], u = t[6], h = t[10], f = s + o + h;
    if (f > 0) {
      const d = 0.5 / Math.sqrt(f + 1);
      this._w = 0.25 / d, this._x = (u - l) * d, this._y = (n - c) * d, this._z = (r - i) * d;
    } else if (s > o && s > h) {
      const d = 2 * Math.sqrt(1 + s - o - h);
      this._w = (u - l) / d, this._x = 0.25 * d, this._y = (i + r) / d, this._z = (n + c) / d;
    } else if (o > h) {
      const d = 2 * Math.sqrt(1 + o - s - h);
      this._w = (n - c) / d, this._x = (i + r) / d, this._y = 0.25 * d, this._z = (l + u) / d;
    } else {
      const d = 2 * Math.sqrt(1 + h - s - o);
      this._w = (r - i) / d, this._x = (n + c) / d, this._y = (l + u) / d, this._z = 0.25 * d;
    }
    return this._onChangeCallback(), this;
  }
  /**
   * Sets this quaternion to the rotation required to rotate the direction vector
   * `vFrom` to the direction vector `vTo`.
   *
   * @param {Vector3} vFrom - The first (normalized) direction vector.
   * @param {Vector3} vTo - The second (normalized) direction vector.
   * @return {Quaternion} A reference to this quaternion.
   */
  setFromUnitVectors(e, t) {
    let s = e.dot(t) + 1;
    return s < 1e-8 ? (s = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = s) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = s)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = s), this.normalize();
  }
  /**
   * Returns the angle between this quaternion and the given one in radians.
   *
   * @param {Quaternion} q - The quaternion to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(e) {
    return 2 * Math.acos(Math.abs(Je(this.dot(e), -1, 1)));
  }
  /**
   * Rotates this quaternion by a given angular step to the given quaternion.
   * The method ensures that the final quaternion will not overshoot `q`.
   *
   * @param {Quaternion} q - The target quaternion.
   * @param {number} step - The angular step in radians.
   * @return {Quaternion} A reference to this quaternion.
   */
  rotateTowards(e, t) {
    const s = this.angleTo(e);
    if (s === 0) return this;
    const i = Math.min(1, t / s);
    return this.slerp(e, i), this;
  }
  /**
   * Sets this quaternion to the identity quaternion; that is, to the
   * quaternion that represents "no rotation".
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  identity() {
    return this.set(0, 0, 0, 1);
  }
  /**
   * Inverts this quaternion via {@link Quaternion#conjugate}. The
   * quaternion is assumed to have unit length.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  invert() {
    return this.conjugate();
  }
  /**
   * Returns the rotational conjugate of this quaternion. The conjugate of a
   * quaternion represents the same rotation in the opposite direction about
   * the rotational axis.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  conjugate() {
    return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
  }
  /**
   * Calculates the dot product of this quaternion and the given one.
   *
   * @param {Quaternion} v - The quaternion to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
  }
  /**
   * Computes the squared Euclidean length (straight-line length) of this quaternion,
   * considered as a 4 dimensional vector. This can be useful if you are comparing the
   * lengths of two quaternions, as this is a slightly more efficient calculation than
   * {@link Quaternion#length}.
   *
   * @return {number} The squared Euclidean length.
   */
  lengthSq() {
    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
  }
  /**
   * Computes the Euclidean length (straight-line length) of this quaternion,
   * considered as a 4 dimensional vector.
   *
   * @return {number} The Euclidean length.
   */
  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
  }
  /**
   * Normalizes this quaternion - that is, calculated the quaternion that performs
   * the same rotation as this one, but has a length equal to `1`.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  normalize() {
    let e = this.length();
    return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x = this._x * e, this._y = this._y * e, this._z = this._z * e, this._w = this._w * e), this._onChangeCallback(), this;
  }
  /**
   * Multiplies this quaternion by the given one.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  multiply(e) {
    return this.multiplyQuaternions(this, e);
  }
  /**
   * Pre-multiplies this quaternion by the given one.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  premultiply(e) {
    return this.multiplyQuaternions(e, this);
  }
  /**
   * Multiplies the given quaternions and stores the result in this instance.
   *
   * @param {Quaternion} a - The first quaternion.
   * @param {Quaternion} b - The second quaternion.
   * @return {Quaternion} A reference to this quaternion.
   */
  multiplyQuaternions(e, t) {
    const s = e._x, i = e._y, n = e._z, r = e._w, o = t._x, l = t._y, c = t._z, u = t._w;
    return this._x = s * u + r * o + i * c - n * l, this._y = i * u + r * l + n * o - s * c, this._z = n * u + r * c + s * l - i * o, this._w = r * u - s * o - i * l - n * c, this._onChangeCallback(), this;
  }
  /**
   * Performs a spherical linear interpolation between quaternions.
   *
   * @param {Quaternion} qb - The target quaternion.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {Quaternion} A reference to this quaternion.
   */
  slerp(e, t) {
    if (t === 0) return this;
    if (t === 1) return this.copy(e);
    const s = this._x, i = this._y, n = this._z, r = this._w;
    let o = r * e._w + s * e._x + i * e._y + n * e._z;
    if (o < 0 ? (this._w = -e._w, this._x = -e._x, this._y = -e._y, this._z = -e._z, o = -o) : this.copy(e), o >= 1)
      return this._w = r, this._x = s, this._y = i, this._z = n, this;
    const l = 1 - o * o;
    if (l <= Number.EPSILON) {
      const d = 1 - t;
      return this._w = d * r + t * this._w, this._x = d * s + t * this._x, this._y = d * i + t * this._y, this._z = d * n + t * this._z, this.normalize(), this;
    }
    const c = Math.sqrt(l), u = Math.atan2(c, o), h = Math.sin((1 - t) * u) / c, f = Math.sin(t * u) / c;
    return this._w = r * h + this._w * f, this._x = s * h + this._x * f, this._y = i * h + this._y * f, this._z = n * h + this._z * f, this._onChangeCallback(), this;
  }
  /**
   * Performs a spherical linear interpolation between the given quaternions
   * and stores the result in this quaternion.
   *
   * @param {Quaternion} qa - The source quaternion.
   * @param {Quaternion} qb - The target quaternion.
   * @param {number} t - The interpolation factor in the closed interval `[0, 1]`.
   * @return {Quaternion} A reference to this quaternion.
   */
  slerpQuaternions(e, t, s) {
    return this.copy(e).slerp(t, s);
  }
  /**
   * Sets this quaternion to a uniformly random, normalized quaternion.
   *
   * @return {Quaternion} A reference to this quaternion.
   */
  random() {
    const e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), s = Math.random(), i = Math.sqrt(1 - s), n = Math.sqrt(s);
    return this.set(
      i * Math.sin(e),
      i * Math.cos(e),
      n * Math.sin(t),
      n * Math.cos(t)
    );
  }
  /**
   * Returns `true` if this quaternion is equal with the given one.
   *
   * @param {Quaternion} quaternion - The quaternion to test for equality.
   * @return {boolean} Whether this quaternion is equal with the given one.
   */
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
  }
  /**
   * Sets this quaternion's components from the given array.
   *
   * @param {Array<number>} array - An array holding the quaternion component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Quaternion} A reference to this quaternion.
   */
  fromArray(e, t = 0) {
    return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
  }
  /**
   * Writes the components of this quaternion to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the quaternion components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The quaternion components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
  }
  /**
   * Sets the components of this quaternion from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding quaternion data.
   * @param {number} index - The index into the attribute.
   * @return {Quaternion} A reference to this quaternion.
   */
  fromBufferAttribute(e, t) {
    return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
  }
  /**
   * This methods defines the serialization result of this class. Returns the
   * numerical elements of this quaternion in an array of format `[x, y, z, w]`.
   *
   * @return {Array<number>} The serialized quaternion.
   */
  toJSON() {
    return this.toArray();
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._w;
  }
}
class Y {
  /**
   * Constructs a new 3D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   * @param {number} [z=0] - The z value of this vector.
   */
  constructor(e = 0, t = 0, s = 0) {
    Y.prototype.isVector3 = true, this.x = e, this.y = t, this.z = s;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @param {number} z - The value of the z component.
   * @return {Vector3} A reference to this vector.
   */
  set(e, t, s) {
    return s === void 0 && (s = this.z), this.x = e, this.y = t, this.z = s, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector3} A reference to this vector.
   */
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setX(e) {
    return this.x = e, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setY(e) {
    return this.y = e, this;
  }
  /**
   * Sets the vector's z component to the given value
   *
   * @param {number} z - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setZ(e) {
    return this.z = e, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
   * @param {number} value - The value to set.
   * @return {Vector3} A reference to this vector.
   */
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y, `2` equals to z.
   * @return {number} A vector component value.
   */
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector3} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector3} v - The vector to copy.
   * @return {Vector3} A reference to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector3} v - The vector to add.
   * @return {Vector3} A reference to this vector.
   */
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector3} A reference to this vector.
   */
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector3|Vector4} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector3} A reference to this vector.
   */
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector3} v - The vector to subtract.
   * @return {Vector3} A reference to this vector.
   */
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector3} A reference to this vector.
   */
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector3} v - The vector to multiply.
   * @return {Vector3} A reference to this vector.
   */
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector3} A reference to this vector.
   */
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this;
  }
  /**
   * Multiplies the given vectors and stores the result in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  multiplyVectors(e, t) {
    return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
  }
  /**
   * Applies the given Euler rotation to this vector.
   *
   * @param {Euler} euler - The Euler angles.
   * @return {Vector3} A reference to this vector.
   */
  applyEuler(e) {
    return this.applyQuaternion(xy.setFromEuler(e));
  }
  /**
   * Applies a rotation specified by an axis and an angle to this vector.
   *
   * @param {Vector3} axis - A normalized vector representing the rotation axis.
   * @param {number} angle - The angle in radians.
   * @return {Vector3} A reference to this vector.
   */
  applyAxisAngle(e, t) {
    return this.applyQuaternion(xy.setFromAxisAngle(e, t));
  }
  /**
   * Multiplies this vector with the given 3x3 matrix.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @return {Vector3} A reference to this vector.
   */
  applyMatrix3(e) {
    const t = this.x, s = this.y, i = this.z, n = e.elements;
    return this.x = n[0] * t + n[3] * s + n[6] * i, this.y = n[1] * t + n[4] * s + n[7] * i, this.z = n[2] * t + n[5] * s + n[8] * i, this;
  }
  /**
   * Multiplies this vector by the given normal matrix and normalizes
   * the result.
   *
   * @param {Matrix3} m - The normal matrix.
   * @return {Vector3} A reference to this vector.
   */
  applyNormalMatrix(e) {
    return this.applyMatrix3(e).normalize();
  }
  /**
   * Multiplies this vector (with an implicit 1 in the 4th dimension) by m, and
   * divides by perspective.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {Vector3} A reference to this vector.
   */
  applyMatrix4(e) {
    const t = this.x, s = this.y, i = this.z, n = e.elements, r = 1 / (n[3] * t + n[7] * s + n[11] * i + n[15]);
    return this.x = (n[0] * t + n[4] * s + n[8] * i + n[12]) * r, this.y = (n[1] * t + n[5] * s + n[9] * i + n[13]) * r, this.z = (n[2] * t + n[6] * s + n[10] * i + n[14]) * r, this;
  }
  /**
   * Applies the given Quaternion to this vector.
   *
   * @param {Quaternion} q - The Quaternion.
   * @return {Vector3} A reference to this vector.
   */
  applyQuaternion(e) {
    const t = this.x, s = this.y, i = this.z, n = e.x, r = e.y, o = e.z, l = e.w, c = 2 * (r * i - o * s), u = 2 * (o * t - n * i), h = 2 * (n * s - r * t);
    return this.x = t + l * c + r * h - o * u, this.y = s + l * u + o * c - n * h, this.z = i + l * h + n * u - r * c, this;
  }
  /**
   * Projects this vector from world space into the camera's normalized
   * device coordinate (NDC) space.
   *
   * @param {Camera} camera - The camera.
   * @return {Vector3} A reference to this vector.
   */
  project(e) {
    return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
  }
  /**
   * Unprojects this vector from the camera's normalized device coordinate (NDC)
   * space into world space.
   *
   * @param {Camera} camera - The camera.
   * @return {Vector3} A reference to this vector.
   */
  unproject(e) {
    return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
  }
  /**
   * Transforms the direction of this vector by a matrix (the upper left 3 x 3
   * subset of the given 4x4 matrix and then normalizes the result.
   *
   * @param {Matrix4} m - The matrix.
   * @return {Vector3} A reference to this vector.
   */
  transformDirection(e) {
    const t = this.x, s = this.y, i = this.z, n = e.elements;
    return this.x = n[0] * t + n[4] * s + n[8] * i, this.y = n[1] * t + n[5] * s + n[9] * i, this.z = n[2] * t + n[6] * s + n[10] * i, this.normalize();
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector3} v - The vector to divide.
   * @return {Vector3} A reference to this vector.
   */
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector3} A reference to this vector.
   */
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  /**
   * If this vector's x, y or z value is greater than the given vector's x, y or z
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector3} v - The vector.
   * @return {Vector3} A reference to this vector.
   */
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
  }
  /**
   * If this vector's x, y or z value is less than the given vector's x, y or z
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector3} v - The vector.
   * @return {Vector3} A reference to this vector.
   */
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
  }
  /**
   * If this vector's x, y or z value is greater than the max vector's x, y or z
   * value, it is replaced by the corresponding value.
   * If this vector's x, y or z value is less than the min vector's x, y or z value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector3} min - The minimum x, y and z values.
   * @param {Vector3} max - The maximum x, y and z values in the desired range.
   * @return {Vector3} A reference to this vector.
   */
  clamp(e, t) {
    return this.x = Je(this.x, e.x, t.x), this.y = Je(this.y, e.y, t.y), this.z = Je(this.z, e.z, t.z), this;
  }
  /**
   * If this vector's x, y or z values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x, y or z values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector3} A reference to this vector.
   */
  clampScalar(e, t) {
    return this.x = Je(this.x, e, t), this.y = Je(this.y, e, t), this.z = Je(this.z, e, t), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector3} A reference to this vector.
   */
  clampLength(e, t) {
    const s = this.length();
    return this.divideScalar(s || 1).multiplyScalar(Je(s, e, t));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector3} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector3} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x, y = -y and z = -z.
   *
   * @return {Vector3} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector3} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z;
  }
  // TODO lengthSquared?
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0, 0) to (x, y, z). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0, 0) to (x, y, z).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector3} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector3} A reference to this vector.
   */
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector3} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector3} A reference to this vector.
   */
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector3} v1 - The first vector.
   * @param {Vector3} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector3} A reference to this vector.
   */
  lerpVectors(e, t, s) {
    return this.x = e.x + (t.x - e.x) * s, this.y = e.y + (t.y - e.y) * s, this.z = e.z + (t.z - e.z) * s, this;
  }
  /**
   * Calculates the cross product of the given vector with this instance.
   *
   * @param {Vector3} v - The vector to compute the cross product with.
   * @return {Vector3} The result of the cross product.
   */
  cross(e) {
    return this.crossVectors(this, e);
  }
  /**
   * Calculates the cross product of the given vectors and stores the result
   * in this instance.
   *
   * @param {Vector3} a - The first vector.
   * @param {Vector3} b - The second vector.
   * @return {Vector3} A reference to this vector.
   */
  crossVectors(e, t) {
    const s = e.x, i = e.y, n = e.z, r = t.x, o = t.y, l = t.z;
    return this.x = i * l - n * o, this.y = n * r - s * l, this.z = s * o - i * r, this;
  }
  /**
   * Projects this vector onto the given one.
   *
   * @param {Vector3} v - The vector to project to.
   * @return {Vector3} A reference to this vector.
   */
  projectOnVector(e) {
    const t = e.lengthSq();
    if (t === 0) return this.set(0, 0, 0);
    const s = e.dot(this) / t;
    return this.copy(e).multiplyScalar(s);
  }
  /**
   * Projects this vector onto a plane by subtracting this
   * vector projected onto the plane's normal from this vector.
   *
   * @param {Vector3} planeNormal - The plane normal.
   * @return {Vector3} A reference to this vector.
   */
  projectOnPlane(e) {
    return Id.copy(this).projectOnVector(e), this.sub(Id);
  }
  /**
   * Reflects this vector off a plane orthogonal to the given normal vector.
   *
   * @param {Vector3} normal - The (normalized) normal vector.
   * @return {Vector3} A reference to this vector.
   */
  reflect(e) {
    return this.sub(Id.copy(e).multiplyScalar(2 * this.dot(e)));
  }
  /**
   * Returns the angle between the given vector and this instance in radians.
   *
   * @param {Vector3} v - The vector to compute the angle with.
   * @return {number} The angle in radians.
   */
  angleTo(e) {
    const t = Math.sqrt(this.lengthSq() * e.lengthSq());
    if (t === 0) return Math.PI / 2;
    const s = this.dot(e) / t;
    return Math.acos(Je(s, -1, 1));
  }
  /**
   * Computes the distance from the given vector to this instance.
   *
   * @param {Vector3} v - The vector to compute the distance to.
   * @return {number} The distance.
   */
  distanceTo(e) {
    return Math.sqrt(this.distanceToSquared(e));
  }
  /**
   * Computes the squared distance from the given vector to this instance.
   * If you are just comparing the distance with another distance, you should compare
   * the distance squared instead as it is slightly more efficient to calculate.
   *
   * @param {Vector3} v - The vector to compute the squared distance to.
   * @return {number} The squared distance.
   */
  distanceToSquared(e) {
    const t = this.x - e.x, s = this.y - e.y, i = this.z - e.z;
    return t * t + s * s + i * i;
  }
  /**
   * Computes the Manhattan distance from the given vector to this instance.
   *
   * @param {Vector3} v - The vector to compute the Manhattan distance to.
   * @return {number} The Manhattan distance.
   */
  manhattanDistanceTo(e) {
    return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
  }
  /**
   * Sets the vector components from the given spherical coordinates.
   *
   * @param {Spherical} s - The spherical coordinates.
   * @return {Vector3} A reference to this vector.
   */
  setFromSpherical(e) {
    return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
  }
  /**
   * Sets the vector components from the given spherical coordinates.
   *
   * @param {number} radius - The radius.
   * @param {number} phi - The phi angle in radians.
   * @param {number} theta - The theta angle in radians.
   * @return {Vector3} A reference to this vector.
   */
  setFromSphericalCoords(e, t, s) {
    const i = Math.sin(t) * e;
    return this.x = i * Math.sin(s), this.y = Math.cos(t) * e, this.z = i * Math.cos(s), this;
  }
  /**
   * Sets the vector components from the given cylindrical coordinates.
   *
   * @param {Cylindrical} c - The cylindrical coordinates.
   * @return {Vector3} A reference to this vector.
   */
  setFromCylindrical(e) {
    return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
  }
  /**
   * Sets the vector components from the given cylindrical coordinates.
   *
   * @param {number} radius - The radius.
   * @param {number} theta - The theta angle in radians.
   * @param {number} y - The y value.
   * @return {Vector3} A reference to this vector.
   */
  setFromCylindricalCoords(e, t, s) {
    return this.x = e * Math.sin(t), this.y = s, this.z = e * Math.cos(t), this;
  }
  /**
   * Sets the vector components to the position elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this;
  }
  /**
   * Sets the vector components to the scale elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixScale(e) {
    const t = this.setFromMatrixColumn(e, 0).length(), s = this.setFromMatrixColumn(e, 1).length(), i = this.setFromMatrixColumn(e, 2).length();
    return this.x = t, this.y = s, this.z = i, this;
  }
  /**
   * Sets the vector components from the specified matrix column.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @param {number} index - The column index.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrixColumn(e, t) {
    return this.fromArray(e.elements, t * 4);
  }
  /**
   * Sets the vector components from the specified matrix column.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @param {number} index - The column index.
   * @return {Vector3} A reference to this vector.
   */
  setFromMatrix3Column(e, t) {
    return this.fromArray(e.elements, t * 3);
  }
  /**
   * Sets the vector components from the given Euler angles.
   *
   * @param {Euler} e - The Euler angles to set.
   * @return {Vector3} A reference to this vector.
   */
  setFromEuler(e) {
    return this.x = e._x, this.y = e._y, this.z = e._z, this;
  }
  /**
   * Sets the vector components from the RGB components of the
   * given color.
   *
   * @param {Color} c - The color to set.
   * @return {Vector3} A reference to this vector.
   */
  setFromColor(e) {
    return this.x = e.r, this.y = e.g, this.z = e.b, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector3} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`
   * and z value to be `array[ offset + 2 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector3} A reference to this vector.
   */
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector3} A reference to this vector.
   */
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector3} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
  }
  /**
   * Sets this vector to a uniformly random point on a unit sphere.
   *
   * @return {Vector3} A reference to this vector.
   */
  randomDirection() {
    const e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, s = Math.sqrt(1 - t * t);
    return this.x = s * Math.cos(e), this.y = t, this.z = s * Math.sin(e), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z;
  }
}
const Id = /* @__PURE__ */ new Y(), xy = /* @__PURE__ */ new Ma();
class zs {
  /**
   * Constructs a new 3x3 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   */
  constructor(e, t, s, i, n, r, o, l, c) {
    zs.prototype.isMatrix3 = true, this.elements = [
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, s, i, n, r, o, l, c);
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @return {Matrix3} A reference to this matrix.
   */
  set(e, t, s, i, n, r, o, l, c) {
    const u = this.elements;
    return u[0] = e, u[1] = i, u[2] = o, u[3] = t, u[4] = n, u[5] = l, u[6] = s, u[7] = r, u[8] = c, this;
  }
  /**
   * Sets this matrix to the 3x3 identity matrix.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Copies the values of the given matrix to this instance.
   *
   * @param {Matrix3} m - The matrix to copy.
   * @return {Matrix3} A reference to this matrix.
   */
  copy(e) {
    const t = this.elements, s = e.elements;
    return t[0] = s[0], t[1] = s[1], t[2] = s[2], t[3] = s[3], t[4] = s[4], t[5] = s[5], t[6] = s[6], t[7] = s[7], t[8] = s[8], this;
  }
  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix3} A reference to this matrix.
   */
  extractBasis(e, t, s) {
    return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), s.setFromMatrix3Column(this, 2), this;
  }
  /**
   * Set this matrix to the upper 3x3 matrix of the given 4x4 matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  setFromMatrix4(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[4],
      t[8],
      t[1],
      t[5],
      t[9],
      t[2],
      t[6],
      t[10]
    ), this;
  }
  /**
   * Post-multiplies this matrix by the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to multiply with.
   * @return {Matrix3} A reference to this matrix.
   */
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  /**
   * Pre-multiplies this matrix by the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix to multiply with.
   * @return {Matrix3} A reference to this matrix.
   */
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  /**
   * Multiples the given 3x3 matrices and stores the result
   * in this matrix.
   *
   * @param {Matrix3} a - The first matrix.
   * @param {Matrix3} b - The second matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  multiplyMatrices(e, t) {
    const s = e.elements, i = t.elements, n = this.elements, r = s[0], o = s[3], l = s[6], c = s[1], u = s[4], h = s[7], f = s[2], d = s[5], p = s[8], m3 = i[0], g = i[3], y3 = i[6], x = i[1], v = i[4], w = i[7], A = i[2], b = i[5], M = i[8];
    return n[0] = r * m3 + o * x + l * A, n[3] = r * g + o * v + l * b, n[6] = r * y3 + o * w + l * M, n[1] = c * m3 + u * x + h * A, n[4] = c * g + u * v + h * b, n[7] = c * y3 + u * w + h * M, n[2] = f * m3 + d * x + p * A, n[5] = f * g + d * v + p * b, n[8] = f * y3 + d * w + p * M, this;
  }
  /**
   * Multiplies every component of the matrix by the given scalar.
   *
   * @param {number} s - The scalar.
   * @return {Matrix3} A reference to this matrix.
   */
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
  }
  /**
   * Computes and returns the determinant of this matrix.
   *
   * @return {number} The determinant.
   */
  determinant() {
    const e = this.elements, t = e[0], s = e[1], i = e[2], n = e[3], r = e[4], o = e[5], l = e[6], c = e[7], u = e[8];
    return t * r * u - t * o * c - s * n * u + s * o * l + i * n * c - i * r * l;
  }
  /**
   * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
   * You can not invert with a determinant of zero. If you attempt this, the method produces
   * a zero matrix instead.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  invert() {
    const e = this.elements, t = e[0], s = e[1], i = e[2], n = e[3], r = e[4], o = e[5], l = e[6], c = e[7], u = e[8], h = u * r - o * c, f = o * l - u * n, d = c * n - r * l, p = t * h + s * f + i * d;
    if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
    const m3 = 1 / p;
    return e[0] = h * m3, e[1] = (i * c - u * s) * m3, e[2] = (o * s - i * r) * m3, e[3] = f * m3, e[4] = (u * t - i * l) * m3, e[5] = (i * n - o * t) * m3, e[6] = d * m3, e[7] = (s * l - c * t) * m3, e[8] = (r * t - s * n) * m3, this;
  }
  /**
   * Transposes this matrix in place.
   *
   * @return {Matrix3} A reference to this matrix.
   */
  transpose() {
    let e;
    const t = this.elements;
    return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
  }
  /**
   * Computes the normal matrix which is the inverse transpose of the upper
   * left 3x3 portion of the given 4x4 matrix.
   *
   * @param {Matrix4} matrix4 - The 4x4 matrix.
   * @return {Matrix3} A reference to this matrix.
   */
  getNormalMatrix(e) {
    return this.setFromMatrix4(e).invert().transpose();
  }
  /**
   * Transposes this matrix into the supplied array, and returns itself unchanged.
   *
   * @param {Array<number>} r - An array to store the transposed matrix elements.
   * @return {Matrix3} A reference to this matrix.
   */
  transposeIntoArray(e) {
    const t = this.elements;
    return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
  }
  /**
   * Sets the UV transform matrix from offset, repeat, rotation, and center.
   *
   * @param {number} tx - Offset x.
   * @param {number} ty - Offset y.
   * @param {number} sx - Repeat x.
   * @param {number} sy - Repeat y.
   * @param {number} rotation - Rotation, in radians. Positive values rotate counterclockwise.
   * @param {number} cx - Center x of rotation.
   * @param {number} cy - Center y of rotation
   * @return {Matrix3} A reference to this matrix.
   */
  setUvTransform(e, t, s, i, n, r, o) {
    const l = Math.cos(n), c = Math.sin(n);
    return this.set(
      s * l,
      s * c,
      -s * (l * r + c * o) + r + e,
      -i * c,
      i * l,
      -i * (-c * r + l * o) + o + t,
      0,
      0,
      1
    ), this;
  }
  /**
   * Scales this matrix with the given scalar values.
   *
   * @param {number} sx - The amount to scale in the X axis.
   * @param {number} sy - The amount to scale in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  scale(e, t) {
    return this.premultiply(Bd.makeScale(e, t)), this;
  }
  /**
   * Rotates this matrix by the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix3} A reference to this matrix.
   */
  rotate(e) {
    return this.premultiply(Bd.makeRotation(-e)), this;
  }
  /**
   * Translates this matrix by the given scalar values.
   *
   * @param {number} tx - The amount to translate in the X axis.
   * @param {number} ty - The amount to translate in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  translate(e, t) {
    return this.premultiply(Bd.makeTranslation(e, t)), this;
  }
  // for 2D Transforms
  /**
   * Sets this matrix as a 2D translation transform.
   *
   * @param {number|Vector2} x - The amount to translate in the X axis or alternatively a translation vector.
   * @param {number} y - The amount to translate in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  makeTranslation(e, t) {
    return e.isVector2 ? this.set(
      1,
      0,
      e.x,
      0,
      1,
      e.y,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      e,
      0,
      1,
      t,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a 2D rotational transformation.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix3} A reference to this matrix.
   */
  makeRotation(e) {
    const t = Math.cos(e), s = Math.sin(e);
    return this.set(
      t,
      -s,
      0,
      s,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a 2D scale transform.
   *
   * @param {number} x - The amount to scale in the X axis.
   * @param {number} y - The amount to scale in the Y axis.
   * @return {Matrix3} A reference to this matrix.
   */
  makeScale(e, t) {
    return this.set(
      e,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Returns `true` if this matrix is equal with the given one.
   *
   * @param {Matrix3} matrix - The matrix to test for equality.
   * @return {boolean} Whether this matrix is equal with the given one.
   */
  equals(e) {
    const t = this.elements, s = e.elements;
    for (let i = 0; i < 9; i++)
      if (t[i] !== s[i]) return false;
    return true;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix3} A reference to this matrix.
   */
  fromArray(e, t = 0) {
    for (let s = 0; s < 9; s++)
      this.elements[s] = e[s + t];
    return this;
  }
  /**
   * Writes the elements of this matrix to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The matrix elements in column-major order.
   */
  toArray(e = [], t = 0) {
    const s = this.elements;
    return e[t] = s[0], e[t + 1] = s[1], e[t + 2] = s[2], e[t + 3] = s[3], e[t + 4] = s[4], e[t + 5] = s[5], e[t + 6] = s[6], e[t + 7] = s[7], e[t + 8] = s[8], e;
  }
  /**
   * Returns a matrix with copied values from this instance.
   *
   * @return {Matrix3} A clone of this instance.
   */
  clone() {
    return new this.constructor().fromArray(this.elements);
  }
}
const Bd = /* @__PURE__ */ new zs();
function hp(a) {
  return (void 0).createElementNS("http://www.w3.org/1999/xhtml", a);
}
const vy = {};
function Ji(a) {
  a in vy || (vy[a] = true, console.warn(a));
}
const _y = /* @__PURE__ */ new zs().set(
  0.4123908,
  0.3575843,
  0.1804808,
  0.212639,
  0.7151687,
  0.0721923,
  0.0193308,
  0.1191948,
  0.9505322
), Ty = /* @__PURE__ */ new zs().set(
  3.2409699,
  -1.5373832,
  -0.4986108,
  -0.9692436,
  1.8759675,
  0.0415551,
  0.0556301,
  -0.203977,
  1.0569715
);
function MR() {
  const a = {
    enabled: true,
    workingColorSpace: cp,
    /**
     * Implementations of supported color spaces.
     *
     * Required:
     *	- primaries: chromaticity coordinates [ rx ry gx gy bx by ]
     *	- whitePoint: reference white [ x y ]
     *	- transfer: transfer function (pre-defined)
     *	- toXYZ: Matrix3 RGB to XYZ transform
     *	- fromXYZ: Matrix3 XYZ to RGB transform
     *	- luminanceCoefficients: RGB luminance coefficients
     *
     * Optional:
     *  - outputColorSpaceConfig: { drawingBufferColorSpace: ColorSpace, toneMappingMode: 'extended' | 'standard' }
     *  - workingColorSpaceConfig: { unpackColorSpace: ColorSpace }
     *
     * Reference:
     * - https://www.russellcottrell.com/photo/matrixCalculator.htm
     */
    spaces: {},
    convert: function(i, n, r) {
      return this.enabled === false || n === r || !n || !r || (this.spaces[n].transfer === ze && (i.r = Fn(i.r), i.g = Fn(i.g), i.b = Fn(i.b)), this.spaces[n].primaries !== this.spaces[r].primaries && (i.applyMatrix3(this.spaces[n].toXYZ), i.applyMatrix3(this.spaces[r].fromXYZ)), this.spaces[r].transfer === ze && (i.r = na(i.r), i.g = na(i.g), i.b = na(i.b))), i;
    },
    workingToColorSpace: function(i, n) {
      return this.convert(i, this.workingColorSpace, n);
    },
    colorSpaceToWorking: function(i, n) {
      return this.convert(i, n, this.workingColorSpace);
    },
    getPrimaries: function(i) {
      return this.spaces[i].primaries;
    },
    getTransfer: function(i) {
      return i === gr ? th : this.spaces[i].transfer;
    },
    getToneMappingMode: function(i) {
      return this.spaces[i].outputColorSpaceConfig.toneMappingMode || "standard";
    },
    getLuminanceCoefficients: function(i, n = this.workingColorSpace) {
      return i.fromArray(this.spaces[n].luminanceCoefficients);
    },
    define: function(i) {
      Object.assign(this.spaces, i);
    },
    // Internal APIs
    _getMatrix: function(i, n, r) {
      return i.copy(this.spaces[n].toXYZ).multiply(this.spaces[r].fromXYZ);
    },
    _getDrawingBufferColorSpace: function(i) {
      return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace;
    },
    _getUnpackColorSpace: function(i = this.workingColorSpace) {
      return this.spaces[i].workingColorSpaceConfig.unpackColorSpace;
    },
    // Deprecated
    fromWorkingColorSpace: function(i, n) {
      return Ji("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), a.workingToColorSpace(i, n);
    },
    toWorkingColorSpace: function(i, n) {
      return Ji("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), a.colorSpaceToWorking(i, n);
    }
  }, e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06], t = [0.2126, 0.7152, 0.0722], s = [0.3127, 0.329];
  return a.define({
    [cp]: {
      primaries: e,
      whitePoint: s,
      transfer: th,
      toXYZ: _y,
      fromXYZ: Ty,
      luminanceCoefficients: t,
      workingColorSpaceConfig: { unpackColorSpace: js },
      outputColorSpaceConfig: { drawingBufferColorSpace: js }
    },
    [js]: {
      primaries: e,
      whitePoint: s,
      transfer: ze,
      toXYZ: _y,
      fromXYZ: Ty,
      luminanceCoefficients: t,
      outputColorSpaceConfig: { drawingBufferColorSpace: js }
    }
  }), a;
}
const yt = /* @__PURE__ */ MR();
function Fn(a) {
  return a < 0.04045 ? a * 0.0773993808 : Math.pow(a * 0.9478672986 + 0.0521327014, 2.4);
}
function na(a) {
  return a < 31308e-7 ? a * 12.92 : 1.055 * Math.pow(a, 0.41666) - 0.055;
}
let Ao;
class AR {
  /**
   * Returns a data URI containing a representation of the given image.
   *
   * @param {(HTMLImageElement|HTMLCanvasElement)} image - The image object.
   * @param {string} [type='image/png'] - Indicates the image format.
   * @return {string} The data URI.
   */
  static getDataURL(e, t = "image/png") {
    if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u")
      return e.src;
    let s;
    if (e instanceof HTMLCanvasElement)
      s = e;
    else {
      Ao === void 0 && (Ao = hp("canvas")), Ao.width = e.width, Ao.height = e.height;
      const i = Ao.getContext("2d");
      e instanceof ImageData ? i.putImageData(e, 0, 0) : i.drawImage(e, 0, 0, e.width, e.height), s = Ao;
    }
    return s.toDataURL(t);
  }
  /**
   * Converts the given sRGB image data to linear color space.
   *
   * @param {(HTMLImageElement|HTMLCanvasElement|ImageBitmap|Object)} image - The image object.
   * @return {HTMLCanvasElement|Object} The converted image.
   */
  static sRGBToLinear(e) {
    if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
      const t = hp("canvas");
      t.width = e.width, t.height = e.height;
      const s = t.getContext("2d");
      s.drawImage(e, 0, 0, e.width, e.height);
      const i = s.getImageData(0, 0, e.width, e.height), n = i.data;
      for (let r = 0; r < n.length; r++)
        n[r] = Fn(n[r] / 255) * 255;
      return s.putImageData(i, 0, 0), t;
    } else if (e.data) {
      const t = e.data.slice(0);
      for (let s = 0; s < t.length; s++)
        t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[s] = Math.floor(Fn(t[s] / 255) * 255) : t[s] = Fn(t[s]);
      return {
        data: t,
        width: e.width,
        height: e.height
      };
    } else
      return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
  }
}
let ER = 0;
class rm {
  /**
   * Constructs a new video texture.
   *
   * @param {any} [data=null] - The data definition of a texture.
   */
  constructor(e = null) {
    this.isSource = true, Object.defineProperty(this, "id", { value: ER++ }), this.uuid = Bn(), this.data = e, this.dataReady = true, this.version = 0;
  }
  /**
   * Returns the dimensions of the source into the given target vector.
   *
   * @param {(Vector2|Vector3)} target - The target object the result is written into.
   * @return {(Vector2|Vector3)} The dimensions of the source.
   */
  getSize(e) {
    const t = this.data;
    return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : t instanceof VideoFrame ? e.set(t.displayHeight, t.displayWidth, 0) : t !== null ? e.set(t.width, t.height, t.depth || 0) : e.set(0, 0, 0), e;
  }
  /**
   * When the property is set to `true`, the engine allocates the memory
   * for the texture (if necessary) and triggers the actual texture upload
   * to the GPU next time the source is used.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === true && this.version++;
  }
  /**
   * Serializes the source into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized source.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.images[this.uuid] !== void 0)
      return e.images[this.uuid];
    const s = {
      uuid: this.uuid,
      url: ""
    }, i = this.data;
    if (i !== null) {
      let n;
      if (Array.isArray(i)) {
        n = [];
        for (let r = 0, o = i.length; r < o; r++)
          i[r].isDataTexture ? n.push(Fd(i[r].image)) : n.push(Fd(i[r]));
      } else
        n = Fd(i);
      s.url = n;
    }
    return t || (e.images[this.uuid] = s), s;
  }
}
function Fd(a) {
  return typeof HTMLImageElement < "u" && a instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && a instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && a instanceof ImageBitmap ? AR.getDataURL(a) : a.data ? {
    data: Array.from(a.data),
    width: a.width,
    height: a.height,
    type: a.data.constructor.name
  } : (console.warn("THREE.Texture: Unable to serialize Texture."), {});
}
let RR = 0;
const Dd = /* @__PURE__ */ new Y();
class ys extends co2 {
  /**
   * Constructs a new texture.
   *
   * @param {?Object} [image=Texture.DEFAULT_IMAGE] - The image holding the texture data.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space.
   */
  constructor(e = ys.DEFAULT_IMAGE, t = ys.DEFAULT_MAPPING, s = cr, i = cr, n = ti, r = Pn, o = Zs, l = gs, c = ys.DEFAULT_ANISOTROPY, u = gr) {
    super(), this.isTexture = true, Object.defineProperty(this, "id", { value: RR++ }), this.uuid = Bn(), this.name = "", this.source = new rm(e), this.mipmaps = [], this.mapping = t, this.channel = 0, this.wrapS = s, this.wrapT = i, this.magFilter = n, this.minFilter = r, this.anisotropy = c, this.format = o, this.internalFormat = null, this.type = l, this.offset = new Ke(0, 0), this.repeat = new Ke(1, 1), this.center = new Ke(0, 0), this.rotation = 0, this.matrixAutoUpdate = true, this.matrix = new zs(), this.generateMipmaps = true, this.premultiplyAlpha = false, this.flipY = true, this.unpackAlignment = 4, this.colorSpace = u, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = false, this.isArrayTexture = !!(e && e.depth && e.depth > 1), this.pmremVersion = 0;
  }
  /**
   * The width of the texture in pixels.
   */
  get width() {
    return this.source.getSize(Dd).x;
  }
  /**
   * The height of the texture in pixels.
   */
  get height() {
    return this.source.getSize(Dd).y;
  }
  /**
   * The depth of the texture in pixels.
   */
  get depth() {
    return this.source.getSize(Dd).z;
  }
  /**
   * The image object holding the texture data.
   *
   * @type {?Object}
   */
  get image() {
    return this.source.data;
  }
  set image(e = null) {
    this.source.data = e;
  }
  /**
   * Updates the texture transformation matrix from the from the properties {@link Texture#offset},
   * {@link Texture#repeat}, {@link Texture#rotation}, and {@link Texture#center}.
   */
  updateMatrix() {
    this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
  }
  /**
   * Adds a range of data in the data texture to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Returns a new texture with copied values from this instance.
   *
   * @return {Texture} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given texture to this instance.
   *
   * @param {Texture} source - The texture to copy.
   * @return {Texture} A reference to this instance.
   */
  copy(e) {
    return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = true, this;
  }
  /**
   * Sets this texture's properties based on `values`.
   * @param {Object} values - A container with texture parameters.
   */
  setValues(e) {
    for (const t in e) {
      const s = e[t];
      if (s === void 0) {
        console.warn(`THREE.Texture.setValues(): parameter '${t}' has value of undefined.`);
        continue;
      }
      const i = this[t];
      if (i === void 0) {
        console.warn(`THREE.Texture.setValues(): property '${t}' does not exist.`);
        continue;
      }
      i && s && i.isVector2 && s.isVector2 || i && s && i.isVector3 && s.isVector3 || i && s && i.isMatrix3 && s.isMatrix3 ? i.copy(s) : this[t] = s;
    }
  }
  /**
   * Serializes the texture into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized texture.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string";
    if (!t && e.textures[this.uuid] !== void 0)
      return e.textures[this.uuid];
    const s = {
      metadata: {
        version: 4.7,
        type: "Texture",
        generator: "Texture.toJSON"
      },
      uuid: this.uuid,
      name: this.name,
      image: this.source.toJSON(e).uuid,
      mapping: this.mapping,
      channel: this.channel,
      repeat: [this.repeat.x, this.repeat.y],
      offset: [this.offset.x, this.offset.y],
      center: [this.center.x, this.center.y],
      rotation: this.rotation,
      wrap: [this.wrapS, this.wrapT],
      format: this.format,
      internalFormat: this.internalFormat,
      type: this.type,
      colorSpace: this.colorSpace,
      minFilter: this.minFilter,
      magFilter: this.magFilter,
      anisotropy: this.anisotropy,
      flipY: this.flipY,
      generateMipmaps: this.generateMipmaps,
      premultiplyAlpha: this.premultiplyAlpha,
      unpackAlignment: this.unpackAlignment
    };
    return Object.keys(this.userData).length > 0 && (s.userData = this.userData), t || (e.textures[this.uuid] = s), s;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires Texture#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Transforms the given uv vector with the textures uv transformation matrix.
   *
   * @param {Vector2} uv - The uv vector.
   * @return {Vector2} The transformed uv vector.
   */
  transformUv(e) {
    if (this.mapping !== Qp) return e;
    if (e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1)
      switch (this.wrapS) {
        case pa:
          e.x = e.x - Math.floor(e.x);
          break;
        case cr:
          e.x = e.x < 0 ? 0 : 1;
          break;
        case ma:
          Math.abs(Math.floor(e.x) % 2) === 1 ? e.x = Math.ceil(e.x) - e.x : e.x = e.x - Math.floor(e.x);
          break;
      }
    if (e.y < 0 || e.y > 1)
      switch (this.wrapT) {
        case pa:
          e.y = e.y - Math.floor(e.y);
          break;
        case cr:
          e.y = e.y < 0 ? 0 : 1;
          break;
        case ma:
          Math.abs(Math.floor(e.y) % 2) === 1 ? e.y = Math.ceil(e.y) - e.y : e.y = e.y - Math.floor(e.y);
          break;
      }
    return this.flipY && (e.y = 1 - e.y), e;
  }
  /**
   * Setting this property to `true` indicates the engine the texture
   * must be updated in the next render. This triggers a texture upload
   * to the GPU and ensures correct texture parameter configuration.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === true && (this.version++, this.source.needsUpdate = true);
  }
  /**
   * Setting this property to `true` indicates the engine the PMREM
   * must be regenerated.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsPMREMUpdate(e) {
    e === true && this.pmremVersion++;
  }
}
ys.DEFAULT_IMAGE = null;
ys.DEFAULT_MAPPING = Qp;
ys.DEFAULT_ANISOTROPY = 1;
class et {
  /**
   * Constructs a new 4D vector.
   *
   * @param {number} [x=0] - The x value of this vector.
   * @param {number} [y=0] - The y value of this vector.
   * @param {number} [z=0] - The z value of this vector.
   * @param {number} [w=1] - The w value of this vector.
   */
  constructor(e = 0, t = 0, s = 0, i = 1) {
    et.prototype.isVector4 = true, this.x = e, this.y = t, this.z = s, this.w = i;
  }
  /**
   * Alias for {@link Vector4#z}.
   *
   * @type {number}
   */
  get width() {
    return this.z;
  }
  set width(e) {
    this.z = e;
  }
  /**
   * Alias for {@link Vector4#w}.
   *
   * @type {number}
   */
  get height() {
    return this.w;
  }
  set height(e) {
    this.w = e;
  }
  /**
   * Sets the vector components.
   *
   * @param {number} x - The value of the x component.
   * @param {number} y - The value of the y component.
   * @param {number} z - The value of the z component.
   * @param {number} w - The value of the w component.
   * @return {Vector4} A reference to this vector.
   */
  set(e, t, s, i) {
    return this.x = e, this.y = t, this.z = s, this.w = i, this;
  }
  /**
   * Sets the vector components to the same value.
   *
   * @param {number} scalar - The value to set for all vector components.
   * @return {Vector4} A reference to this vector.
   */
  setScalar(e) {
    return this.x = e, this.y = e, this.z = e, this.w = e, this;
  }
  /**
   * Sets the vector's x component to the given value
   *
   * @param {number} x - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setX(e) {
    return this.x = e, this;
  }
  /**
   * Sets the vector's y component to the given value
   *
   * @param {number} y - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setY(e) {
    return this.y = e, this;
  }
  /**
   * Sets the vector's z component to the given value
   *
   * @param {number} z - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setZ(e) {
    return this.z = e, this;
  }
  /**
   * Sets the vector's w component to the given value
   *
   * @param {number} w - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setW(e) {
    return this.w = e, this;
  }
  /**
   * Allows to set a vector component with an index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y,
   * `2` equals to z, `3` equals to w.
   * @param {number} value - The value to set.
   * @return {Vector4} A reference to this vector.
   */
  setComponent(e, t) {
    switch (e) {
      case 0:
        this.x = t;
        break;
      case 1:
        this.y = t;
        break;
      case 2:
        this.z = t;
        break;
      case 3:
        this.w = t;
        break;
      default:
        throw new Error("index is out of range: " + e);
    }
    return this;
  }
  /**
   * Returns the value of the vector component which matches the given index.
   *
   * @param {number} index - The component index. `0` equals to x, `1` equals to y,
   * `2` equals to z, `3` equals to w.
   * @return {number} A vector component value.
   */
  getComponent(e) {
    switch (e) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      case 2:
        return this.z;
      case 3:
        return this.w;
      default:
        throw new Error("index is out of range: " + e);
    }
  }
  /**
   * Returns a new vector with copied values from this instance.
   *
   * @return {Vector4} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.x, this.y, this.z, this.w);
  }
  /**
   * Copies the values of the given vector to this instance.
   *
   * @param {Vector3|Vector4} v - The vector to copy.
   * @return {Vector4} A reference to this vector.
   */
  copy(e) {
    return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w !== void 0 ? e.w : 1, this;
  }
  /**
   * Adds the given vector to this instance.
   *
   * @param {Vector4} v - The vector to add.
   * @return {Vector4} A reference to this vector.
   */
  add(e) {
    return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
  }
  /**
   * Adds the given scalar value to all components of this instance.
   *
   * @param {number} s - The scalar to add.
   * @return {Vector4} A reference to this vector.
   */
  addScalar(e) {
    return this.x += e, this.y += e, this.z += e, this.w += e, this;
  }
  /**
   * Adds the given vectors and stores the result in this instance.
   *
   * @param {Vector4} a - The first vector.
   * @param {Vector4} b - The second vector.
   * @return {Vector4} A reference to this vector.
   */
  addVectors(e, t) {
    return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
  }
  /**
   * Adds the given vector scaled by the given factor to this instance.
   *
   * @param {Vector4} v - The vector.
   * @param {number} s - The factor that scales `v`.
   * @return {Vector4} A reference to this vector.
   */
  addScaledVector(e, t) {
    return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
  }
  /**
   * Subtracts the given vector from this instance.
   *
   * @param {Vector4} v - The vector to subtract.
   * @return {Vector4} A reference to this vector.
   */
  sub(e) {
    return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
  }
  /**
   * Subtracts the given scalar value from all components of this instance.
   *
   * @param {number} s - The scalar to subtract.
   * @return {Vector4} A reference to this vector.
   */
  subScalar(e) {
    return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
  }
  /**
   * Subtracts the given vectors and stores the result in this instance.
   *
   * @param {Vector4} a - The first vector.
   * @param {Vector4} b - The second vector.
   * @return {Vector4} A reference to this vector.
   */
  subVectors(e, t) {
    return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
  }
  /**
   * Multiplies the given vector with this instance.
   *
   * @param {Vector4} v - The vector to multiply.
   * @return {Vector4} A reference to this vector.
   */
  multiply(e) {
    return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
  }
  /**
   * Multiplies the given scalar value with all components of this instance.
   *
   * @param {number} scalar - The scalar to multiply.
   * @return {Vector4} A reference to this vector.
   */
  multiplyScalar(e) {
    return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
  }
  /**
   * Multiplies this vector with the given 4x4 matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector4} A reference to this vector.
   */
  applyMatrix4(e) {
    const t = this.x, s = this.y, i = this.z, n = this.w, r = e.elements;
    return this.x = r[0] * t + r[4] * s + r[8] * i + r[12] * n, this.y = r[1] * t + r[5] * s + r[9] * i + r[13] * n, this.z = r[2] * t + r[6] * s + r[10] * i + r[14] * n, this.w = r[3] * t + r[7] * s + r[11] * i + r[15] * n, this;
  }
  /**
   * Divides this instance by the given vector.
   *
   * @param {Vector4} v - The vector to divide.
   * @return {Vector4} A reference to this vector.
   */
  divide(e) {
    return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
  }
  /**
   * Divides this vector by the given scalar.
   *
   * @param {number} scalar - The scalar to divide.
   * @return {Vector4} A reference to this vector.
   */
  divideScalar(e) {
    return this.multiplyScalar(1 / e);
  }
  /**
   * Sets the x, y and z components of this
   * vector to the quaternion's axis and w to the angle.
   *
   * @param {Quaternion} q - The Quaternion to set.
   * @return {Vector4} A reference to this vector.
   */
  setAxisAngleFromQuaternion(e) {
    this.w = 2 * Math.acos(e.w);
    const t = Math.sqrt(1 - e.w * e.w);
    return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
  }
  /**
   * Sets the x, y and z components of this
   * vector to the axis of rotation and w to the angle.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper left 3x3 matrix is a pure rotation matrix.
   * @return {Vector4} A reference to this vector.
   */
  setAxisAngleFromRotationMatrix(e) {
    let t, s, i, n;
    const l = e.elements, c = l[0], u = l[4], h = l[8], f = l[1], d = l[5], p = l[9], m3 = l[2], g = l[6], y3 = l[10];
    if (Math.abs(u - f) < 0.01 && Math.abs(h - m3) < 0.01 && Math.abs(p - g) < 0.01) {
      if (Math.abs(u + f) < 0.1 && Math.abs(h + m3) < 0.1 && Math.abs(p + g) < 0.1 && Math.abs(c + d + y3 - 3) < 0.1)
        return this.set(1, 0, 0, 0), this;
      t = Math.PI;
      const v = (c + 1) / 2, w = (d + 1) / 2, A = (y3 + 1) / 2, b = (u + f) / 4, M = (h + m3) / 4, _ = (p + g) / 4;
      return v > w && v > A ? v < 0.01 ? (s = 0, i = 0.707106781, n = 0.707106781) : (s = Math.sqrt(v), i = b / s, n = M / s) : w > A ? w < 0.01 ? (s = 0.707106781, i = 0, n = 0.707106781) : (i = Math.sqrt(w), s = b / i, n = _ / i) : A < 0.01 ? (s = 0.707106781, i = 0.707106781, n = 0) : (n = Math.sqrt(A), s = M / n, i = _ / n), this.set(s, i, n, t), this;
    }
    let x = Math.sqrt((g - p) * (g - p) + (h - m3) * (h - m3) + (f - u) * (f - u));
    return Math.abs(x) < 1e-3 && (x = 1), this.x = (g - p) / x, this.y = (h - m3) / x, this.z = (f - u) / x, this.w = Math.acos((c + d + y3 - 1) / 2), this;
  }
  /**
   * Sets the vector components to the position elements of the
   * given transformation matrix.
   *
   * @param {Matrix4} m - The 4x4 matrix.
   * @return {Vector4} A reference to this vector.
   */
  setFromMatrixPosition(e) {
    const t = e.elements;
    return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
  }
  /**
   * If this vector's x, y, z or w value is greater than the given vector's x, y, z or w
   * value, replace that value with the corresponding min value.
   *
   * @param {Vector4} v - The vector.
   * @return {Vector4} A reference to this vector.
   */
  min(e) {
    return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
  }
  /**
   * If this vector's x, y, z or w value is less than the given vector's x, y, z or w
   * value, replace that value with the corresponding max value.
   *
   * @param {Vector4} v - The vector.
   * @return {Vector4} A reference to this vector.
   */
  max(e) {
    return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
  }
  /**
   * If this vector's x, y, z or w value is greater than the max vector's x, y, z or w
   * value, it is replaced by the corresponding value.
   * If this vector's x, y, z or w value is less than the min vector's x, y, z or w value,
   * it is replaced by the corresponding value.
   *
   * @param {Vector4} min - The minimum x, y and z values.
   * @param {Vector4} max - The maximum x, y and z values in the desired range.
   * @return {Vector4} A reference to this vector.
   */
  clamp(e, t) {
    return this.x = Je(this.x, e.x, t.x), this.y = Je(this.y, e.y, t.y), this.z = Je(this.z, e.z, t.z), this.w = Je(this.w, e.w, t.w), this;
  }
  /**
   * If this vector's x, y, z or w values are greater than the max value, they are
   * replaced by the max value.
   * If this vector's x, y, z or w values are less than the min value, they are
   * replaced by the min value.
   *
   * @param {number} minVal - The minimum value the components will be clamped to.
   * @param {number} maxVal - The maximum value the components will be clamped to.
   * @return {Vector4} A reference to this vector.
   */
  clampScalar(e, t) {
    return this.x = Je(this.x, e, t), this.y = Je(this.y, e, t), this.z = Je(this.z, e, t), this.w = Je(this.w, e, t), this;
  }
  /**
   * If this vector's length is greater than the max value, it is replaced by
   * the max value.
   * If this vector's length is less than the min value, it is replaced by the
   * min value.
   *
   * @param {number} min - The minimum value the vector length will be clamped to.
   * @param {number} max - The maximum value the vector length will be clamped to.
   * @return {Vector4} A reference to this vector.
   */
  clampLength(e, t) {
    const s = this.length();
    return this.divideScalar(s || 1).multiplyScalar(Je(s, e, t));
  }
  /**
   * The components of this vector are rounded down to the nearest integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  floor() {
    return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
  }
  /**
   * The components of this vector are rounded up to the nearest integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  ceil() {
    return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
  }
  /**
   * The components of this vector are rounded to the nearest integer value
   *
   * @return {Vector4} A reference to this vector.
   */
  round() {
    return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
  }
  /**
   * The components of this vector are rounded towards zero (up if negative,
   * down if positive) to an integer value.
   *
   * @return {Vector4} A reference to this vector.
   */
  roundToZero() {
    return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
  }
  /**
   * Inverts this vector - i.e. sets x = -x, y = -y, z = -z, w = -w.
   *
   * @return {Vector4} A reference to this vector.
   */
  negate() {
    return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
  }
  /**
   * Calculates the dot product of the given vector with this instance.
   *
   * @param {Vector4} v - The vector to compute the dot product with.
   * @return {number} The result of the dot product.
   */
  dot(e) {
    return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
  }
  /**
   * Computes the square of the Euclidean length (straight-line length) from
   * (0, 0, 0, 0) to (x, y, z, w). If you are comparing the lengths of vectors, you should
   * compare the length squared instead as it is slightly more efficient to calculate.
   *
   * @return {number} The square length of this vector.
   */
  lengthSq() {
    return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
  }
  /**
   * Computes the  Euclidean length (straight-line length) from (0, 0, 0, 0) to (x, y, z, w).
   *
   * @return {number} The length of this vector.
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }
  /**
   * Computes the Manhattan length of this vector.
   *
   * @return {number} The length of this vector.
   */
  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
  }
  /**
   * Converts this vector to a unit vector - that is, sets it equal to a vector
   * with the same direction as this one, but with a vector length of `1`.
   *
   * @return {Vector4} A reference to this vector.
   */
  normalize() {
    return this.divideScalar(this.length() || 1);
  }
  /**
   * Sets this vector to a vector with the same direction as this one, but
   * with the specified length.
   *
   * @param {number} length - The new length of this vector.
   * @return {Vector4} A reference to this vector.
   */
  setLength(e) {
    return this.normalize().multiplyScalar(e);
  }
  /**
   * Linearly interpolates between the given vector and this instance, where
   * alpha is the percent distance along the line - alpha = 0 will be this
   * vector, and alpha = 1 will be the given one.
   *
   * @param {Vector4} v - The vector to interpolate towards.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector4} A reference to this vector.
   */
  lerp(e, t) {
    return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
  }
  /**
   * Linearly interpolates between the given vectors, where alpha is the percent
   * distance along the line - alpha = 0 will be first vector, and alpha = 1 will
   * be the second one. The result is stored in this instance.
   *
   * @param {Vector4} v1 - The first vector.
   * @param {Vector4} v2 - The second vector.
   * @param {number} alpha - The interpolation factor, typically in the closed interval `[0, 1]`.
   * @return {Vector4} A reference to this vector.
   */
  lerpVectors(e, t, s) {
    return this.x = e.x + (t.x - e.x) * s, this.y = e.y + (t.y - e.y) * s, this.z = e.z + (t.z - e.z) * s, this.w = e.w + (t.w - e.w) * s, this;
  }
  /**
   * Returns `true` if this vector is equal with the given one.
   *
   * @param {Vector4} v - The vector to test for equality.
   * @return {boolean} Whether this vector is equal with the given one.
   */
  equals(e) {
    return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
  }
  /**
   * Sets this vector's x value to be `array[ offset ]`, y value to be `array[ offset + 1 ]`,
   * z value to be `array[ offset + 2 ]`, w value to be `array[ offset + 3 ]`.
   *
   * @param {Array<number>} array - An array holding the vector component values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Vector4} A reference to this vector.
   */
  fromArray(e, t = 0) {
    return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
  }
  /**
   * Writes the components of this vector to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the vector components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The vector components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
  }
  /**
   * Sets the components of this vector from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding vector data.
   * @param {number} index - The index into the attribute.
   * @return {Vector4} A reference to this vector.
   */
  fromBufferAttribute(e, t) {
    return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
  }
  /**
   * Sets each component of this vector to a pseudo-random value between `0` and
   * `1`, excluding `1`.
   *
   * @return {Vector4} A reference to this vector.
   */
  random() {
    return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y, yield this.z, yield this.w;
  }
}
class uo extends co2 {
  /**
   * Render target options.
   *
   * @typedef {Object} RenderTarget~Options
   * @property {boolean} [generateMipmaps=false] - Whether to generate mipmaps or not.
   * @property {number} [magFilter=LinearFilter] - The mag filter.
   * @property {number} [minFilter=LinearFilter] - The min filter.
   * @property {number} [format=RGBAFormat] - The texture format.
   * @property {number} [type=UnsignedByteType] - The texture type.
   * @property {?string} [internalFormat=null] - The texture's internal format.
   * @property {number} [wrapS=ClampToEdgeWrapping] - The texture's uv wrapping mode.
   * @property {number} [wrapT=ClampToEdgeWrapping] - The texture's uv wrapping mode.
   * @property {number} [anisotropy=1] - The texture's anisotropy value.
   * @property {string} [colorSpace=NoColorSpace] - The texture's color space.
   * @property {boolean} [depthBuffer=true] - Whether to allocate a depth buffer or not.
   * @property {boolean} [stencilBuffer=false] - Whether to allocate a stencil buffer or not.
   * @property {boolean} [resolveDepthBuffer=true] - Whether to resolve the depth buffer or not.
   * @property {boolean} [resolveStencilBuffer=true] - Whether  to resolve the stencil buffer or not.
   * @property {?Texture} [depthTexture=null] - Reference to a depth texture.
   * @property {number} [samples=0] - The MSAA samples count.
   * @property {number} [count=1] - Defines the number of color attachments . Must be at least `1`.
   * @property {number} [depth=1] - The texture depth.
   * @property {boolean} [multiview=false] - Whether this target is used for multiview rendering.
   */
  /**
   * Constructs a new render target.
   *
   * @param {number} [width=1] - The width of the render target.
   * @param {number} [height=1] - The height of the render target.
   * @param {RenderTarget~Options} [options] - The configuration object.
   */
  constructor(e = 1, t = 1, s = {}) {
    super(), s = Object.assign({
      generateMipmaps: false,
      internalFormat: null,
      minFilter: ti,
      depthBuffer: true,
      stencilBuffer: false,
      resolveDepthBuffer: true,
      resolveStencilBuffer: true,
      depthTexture: null,
      samples: 0,
      count: 1,
      depth: 1,
      multiview: false
    }, s), this.isRenderTarget = true, this.width = e, this.height = t, this.depth = s.depth, this.scissor = new et(0, 0, e, t), this.scissorTest = false, this.viewport = new et(0, 0, e, t);
    const i = { width: e, height: t, depth: s.depth }, n = new ys(i);
    this.textures = [];
    const r = s.count;
    for (let o = 0; o < r; o++)
      this.textures[o] = n.clone(), this.textures[o].isRenderTargetTexture = true, this.textures[o].renderTarget = this;
    this._setTextureOptions(s), this.depthBuffer = s.depthBuffer, this.stencilBuffer = s.stencilBuffer, this.resolveDepthBuffer = s.resolveDepthBuffer, this.resolveStencilBuffer = s.resolveStencilBuffer, this._depthTexture = null, this.depthTexture = s.depthTexture, this.samples = s.samples, this.multiview = s.multiview;
  }
  _setTextureOptions(e = {}) {
    const t = {
      minFilter: ti,
      generateMipmaps: false,
      flipY: false,
      internalFormat: null
    };
    e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
    for (let s = 0; s < this.textures.length; s++)
      this.textures[s].setValues(t);
  }
  /**
   * The texture representing the default color attachment.
   *
   * @type {Texture}
   */
  get texture() {
    return this.textures[0];
  }
  set texture(e) {
    this.textures[0] = e;
  }
  set depthTexture(e) {
    this._depthTexture !== null && (this._depthTexture.renderTarget = null), e !== null && (e.renderTarget = this), this._depthTexture = e;
  }
  /**
   * Instead of saving the depth in a renderbuffer, a texture
   * can be used instead which is useful for further processing
   * e.g. in context of post-processing.
   *
   * @type {?DepthTexture}
   * @default null
   */
  get depthTexture() {
    return this._depthTexture;
  }
  /**
   * Sets the size of this render target.
   *
   * @param {number} width - The width.
   * @param {number} height - The height.
   * @param {number} [depth=1] - The depth.
   */
  setSize(e, t, s = 1) {
    if (this.width !== e || this.height !== t || this.depth !== s) {
      this.width = e, this.height = t, this.depth = s;
      for (let i = 0, n = this.textures.length; i < n; i++)
        this.textures[i].image.width = e, this.textures[i].image.height = t, this.textures[i].image.depth = s, this.textures[i].isArrayTexture = this.textures[i].image.depth > 1;
      this.dispose();
    }
    this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
  }
  /**
   * Returns a new render target with copied values from this instance.
   *
   * @return {RenderTarget} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the settings of the given render target. This is a structural copy so
   * no resources are shared between render targets after the copy. That includes
   * all MRT textures and the depth texture.
   *
   * @param {RenderTarget} source - The render target to copy.
   * @return {RenderTarget} A reference to this instance.
   */
  copy(e) {
    this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
    for (let t = 0, s = e.textures.length; t < s; t++) {
      this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = true, this.textures[t].renderTarget = this;
      const i = Object.assign({}, e.textures[t].image);
      this.textures[t].source = new rm(i);
    }
    return this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()), this.samples = e.samples, this;
  }
  /**
   * Frees the GPU-related resources allocated by this instance. Call this
   * method whenever this instance is no longer used in your app.
   *
   * @fires RenderTarget#dispose
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
}
class Wl {
  /**
   * Constructs a new bounding box.
   *
   * @param {Vector3} [min=(Infinity,Infinity,Infinity)] - A vector representing the lower boundary of the box.
   * @param {Vector3} [max=(-Infinity,-Infinity,-Infinity)] - A vector representing the upper boundary of the box.
   */
  constructor(e = new Y(1 / 0, 1 / 0, 1 / 0), t = new Y(-1 / 0, -1 / 0, -1 / 0)) {
    this.isBox3 = true, this.min = e, this.max = t;
  }
  /**
   * Sets the lower and upper boundaries of this box.
   * Please note that this method only copies the values from the given objects.
   *
   * @param {Vector3} min - The lower boundary of the box.
   * @param {Vector3} max - The upper boundary of the box.
   * @return {Box3} A reference to this bounding box.
   */
  set(e, t) {
    return this.min.copy(e), this.max.copy(t), this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given array.
   *
   * @param {Array<number>} array - An array holding 3D position data.
   * @return {Box3} A reference to this bounding box.
   */
  setFromArray(e) {
    this.makeEmpty();
    for (let t = 0, s = e.length; t < s; t += 3)
      this.expandByPoint(_i.fromArray(e, t));
    return this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - A buffer attribute holding 3D position data.
   * @return {Box3} A reference to this bounding box.
   */
  setFromBufferAttribute(e) {
    this.makeEmpty();
    for (let t = 0, s = e.count; t < s; t++)
      this.expandByPoint(_i.fromBufferAttribute(e, t));
    return this;
  }
  /**
   * Sets the upper and lower bounds of this box so it encloses the position data
   * in the given array.
   *
   * @param {Array<Vector3>} points - An array holding 3D position data as instances of {@link Vector3}.
   * @return {Box3} A reference to this bounding box.
   */
  setFromPoints(e) {
    this.makeEmpty();
    for (let t = 0, s = e.length; t < s; t++)
      this.expandByPoint(e[t]);
    return this;
  }
  /**
   * Centers this box on the given center vector and sets this box's width, height and
   * depth to the given size values.
   *
   * @param {Vector3} center - The center of the box.
   * @param {Vector3} size - The x, y and z dimensions of the box.
   * @return {Box3} A reference to this bounding box.
   */
  setFromCenterAndSize(e, t) {
    const s = _i.copy(t).multiplyScalar(0.5);
    return this.min.copy(e).sub(s), this.max.copy(e).add(s), this;
  }
  /**
   * Computes the world-axis-aligned bounding box for the given 3D object
   * (including its children), accounting for the object's, and children's,
   * world transforms. The function may result in a larger box than strictly necessary.
   *
   * @param {Object3D} object - The 3D object to compute the bounding box for.
   * @param {boolean} [precise=false] - If set to `true`, the method computes the smallest
   * world-axis-aligned bounding box at the expense of more computation.
   * @return {Box3} A reference to this bounding box.
   */
  setFromObject(e, t = false) {
    return this.makeEmpty(), this.expandByObject(e, t);
  }
  /**
   * Returns a new box with copied values from this instance.
   *
   * @return {Box3} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Copies the values of the given box to this instance.
   *
   * @param {Box3} box - The box to copy.
   * @return {Box3} A reference to this bounding box.
   */
  copy(e) {
    return this.min.copy(e.min), this.max.copy(e.max), this;
  }
  /**
   * Makes this box empty which means in encloses a zero space in 3D.
   *
   * @return {Box3} A reference to this bounding box.
   */
  makeEmpty() {
    return this.min.x = this.min.y = this.min.z = 1 / 0, this.max.x = this.max.y = this.max.z = -1 / 0, this;
  }
  /**
   * Returns true if this box includes zero points within its bounds.
   * Note that a box with equal lower and upper bounds still includes one
   * point, the one both bounds share.
   *
   * @return {boolean} Whether this box is empty or not.
   */
  isEmpty() {
    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
  }
  /**
   * Returns the center point of this box.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The center point.
   */
  getCenter(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(0.5);
  }
  /**
   * Returns the dimensions of this box.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The size.
   */
  getSize(e) {
    return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
  }
  /**
   * Expands the boundaries of this box to include the given point.
   *
   * @param {Vector3} point - The point that should be included by the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByPoint(e) {
    return this.min.min(e), this.max.max(e), this;
  }
  /**
   * Expands this box equilaterally by the given vector. The width of this
   * box will be expanded by the x component of the vector in both
   * directions. The height of this box will be expanded by the y component of
   * the vector in both directions. The depth of this box will be
   * expanded by the z component of the vector in both directions.
   *
   * @param {Vector3} vector - The vector that should expand the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByVector(e) {
    return this.min.sub(e), this.max.add(e), this;
  }
  /**
   * Expands each dimension of the box by the given scalar. If negative, the
   * dimensions of the box will be contracted.
   *
   * @param {number} scalar - The scalar value that should expand the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  expandByScalar(e) {
    return this.min.addScalar(-e), this.max.addScalar(e), this;
  }
  /**
   * Expands the boundaries of this box to include the given 3D object and
   * its children, accounting for the object's, and children's, world
   * transforms. The function may result in a larger box than strictly
   * necessary (unless the precise parameter is set to true).
   *
   * @param {Object3D} object - The 3D object that should expand the bounding box.
   * @param {boolean} precise - If set to `true`, the method expands the bounding box
   * as little as necessary at the expense of more computation.
   * @return {Box3} A reference to this bounding box.
   */
  expandByObject(e, t = false) {
    e.updateWorldMatrix(false, false);
    const s = e.geometry;
    if (s !== void 0) {
      const n = s.getAttribute("position");
      if (t === true && n !== void 0 && e.isInstancedMesh !== true)
        for (let r = 0, o = n.count; r < o; r++)
          e.isMesh === true ? e.getVertexPosition(r, _i) : _i.fromBufferAttribute(n, r), _i.applyMatrix4(e.matrixWorld), this.expandByPoint(_i);
      else
        e.boundingBox !== void 0 ? (e.boundingBox === null && e.computeBoundingBox(), Sc.copy(e.boundingBox)) : (s.boundingBox === null && s.computeBoundingBox(), Sc.copy(s.boundingBox)), Sc.applyMatrix4(e.matrixWorld), this.union(Sc);
    }
    const i = e.children;
    for (let n = 0, r = i.length; n < r; n++)
      this.expandByObject(i[n], t);
    return this;
  }
  /**
   * Returns `true` if the given point lies within or on the boundaries of this box.
   *
   * @param {Vector3} point - The point to test.
   * @return {boolean} Whether the bounding box contains the given point or not.
   */
  containsPoint(e) {
    return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
  }
  /**
   * Returns `true` if this bounding box includes the entirety of the given bounding box.
   * If this box and the given one are identical, this function also returns `true`.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the bounding box contains the given bounding box or not.
   */
  containsBox(e) {
    return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
  }
  /**
   * Returns a point as a proportion of this box's width, height and depth.
   *
   * @param {Vector3} point - A point in 3D space.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} A point as a proportion of this box's width, height and depth.
   */
  getParameter(e, t) {
    return t.set(
      (e.x - this.min.x) / (this.max.x - this.min.x),
      (e.y - this.min.y) / (this.max.y - this.min.y),
      (e.z - this.min.z) / (this.max.z - this.min.z)
    );
  }
  /**
   * Returns `true` if the given bounding box intersects with this bounding box.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the given bounding box intersects with this bounding box.
   */
  intersectsBox(e) {
    return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
  }
  /**
   * Returns `true` if the given bounding sphere intersects with this bounding box.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the given bounding sphere intersects with this bounding box.
   */
  intersectsSphere(e) {
    return this.clampPoint(e.center, _i), _i.distanceToSquared(e.center) <= e.radius * e.radius;
  }
  /**
   * Returns `true` if the given plane intersects with this bounding box.
   *
   * @param {Plane} plane - The plane to test.
   * @return {boolean} Whether the given plane intersects with this bounding box.
   */
  intersectsPlane(e) {
    let t, s;
    return e.normal.x > 0 ? (t = e.normal.x * this.min.x, s = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, s = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, s += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, s += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, s += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, s += e.normal.z * this.min.z), t <= -e.constant && s >= -e.constant;
  }
  /**
   * Returns `true` if the given triangle intersects with this bounding box.
   *
   * @param {Triangle} triangle - The triangle to test.
   * @return {boolean} Whether the given triangle intersects with this bounding box.
   */
  intersectsTriangle(e) {
    if (this.isEmpty())
      return false;
    this.getCenter(Va), Mc.subVectors(this.max, Va), Eo.subVectors(e.a, Va), Ro.subVectors(e.b, Va), Co.subVectors(e.c, Va), qn.subVectors(Ro, Eo), Xn.subVectors(Co, Ro), Pr.subVectors(Eo, Co);
    let t = [
      0,
      -qn.z,
      qn.y,
      0,
      -Xn.z,
      Xn.y,
      0,
      -Pr.z,
      Pr.y,
      qn.z,
      0,
      -qn.x,
      Xn.z,
      0,
      -Xn.x,
      Pr.z,
      0,
      -Pr.x,
      -qn.y,
      qn.x,
      0,
      -Xn.y,
      Xn.x,
      0,
      -Pr.y,
      Pr.x,
      0
    ];
    return !Ld(t, Eo, Ro, Co, Mc) || (t = [1, 0, 0, 0, 1, 0, 0, 0, 1], !Ld(t, Eo, Ro, Co, Mc)) ? false : (Ac.crossVectors(qn, Xn), t = [Ac.x, Ac.y, Ac.z], Ld(t, Eo, Ro, Co, Mc));
  }
  /**
   * Clamps the given point within the bounds of this box.
   *
   * @param {Vector3} point - The point to clamp.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The clamped point.
   */
  clampPoint(e, t) {
    return t.copy(e).clamp(this.min, this.max);
  }
  /**
   * Returns the euclidean distance from any edge of this box to the specified point. If
   * the given point lies inside of this box, the distance will be `0`.
   *
   * @param {Vector3} point - The point to compute the distance to.
   * @return {number} The euclidean distance.
   */
  distanceToPoint(e) {
    return this.clampPoint(e, _i).distanceTo(e);
  }
  /**
   * Returns a bounding sphere that encloses this bounding box.
   *
   * @param {Sphere} target - The target sphere that is used to store the method's result.
   * @return {Sphere} The bounding sphere that encloses this bounding box.
   */
  getBoundingSphere(e) {
    return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(_i).length() * 0.5), e;
  }
  /**
   * Computes the intersection of this bounding box and the given one, setting the upper
   * bound of this box to the lesser of the two boxes' upper bounds and the
   * lower bound of this box to the greater of the two boxes' lower bounds. If
   * there's no overlap, makes this box empty.
   *
   * @param {Box3} box - The bounding box to intersect with.
   * @return {Box3} A reference to this bounding box.
   */
  intersect(e) {
    return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
  }
  /**
   * Computes the union of this box and another and the given one, setting the upper
   * bound of this box to the greater of the two boxes' upper bounds and the
   * lower bound of this box to the lesser of the two boxes' lower bounds.
   *
   * @param {Box3} box - The bounding box that will be unioned with this instance.
   * @return {Box3} A reference to this bounding box.
   */
  union(e) {
    return this.min.min(e.min), this.max.max(e.max), this;
  }
  /**
   * Transforms this bounding box by the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @return {Box3} A reference to this bounding box.
   */
  applyMatrix4(e) {
    return this.isEmpty() ? this : (pn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), pn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), pn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), pn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), pn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), pn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), pn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), pn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(pn), this);
  }
  /**
   * Adds the given offset to both the upper and lower bounds of this bounding box,
   * effectively moving it in 3D space.
   *
   * @param {Vector3} offset - The offset that should be used to translate the bounding box.
   * @return {Box3} A reference to this bounding box.
   */
  translate(e) {
    return this.min.add(e), this.max.add(e), this;
  }
  /**
   * Returns `true` if this bounding box is equal with the given one.
   *
   * @param {Box3} box - The box to test for equality.
   * @return {boolean} Whether this bounding box is equal with the given one.
   */
  equals(e) {
    return e.min.equals(this.min) && e.max.equals(this.max);
  }
  /**
   * Returns a serialized structure of the bounding box.
   *
   * @return {Object} Serialized structure with fields representing the object state.
   */
  toJSON() {
    return {
      min: this.min.toArray(),
      max: this.max.toArray()
    };
  }
  /**
   * Returns a serialized structure of the bounding box.
   *
   * @param {Object} json - The serialized json to set the box from.
   * @return {Box3} A reference to this bounding box.
   */
  fromJSON(e) {
    return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
  }
}
const pn = [
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y(),
  /* @__PURE__ */ new Y()
], _i = /* @__PURE__ */ new Y(), Sc = /* @__PURE__ */ new Wl(), Eo = /* @__PURE__ */ new Y(), Ro = /* @__PURE__ */ new Y(), Co = /* @__PURE__ */ new Y(), qn = /* @__PURE__ */ new Y(), Xn = /* @__PURE__ */ new Y(), Pr = /* @__PURE__ */ new Y(), Va = /* @__PURE__ */ new Y(), Mc = /* @__PURE__ */ new Y(), Ac = /* @__PURE__ */ new Y(), Ir = /* @__PURE__ */ new Y();
function Ld(a, e, t, s, i) {
  for (let n = 0, r = a.length - 3; n <= r; n += 3) {
    Ir.fromArray(a, n);
    const o = i.x * Math.abs(Ir.x) + i.y * Math.abs(Ir.y) + i.z * Math.abs(Ir.z), l = e.dot(Ir), c = t.dot(Ir), u = s.dot(Ir);
    if (Math.max(-Math.max(l, c, u), Math.min(l, c, u)) > o)
      return false;
  }
  return true;
}
const PR = /* @__PURE__ */ new Wl(), Ha2 = /* @__PURE__ */ new Y(), Od = /* @__PURE__ */ new Y();
class Ah {
  /**
   * Constructs a new sphere.
   *
   * @param {Vector3} [center=(0,0,0)] - The center of the sphere
   * @param {number} [radius=-1] - The radius of the sphere.
   */
  constructor(e = new Y(), t = -1) {
    this.isSphere = true, this.center = e, this.radius = t;
  }
  /**
   * Sets the sphere's components by copying the given values.
   *
   * @param {Vector3} center - The center.
   * @param {number} radius - The radius.
   * @return {Sphere} A reference to this sphere.
   */
  set(e, t) {
    return this.center.copy(e), this.radius = t, this;
  }
  /**
   * Computes the minimum bounding sphere for list of points.
   * If the optional center point is given, it is used as the sphere's
   * center. Otherwise, the center of the axis-aligned bounding box
   * encompassing the points is calculated.
   *
   * @param {Array<Vector3>} points - A list of points in 3D space.
   * @param {Vector3} [optionalCenter] - The center of the sphere.
   * @return {Sphere} A reference to this sphere.
   */
  setFromPoints(e, t) {
    const s = this.center;
    t !== void 0 ? s.copy(t) : PR.setFromPoints(e).getCenter(s);
    let i = 0;
    for (let n = 0, r = e.length; n < r; n++)
      i = Math.max(i, s.distanceToSquared(e[n]));
    return this.radius = Math.sqrt(i), this;
  }
  /**
   * Copies the values of the given sphere to this instance.
   *
   * @param {Sphere} sphere - The sphere to copy.
   * @return {Sphere} A reference to this sphere.
   */
  copy(e) {
    return this.center.copy(e.center), this.radius = e.radius, this;
  }
  /**
   * Returns `true` if the sphere is empty (the radius set to a negative number).
   *
   * Spheres with a radius of `0` contain only their center point and are not
   * considered to be empty.
   *
   * @return {boolean} Whether this sphere is empty or not.
   */
  isEmpty() {
    return this.radius < 0;
  }
  /**
   * Makes this sphere empty which means in encloses a zero space in 3D.
   *
   * @return {Sphere} A reference to this sphere.
   */
  makeEmpty() {
    return this.center.set(0, 0, 0), this.radius = -1, this;
  }
  /**
   * Returns `true` if this sphere contains the given point inclusive of
   * the surface of the sphere.
   *
   * @param {Vector3} point - The point to check.
   * @return {boolean} Whether this sphere contains the given point or not.
   */
  containsPoint(e) {
    return e.distanceToSquared(this.center) <= this.radius * this.radius;
  }
  /**
   * Returns the closest distance from the boundary of the sphere to the
   * given point. If the sphere contains the point, the distance will
   * be negative.
   *
   * @param {Vector3} point - The point to compute the distance to.
   * @return {number} The distance to the point.
   */
  distanceToPoint(e) {
    return e.distanceTo(this.center) - this.radius;
  }
  /**
   * Returns `true` if this sphere intersects with the given one.
   *
   * @param {Sphere} sphere - The sphere to test.
   * @return {boolean} Whether this sphere intersects with the given one or not.
   */
  intersectsSphere(e) {
    const t = this.radius + e.radius;
    return e.center.distanceToSquared(this.center) <= t * t;
  }
  /**
   * Returns `true` if this sphere intersects with the given box.
   *
   * @param {Box3} box - The box to test.
   * @return {boolean} Whether this sphere intersects with the given box or not.
   */
  intersectsBox(e) {
    return e.intersectsSphere(this);
  }
  /**
   * Returns `true` if this sphere intersects with the given plane.
   *
   * @param {Plane} plane - The plane to test.
   * @return {boolean} Whether this sphere intersects with the given plane or not.
   */
  intersectsPlane(e) {
    return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
  }
  /**
   * Clamps a point within the sphere. If the point is outside the sphere, it
   * will clamp it to the closest point on the edge of the sphere. Points
   * already inside the sphere will not be affected.
   *
   * @param {Vector3} point - The plane to clamp.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The clamped point.
   */
  clampPoint(e, t) {
    const s = this.center.distanceToSquared(e);
    return t.copy(e), s > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
  }
  /**
   * Returns a bounding box that encloses this sphere.
   *
   * @param {Box3} target - The target box that is used to store the method's result.
   * @return {Box3} The bounding box that encloses this sphere.
   */
  getBoundingBox(e) {
    return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
  }
  /**
   * Transforms this sphere with the given 4x4 transformation matrix.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @return {Sphere} A reference to this sphere.
   */
  applyMatrix4(e) {
    return this.center.applyMatrix4(e), this.radius = this.radius * e.getMaxScaleOnAxis(), this;
  }
  /**
   * Translates the sphere's center by the given offset.
   *
   * @param {Vector3} offset - The offset.
   * @return {Sphere} A reference to this sphere.
   */
  translate(e) {
    return this.center.add(e), this;
  }
  /**
   * Expands the boundaries of this sphere to include the given point.
   *
   * @param {Vector3} point - The point to include.
   * @return {Sphere} A reference to this sphere.
   */
  expandByPoint(e) {
    if (this.isEmpty())
      return this.center.copy(e), this.radius = 0, this;
    Ha2.subVectors(e, this.center);
    const t = Ha2.lengthSq();
    if (t > this.radius * this.radius) {
      const s = Math.sqrt(t), i = (s - this.radius) * 0.5;
      this.center.addScaledVector(Ha2, i / s), this.radius += i;
    }
    return this;
  }
  /**
   * Expands this sphere to enclose both the original sphere and the given sphere.
   *
   * @param {Sphere} sphere - The sphere to include.
   * @return {Sphere} A reference to this sphere.
   */
  union(e) {
    return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === true ? this.radius = Math.max(this.radius, e.radius) : (Od.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(Ha2.copy(e.center).add(Od)), this.expandByPoint(Ha2.copy(e.center).sub(Od))), this);
  }
  /**
   * Returns `true` if this sphere is equal with the given one.
   *
   * @param {Sphere} sphere - The sphere to test for equality.
   * @return {boolean} Whether this bounding sphere is equal with the given one.
   */
  equals(e) {
    return e.center.equals(this.center) && e.radius === this.radius;
  }
  /**
   * Returns a new sphere with copied values from this instance.
   *
   * @return {Sphere} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
  /**
   * Returns a serialized structure of the bounding sphere.
   *
   * @return {Object} Serialized structure with fields representing the object state.
   */
  toJSON() {
    return {
      radius: this.radius,
      center: this.center.toArray()
    };
  }
  /**
   * Returns a serialized structure of the bounding sphere.
   *
   * @param {Object} json - The serialized json to set the sphere from.
   * @return {Box3} A reference to this bounding sphere.
   */
  fromJSON(e) {
    return this.radius = e.radius, this.center.fromArray(e.center), this;
  }
}
class Rt {
  /**
   * Constructs a new 4x4 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n14] - 1-4 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n24] - 2-4 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @param {number} [n34] - 3-4 matrix element.
   * @param {number} [n41] - 4-1 matrix element.
   * @param {number} [n42] - 4-2 matrix element.
   * @param {number} [n43] - 4-3 matrix element.
   * @param {number} [n44] - 4-4 matrix element.
   */
  constructor(e, t, s, i, n, r, o, l, c, u, h, f, d, p, m3, g) {
    Rt.prototype.isMatrix4 = true, this.elements = [
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, s, i, n, r, o, l, c, u, h, f, d, p, m3, g);
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n13] - 1-3 matrix element.
   * @param {number} [n14] - 1-4 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   * @param {number} [n23] - 2-3 matrix element.
   * @param {number} [n24] - 2-4 matrix element.
   * @param {number} [n31] - 3-1 matrix element.
   * @param {number} [n32] - 3-2 matrix element.
   * @param {number} [n33] - 3-3 matrix element.
   * @param {number} [n34] - 3-4 matrix element.
   * @param {number} [n41] - 4-1 matrix element.
   * @param {number} [n42] - 4-2 matrix element.
   * @param {number} [n43] - 4-3 matrix element.
   * @param {number} [n44] - 4-4 matrix element.
   * @return {Matrix4} A reference to this matrix.
   */
  set(e, t, s, i, n, r, o, l, c, u, h, f, d, p, m3, g) {
    const y3 = this.elements;
    return y3[0] = e, y3[4] = t, y3[8] = s, y3[12] = i, y3[1] = n, y3[5] = r, y3[9] = o, y3[13] = l, y3[2] = c, y3[6] = u, y3[10] = h, y3[14] = f, y3[3] = d, y3[7] = p, y3[11] = m3, y3[15] = g, this;
  }
  /**
   * Sets this matrix to the 4x4 identity matrix.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Returns a matrix with copied values from this instance.
   *
   * @return {Matrix4} A clone of this instance.
   */
  clone() {
    return new Rt().fromArray(this.elements);
  }
  /**
   * Copies the values of the given matrix to this instance.
   *
   * @param {Matrix4} m - The matrix to copy.
   * @return {Matrix4} A reference to this matrix.
   */
  copy(e) {
    const t = this.elements, s = e.elements;
    return t[0] = s[0], t[1] = s[1], t[2] = s[2], t[3] = s[3], t[4] = s[4], t[5] = s[5], t[6] = s[6], t[7] = s[7], t[8] = s[8], t[9] = s[9], t[10] = s[10], t[11] = s[11], t[12] = s[12], t[13] = s[13], t[14] = s[14], t[15] = s[15], this;
  }
  /**
   * Copies the translation component of the given matrix
   * into this matrix's translation component.
   *
   * @param {Matrix4} m - The matrix to copy the translation component.
   * @return {Matrix4} A reference to this matrix.
   */
  copyPosition(e) {
    const t = this.elements, s = e.elements;
    return t[12] = s[12], t[13] = s[13], t[14] = s[14], this;
  }
  /**
   * Set the upper 3x3 elements of this matrix to the values of given 3x3 matrix.
   *
   * @param {Matrix3} m - The 3x3 matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  setFromMatrix3(e) {
    const t = e.elements;
    return this.set(
      t[0],
      t[3],
      t[6],
      0,
      t[1],
      t[4],
      t[7],
      0,
      t[2],
      t[5],
      t[8],
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Extracts the basis of this matrix into the three axis vectors provided.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  extractBasis(e, t, s) {
    return e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), s.setFromMatrixColumn(this, 2), this;
  }
  /**
   * Sets the given basis vectors to this matrix.
   *
   * @param {Vector3} xAxis - The basis's x axis.
   * @param {Vector3} yAxis - The basis's y axis.
   * @param {Vector3} zAxis - The basis's z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeBasis(e, t, s) {
    return this.set(
      e.x,
      t.x,
      s.x,
      0,
      e.y,
      t.y,
      s.y,
      0,
      e.z,
      t.z,
      s.z,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Extracts the rotation component of the given matrix
   * into this matrix's rotation component.
   *
   * Note: This method does not support reflection matrices.
   *
   * @param {Matrix4} m - The matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  extractRotation(e) {
    const t = this.elements, s = e.elements, i = 1 / No.setFromMatrixColumn(e, 0).length(), n = 1 / No.setFromMatrixColumn(e, 1).length(), r = 1 / No.setFromMatrixColumn(e, 2).length();
    return t[0] = s[0] * i, t[1] = s[1] * i, t[2] = s[2] * i, t[3] = 0, t[4] = s[4] * n, t[5] = s[5] * n, t[6] = s[6] * n, t[7] = 0, t[8] = s[8] * r, t[9] = s[9] * r, t[10] = s[10] * r, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  /**
   * Sets the rotation component (the upper left 3x3 matrix) of this matrix to
   * the rotation specified by the given Euler angles. The rest of
   * the matrix is set to the identity. Depending on the {@link Euler#order},
   * there are six possible outcomes. See [this page]{@link https://en.wikipedia.org/wiki/Euler_angles#Rotation_matrix}
   * for a complete list.
   *
   * @param {Euler} euler - The Euler angles.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationFromEuler(e) {
    const t = this.elements, s = e.x, i = e.y, n = e.z, r = Math.cos(s), o = Math.sin(s), l = Math.cos(i), c = Math.sin(i), u = Math.cos(n), h = Math.sin(n);
    if (e.order === "XYZ") {
      const f = r * u, d = r * h, p = o * u, m3 = o * h;
      t[0] = l * u, t[4] = -l * h, t[8] = c, t[1] = d + p * c, t[5] = f - m3 * c, t[9] = -o * l, t[2] = m3 - f * c, t[6] = p + d * c, t[10] = r * l;
    } else if (e.order === "YXZ") {
      const f = l * u, d = l * h, p = c * u, m3 = c * h;
      t[0] = f + m3 * o, t[4] = p * o - d, t[8] = r * c, t[1] = r * h, t[5] = r * u, t[9] = -o, t[2] = d * o - p, t[6] = m3 + f * o, t[10] = r * l;
    } else if (e.order === "ZXY") {
      const f = l * u, d = l * h, p = c * u, m3 = c * h;
      t[0] = f - m3 * o, t[4] = -r * h, t[8] = p + d * o, t[1] = d + p * o, t[5] = r * u, t[9] = m3 - f * o, t[2] = -r * c, t[6] = o, t[10] = r * l;
    } else if (e.order === "ZYX") {
      const f = r * u, d = r * h, p = o * u, m3 = o * h;
      t[0] = l * u, t[4] = p * c - d, t[8] = f * c + m3, t[1] = l * h, t[5] = m3 * c + f, t[9] = d * c - p, t[2] = -c, t[6] = o * l, t[10] = r * l;
    } else if (e.order === "YZX") {
      const f = r * l, d = r * c, p = o * l, m3 = o * c;
      t[0] = l * u, t[4] = m3 - f * h, t[8] = p * h + d, t[1] = h, t[5] = r * u, t[9] = -o * u, t[2] = -c * u, t[6] = d * h + p, t[10] = f - m3 * h;
    } else if (e.order === "XZY") {
      const f = r * l, d = r * c, p = o * l, m3 = o * c;
      t[0] = l * u, t[4] = -h, t[8] = c * u, t[1] = f * h + m3, t[5] = r * u, t[9] = d * h - p, t[2] = p * h - d, t[6] = o * u, t[10] = m3 * h + f;
    }
    return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
  }
  /**
   * Sets the rotation component of this matrix to the rotation specified by
   * the given Quaternion as outlined [here]{@link https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion}
   * The rest of the matrix is set to the identity.
   *
   * @param {Quaternion} q - The Quaternion.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationFromQuaternion(e) {
    return this.compose(BR, e, FR);
  }
  /**
   * Sets the rotation component of the transformation matrix, looking from `eye` towards
   * `target`, and oriented by the up-direction.
   *
   * @param {Vector3} eye - The eye vector.
   * @param {Vector3} target - The target vector.
   * @param {Vector3} up - The up vector.
   * @return {Matrix4} A reference to this matrix.
   */
  lookAt(e, t, s) {
    const i = this.elements;
    return Gs.subVectors(e, t), Gs.lengthSq() === 0 && (Gs.z = 1), Gs.normalize(), Kn.crossVectors(s, Gs), Kn.lengthSq() === 0 && (Math.abs(s.z) === 1 ? Gs.x += 1e-4 : Gs.z += 1e-4, Gs.normalize(), Kn.crossVectors(s, Gs)), Kn.normalize(), Cc.crossVectors(Gs, Kn), i[0] = Kn.x, i[4] = Cc.x, i[8] = Gs.x, i[1] = Kn.y, i[5] = Cc.y, i[9] = Gs.y, i[2] = Kn.z, i[6] = Cc.z, i[10] = Gs.z, this;
  }
  /**
   * Post-multiplies this matrix by the given 4x4 matrix.
   *
   * @param {Matrix4} m - The matrix to multiply with.
   * @return {Matrix4} A reference to this matrix.
   */
  multiply(e) {
    return this.multiplyMatrices(this, e);
  }
  /**
   * Pre-multiplies this matrix by the given 4x4 matrix.
   *
   * @param {Matrix4} m - The matrix to multiply with.
   * @return {Matrix4} A reference to this matrix.
   */
  premultiply(e) {
    return this.multiplyMatrices(e, this);
  }
  /**
   * Multiples the given 4x4 matrices and stores the result
   * in this matrix.
   *
   * @param {Matrix4} a - The first matrix.
   * @param {Matrix4} b - The second matrix.
   * @return {Matrix4} A reference to this matrix.
   */
  multiplyMatrices(e, t) {
    const s = e.elements, i = t.elements, n = this.elements, r = s[0], o = s[4], l = s[8], c = s[12], u = s[1], h = s[5], f = s[9], d = s[13], p = s[2], m3 = s[6], g = s[10], y3 = s[14], x = s[3], v = s[7], w = s[11], A = s[15], b = i[0], M = i[4], _ = i[8], T = i[12], S3 = i[1], E = i[5], C = i[9], B3 = i[13], D = i[2], G3 = i[6], O = i[10], ce2 = i[14], te = i[3], H = i[7], ie = i[11], ue2 = i[15];
    return n[0] = r * b + o * S3 + l * D + c * te, n[4] = r * M + o * E + l * G3 + c * H, n[8] = r * _ + o * C + l * O + c * ie, n[12] = r * T + o * B3 + l * ce2 + c * ue2, n[1] = u * b + h * S3 + f * D + d * te, n[5] = u * M + h * E + f * G3 + d * H, n[9] = u * _ + h * C + f * O + d * ie, n[13] = u * T + h * B3 + f * ce2 + d * ue2, n[2] = p * b + m3 * S3 + g * D + y3 * te, n[6] = p * M + m3 * E + g * G3 + y3 * H, n[10] = p * _ + m3 * C + g * O + y3 * ie, n[14] = p * T + m3 * B3 + g * ce2 + y3 * ue2, n[3] = x * b + v * S3 + w * D + A * te, n[7] = x * M + v * E + w * G3 + A * H, n[11] = x * _ + v * C + w * O + A * ie, n[15] = x * T + v * B3 + w * ce2 + A * ue2, this;
  }
  /**
   * Multiplies every component of the matrix by the given scalar.
   *
   * @param {number} s - The scalar.
   * @return {Matrix4} A reference to this matrix.
   */
  multiplyScalar(e) {
    const t = this.elements;
    return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
  }
  /**
   * Computes and returns the determinant of this matrix.
   *
   * Based on the method outlined [here]{@link http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.html}.
   *
   * @return {number} The determinant.
   */
  determinant() {
    const e = this.elements, t = e[0], s = e[4], i = e[8], n = e[12], r = e[1], o = e[5], l = e[9], c = e[13], u = e[2], h = e[6], f = e[10], d = e[14], p = e[3], m3 = e[7], g = e[11], y3 = e[15];
    return p * (+n * l * h - i * c * h - n * o * f + s * c * f + i * o * d - s * l * d) + m3 * (+t * l * d - t * c * f + n * r * f - i * r * d + i * c * u - n * l * u) + g * (+t * c * h - t * o * d - n * r * h + s * r * d + n * o * u - s * c * u) + y3 * (-i * o * u - t * l * h + t * o * f + i * r * h - s * r * f + s * l * u);
  }
  /**
   * Transposes this matrix in place.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  transpose() {
    const e = this.elements;
    let t;
    return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
  }
  /**
   * Sets the position component for this matrix from the given vector,
   * without affecting the rest of the matrix.
   *
   * @param {number|Vector3} x - The x component of the vector or alternatively the vector object.
   * @param {number} y - The y component of the vector.
   * @param {number} z - The z component of the vector.
   * @return {Matrix4} A reference to this matrix.
   */
  setPosition(e, t, s) {
    const i = this.elements;
    return e.isVector3 ? (i[12] = e.x, i[13] = e.y, i[14] = e.z) : (i[12] = e, i[13] = t, i[14] = s), this;
  }
  /**
   * Inverts this matrix, using the [analytic method]{@link https://en.wikipedia.org/wiki/Invertible_matrix#Analytic_solution}.
   * You can not invert with a determinant of zero. If you attempt this, the method produces
   * a zero matrix instead.
   *
   * @return {Matrix4} A reference to this matrix.
   */
  invert() {
    const e = this.elements, t = e[0], s = e[1], i = e[2], n = e[3], r = e[4], o = e[5], l = e[6], c = e[7], u = e[8], h = e[9], f = e[10], d = e[11], p = e[12], m3 = e[13], g = e[14], y3 = e[15], x = h * g * c - m3 * f * c + m3 * l * d - o * g * d - h * l * y3 + o * f * y3, v = p * f * c - u * g * c - p * l * d + r * g * d + u * l * y3 - r * f * y3, w = u * m3 * c - p * h * c + p * o * d - r * m3 * d - u * o * y3 + r * h * y3, A = p * h * l - u * m3 * l - p * o * f + r * m3 * f + u * o * g - r * h * g, b = t * x + s * v + i * w + n * A;
    if (b === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const M = 1 / b;
    return e[0] = x * M, e[1] = (m3 * f * n - h * g * n - m3 * i * d + s * g * d + h * i * y3 - s * f * y3) * M, e[2] = (o * g * n - m3 * l * n + m3 * i * c - s * g * c - o * i * y3 + s * l * y3) * M, e[3] = (h * l * n - o * f * n - h * i * c + s * f * c + o * i * d - s * l * d) * M, e[4] = v * M, e[5] = (u * g * n - p * f * n + p * i * d - t * g * d - u * i * y3 + t * f * y3) * M, e[6] = (p * l * n - r * g * n - p * i * c + t * g * c + r * i * y3 - t * l * y3) * M, e[7] = (r * f * n - u * l * n + u * i * c - t * f * c - r * i * d + t * l * d) * M, e[8] = w * M, e[9] = (p * h * n - u * m3 * n - p * s * d + t * m3 * d + u * s * y3 - t * h * y3) * M, e[10] = (r * m3 * n - p * o * n + p * s * c - t * m3 * c - r * s * y3 + t * o * y3) * M, e[11] = (u * o * n - r * h * n - u * s * c + t * h * c + r * s * d - t * o * d) * M, e[12] = A * M, e[13] = (u * m3 * i - p * h * i + p * s * f - t * m3 * f - u * s * g + t * h * g) * M, e[14] = (p * o * i - r * m3 * i - p * s * l + t * m3 * l + r * s * g - t * o * g) * M, e[15] = (r * h * i - u * o * i + u * s * l - t * h * l - r * s * f + t * o * f) * M, this;
  }
  /**
   * Multiplies the columns of this matrix by the given vector.
   *
   * @param {Vector3} v - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  scale(e) {
    const t = this.elements, s = e.x, i = e.y, n = e.z;
    return t[0] *= s, t[4] *= i, t[8] *= n, t[1] *= s, t[5] *= i, t[9] *= n, t[2] *= s, t[6] *= i, t[10] *= n, t[3] *= s, t[7] *= i, t[11] *= n, this;
  }
  /**
   * Gets the maximum scale value of the three axes.
   *
   * @return {number} The maximum scale.
   */
  getMaxScaleOnAxis() {
    const e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], s = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], i = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
    return Math.sqrt(Math.max(t, s, i));
  }
  /**
   * Sets this matrix as a translation transform from the given vector.
   *
   * @param {number|Vector3} x - The amount to translate in the X axis or alternatively a translation vector.
   * @param {number} y - The amount to translate in the Y axis.
   * @param {number} z - The amount to translate in the z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeTranslation(e, t, s) {
    return e.isVector3 ? this.set(
      1,
      0,
      0,
      e.x,
      0,
      1,
      0,
      e.y,
      0,
      0,
      1,
      e.z,
      0,
      0,
      0,
      1
    ) : this.set(
      1,
      0,
      0,
      e,
      0,
      1,
      0,
      t,
      0,
      0,
      1,
      s,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the X axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationX(e) {
    const t = Math.cos(e), s = Math.sin(e);
    return this.set(
      1,
      0,
      0,
      0,
      0,
      t,
      -s,
      0,
      0,
      s,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the Y axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationY(e) {
    const t = Math.cos(e), s = Math.sin(e);
    return this.set(
      t,
      0,
      s,
      0,
      0,
      1,
      0,
      0,
      -s,
      0,
      t,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the Z axis by
   * the given angle.
   *
   * @param {number} theta - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationZ(e) {
    const t = Math.cos(e), s = Math.sin(e);
    return this.set(
      t,
      -s,
      0,
      0,
      s,
      t,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a rotational transformation around the given axis by
   * the given angle.
   *
   * This is a somewhat controversial but mathematically sound alternative to
   * rotating via Quaternions. See the discussion [here]{@link https://www.gamedev.net/articles/programming/math-and-physics/do-we-really-need-quaternions-r1199}.
   *
   * @param {Vector3} axis - The normalized rotation axis.
   * @param {number} angle - The rotation in radians.
   * @return {Matrix4} A reference to this matrix.
   */
  makeRotationAxis(e, t) {
    const s = Math.cos(t), i = Math.sin(t), n = 1 - s, r = e.x, o = e.y, l = e.z, c = n * r, u = n * o;
    return this.set(
      c * r + s,
      c * o - i * l,
      c * l + i * o,
      0,
      c * o + i * l,
      u * o + s,
      u * l - i * r,
      0,
      c * l - i * o,
      u * l + i * r,
      n * l * l + s,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a scale transformation.
   *
   * @param {number} x - The amount to scale in the X axis.
   * @param {number} y - The amount to scale in the Y axis.
   * @param {number} z - The amount to scale in the Z axis.
   * @return {Matrix4} A reference to this matrix.
   */
  makeScale(e, t, s) {
    return this.set(
      e,
      0,
      0,
      0,
      0,
      t,
      0,
      0,
      0,
      0,
      s,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix as a shear transformation.
   *
   * @param {number} xy - The amount to shear X by Y.
   * @param {number} xz - The amount to shear X by Z.
   * @param {number} yx - The amount to shear Y by X.
   * @param {number} yz - The amount to shear Y by Z.
   * @param {number} zx - The amount to shear Z by X.
   * @param {number} zy - The amount to shear Z by Y.
   * @return {Matrix4} A reference to this matrix.
   */
  makeShear(e, t, s, i, n, r) {
    return this.set(
      1,
      s,
      n,
      0,
      e,
      1,
      r,
      0,
      t,
      i,
      1,
      0,
      0,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets this matrix to the transformation composed of the given position,
   * rotation (Quaternion) and scale.
   *
   * @param {Vector3} position - The position vector.
   * @param {Quaternion} quaternion - The rotation as a Quaternion.
   * @param {Vector3} scale - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  compose(e, t, s) {
    const i = this.elements, n = t._x, r = t._y, o = t._z, l = t._w, c = n + n, u = r + r, h = o + o, f = n * c, d = n * u, p = n * h, m3 = r * u, g = r * h, y3 = o * h, x = l * c, v = l * u, w = l * h, A = s.x, b = s.y, M = s.z;
    return i[0] = (1 - (m3 + y3)) * A, i[1] = (d + w) * A, i[2] = (p - v) * A, i[3] = 0, i[4] = (d - w) * b, i[5] = (1 - (f + y3)) * b, i[6] = (g + x) * b, i[7] = 0, i[8] = (p + v) * M, i[9] = (g - x) * M, i[10] = (1 - (f + m3)) * M, i[11] = 0, i[12] = e.x, i[13] = e.y, i[14] = e.z, i[15] = 1, this;
  }
  /**
   * Decomposes this matrix into its position, rotation and scale components
   * and provides the result in the given objects.
   *
   * Note: Not all matrices are decomposable in this way. For example, if an
   * object has a non-uniformly scaled parent, then the object's world matrix
   * may not be decomposable, and this method may not be appropriate.
   *
   * @param {Vector3} position - The position vector.
   * @param {Quaternion} quaternion - The rotation as a Quaternion.
   * @param {Vector3} scale - The scale vector.
   * @return {Matrix4} A reference to this matrix.
   */
  decompose(e, t, s) {
    const i = this.elements;
    let n = No.set(i[0], i[1], i[2]).length();
    const r = No.set(i[4], i[5], i[6]).length(), o = No.set(i[8], i[9], i[10]).length();
    this.determinant() < 0 && (n = -n), e.x = i[12], e.y = i[13], e.z = i[14], Ti.copy(this);
    const c = 1 / n, u = 1 / r, h = 1 / o;
    return Ti.elements[0] *= c, Ti.elements[1] *= c, Ti.elements[2] *= c, Ti.elements[4] *= u, Ti.elements[5] *= u, Ti.elements[6] *= u, Ti.elements[8] *= h, Ti.elements[9] *= h, Ti.elements[10] *= h, t.setFromRotationMatrix(Ti), s.x = n, s.y = r, s.z = o, this;
  }
  /**
  	 * Creates a perspective projection matrix. This is used internally by
  	 * {@link PerspectiveCamera#updateProjectionMatrix}.
  
  	 * @param {number} left - Left boundary of the viewing frustum at the near plane.
  	 * @param {number} right - Right boundary of the viewing frustum at the near plane.
  	 * @param {number} top - Top boundary of the viewing frustum at the near plane.
  	 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
  	 * @param {number} near - The distance from the camera to the near plane.
  	 * @param {number} far - The distance from the camera to the far plane.
  	 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
  	 * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
  	 * @return {Matrix4} A reference to this matrix.
  	 */
  makePerspective(e, t, s, i, n, r, o = Qs, l = false) {
    const c = this.elements, u = 2 * n / (t - e), h = 2 * n / (s - i), f = (t + e) / (t - e), d = (s + i) / (s - i);
    let p, m3;
    if (l)
      p = n / (r - n), m3 = r * n / (r - n);
    else if (o === Qs)
      p = -(r + n) / (r - n), m3 = -2 * r * n / (r - n);
    else if (o === yr)
      p = -r / (r - n), m3 = -r * n / (r - n);
    else
      throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
    return c[0] = u, c[4] = 0, c[8] = f, c[12] = 0, c[1] = 0, c[5] = h, c[9] = d, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m3, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
  }
  /**
  	 * Creates a orthographic projection matrix. This is used internally by
  	 * {@link OrthographicCamera#updateProjectionMatrix}.
  
  	 * @param {number} left - Left boundary of the viewing frustum at the near plane.
  	 * @param {number} right - Right boundary of the viewing frustum at the near plane.
  	 * @param {number} top - Top boundary of the viewing frustum at the near plane.
  	 * @param {number} bottom - Bottom boundary of the viewing frustum at the near plane.
  	 * @param {number} near - The distance from the camera to the near plane.
  	 * @param {number} far - The distance from the camera to the far plane.
  	 * @param {(WebGLCoordinateSystem|WebGPUCoordinateSystem)} [coordinateSystem=WebGLCoordinateSystem] - The coordinate system.
  	 * @param {boolean} [reversedDepth=false] - Whether to use a reversed depth.
  	 * @return {Matrix4} A reference to this matrix.
  	 */
  makeOrthographic(e, t, s, i, n, r, o = Qs, l = false) {
    const c = this.elements, u = 2 / (t - e), h = 2 / (s - i), f = -(t + e) / (t - e), d = -(s + i) / (s - i);
    let p, m3;
    if (l)
      p = 1 / (r - n), m3 = r / (r - n);
    else if (o === Qs)
      p = -2 / (r - n), m3 = -(r + n) / (r - n);
    else if (o === yr)
      p = -1 / (r - n), m3 = -n / (r - n);
    else
      throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
    return c[0] = u, c[4] = 0, c[8] = 0, c[12] = f, c[1] = 0, c[5] = h, c[9] = 0, c[13] = d, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m3, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
  }
  /**
   * Returns `true` if this matrix is equal with the given one.
   *
   * @param {Matrix4} matrix - The matrix to test for equality.
   * @return {boolean} Whether this matrix is equal with the given one.
   */
  equals(e) {
    const t = this.elements, s = e.elements;
    for (let i = 0; i < 16; i++)
      if (t[i] !== s[i]) return false;
    return true;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix4} A reference to this matrix.
   */
  fromArray(e, t = 0) {
    for (let s = 0; s < 16; s++)
      this.elements[s] = e[s + t];
    return this;
  }
  /**
   * Writes the elements of this matrix to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The matrix elements in column-major order.
   */
  toArray(e = [], t = 0) {
    const s = this.elements;
    return e[t] = s[0], e[t + 1] = s[1], e[t + 2] = s[2], e[t + 3] = s[3], e[t + 4] = s[4], e[t + 5] = s[5], e[t + 6] = s[6], e[t + 7] = s[7], e[t + 8] = s[8], e[t + 9] = s[9], e[t + 10] = s[10], e[t + 11] = s[11], e[t + 12] = s[12], e[t + 13] = s[13], e[t + 14] = s[14], e[t + 15] = s[15], e;
  }
}
const No = /* @__PURE__ */ new Y(), Ti = /* @__PURE__ */ new Rt(), BR = /* @__PURE__ */ new Y(0, 0, 0), FR = /* @__PURE__ */ new Y(1, 1, 1), Kn = /* @__PURE__ */ new Y(), Cc = /* @__PURE__ */ new Y(), Gs = /* @__PURE__ */ new Y(), by = /* @__PURE__ */ new Rt(), wy = /* @__PURE__ */ new Ma();
class gi {
  /**
   * Constructs a new euler instance.
   *
   * @param {number} [x=0] - The angle of the x axis in radians.
   * @param {number} [y=0] - The angle of the y axis in radians.
   * @param {number} [z=0] - The angle of the z axis in radians.
   * @param {string} [order=Euler.DEFAULT_ORDER] - A string representing the order that the rotations are applied.
   */
  constructor(e = 0, t = 0, s = 0, i = gi.DEFAULT_ORDER) {
    this.isEuler = true, this._x = e, this._y = t, this._z = s, this._order = i;
  }
  /**
   * The angle of the x axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get x() {
    return this._x;
  }
  set x(e) {
    this._x = e, this._onChangeCallback();
  }
  /**
   * The angle of the y axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get y() {
    return this._y;
  }
  set y(e) {
    this._y = e, this._onChangeCallback();
  }
  /**
   * The angle of the z axis in radians.
   *
   * @type {number}
   * @default 0
   */
  get z() {
    return this._z;
  }
  set z(e) {
    this._z = e, this._onChangeCallback();
  }
  /**
   * A string representing the order that the rotations are applied.
   *
   * @type {string}
   * @default 'XYZ'
   */
  get order() {
    return this._order;
  }
  set order(e) {
    this._order = e, this._onChangeCallback();
  }
  /**
   * Sets the Euler components.
   *
   * @param {number} x - The angle of the x axis in radians.
   * @param {number} y - The angle of the y axis in radians.
   * @param {number} z - The angle of the z axis in radians.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  set(e, t, s, i = this._order) {
    return this._x = e, this._y = t, this._z = s, this._order = i, this._onChangeCallback(), this;
  }
  /**
   * Returns a new Euler instance with copied values from this instance.
   *
   * @return {Euler} A clone of this instance.
   */
  clone() {
    return new this.constructor(this._x, this._y, this._z, this._order);
  }
  /**
   * Copies the values of the given Euler instance to this instance.
   *
   * @param {Euler} euler - The Euler instance to copy.
   * @return {Euler} A reference to this Euler instance.
   */
  copy(e) {
    return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
  }
  /**
   * Sets the angles of this Euler instance from a pure rotation matrix.
   *
   * @param {Matrix4} m - A 4x4 matrix of which the upper 3x3 of matrix is a pure rotation matrix (i.e. unscaled).
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromRotationMatrix(e, t = this._order, s = true) {
    const i = e.elements, n = i[0], r = i[4], o = i[8], l = i[1], c = i[5], u = i[9], h = i[2], f = i[6], d = i[10];
    switch (t) {
      case "XYZ":
        this._y = Math.asin(Je(o, -1, 1)), Math.abs(o) < 0.9999999 ? (this._x = Math.atan2(-u, d), this._z = Math.atan2(-r, n)) : (this._x = Math.atan2(f, c), this._z = 0);
        break;
      case "YXZ":
        this._x = Math.asin(-Je(u, -1, 1)), Math.abs(u) < 0.9999999 ? (this._y = Math.atan2(o, d), this._z = Math.atan2(l, c)) : (this._y = Math.atan2(-h, n), this._z = 0);
        break;
      case "ZXY":
        this._x = Math.asin(Je(f, -1, 1)), Math.abs(f) < 0.9999999 ? (this._y = Math.atan2(-h, d), this._z = Math.atan2(-r, c)) : (this._y = 0, this._z = Math.atan2(l, n));
        break;
      case "ZYX":
        this._y = Math.asin(-Je(h, -1, 1)), Math.abs(h) < 0.9999999 ? (this._x = Math.atan2(f, d), this._z = Math.atan2(l, n)) : (this._x = 0, this._z = Math.atan2(-r, c));
        break;
      case "YZX":
        this._z = Math.asin(Je(l, -1, 1)), Math.abs(l) < 0.9999999 ? (this._x = Math.atan2(-u, c), this._y = Math.atan2(-h, n)) : (this._x = 0, this._y = Math.atan2(o, d));
        break;
      case "XZY":
        this._z = Math.asin(-Je(r, -1, 1)), Math.abs(r) < 0.9999999 ? (this._x = Math.atan2(f, c), this._y = Math.atan2(o, n)) : (this._x = Math.atan2(-u, d), this._y = 0);
        break;
      default:
        console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
    }
    return this._order = t, s === true && this._onChangeCallback(), this;
  }
  /**
   * Sets the angles of this Euler instance from a normalized quaternion.
   *
   * @param {Quaternion} q - A normalized Quaternion.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @param {boolean} [update=true] - Whether the internal `onChange` callback should be executed or not.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromQuaternion(e, t, s) {
    return by.makeRotationFromQuaternion(e), this.setFromRotationMatrix(by, t, s);
  }
  /**
   * Sets the angles of this Euler instance from the given vector.
   *
   * @param {Vector3} v - The vector.
   * @param {string} [order] - A string representing the order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  setFromVector3(e, t = this._order) {
    return this.set(e.x, e.y, e.z, t);
  }
  /**
   * Resets the euler angle with a new order by creating a quaternion from this
   * euler angle and then setting this euler angle with the quaternion and the
   * new order.
   *
   * Warning: This discards revolution information.
   *
   * @param {string} [newOrder] - A string representing the new order that the rotations are applied.
   * @return {Euler} A reference to this Euler instance.
   */
  reorder(e) {
    return wy.setFromEuler(this), this.setFromQuaternion(wy, e);
  }
  /**
   * Returns `true` if this Euler instance is equal with the given one.
   *
   * @param {Euler} euler - The Euler instance to test for equality.
   * @return {boolean} Whether this Euler instance is equal with the given one.
   */
  equals(e) {
    return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
  }
  /**
   * Sets this Euler instance's components to values from the given array. The first three
   * entries of the array are assign to the x,y and z components. An optional fourth entry
   * defines the Euler order.
   *
   * @param {Array<number,number,number,?string>} array - An array holding the Euler component values.
   * @return {Euler} A reference to this Euler instance.
   */
  fromArray(e) {
    return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
  }
  /**
   * Writes the components of this Euler instance to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number,number,number,string>} [array=[]] - The target array holding the Euler components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number,number,number,string>} The Euler components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
  }
  _onChange(e) {
    return this._onChangeCallback = e, this;
  }
  _onChangeCallback() {
  }
  *[Symbol.iterator]() {
    yield this._x, yield this._y, yield this._z, yield this._order;
  }
}
gi.DEFAULT_ORDER = "XYZ";
class DR {
  /**
   * Constructs a new layers instance, with membership
   * initially set to layer `0`.
   */
  constructor() {
    this.mask = 1;
  }
  /**
   * Sets membership to the given layer, and remove membership all other layers.
   *
   * @param {number} layer - The layer to set.
   */
  set(e) {
    this.mask = (1 << e | 0) >>> 0;
  }
  /**
   * Adds membership of the given layer.
   *
   * @param {number} layer - The layer to enable.
   */
  enable(e) {
    this.mask |= 1 << e | 0;
  }
  /**
   * Adds membership to all layers.
   */
  enableAll() {
    this.mask = -1;
  }
  /**
   * Toggles the membership of the given layer.
   *
   * @param {number} layer - The layer to toggle.
   */
  toggle(e) {
    this.mask ^= 1 << e | 0;
  }
  /**
   * Removes membership of the given layer.
   *
   * @param {number} layer - The layer to enable.
   */
  disable(e) {
    this.mask &= ~(1 << e | 0);
  }
  /**
   * Removes the membership from all layers.
   */
  disableAll() {
    this.mask = 0;
  }
  /**
   * Returns `true` if this and the given layers object have at least one
   * layer in common.
   *
   * @param {Layers} layers - The layers to test.
   * @return {boolean } Whether this and the given layers object have at least one layer in common or not.
   */
  test(e) {
    return (this.mask & e.mask) !== 0;
  }
  /**
   * Returns `true` if the given layer is enabled.
   *
   * @param {number} layer - The layer to test.
   * @return {boolean } Whether the given layer is enabled or not.
   */
  isEnabled(e) {
    return (this.mask & (1 << e | 0)) !== 0;
  }
}
let LR = 0;
const Sy = /* @__PURE__ */ new Y(), Po = /* @__PURE__ */ new Ma(), gn = /* @__PURE__ */ new Rt(), Nc = /* @__PURE__ */ new Y(), $a = /* @__PURE__ */ new Y(), OR = /* @__PURE__ */ new Y(), UR = /* @__PURE__ */ new Ma(), My = /* @__PURE__ */ new Y(1, 0, 0), Ay = /* @__PURE__ */ new Y(0, 1, 0), Ey = /* @__PURE__ */ new Y(0, 0, 1), Ry = { type: "added" }, kR = { type: "removed" }, Io = { type: "childadded", child: null }, Gd = { type: "childremoved", child: null };
class Jt extends co2 {
  /**
   * Constructs a new 3D object.
   */
  constructor() {
    super(), this.isObject3D = true, Object.defineProperty(this, "id", { value: LR++ }), this.uuid = Bn(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = Jt.DEFAULT_UP.clone();
    const e = new Y(), t = new gi(), s = new Ma(), i = new Y(1, 1, 1);
    function n() {
      s.setFromEuler(t, false);
    }
    function r() {
      t.setFromQuaternion(s, void 0, false);
    }
    t._onChange(n), s._onChange(r), Object.defineProperties(this, {
      /**
       * Represents the object's local position.
       *
       * @name Object3D#position
       * @type {Vector3}
       * @default (0,0,0)
       */
      position: {
        configurable: true,
        enumerable: true,
        value: e
      },
      /**
       * Represents the object's local rotation as Euler angles, in radians.
       *
       * @name Object3D#rotation
       * @type {Euler}
       * @default (0,0,0)
       */
      rotation: {
        configurable: true,
        enumerable: true,
        value: t
      },
      /**
       * Represents the object's local rotation as Quaternions.
       *
       * @name Object3D#quaternion
       * @type {Quaternion}
       */
      quaternion: {
        configurable: true,
        enumerable: true,
        value: s
      },
      /**
       * Represents the object's local scale.
       *
       * @name Object3D#scale
       * @type {Vector3}
       * @default (1,1,1)
       */
      scale: {
        configurable: true,
        enumerable: true,
        value: i
      },
      /**
       * Represents the object's model-view matrix.
       *
       * @name Object3D#modelViewMatrix
       * @type {Matrix4}
       */
      modelViewMatrix: {
        value: new Rt()
      },
      /**
       * Represents the object's normal matrix.
       *
       * @name Object3D#normalMatrix
       * @type {Matrix3}
       */
      normalMatrix: {
        value: new zs()
      }
    }), this.matrix = new Rt(), this.matrixWorld = new Rt(), this.matrixAutoUpdate = Jt.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = false, this.layers = new DR(), this.visible = true, this.castShadow = false, this.receiveShadow = false, this.frustumCulled = true, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.userData = {};
  }
  /**
   * A callback that is executed immediately before a 3D object is rendered to a shadow map.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {Camera} shadowCamera - The shadow camera.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} depthMaterial - The depth material.
   * @param {Object} group - The geometry group data.
   */
  onBeforeShadow() {
  }
  /**
   * A callback that is executed immediately after a 3D object is rendered to a shadow map.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {Camera} shadowCamera - The shadow camera.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} depthMaterial - The depth material.
   * @param {Object} group - The geometry group data.
   */
  onAfterShadow() {
  }
  /**
   * A callback that is executed immediately before a 3D object is rendered.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} material - The 3D object's material.
   * @param {Object} group - The geometry group data.
   */
  onBeforeRender() {
  }
  /**
   * A callback that is executed immediately after a 3D object is rendered.
   *
   * @param {Renderer|WebGLRenderer} renderer - The renderer.
   * @param {Object3D} object - The 3D object.
   * @param {Camera} camera - The camera that is used to render the scene.
   * @param {BufferGeometry} geometry - The 3D object's geometry.
   * @param {Material} material - The 3D object's material.
   * @param {Object} group - The geometry group data.
   */
  onAfterRender() {
  }
  /**
   * Applies the given transformation matrix to the object and updates the object's position,
   * rotation and scale.
   *
   * @param {Matrix4} matrix - The transformation matrix.
   */
  applyMatrix4(e) {
    this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
  }
  /**
   * Applies a rotation represented by given the quaternion to the 3D object.
   *
   * @param {Quaternion} q - The quaternion.
   * @return {Object3D} A reference to this instance.
   */
  applyQuaternion(e) {
    return this.quaternion.premultiply(e), this;
  }
  /**
   * Sets the given rotation represented as an axis/angle couple to the 3D object.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   */
  setRotationFromAxisAngle(e, t) {
    this.quaternion.setFromAxisAngle(e, t);
  }
  /**
   * Sets the given rotation represented as Euler angles to the 3D object.
   *
   * @param {Euler} euler - The Euler angles.
   */
  setRotationFromEuler(e) {
    this.quaternion.setFromEuler(e, true);
  }
  /**
   * Sets the given rotation represented as rotation matrix to the 3D object.
   *
   * @param {Matrix4} m - Although a 4x4 matrix is expected, the upper 3x3 portion must be
   * a pure rotation matrix (i.e, unscaled).
   */
  setRotationFromMatrix(e) {
    this.quaternion.setFromRotationMatrix(e);
  }
  /**
   * Sets the given rotation represented as a Quaternion to the 3D object.
   *
   * @param {Quaternion} q - The Quaternion
   */
  setRotationFromQuaternion(e) {
    this.quaternion.copy(e);
  }
  /**
   * Rotates the 3D object along an axis in local space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateOnAxis(e, t) {
    return Po.setFromAxisAngle(e, t), this.quaternion.multiply(Po), this;
  }
  /**
   * Rotates the 3D object along an axis in world space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateOnWorldAxis(e, t) {
    return Po.setFromAxisAngle(e, t), this.quaternion.premultiply(Po), this;
  }
  /**
   * Rotates the 3D object around its X axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateX(e) {
    return this.rotateOnAxis(My, e);
  }
  /**
   * Rotates the 3D object around its Y axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateY(e) {
    return this.rotateOnAxis(Ay, e);
  }
  /**
   * Rotates the 3D object around its Z axis in local space.
   *
   * @param {number} angle - The angle in radians.
   * @return {Object3D} A reference to this instance.
   */
  rotateZ(e) {
    return this.rotateOnAxis(Ey, e);
  }
  /**
   * Translate the 3D object by a distance along the given axis in local space.
   *
   * @param {Vector3} axis - The (normalized) axis vector.
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateOnAxis(e, t) {
    return Sy.copy(e).applyQuaternion(this.quaternion), this.position.add(Sy.multiplyScalar(t)), this;
  }
  /**
   * Translate the 3D object by a distance along its X-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateX(e) {
    return this.translateOnAxis(My, e);
  }
  /**
   * Translate the 3D object by a distance along its Y-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateY(e) {
    return this.translateOnAxis(Ay, e);
  }
  /**
   * Translate the 3D object by a distance along its Z-axis in local space.
   *
   * @param {number} distance - The distance in world units.
   * @return {Object3D} A reference to this instance.
   */
  translateZ(e) {
    return this.translateOnAxis(Ey, e);
  }
  /**
   * Converts the given vector from this 3D object's local space to world space.
   *
   * @param {Vector3} vector - The vector to convert.
   * @return {Vector3} The converted vector.
   */
  localToWorld(e) {
    return this.updateWorldMatrix(true, false), e.applyMatrix4(this.matrixWorld);
  }
  /**
   * Converts the given vector from this 3D object's word space to local space.
   *
   * @param {Vector3} vector - The vector to convert.
   * @return {Vector3} The converted vector.
   */
  worldToLocal(e) {
    return this.updateWorldMatrix(true, false), e.applyMatrix4(gn.copy(this.matrixWorld).invert());
  }
  /**
   * Rotates the object to face a point in world space.
   *
   * This method does not support objects having non-uniformly-scaled parent(s).
   *
   * @param {number|Vector3} x - The x coordinate in world space. Alternatively, a vector representing a position in world space
   * @param {number} [y] - The y coordinate in world space.
   * @param {number} [z] - The z coordinate in world space.
   */
  lookAt(e, t, s) {
    e.isVector3 ? Nc.copy(e) : Nc.set(e, t, s);
    const i = this.parent;
    this.updateWorldMatrix(true, false), $a.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? gn.lookAt($a, Nc, this.up) : gn.lookAt(Nc, $a, this.up), this.quaternion.setFromRotationMatrix(gn), i && (gn.extractRotation(i.matrixWorld), Po.setFromRotationMatrix(gn), this.quaternion.premultiply(Po.invert()));
  }
  /**
   * Adds the given 3D object as a child to this 3D object. An arbitrary number of
   * objects may be added. Any current parent on an object passed in here will be
   * removed, since an object can have at most one parent.
   *
   * @fires Object3D#added
   * @fires Object3D#childadded
   * @param {Object3D} object - The 3D object to add.
   * @return {Object3D} A reference to this instance.
   */
  add(e) {
    if (arguments.length > 1) {
      for (let t = 0; t < arguments.length; t++)
        this.add(arguments[t]);
      return this;
    }
    return e === this ? (console.error("THREE.Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(Ry), Io.child = e, this.dispatchEvent(Io), Io.child = null) : console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", e), this);
  }
  /**
   * Removes the given 3D object as child from this 3D object.
   * An arbitrary number of objects may be removed.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @param {Object3D} object - The 3D object to remove.
   * @return {Object3D} A reference to this instance.
   */
  remove(e) {
    if (arguments.length > 1) {
      for (let s = 0; s < arguments.length; s++)
        this.remove(arguments[s]);
      return this;
    }
    const t = this.children.indexOf(e);
    return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(kR), Gd.child = e, this.dispatchEvent(Gd), Gd.child = null), this;
  }
  /**
   * Removes this 3D object from its current parent.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @return {Object3D} A reference to this instance.
   */
  removeFromParent() {
    const e = this.parent;
    return e !== null && e.remove(this), this;
  }
  /**
   * Removes all child objects.
   *
   * @fires Object3D#removed
   * @fires Object3D#childremoved
   * @return {Object3D} A reference to this instance.
   */
  clear() {
    return this.remove(...this.children);
  }
  /**
   * Adds the given 3D object as a child of this 3D object, while maintaining the object's world
   * transform. This method does not support scene graphs having non-uniformly-scaled nodes(s).
   *
   * @fires Object3D#added
   * @fires Object3D#childadded
   * @param {Object3D} object - The 3D object to attach.
   * @return {Object3D} A reference to this instance.
   */
  attach(e) {
    return this.updateWorldMatrix(true, false), gn.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(true, false), gn.multiply(e.parent.matrixWorld)), e.applyMatrix4(gn), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(false, true), e.dispatchEvent(Ry), Io.child = e, this.dispatchEvent(Io), Io.child = null, this;
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching ID.
   *
   * @param {number} id - The id.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectById(e) {
    return this.getObjectByProperty("id", e);
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching name.
   *
   * @param {string} name - The name.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectByName(e) {
    return this.getObjectByProperty("name", e);
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns the first with a matching property value.
   *
   * @param {string} name - The name of the property.
   * @param {any} value - The value.
   * @return {Object3D|undefined} The found 3D object. Returns `undefined` if no 3D object has been found.
   */
  getObjectByProperty(e, t) {
    if (this[e] === t) return this;
    for (let s = 0, i = this.children.length; s < i; s++) {
      const r = this.children[s].getObjectByProperty(e, t);
      if (r !== void 0)
        return r;
    }
  }
  /**
   * Searches through the 3D object and its children, starting with the 3D object
   * itself, and returns all 3D objects with a matching property value.
   *
   * @param {string} name - The name of the property.
   * @param {any} value - The value.
   * @param {Array<Object3D>} result - The method stores the result in this array.
   * @return {Array<Object3D>} The found 3D objects.
   */
  getObjectsByProperty(e, t, s = []) {
    this[e] === t && s.push(this);
    const i = this.children;
    for (let n = 0, r = i.length; n < r; n++)
      i[n].getObjectsByProperty(e, t, s);
    return s;
  }
  /**
   * Returns a vector representing the position of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's position in world space.
   */
  getWorldPosition(e) {
    return this.updateWorldMatrix(true, false), e.setFromMatrixPosition(this.matrixWorld);
  }
  /**
   * Returns a Quaternion representing the position of the 3D object in world space.
   *
   * @param {Quaternion} target - The target Quaternion the result is stored to.
   * @return {Quaternion} The 3D object's rotation in world space.
   */
  getWorldQuaternion(e) {
    return this.updateWorldMatrix(true, false), this.matrixWorld.decompose($a, e, OR), e;
  }
  /**
   * Returns a vector representing the scale of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's scale in world space.
   */
  getWorldScale(e) {
    return this.updateWorldMatrix(true, false), this.matrixWorld.decompose($a, UR, e), e;
  }
  /**
   * Returns a vector representing the ("look") direction of the 3D object in world space.
   *
   * @param {Vector3} target - The target vector the result is stored to.
   * @return {Vector3} The 3D object's direction in world space.
   */
  getWorldDirection(e) {
    this.updateWorldMatrix(true, false);
    const t = this.matrixWorld.elements;
    return e.set(t[8], t[9], t[10]).normalize();
  }
  /**
   * Abstract method to get intersections between a casted ray and this
   * 3D object. Renderable 3D objects such as {@link Mesh}, {@link Line} or {@link Points}
   * implement this method in order to use raycasting.
   *
   * @abstract
   * @param {Raycaster} raycaster - The raycaster.
   * @param {Array<Object>} intersects - An array holding the result of the method.
   */
  raycast() {
  }
  /**
   * Executes the callback on this 3D object and all descendants.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverse(e) {
    e(this);
    const t = this.children;
    for (let s = 0, i = t.length; s < i; s++)
      t[s].traverse(e);
  }
  /**
   * Like {@link Object3D#traverse}, but the callback will only be executed for visible 3D objects.
   * Descendants of invisible 3D objects are not traversed.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverseVisible(e) {
    if (this.visible === false) return;
    e(this);
    const t = this.children;
    for (let s = 0, i = t.length; s < i; s++)
      t[s].traverseVisible(e);
  }
  /**
   * Like {@link Object3D#traverse}, but the callback will only be executed for all ancestors.
   *
   * Note: Modifying the scene graph inside the callback is discouraged.
   *
   * @param {Function} callback - A callback function that allows to process the current 3D object.
   */
  traverseAncestors(e) {
    const t = this.parent;
    t !== null && (e(t), t.traverseAncestors(e));
  }
  /**
   * Updates the transformation matrix in local space by computing it from the current
   * position, rotation and scale values.
   */
  updateMatrix() {
    this.matrix.compose(this.position, this.quaternion, this.scale), this.matrixWorldNeedsUpdate = true;
  }
  /**
   * Updates the transformation matrix in world space of this 3D objects and its descendants.
   *
   * To ensure correct results, this method also recomputes the 3D object's transformation matrix in
   * local space. The computation of the local and world matrix can be controlled with the
   * {@link Object3D#matrixAutoUpdate} and {@link Object3D#matrixWorldAutoUpdate} flags which are both
   * `true` by default.  Set these flags to `false` if you need more control over the update matrix process.
   *
   * @param {boolean} [force=false] - When set to `true`, a recomputation of world matrices is forced even
   * when {@link Object3D#matrixWorldAutoUpdate} is set to `false`.
   */
  updateMatrixWorld(e) {
    this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = false, e = true);
    const t = this.children;
    for (let s = 0, i = t.length; s < i; s++)
      t[s].updateMatrixWorld(e);
  }
  /**
   * An alternative version of {@link Object3D#updateMatrixWorld} with more control over the
   * update of ancestor and descendant nodes.
   *
   * @param {boolean} [updateParents=false] Whether ancestor nodes should be updated or not.
   * @param {boolean} [updateChildren=false] Whether descendant nodes should be updated or not.
   */
  updateWorldMatrix(e, t) {
    const s = this.parent;
    if (e === true && s !== null && s.updateWorldMatrix(true, false), this.matrixAutoUpdate && this.updateMatrix(), this.matrixWorldAutoUpdate === true && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), t === true) {
      const i = this.children;
      for (let n = 0, r = i.length; n < r; n++)
        i[n].updateWorldMatrix(false, true);
    }
  }
  /**
   * Serializes the 3D object into JSON.
   *
   * @param {?(Object|string)} meta - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized 3D object.
   * @see {@link ObjectLoader#parse}
   */
  toJSON(e) {
    const t = e === void 0 || typeof e == "string", s = {};
    t && (e = {
      geometries: {},
      materials: {},
      textures: {},
      images: {},
      shapes: {},
      skeletons: {},
      animations: {},
      nodes: {}
    }, s.metadata = {
      version: 4.7,
      type: "Object",
      generator: "Object3D.toJSON"
    });
    const i = {};
    i.uuid = this.uuid, i.type = this.type, this.name !== "" && (i.name = this.name), this.castShadow === true && (i.castShadow = true), this.receiveShadow === true && (i.receiveShadow = true), this.visible === false && (i.visible = false), this.frustumCulled === false && (i.frustumCulled = false), this.renderOrder !== 0 && (i.renderOrder = this.renderOrder), Object.keys(this.userData).length > 0 && (i.userData = this.userData), i.layers = this.layers.mask, i.matrix = this.matrix.toArray(), i.up = this.up.toArray(), this.matrixAutoUpdate === false && (i.matrixAutoUpdate = false), this.isInstancedMesh && (i.type = "InstancedMesh", i.count = this.count, i.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (i.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (i.type = "BatchedMesh", i.perObjectFrustumCulled = this.perObjectFrustumCulled, i.sortObjects = this.sortObjects, i.drawRanges = this._drawRanges, i.reservedRanges = this._reservedRanges, i.geometryInfo = this._geometryInfo.map((o) => ({
      ...o,
      boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0,
      boundingSphere: o.boundingSphere ? o.boundingSphere.toJSON() : void 0
    })), i.instanceInfo = this._instanceInfo.map((o) => ({ ...o })), i.availableInstanceIds = this._availableInstanceIds.slice(), i.availableGeometryIds = this._availableGeometryIds.slice(), i.nextIndexStart = this._nextIndexStart, i.nextVertexStart = this._nextVertexStart, i.geometryCount = this._geometryCount, i.maxInstanceCount = this._maxInstanceCount, i.maxVertexCount = this._maxVertexCount, i.maxIndexCount = this._maxIndexCount, i.geometryInitialized = this._geometryInitialized, i.matricesTexture = this._matricesTexture.toJSON(e), i.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (i.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (i.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (i.boundingBox = this.boundingBox.toJSON()));
    function n(o, l) {
      return o[l.uuid] === void 0 && (o[l.uuid] = l.toJSON(e)), l.uuid;
    }
    if (this.isScene)
      this.background && (this.background.isColor ? i.background = this.background.toJSON() : this.background.isTexture && (i.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== true && (i.environment = this.environment.toJSON(e).uuid);
    else if (this.isMesh || this.isLine || this.isPoints) {
      i.geometry = n(e.geometries, this.geometry);
      const o = this.geometry.parameters;
      if (o !== void 0 && o.shapes !== void 0) {
        const l = o.shapes;
        if (Array.isArray(l))
          for (let c = 0, u = l.length; c < u; c++) {
            const h = l[c];
            n(e.shapes, h);
          }
        else
          n(e.shapes, l);
      }
    }
    if (this.isSkinnedMesh && (i.bindMode = this.bindMode, i.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (n(e.skeletons, this.skeleton), i.skeleton = this.skeleton.uuid)), this.material !== void 0)
      if (Array.isArray(this.material)) {
        const o = [];
        for (let l = 0, c = this.material.length; l < c; l++)
          o.push(n(e.materials, this.material[l]));
        i.material = o;
      } else
        i.material = n(e.materials, this.material);
    if (this.children.length > 0) {
      i.children = [];
      for (let o = 0; o < this.children.length; o++)
        i.children.push(this.children[o].toJSON(e).object);
    }
    if (this.animations.length > 0) {
      i.animations = [];
      for (let o = 0; o < this.animations.length; o++) {
        const l = this.animations[o];
        i.animations.push(n(e.animations, l));
      }
    }
    if (t) {
      const o = r(e.geometries), l = r(e.materials), c = r(e.textures), u = r(e.images), h = r(e.shapes), f = r(e.skeletons), d = r(e.animations), p = r(e.nodes);
      o.length > 0 && (s.geometries = o), l.length > 0 && (s.materials = l), c.length > 0 && (s.textures = c), u.length > 0 && (s.images = u), h.length > 0 && (s.shapes = h), f.length > 0 && (s.skeletons = f), d.length > 0 && (s.animations = d), p.length > 0 && (s.nodes = p);
    }
    return s.object = i, s;
    function r(o) {
      const l = [];
      for (const c in o) {
        const u = o[c];
        delete u.metadata, l.push(u);
      }
      return l;
    }
  }
  /**
   * Returns a new 3D object with copied values from this instance.
   *
   * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are also cloned.
   * @return {Object3D} A clone of this instance.
   */
  clone(e) {
    return new this.constructor().copy(this, e);
  }
  /**
   * Copies the values of the given 3D object to this instance.
   *
   * @param {Object3D} source - The 3D object to copy.
   * @param {boolean} [recursive=true] - When set to `true`, descendants of the 3D object are cloned.
   * @return {Object3D} A reference to this instance.
   */
  copy(e, t = true) {
    if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === true)
      for (let s = 0; s < e.children.length; s++) {
        const i = e.children[s];
        this.add(i.clone());
      }
    return this;
  }
}
Jt.DEFAULT_UP = /* @__PURE__ */ new Y(0, 1, 0);
Jt.DEFAULT_MATRIX_AUTO_UPDATE = true;
Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = true;
const rv = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
}, Zn = { h: 0, s: 0, l: 0 }, Pc = { h: 0, s: 0, l: 0 };
function Yd(a, e, t) {
  return t < 0 && (t += 1), t > 1 && (t -= 1), t < 1 / 6 ? a + (e - a) * 6 * t : t < 1 / 2 ? e : t < 2 / 3 ? a + (e - a) * 6 * (2 / 3 - t) : a;
}
class pt {
  /**
   * Constructs a new color.
   *
   * Note that standard method of specifying color in three.js is with a hexadecimal triplet,
   * and that method is used throughout the rest of the documentation.
   *
   * @param {(number|string|Color)} [r] - The red component of the color. If `g` and `b` are
   * not provided, it can be hexadecimal triplet, a CSS-style string or another `Color` instance.
   * @param {number} [g] - The green component.
   * @param {number} [b] - The blue component.
   */
  constructor(e, t, s) {
    return this.isColor = true, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, s);
  }
  /**
   * Sets the colors's components from the given values.
   *
   * @param {(number|string|Color)} [r] - The red component of the color. If `g` and `b` are
   * not provided, it can be hexadecimal triplet, a CSS-style string or another `Color` instance.
   * @param {number} [g] - The green component.
   * @param {number} [b] - The blue component.
   * @return {Color} A reference to this color.
   */
  set(e, t, s) {
    if (t === void 0 && s === void 0) {
      const i = e;
      i && i.isColor ? this.copy(i) : typeof i == "number" ? this.setHex(i) : typeof i == "string" && this.setStyle(i);
    } else
      this.setRGB(e, t, s);
    return this;
  }
  /**
   * Sets the colors's components to the given scalar value.
   *
   * @param {number} scalar - The scalar value.
   * @return {Color} A reference to this color.
   */
  setScalar(e) {
    return this.r = e, this.g = e, this.b = e, this;
  }
  /**
   * Sets this color from a hexadecimal value.
   *
   * @param {number} hex - The hexadecimal value.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setHex(e, t = js) {
    return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, yt.colorSpaceToWorking(this, t), this;
  }
  /**
   * Sets this color from RGB values.
   *
   * @param {number} r - Red channel value between `0.0` and `1.0`.
   * @param {number} g - Green channel value between `0.0` and `1.0`.
   * @param {number} b - Blue channel value between `0.0` and `1.0`.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setRGB(e, t, s, i = yt.workingColorSpace) {
    return this.r = e, this.g = t, this.b = s, yt.colorSpaceToWorking(this, i), this;
  }
  /**
   * Sets this color from RGB values.
   *
   * @param {number} h - Hue value between `0.0` and `1.0`.
   * @param {number} s - Saturation value between `0.0` and `1.0`.
   * @param {number} l - Lightness value between `0.0` and `1.0`.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setHSL(e, t, s, i = yt.workingColorSpace) {
    if (e = nm(e, 1), t = Je(t, 0, 1), s = Je(s, 0, 1), t === 0)
      this.r = this.g = this.b = s;
    else {
      const n = s <= 0.5 ? s * (1 + t) : s + t - s * t, r = 2 * s - n;
      this.r = Yd(r, n, e + 1 / 3), this.g = Yd(r, n, e), this.b = Yd(r, n, e - 1 / 3);
    }
    return yt.colorSpaceToWorking(this, i), this;
  }
  /**
   * Sets this color from a CSS-style string. For example, `rgb(250, 0,0)`,
   * `rgb(100%, 0%, 0%)`, `hsl(0, 100%, 50%)`, `#ff0000`, `#f00`, or `red` ( or
   * any [X11 color name]{@link https://en.wikipedia.org/wiki/X11_color_names#Color_name_chart} -
   * all 140 color names are supported).
   *
   * @param {string} style - Color as a CSS-style string.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setStyle(e, t = js) {
    function s(n) {
      n !== void 0 && parseFloat(n) < 1 && console.warn("THREE.Color: Alpha component of " + e + " will be ignored.");
    }
    let i;
    if (i = /^(\w+)\(([^\)]*)\)/.exec(e)) {
      let n;
      const r = i[1], o = i[2];
      switch (r) {
        case "rgb":
        case "rgba":
          if (n = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return s(n[4]), this.setRGB(
              Math.min(255, parseInt(n[1], 10)) / 255,
              Math.min(255, parseInt(n[2], 10)) / 255,
              Math.min(255, parseInt(n[3], 10)) / 255,
              t
            );
          if (n = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return s(n[4]), this.setRGB(
              Math.min(100, parseInt(n[1], 10)) / 100,
              Math.min(100, parseInt(n[2], 10)) / 100,
              Math.min(100, parseInt(n[3], 10)) / 100,
              t
            );
          break;
        case "hsl":
        case "hsla":
          if (n = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))
            return s(n[4]), this.setHSL(
              parseFloat(n[1]) / 360,
              parseFloat(n[2]) / 100,
              parseFloat(n[3]) / 100,
              t
            );
          break;
        default:
          console.warn("THREE.Color: Unknown color model " + e);
      }
    } else if (i = /^\#([A-Fa-f\d]+)$/.exec(e)) {
      const n = i[1], r = n.length;
      if (r === 3)
        return this.setRGB(
          parseInt(n.charAt(0), 16) / 15,
          parseInt(n.charAt(1), 16) / 15,
          parseInt(n.charAt(2), 16) / 15,
          t
        );
      if (r === 6)
        return this.setHex(parseInt(n, 16), t);
      console.warn("THREE.Color: Invalid hex color " + e);
    } else if (e && e.length > 0)
      return this.setColorName(e, t);
    return this;
  }
  /**
   * Sets this color from a color name. Faster than {@link Color#setStyle} if
   * you don't need the other CSS-style formats.
   *
   * For convenience, the list of names is exposed in `Color.NAMES` as a hash.
   * ```js
   * Color.NAMES.aliceblue // returns 0xF0F8FF
   * ```
   *
   * @param {string} style - The color name.
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {Color} A reference to this color.
   */
  setColorName(e, t = js) {
    const s = rv[e.toLowerCase()];
    return s !== void 0 ? this.setHex(s, t) : console.warn("THREE.Color: Unknown color " + e), this;
  }
  /**
   * Returns a new color with copied values from this instance.
   *
   * @return {Color} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.r, this.g, this.b);
  }
  /**
   * Copies the values of the given color to this instance.
   *
   * @param {Color} color - The color to copy.
   * @return {Color} A reference to this color.
   */
  copy(e) {
    return this.r = e.r, this.g = e.g, this.b = e.b, this;
  }
  /**
   * Copies the given color into this color, and then converts this color from
   * `SRGBColorSpace` to `LinearSRGBColorSpace`.
   *
   * @param {Color} color - The color to copy/convert.
   * @return {Color} A reference to this color.
   */
  copySRGBToLinear(e) {
    return this.r = Fn(e.r), this.g = Fn(e.g), this.b = Fn(e.b), this;
  }
  /**
   * Copies the given color into this color, and then converts this color from
   * `LinearSRGBColorSpace` to `SRGBColorSpace`.
   *
   * @param {Color} color - The color to copy/convert.
   * @return {Color} A reference to this color.
   */
  copyLinearToSRGB(e) {
    return this.r = na(e.r), this.g = na(e.g), this.b = na(e.b), this;
  }
  /**
   * Converts this color from `SRGBColorSpace` to `LinearSRGBColorSpace`.
   *
   * @return {Color} A reference to this color.
   */
  convertSRGBToLinear() {
    return this.copySRGBToLinear(this), this;
  }
  /**
   * Converts this color from `LinearSRGBColorSpace` to `SRGBColorSpace`.
   *
   * @return {Color} A reference to this color.
   */
  convertLinearToSRGB() {
    return this.copyLinearToSRGB(this), this;
  }
  /**
   * Returns the hexadecimal value of this color.
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {number} The hexadecimal value.
   */
  getHex(e = js) {
    return yt.workingToColorSpace(hs.copy(this), e), Math.round(Je(hs.r * 255, 0, 255)) * 65536 + Math.round(Je(hs.g * 255, 0, 255)) * 256 + Math.round(Je(hs.b * 255, 0, 255));
  }
  /**
   * Returns the hexadecimal value of this color as a string (for example, 'FFFFFF').
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {string} The hexadecimal value as a string.
   */
  getHexString(e = js) {
    return ("000000" + this.getHex(e).toString(16)).slice(-6);
  }
  /**
   * Converts the colors RGB values into the HSL format and stores them into the
   * given target object.
   *
   * @param {{h:number,s:number,l:number}} target - The target object that is used to store the method's result.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {{h:number,s:number,l:number}} The HSL representation of this color.
   */
  getHSL(e, t = yt.workingColorSpace) {
    yt.workingToColorSpace(hs.copy(this), t);
    const s = hs.r, i = hs.g, n = hs.b, r = Math.max(s, i, n), o = Math.min(s, i, n);
    let l, c;
    const u = (o + r) / 2;
    if (o === r)
      l = 0, c = 0;
    else {
      const h = r - o;
      switch (c = u <= 0.5 ? h / (r + o) : h / (2 - r - o), r) {
        case s:
          l = (i - n) / h + (i < n ? 6 : 0);
          break;
        case i:
          l = (n - s) / h + 2;
          break;
        case n:
          l = (s - i) / h + 4;
          break;
      }
      l /= 6;
    }
    return e.h = l, e.s = c, e.l = u, e;
  }
  /**
   * Returns the RGB values of this color and stores them into the given target object.
   *
   * @param {Color} target - The target color that is used to store the method's result.
   * @param {string} [colorSpace=ColorManagement.workingColorSpace] - The color space.
   * @return {Color} The RGB representation of this color.
   */
  getRGB(e, t = yt.workingColorSpace) {
    return yt.workingToColorSpace(hs.copy(this), t), e.r = hs.r, e.g = hs.g, e.b = hs.b, e;
  }
  /**
   * Returns the value of this color as a CSS style string. Example: `rgb(255,0,0)`.
   *
   * @param {string} [colorSpace=SRGBColorSpace] - The color space.
   * @return {string} The CSS representation of this color.
   */
  getStyle(e = js) {
    yt.workingToColorSpace(hs.copy(this), e);
    const t = hs.r, s = hs.g, i = hs.b;
    return e !== js ? `color(${e} ${t.toFixed(3)} ${s.toFixed(3)} ${i.toFixed(3)})` : `rgb(${Math.round(t * 255)},${Math.round(s * 255)},${Math.round(i * 255)})`;
  }
  /**
   * Adds the given HSL values to this color's values.
   * Internally, this converts the color's RGB values to HSL, adds HSL
   * and then converts the color back to RGB.
   *
   * @param {number} h - Hue value between `0.0` and `1.0`.
   * @param {number} s - Saturation value between `0.0` and `1.0`.
   * @param {number} l - Lightness value between `0.0` and `1.0`.
   * @return {Color} A reference to this color.
   */
  offsetHSL(e, t, s) {
    return this.getHSL(Zn), this.setHSL(Zn.h + e, Zn.s + t, Zn.l + s);
  }
  /**
   * Adds the RGB values of the given color to the RGB values of this color.
   *
   * @param {Color} color - The color to add.
   * @return {Color} A reference to this color.
   */
  add(e) {
    return this.r += e.r, this.g += e.g, this.b += e.b, this;
  }
  /**
   * Adds the RGB values of the given colors and stores the result in this instance.
   *
   * @param {Color} color1 - The first color.
   * @param {Color} color2 - The second color.
   * @return {Color} A reference to this color.
   */
  addColors(e, t) {
    return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
  }
  /**
   * Adds the given scalar value to the RGB values of this color.
   *
   * @param {number} s - The scalar to add.
   * @return {Color} A reference to this color.
   */
  addScalar(e) {
    return this.r += e, this.g += e, this.b += e, this;
  }
  /**
   * Subtracts the RGB values of the given color from the RGB values of this color.
   *
   * @param {Color} color - The color to subtract.
   * @return {Color} A reference to this color.
   */
  sub(e) {
    return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
  }
  /**
   * Multiplies the RGB values of the given color with the RGB values of this color.
   *
   * @param {Color} color - The color to multiply.
   * @return {Color} A reference to this color.
   */
  multiply(e) {
    return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
  }
  /**
   * Multiplies the given scalar value with the RGB values of this color.
   *
   * @param {number} s - The scalar to multiply.
   * @return {Color} A reference to this color.
   */
  multiplyScalar(e) {
    return this.r *= e, this.g *= e, this.b *= e, this;
  }
  /**
   * Linearly interpolates this color's RGB values toward the RGB values of the
   * given color. The alpha argument can be thought of as the ratio between
   * the two colors, where `0.0` is this color and `1.0` is the first argument.
   *
   * @param {Color} color - The color to converge on.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerp(e, t) {
    return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
  }
  /**
   * Linearly interpolates between the given colors and stores the result in this instance.
   * The alpha argument can be thought of as the ratio between the two colors, where `0.0`
   * is the first and `1.0` is the second color.
   *
   * @param {Color} color1 - The first color.
   * @param {Color} color2 - The second color.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerpColors(e, t, s) {
    return this.r = e.r + (t.r - e.r) * s, this.g = e.g + (t.g - e.g) * s, this.b = e.b + (t.b - e.b) * s, this;
  }
  /**
   * Linearly interpolates this color's HSL values toward the HSL values of the
   * given color. It differs from {@link Color#lerp} by not interpolating straight
   * from one color to the other, but instead going through all the hues in between
   * those two colors. The alpha argument can be thought of as the ratio between
   * the two colors, where 0.0 is this color and 1.0 is the first argument.
   *
   * @param {Color} color - The color to converge on.
   * @param {number} alpha - The interpolation factor in the closed interval `[0,1]`.
   * @return {Color} A reference to this color.
   */
  lerpHSL(e, t) {
    this.getHSL(Zn), e.getHSL(Pc);
    const s = vl(Zn.h, Pc.h, t), i = vl(Zn.s, Pc.s, t), n = vl(Zn.l, Pc.l, t);
    return this.setHSL(s, i, n), this;
  }
  /**
   * Sets the color's RGB components from the given 3D vector.
   *
   * @param {Vector3} v - The vector to set.
   * @return {Color} A reference to this color.
   */
  setFromVector3(e) {
    return this.r = e.x, this.g = e.y, this.b = e.z, this;
  }
  /**
   * Transforms this color with the given 3x3 matrix.
   *
   * @param {Matrix3} m - The matrix.
   * @return {Color} A reference to this color.
   */
  applyMatrix3(e) {
    const t = this.r, s = this.g, i = this.b, n = e.elements;
    return this.r = n[0] * t + n[3] * s + n[6] * i, this.g = n[1] * t + n[4] * s + n[7] * i, this.b = n[2] * t + n[5] * s + n[8] * i, this;
  }
  /**
   * Returns `true` if this color is equal with the given one.
   *
   * @param {Color} c - The color to test for equality.
   * @return {boolean} Whether this bounding color is equal with the given one.
   */
  equals(e) {
    return e.r === this.r && e.g === this.g && e.b === this.b;
  }
  /**
   * Sets this color's RGB components from the given array.
   *
   * @param {Array<number>} array - An array holding the RGB values.
   * @param {number} [offset=0] - The offset into the array.
   * @return {Color} A reference to this color.
   */
  fromArray(e, t = 0) {
    return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
  }
  /**
   * Writes the RGB components of this color to the given array. If no array is provided,
   * the method returns a new instance.
   *
   * @param {Array<number>} [array=[]] - The target array holding the color components.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Array<number>} The color components.
   */
  toArray(e = [], t = 0) {
    return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
  }
  /**
   * Sets the components of this color from the given buffer attribute.
   *
   * @param {BufferAttribute} attribute - The buffer attribute holding color data.
   * @param {number} index - The index into the attribute.
   * @return {Color} A reference to this color.
   */
  fromBufferAttribute(e, t) {
    return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
  }
  /**
   * This methods defines the serialization result of this class. Returns the color
   * as a hexadecimal value.
   *
   * @return {number} The hexadecimal value.
   */
  toJSON() {
    return this.getHex();
  }
  *[Symbol.iterator]() {
    yield this.r, yield this.g, yield this.b;
  }
}
const hs = /* @__PURE__ */ new pt();
pt.NAMES = rv;
const $t = /* @__PURE__ */ new Y(), Bc = /* @__PURE__ */ new Ke();
let VR = 0;
class pi {
  /**
   * Constructs a new buffer attribute.
   *
   * @param {TypedArray} array - The array holding the attribute data.
   * @param {number} itemSize - The item size.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, s = false) {
    if (Array.isArray(e))
      throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");
    this.isBufferAttribute = true, Object.defineProperty(this, "id", { value: VR++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e !== void 0 ? e.length / t : 0, this.normalized = s, this.usage = sh, this.updateRanges = [], this.gpuType = Ds, this.version = 0;
  }
  /**
   * A callback function that is executed after the renderer has transferred the attribute
   * array data to the GPU.
   */
  onUploadCallback() {
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === true && this.version++;
  }
  /**
   * Sets the usage of this buffer attribute.
   *
   * @param {(StaticDrawUsage|DynamicDrawUsage|StreamDrawUsage|StaticReadUsage|DynamicReadUsage|StreamReadUsage|StaticCopyUsage|DynamicCopyUsage|StreamCopyUsage)} value - The usage to set.
   * @return {BufferAttribute} A reference to this buffer attribute.
   */
  setUsage(e) {
    return this.usage = e, this;
  }
  /**
   * Adds a range of data in the data array to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Copies the values of the given buffer attribute to this instance.
   *
   * @param {BufferAttribute} source - The buffer attribute to copy.
   * @return {BufferAttribute} A reference to this instance.
   */
  copy(e) {
    return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
  }
  /**
   * Copies a vector from the given buffer attribute to this one. The start
   * and destination position in the attribute buffers are represented by the
   * given indices.
   *
   * @param {number} index1 - The destination index into this buffer attribute.
   * @param {BufferAttribute} attribute - The buffer attribute to copy from.
   * @param {number} index2 - The source index into the given buffer attribute.
   * @return {BufferAttribute} A reference to this instance.
   */
  copyAt(e, t, s) {
    e *= this.itemSize, s *= t.itemSize;
    for (let i = 0, n = this.itemSize; i < n; i++)
      this.array[e + i] = t.array[s + i];
    return this;
  }
  /**
   * Copies the given array data into this buffer attribute.
   *
   * @param {(TypedArray|Array)} array - The array to copy.
   * @return {BufferAttribute} A reference to this instance.
   */
  copyArray(e) {
    return this.array.set(e), this;
  }
  /**
   * Applies the given 3x3 matrix to the given attribute. Works with
   * item size `2` and `3`.
   *
   * @param {Matrix3} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyMatrix3(e) {
    if (this.itemSize === 2)
      for (let t = 0, s = this.count; t < s; t++)
        Bc.fromBufferAttribute(this, t), Bc.applyMatrix3(e), this.setXY(t, Bc.x, Bc.y);
    else if (this.itemSize === 3)
      for (let t = 0, s = this.count; t < s; t++)
        $t.fromBufferAttribute(this, t), $t.applyMatrix3(e), this.setXYZ(t, $t.x, $t.y, $t.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyMatrix4(e) {
    for (let t = 0, s = this.count; t < s; t++)
      $t.fromBufferAttribute(this, t), $t.applyMatrix4(e), this.setXYZ(t, $t.x, $t.y, $t.z);
    return this;
  }
  /**
   * Applies the given 3x3 normal matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix3} m - The normal matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  applyNormalMatrix(e) {
    for (let t = 0, s = this.count; t < s; t++)
      $t.fromBufferAttribute(this, t), $t.applyNormalMatrix(e), this.setXYZ(t, $t.x, $t.y, $t.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3` and with direction vectors.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {BufferAttribute} A reference to this instance.
   */
  transformDirection(e) {
    for (let t = 0, s = this.count; t < s; t++)
      $t.fromBufferAttribute(this, t), $t.transformDirection(e), this.setXYZ(t, $t.x, $t.y, $t.z);
    return this;
  }
  /**
   * Sets the given array data in the buffer attribute.
   *
   * @param {(TypedArray|Array)} value - The array data to set.
   * @param {number} [offset=0] - The offset in this buffer attribute's array.
   * @return {BufferAttribute} A reference to this instance.
   */
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  /**
   * Returns the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @return {number} The returned value.
   */
  getComponent(e, t) {
    let s = this.array[e * this.itemSize + t];
    return this.normalized && (s = ws(s, this.array)), s;
  }
  /**
   * Sets the given value to the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @param {number} value - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setComponent(e, t, s) {
    return this.normalized && (s = je(s, this.array)), this.array[e * this.itemSize + t] = s, this;
  }
  /**
   * Returns the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The x component.
   */
  getX(e) {
    let t = this.array[e * this.itemSize];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Sets the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setX(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize] = t, this;
  }
  /**
   * Returns the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The y component.
   */
  getY(e) {
    let t = this.array[e * this.itemSize + 1];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Sets the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} y - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setY(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
  }
  /**
   * Returns the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The z component.
   */
  getZ(e) {
    let t = this.array[e * this.itemSize + 2];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Sets the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} z - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setZ(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
  }
  /**
   * Returns the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The w component.
   */
  getW(e) {
    let t = this.array[e * this.itemSize + 3];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Sets the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} w - The value to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setW(e, t) {
    return this.normalized && (t = je(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
  }
  /**
   * Sets the x and y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXY(e, t, s) {
    return e *= this.itemSize, this.normalized && (t = je(t, this.array), s = je(s, this.array)), this.array[e + 0] = t, this.array[e + 1] = s, this;
  }
  /**
   * Sets the x, y and z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXYZ(e, t, s, i) {
    return e *= this.itemSize, this.normalized && (t = je(t, this.array), s = je(s, this.array), i = je(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = s, this.array[e + 2] = i, this;
  }
  /**
   * Sets the x, y, z and w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @param {number} w - The value for the w component to set.
   * @return {BufferAttribute} A reference to this instance.
   */
  setXYZW(e, t, s, i, n) {
    return e *= this.itemSize, this.normalized && (t = je(t, this.array), s = je(s, this.array), i = je(i, this.array), n = je(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = s, this.array[e + 2] = i, this.array[e + 3] = n, this;
  }
  /**
   * Sets the given callback function that is executed after the Renderer has transferred
   * the attribute array data to the GPU. Can be used to perform clean-up operations after
   * the upload when attribute data are not needed anymore on the CPU side.
   *
   * @param {Function} callback - The `onUpload()` callback.
   * @return {BufferAttribute} A reference to this instance.
   */
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  /**
   * Returns a new buffer attribute with copied values from this instance.
   *
   * @return {BufferAttribute} A clone of this instance.
   */
  clone() {
    return new this.constructor(this.array, this.itemSize).copy(this);
  }
  /**
   * Serializes the buffer attribute into JSON.
   *
   * @return {Object} A JSON object representing the serialized buffer attribute.
   */
  toJSON() {
    const e = {
      itemSize: this.itemSize,
      type: this.array.constructor.name,
      array: Array.from(this.array),
      normalized: this.normalized
    };
    return this.name !== "" && (e.name = this.name), this.usage !== sh && (e.usage = this.usage), e;
  }
}
class Eh extends ys {
  /**
   * Constructs a new cube texture.
   *
   * @param {Array<Image>} [images=[]] - An array holding a image for each side of a cube.
   * @param {number} [mapping=CubeReflectionMapping] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearMipmapLinearFilter] - The min filter value.
   * @param {number} [format=RGBAFormat] - The texture format.
   * @param {number} [type=UnsignedByteType] - The texture type.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {string} [colorSpace=NoColorSpace] - The color space value.
   */
  constructor(e = [], t = Nl, s, i, n, r, o, l, c, u) {
    super(e, t, s, i, n, r, o, l, c, u), this.isCubeTexture = true, this.flipY = false;
  }
  /**
   * Alias for {@link CubeTexture#image}.
   *
   * @type {Array<Image>}
   */
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
}
class hv {
  /**
   * Constructs a new interleaved buffer.
   *
   * @param {TypedArray} array - A typed array with a shared buffer storing attribute data.
   * @param {number} stride - The number of typed-array elements per vertex.
   */
  constructor(e, t) {
    this.isInterleavedBuffer = true, this.array = e, this.stride = t, this.count = e !== void 0 ? e.length / t : 0, this.usage = sh, this.updateRanges = [], this.version = 0, this.uuid = Bn();
  }
  /**
   * A callback function that is executed after the renderer has transferred the attribute array
   * data to the GPU.
   */
  onUploadCallback() {
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === true && this.version++;
  }
  /**
   * Sets the usage of this interleaved buffer.
   *
   * @param {(StaticDrawUsage|DynamicDrawUsage|StreamDrawUsage|StaticReadUsage|DynamicReadUsage|StreamReadUsage|StaticCopyUsage|DynamicCopyUsage|StreamCopyUsage)} value - The usage to set.
   * @return {InterleavedBuffer} A reference to this interleaved buffer.
   */
  setUsage(e) {
    return this.usage = e, this;
  }
  /**
   * Adds a range of data in the data array to be updated on the GPU.
   *
   * @param {number} start - Position at which to start update.
   * @param {number} count - The number of components to update.
   */
  addUpdateRange(e, t) {
    this.updateRanges.push({ start: e, count: t });
  }
  /**
   * Clears the update ranges.
   */
  clearUpdateRanges() {
    this.updateRanges.length = 0;
  }
  /**
   * Copies the values of the given interleaved buffer to this instance.
   *
   * @param {InterleavedBuffer} source - The interleaved buffer to copy.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  copy(e) {
    return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
  }
  /**
   * Copies a vector from the given interleaved buffer to this one. The start
   * and destination position in the attribute buffers are represented by the
   * given indices.
   *
   * @param {number} index1 - The destination index into this interleaved buffer.
   * @param {InterleavedBuffer} interleavedBuffer - The interleaved buffer to copy from.
   * @param {number} index2 - The source index into the given interleaved buffer.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  copyAt(e, t, s) {
    e *= this.stride, s *= t.stride;
    for (let i = 0, n = this.stride; i < n; i++)
      this.array[e + i] = t.array[s + i];
    return this;
  }
  /**
   * Sets the given array data in the interleaved buffer.
   *
   * @param {(TypedArray|Array)} value - The array data to set.
   * @param {number} [offset=0] - The offset in this interleaved buffer's array.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  set(e, t = 0) {
    return this.array.set(e, t), this;
  }
  /**
   * Returns a new interleaved buffer with copied values from this instance.
   *
   * @param {Object} [data] - An object with shared array buffers that allows to retain shared structures.
   * @return {InterleavedBuffer} A clone of this instance.
   */
  clone(e) {
    e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Bn()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
    const t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), s = new this.constructor(t, this.stride);
    return s.setUsage(this.usage), s;
  }
  /**
   * Sets the given callback function that is executed after the Renderer has transferred
   * the array data to the GPU. Can be used to perform clean-up operations after
   * the upload when data are not needed anymore on the CPU side.
   *
   * @param {Function} callback - The `onUpload()` callback.
   * @return {InterleavedBuffer} A reference to this instance.
   */
  onUpload(e) {
    return this.onUploadCallback = e, this;
  }
  /**
   * Serializes the interleaved buffer into JSON.
   *
   * @param {Object} [data] - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized interleaved buffer.
   */
  toJSON(e) {
    return e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = Bn()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer))), {
      uuid: this.uuid,
      buffer: this.array.buffer._uuid,
      type: this.array.constructor.name,
      stride: this.stride
    };
  }
}
const vs = /* @__PURE__ */ new Y();
class lm {
  /**
   * Constructs a new interleaved buffer attribute.
   *
   * @param {InterleavedBuffer} interleavedBuffer - The buffer holding the interleaved data.
   * @param {number} itemSize - The item size.
   * @param {number} offset - The attribute offset into the buffer.
   * @param {boolean} [normalized=false] - Whether the data are normalized or not.
   */
  constructor(e, t, s, i = false) {
    this.isInterleavedBufferAttribute = true, this.name = "", this.data = e, this.itemSize = t, this.offset = s, this.normalized = i;
  }
  /**
   * The item count of this buffer attribute.
   *
   * @type {number}
   * @readonly
   */
  get count() {
    return this.data.count;
  }
  /**
   * The array holding the interleaved buffer attribute data.
   *
   * @type {TypedArray}
   */
  get array() {
    return this.data.array;
  }
  /**
   * Flag to indicate that this attribute has changed and should be re-sent to
   * the GPU. Set this to `true` when you modify the value of the array.
   *
   * @type {number}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    this.data.needsUpdate = e;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  applyMatrix4(e) {
    for (let t = 0, s = this.data.count; t < s; t++)
      vs.fromBufferAttribute(this, t), vs.applyMatrix4(e), this.setXYZ(t, vs.x, vs.y, vs.z);
    return this;
  }
  /**
   * Applies the given 3x3 normal matrix to the given attribute. Only works with
   * item size `3`.
   *
   * @param {Matrix3} m - The normal matrix to apply.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  applyNormalMatrix(e) {
    for (let t = 0, s = this.count; t < s; t++)
      vs.fromBufferAttribute(this, t), vs.applyNormalMatrix(e), this.setXYZ(t, vs.x, vs.y, vs.z);
    return this;
  }
  /**
   * Applies the given 4x4 matrix to the given attribute. Only works with
   * item size `3` and with direction vectors.
   *
   * @param {Matrix4} m - The matrix to apply.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  transformDirection(e) {
    for (let t = 0, s = this.count; t < s; t++)
      vs.fromBufferAttribute(this, t), vs.transformDirection(e), this.setXYZ(t, vs.x, vs.y, vs.z);
    return this;
  }
  /**
   * Returns the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @return {number} The returned value.
   */
  getComponent(e, t) {
    let s = this.array[e * this.data.stride + this.offset + t];
    return this.normalized && (s = ws(s, this.array)), s;
  }
  /**
   * Sets the given value to the given component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} component - The component index.
   * @param {number} value - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setComponent(e, t, s) {
    return this.normalized && (s = je(s, this.array)), this.data.array[e * this.data.stride + this.offset + t] = s, this;
  }
  /**
   * Sets the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setX(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
  }
  /**
   * Sets the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} y - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setY(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
  }
  /**
   * Sets the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} z - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setZ(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
  }
  /**
   * Sets the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} w - The value to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setW(e, t) {
    return this.normalized && (t = je(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
  }
  /**
   * Returns the x component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The x component.
   */
  getX(e) {
    let t = this.data.array[e * this.data.stride + this.offset];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Returns the y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The y component.
   */
  getY(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 1];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Returns the z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The z component.
   */
  getZ(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 2];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Returns the w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @return {number} The w component.
   */
  getW(e) {
    let t = this.data.array[e * this.data.stride + this.offset + 3];
    return this.normalized && (t = ws(t, this.array)), t;
  }
  /**
   * Sets the x and y component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setXY(e, t, s) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = je(t, this.array), s = je(s, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = s, this;
  }
  /**
   * Sets the x, y and z component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setXYZ(e, t, s, i) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = je(t, this.array), s = je(s, this.array), i = je(i, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = s, this.data.array[e + 2] = i, this;
  }
  /**
   * Sets the x, y, z and w component of the vector at the given index.
   *
   * @param {number} index - The index into the buffer attribute.
   * @param {number} x - The value for the x component to set.
   * @param {number} y - The value for the y component to set.
   * @param {number} z - The value for the z component to set.
   * @param {number} w - The value for the w component to set.
   * @return {InterleavedBufferAttribute} A reference to this instance.
   */
  setXYZW(e, t, s, i, n) {
    return e = e * this.data.stride + this.offset, this.normalized && (t = je(t, this.array), s = je(s, this.array), i = je(i, this.array), n = je(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = s, this.data.array[e + 2] = i, this.data.array[e + 3] = n, this;
  }
  /**
   * Returns a new buffer attribute with copied values from this instance.
   *
   * If no parameter is provided, cloning an interleaved buffer attribute will de-interleave buffer data.
   *
   * @param {Object} [data] - An object with interleaved buffers that allows to retain the interleaved property.
   * @return {BufferAttribute|InterleavedBufferAttribute} A clone of this instance.
   */
  clone(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let s = 0; s < this.count; s++) {
        const i = s * this.data.stride + this.offset;
        for (let n = 0; n < this.itemSize; n++)
          t.push(this.data.array[i + n]);
      }
      return new pi(new this.array.constructor(t), this.itemSize, this.normalized);
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.clone(e)), new lm(e.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
  }
  /**
   * Serializes the buffer attribute into JSON.
   *
   * If no parameter is provided, cloning an interleaved buffer attribute will de-interleave buffer data.
   *
   * @param {Object} [data] - An optional value holding meta information about the serialization.
   * @return {Object} A JSON object representing the serialized buffer attribute.
   */
  toJSON(e) {
    if (e === void 0) {
      console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
      const t = [];
      for (let s = 0; s < this.count; s++) {
        const i = s * this.data.stride + this.offset;
        for (let n = 0; n < this.itemSize; n++)
          t.push(this.data.array[i + n]);
      }
      return {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: t,
        normalized: this.normalized
      };
    } else
      return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
        isInterleavedBufferAttribute: true,
        itemSize: this.itemSize,
        data: this.data.uuid,
        offset: this.offset,
        normalized: this.normalized
      };
  }
}
const Qd = /* @__PURE__ */ new Y(), tC = /* @__PURE__ */ new Y(), sC = /* @__PURE__ */ new zs();
class ir {
  /**
   * Constructs a new plane.
   *
   * @param {Vector3} [normal=(1,0,0)] - A unit length vector defining the normal of the plane.
   * @param {number} [constant=0] - The signed distance from the origin to the plane.
   */
  constructor(e = new Y(1, 0, 0), t = 0) {
    this.isPlane = true, this.normal = e, this.constant = t;
  }
  /**
   * Sets the plane components by copying the given values.
   *
   * @param {Vector3} normal - The normal.
   * @param {number} constant - The constant.
   * @return {Plane} A reference to this plane.
   */
  set(e, t) {
    return this.normal.copy(e), this.constant = t, this;
  }
  /**
   * Sets the plane components by defining `x`, `y`, `z` as the
   * plane normal and `w` as the constant.
   *
   * @param {number} x - The value for the normal's x component.
   * @param {number} y - The value for the normal's y component.
   * @param {number} z - The value for the normal's z component.
   * @param {number} w - The constant value.
   * @return {Plane} A reference to this plane.
   */
  setComponents(e, t, s, i) {
    return this.normal.set(e, t, s), this.constant = i, this;
  }
  /**
   * Sets the plane from the given normal and coplanar point (that is a point
   * that lies onto the plane).
   *
   * @param {Vector3} normal - The normal.
   * @param {Vector3} point - A coplanar point.
   * @return {Plane} A reference to this plane.
   */
  setFromNormalAndCoplanarPoint(e, t) {
    return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
  }
  /**
   * Sets the plane from three coplanar points. The winding order is
   * assumed to be counter-clockwise, and determines the direction of
   * the plane normal.
   *
   * @param {Vector3} a - The first coplanar point.
   * @param {Vector3} b - The second coplanar point.
   * @param {Vector3} c - The third coplanar point.
   * @return {Plane} A reference to this plane.
   */
  setFromCoplanarPoints(e, t, s) {
    const i = Qd.subVectors(s, t).cross(tC.subVectors(e, t)).normalize();
    return this.setFromNormalAndCoplanarPoint(i, e), this;
  }
  /**
   * Copies the values of the given plane to this instance.
   *
   * @param {Plane} plane - The plane to copy.
   * @return {Plane} A reference to this plane.
   */
  copy(e) {
    return this.normal.copy(e.normal), this.constant = e.constant, this;
  }
  /**
   * Normalizes the plane normal and adjusts the constant accordingly.
   *
   * @return {Plane} A reference to this plane.
   */
  normalize() {
    const e = 1 / this.normal.length();
    return this.normal.multiplyScalar(e), this.constant *= e, this;
  }
  /**
   * Negates both the plane normal and the constant.
   *
   * @return {Plane} A reference to this plane.
   */
  negate() {
    return this.constant *= -1, this.normal.negate(), this;
  }
  /**
   * Returns the signed distance from the given point to this plane.
   *
   * @param {Vector3} point - The point to compute the distance for.
   * @return {number} The signed distance.
   */
  distanceToPoint(e) {
    return this.normal.dot(e) + this.constant;
  }
  /**
   * Returns the signed distance from the given sphere to this plane.
   *
   * @param {Sphere} sphere - The sphere to compute the distance for.
   * @return {number} The signed distance.
   */
  distanceToSphere(e) {
    return this.distanceToPoint(e.center) - e.radius;
  }
  /**
   * Projects a the given point onto the plane.
   *
   * @param {Vector3} point - The point to project.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The projected point on the plane.
   */
  projectPoint(e, t) {
    return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
  }
  /**
   * Returns the intersection point of the passed line and the plane. Returns
   * `null` if the line does not intersect. Returns the line's starting point if
   * the line is coplanar with the plane.
   *
   * @param {Line3} line - The line to compute the intersection for.
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {?Vector3} The intersection point.
   */
  intersectLine(e, t) {
    const s = e.delta(Qd), i = this.normal.dot(s);
    if (i === 0)
      return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
    const n = -(e.start.dot(this.normal) + this.constant) / i;
    return n < 0 || n > 1 ? null : t.copy(e.start).addScaledVector(s, n);
  }
  /**
   * Returns `true` if the given line segment intersects with (passes through) the plane.
   *
   * @param {Line3} line - The line to test.
   * @return {boolean} Whether the given line segment intersects with the plane or not.
   */
  intersectsLine(e) {
    const t = this.distanceToPoint(e.start), s = this.distanceToPoint(e.end);
    return t < 0 && s > 0 || s < 0 && t > 0;
  }
  /**
   * Returns `true` if the given bounding box intersects with the plane.
   *
   * @param {Box3} box - The bounding box to test.
   * @return {boolean} Whether the given bounding box intersects with the plane or not.
   */
  intersectsBox(e) {
    return e.intersectsPlane(this);
  }
  /**
   * Returns `true` if the given bounding sphere intersects with the plane.
   *
   * @param {Sphere} sphere - The bounding sphere to test.
   * @return {boolean} Whether the given bounding sphere intersects with the plane or not.
   */
  intersectsSphere(e) {
    return e.intersectsPlane(this);
  }
  /**
   * Returns a coplanar vector to the plane, by calculating the
   * projection of the normal at the origin onto the plane.
   *
   * @param {Vector3} target - The target vector that is used to store the method's result.
   * @return {Vector3} The coplanar point.
   */
  coplanarPoint(e) {
    return e.copy(this.normal).multiplyScalar(-this.constant);
  }
  /**
   * Apply a 4x4 matrix to the plane. The matrix must be an affine, homogeneous transform.
   *
   * The optional normal matrix can be pre-computed like so:
   * ```js
   * const optionalNormalMatrix = new THREE.Matrix3().getNormalMatrix( matrix );
   * ```
   *
   * @param {Matrix4} matrix - The transformation matrix.
   * @param {Matrix4} [optionalNormalMatrix] - A pre-computed normal matrix.
   * @return {Plane} A reference to this plane.
   */
  applyMatrix4(e, t) {
    const s = t || sC.getNormalMatrix(e), i = this.coplanarPoint(Qd).applyMatrix4(e), n = this.normal.applyMatrix3(s).normalize();
    return this.constant = -i.dot(n), this;
  }
  /**
   * Translates the plane by the distance defined by the given offset vector.
   * Note that this only affects the plane constant and will not affect the normal vector.
   *
   * @param {Vector3} offset - The offset vector.
   * @return {Plane} A reference to this plane.
   */
  translate(e) {
    return this.constant -= e.dot(this.normal), this;
  }
  /**
   * Returns `true` if this plane is equal with the given one.
   *
   * @param {Plane} plane - The plane to test for equality.
   * @return {boolean} Whether this plane is equal with the given one.
   */
  equals(e) {
    return e.normal.equals(this.normal) && e.constant === this.constant;
  }
  /**
   * Returns a new plane with copied values from this instance.
   *
   * @return {Plane} A clone of this instance.
   */
  clone() {
    return new this.constructor().copy(this);
  }
}
class rC extends ys {
  /**
   * Constructs a new framebuffer texture.
   *
   * @param {number} [width] - The width of the texture.
   * @param {number} [height] - The height of the texture.
   */
  constructor(e, t) {
    super({ width: e, height: t }), this.isFramebufferTexture = true, this.magFilter = Zt, this.minFilter = Zt, this.generateMipmaps = false, this.needsUpdate = true;
  }
}
class en extends ys {
  /**
   * Constructs a new depth texture.
   *
   * @param {number} width - The width of the texture.
   * @param {number} height - The height of the texture.
   * @param {number} [type=UnsignedIntType] - The texture type.
   * @param {number} [mapping=Texture.DEFAULT_MAPPING] - The texture mapping.
   * @param {number} [wrapS=ClampToEdgeWrapping] - The wrapS value.
   * @param {number} [wrapT=ClampToEdgeWrapping] - The wrapT value.
   * @param {number} [magFilter=LinearFilter] - The mag filter value.
   * @param {number} [minFilter=LinearFilter] - The min filter value.
   * @param {number} [anisotropy=Texture.DEFAULT_ANISOTROPY] - The anisotropy value.
   * @param {number} [format=DepthFormat] - The texture format.
   * @param {number} [depth=1] - The depth of the texture.
   */
  constructor(e, t, s = zt, i, n, r, o = Zt, l = Zt, c, u = Qi, h = 1) {
    if (u !== Qi && u !== In)
      throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
    const f = { width: e, height: t, depth: h };
    super(f, i, n, r, o, l, u, s, c), this.isDepthTexture = true, this.flipY = false, this.generateMipmaps = false, this.compareFunction = null;
  }
  copy(e) {
    return super.copy(e), this.source = new rm(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
  }
  toJSON(e) {
    const t = super.toJSON(e);
    return this.compareFunction !== null && (t.compareFunction = this.compareFunction), t;
  }
}
class Rh {
  /**
   * Constructs a new 2x2 matrix. The arguments are supposed to be
   * in row-major order. If no arguments are provided, the constructor
   * initializes the matrix as an identity matrix.
   *
   * @param {number} [n11] - 1-1 matrix element.
   * @param {number} [n12] - 1-2 matrix element.
   * @param {number} [n21] - 2-1 matrix element.
   * @param {number} [n22] - 2-2 matrix element.
   */
  constructor(e, t, s, i) {
    Rh.prototype.isMatrix2 = true, this.elements = [
      1,
      0,
      0,
      1
    ], e !== void 0 && this.set(e, t, s, i);
  }
  /**
   * Sets this matrix to the 2x2 identity matrix.
   *
   * @return {Matrix2} A reference to this matrix.
   */
  identity() {
    return this.set(
      1,
      0,
      0,
      1
    ), this;
  }
  /**
   * Sets the elements of the matrix from the given array.
   *
   * @param {Array<number>} array - The matrix elements in column-major order.
   * @param {number} [offset=0] - Index of the first element in the array.
   * @return {Matrix2} A reference to this matrix.
   */
  fromArray(e, t = 0) {
    for (let s = 0; s < 4; s++)
      this.elements[s] = e[s + t];
    return this;
  }
  /**
   * Sets the elements of the matrix.The arguments are supposed to be
   * in row-major order.
   *
   * @param {number} n11 - 1-1 matrix element.
   * @param {number} n12 - 1-2 matrix element.
   * @param {number} n21 - 2-1 matrix element.
   * @param {number} n22 - 2-2 matrix element.
   * @return {Matrix2} A reference to this matrix.
   */
  set(e, t, s, i) {
    const n = this.elements;
    return n[0] = e, n[2] = t, n[1] = s, n[3] = i, this;
  }
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: {
  revision: vh
} }));
function Il(a, e = 0) {
  let t = 3735928559 ^ e, s = 1103547991 ^ e;
  if (a instanceof Array)
    for (let i = 0, n; i < a.length; i++)
      n = a[i], t = Math.imul(t ^ n, 2654435761), s = Math.imul(s ^ n, 1597334677);
  else
    for (let i = 0, n; i < a.length; i++)
      n = a.charCodeAt(i), t = Math.imul(t ^ n, 2654435761), s = Math.imul(s ^ n, 1597334677);
  return t = Math.imul(t ^ t >>> 16, 2246822507), t ^= Math.imul(s ^ s >>> 13, 3266489909), s = Math.imul(s ^ s >>> 16, 2246822507), s ^= Math.imul(t ^ t >>> 13, 3266489909), 4294967296 * (2097151 & s) + (t >>> 0);
}
const ih = (...a) => Il(a);
function pv(a, e = false) {
  const t = [];
  a.isNode === true && t.push(a.id);
  for (const { property: s, childNode: i } of nh(a))
    t.push(Il(s.slice(0, -4)), i.getCacheKey(e));
  return Il(t);
}
function* nh(a, e = false) {
  for (const t of Object.getOwnPropertyNames(a)) {
    if (t.startsWith("_") === true) continue;
    const s = a[t];
    if (Array.isArray(s) === true)
      for (let i = 0; i < s.length; i++) {
        const n = s[i];
        n && (n.isNode === true || e && typeof n.toJSON == "function") && (yield { property: t, index: i, childNode: n });
      }
    else if (s && s.isNode === true)
      yield { property: t, childNode: s };
    else if (s && Object.getPrototypeOf(s) === Object.prototype)
      for (const i in s) {
        if (i.startsWith("_") === true) continue;
        const n = s[i];
        n && (n.isNode === true || e && typeof n.toJSON == "function") && (yield { property: t, index: i, childNode: n });
      }
  }
}
function rh(a) {
  if (a == null) return null;
  const e = typeof a;
  return a.isNode === true ? "node" : e === "number" ? "float" : e === "boolean" ? "bool" : e === "string" ? "string" : e === "function" ? "shader" : a.isVector2 === true ? "vec2" : a.isVector3 === true ? "vec3" : a.isVector4 === true ? "vec4" : a.isMatrix2 === true ? "mat2" : a.isMatrix3 === true ? "mat3" : a.isMatrix4 === true ? "mat4" : a.isColor === true ? "color" : a instanceof ArrayBuffer ? "ArrayBuffer" : null;
}
function xm(a, ...e) {
  const t = a ? a.slice(-4) : void 0;
  return e.length === 1 && (t === "vec2" ? e = [e[0], e[0]] : t === "vec3" ? e = [e[0], e[0], e[0]] : t === "vec4" && (e = [e[0], e[0], e[0], e[0]])), a === "color" ? new pt(...e) : t === "vec2" ? new Ke(...e) : t === "vec3" ? new Y(...e) : t === "vec4" ? new et(...e) : t === "mat2" ? new Rh(...e) : t === "mat3" ? new zs(...e) : t === "mat4" ? new Rt(...e) : a === "bool" ? e[0] || false : a === "float" || a === "int" || a === "uint" ? e[0] || 0 : a === "string" ? e[0] || "" : a === "ArrayBuffer" ? FC(e[0]) : null;
}
function BC(a) {
  let e = "";
  const t = new Uint8Array(a);
  for (let s = 0; s < t.length; s++)
    e += String.fromCharCode(t[s]);
  return btoa(e);
}
function FC(a) {
  return Uint8Array.from(atob(a), (e) => e.charCodeAt(0)).buffer;
}
const Hc = {
  VERTEX: "vertex"
}, Xe = {
  NONE: "none",
  FRAME: "frame",
  RENDER: "render",
  OBJECT: "object"
}, Aa = ["x", "y", "z", "w"], LC = {
  analyze: "setup",
  generate: "analyze"
};
let OC = 0;
class Ie extends co2 {
  static get type() {
    return "Node";
  }
  /**
   * Constructs a new node.
   *
   * @param {?string} nodeType - The node type.
   */
  constructor(e = null) {
    super(), this.nodeType = e, this.updateType = Xe.NONE, this.updateBeforeType = Xe.NONE, this.updateAfterType = Xe.NONE, this.uuid = wR.generateUUID(), this.version = 0, this.global = false, this.parents = false, this.isNode = true, this._cacheKey = null, this._cacheKeyVersion = 0, Object.defineProperty(this, "id", { value: OC++ });
  }
  /**
   * Set this property to `true` when the node should be regenerated.
   *
   * @type {boolean}
   * @default false
   * @param {boolean} value
   */
  set needsUpdate(e) {
    e === true && this.version++;
  }
  /**
   * The type of the class. The value is usually the constructor name.
   *
   * @type {string}
  	 * @readonly
   */
  get type() {
    return this.constructor.type;
  }
  /**
   * Convenient method for defining {@link Node#update}.
   *
   * @param {Function} callback - The update method.
   * @param {string} updateType - The update type.
   * @return {Node} A reference to this node.
   */
  onUpdate(e, t) {
    return this.updateType = t, this.update = e.bind(this), this;
  }
  /**
   * Convenient method for defining {@link Node#update}. Similar to {@link Node#onUpdate}, but
   * this method automatically sets the update type to `FRAME`.
   *
   * @param {Function} callback - The update method.
   * @return {Node} A reference to this node.
   */
  onFrameUpdate(e) {
    return this.onUpdate(e, Xe.FRAME);
  }
  /**
   * Convenient method for defining {@link Node#update}. Similar to {@link Node#onUpdate}, but
   * this method automatically sets the update type to `RENDER`.
   *
   * @param {Function} callback - The update method.
   * @return {Node} A reference to this node.
   */
  onRenderUpdate(e) {
    return this.onUpdate(e, Xe.RENDER);
  }
  /**
   * Convenient method for defining {@link Node#update}. Similar to {@link Node#onUpdate}, but
   * this method automatically sets the update type to `OBJECT`.
   *
   * @param {Function} callback - The update method.
   * @return {Node} A reference to this node.
   */
  onObjectUpdate(e) {
    return this.onUpdate(e, Xe.OBJECT);
  }
  /**
   * Convenient method for defining {@link Node#updateReference}.
   *
   * @param {Function} callback - The update method.
   * @return {Node} A reference to this node.
   */
  onReference(e) {
    return this.updateReference = e.bind(this), this;
  }
  /**
   * Nodes might refer to other objects like materials. This method allows to dynamically update the reference
   * to such objects based on a given state (e.g. the current node frame or builder).
   *
   * @param {any} state - This method can be invocated in different contexts so `state` can refer to any object type.
   * @return {any} The updated reference.
   */
  updateReference() {
    return this;
  }
  /**
   * By default this method returns the value of the {@link Node#global} flag. This method
   * can be overwritten in derived classes if an analytical way is required to determine the
   * global cache referring to the current shader-stage.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {boolean} Whether this node is global or not.
   */
  isGlobal() {
    return this.global;
  }
  /**
   * Generator function that can be used to iterate over the child nodes.
   *
   * @generator
   * @yields {Node} A child node.
   */
  *getChildren() {
    for (const { childNode: e } of nh(this))
      yield e;
  }
  /**
   * Calling this method dispatches the `dispose` event. This event can be used
   * to register event listeners for clean up tasks.
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Callback for {@link Node#traverse}.
   *
   * @callback traverseCallback
   * @param {Node} node - The current node.
   */
  /**
   * Can be used to traverse through the node's hierarchy.
   *
   * @param {traverseCallback} callback - A callback that is executed per node.
   */
  traverse(e) {
    e(this);
    for (const t of this.getChildren())
      t.traverse(e);
  }
  /**
   * Returns the cache key for this node.
   *
   * @param {boolean} [force=false] - When set to `true`, a recomputation of the cache key is forced.
   * @return {number} The cache key of the node.
   */
  getCacheKey(e = false) {
    return e = e || this.version !== this._cacheKeyVersion, (e === true || this._cacheKey === null) && (this._cacheKey = ih(pv(this, e), this.customCacheKey()), this._cacheKeyVersion = this.version), this._cacheKey;
  }
  /**
   * Generate a custom cache key for this node.
   *
   * @return {number} The cache key of the node.
   */
  customCacheKey() {
    return 0;
  }
  /**
   * Returns the references to this node which is by default `this`.
   *
   * @return {Node} A reference to this node.
   */
  getScope() {
    return this;
  }
  /**
   * Returns the hash of the node which is used to identify the node. By default it's
   * the {@link Node#uuid} however derived node classes might have to overwrite this method
   * depending on their implementation.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The hash.
   */
  getHash() {
    return this.uuid;
  }
  /**
   * Returns the update type of {@link Node#update}.
   *
   * @return {NodeUpdateType} The update type.
   */
  getUpdateType() {
    return this.updateType;
  }
  /**
   * Returns the update type of {@link Node#updateBefore}.
   *
   * @return {NodeUpdateType} The update type.
   */
  getUpdateBeforeType() {
    return this.updateBeforeType;
  }
  /**
   * Returns the update type of {@link Node#updateAfter}.
   *
   * @return {NodeUpdateType} The update type.
   */
  getUpdateAfterType() {
    return this.updateAfterType;
  }
  /**
   * Certain types are composed of multiple elements. For example a `vec3`
   * is composed of three `float` values. This method returns the type of
   * these elements.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The type of the node.
   */
  getElementType(e) {
    const t = this.getNodeType(e);
    return e.getElementType(t);
  }
  /**
   * Returns the node member type for the given name.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} name - The name of the member.
   * @return {string} The type of the node.
   */
  getMemberType() {
    return "void";
  }
  /**
   * Returns the node's type.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The type of the node.
   */
  getNodeType(e) {
    const t = e.getNodeProperties(this);
    return t.outputNode ? t.outputNode.getNodeType(e) : this.nodeType;
  }
  /**
   * This method is used during the build process of a node and ensures
   * equal nodes are not built multiple times but just once. For example if
   * `attribute( 'uv' )` is used multiple times by the user, the build
   * process makes sure to process just the first node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Node} The shared node if possible. Otherwise `this` is returned.
   */
  getShared(e) {
    const t = this.getHash(e);
    return e.getNodeFromHash(t) || this;
  }
  /**
   * Returns the number of elements in the node array.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {?number} The number of elements in the node array.
   */
  getArrayCount() {
    return null;
  }
  /**
   * Represents the setup stage which is the first step of the build process, see {@link Node#build} method.
   * This method is often overwritten in derived modules to prepare the node which is used as a node's output/result.
   * If an output node is prepared, then it must be returned in the `return` statement of the derived module's setup function.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {?Node} The output node.
   */
  setup(e) {
    const t = e.getNodeProperties(this);
    let s = 0;
    for (const i of this.getChildren())
      t["node" + s++] = i;
    return t.outputNode || null;
  }
  /**
   * Represents the analyze stage which is the second step of the build process, see {@link Node#build} method.
   * This stage analyzes the node hierarchy and ensures descendent nodes are built.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {?Node} output - The target output node.
   */
  analyze(e, t = null) {
    const s = e.increaseUsage(this);
    if (this.parents === true) {
      const i = e.getDataFromNode(this, "any");
      i.stages = i.stages || {}, i.stages[e.shaderStage] = i.stages[e.shaderStage] || [], i.stages[e.shaderStage].push(t);
    }
    if (s === 1) {
      const i = e.getNodeProperties(this);
      for (const n of Object.values(i))
        n && n.isNode === true && n.build(e, this);
    }
  }
  /**
   * Represents the generate stage which is the third step of the build process, see {@link Node#build} method.
   * This state builds the output node and returns the resulting shader string.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {?string} [output] - Can be used to define the output type.
   * @return {?string} The generated shader string.
   */
  generate(e, t) {
    const { outputNode: s } = e.getNodeProperties(this);
    if (s && s.isNode === true)
      return s.build(e, t);
  }
  /**
   * The method can be implemented to update the node's internal state before it is used to render an object.
   * The {@link Node#updateBeforeType} property defines how often the update is executed.
   *
   * @abstract
   * @param {NodeFrame} frame - A reference to the current node frame.
   * @return {?boolean} An optional bool that indicates whether the implementation actually performed an update or not (e.g. due to caching).
   */
  updateBefore() {
    console.warn("Abstract function.");
  }
  /**
   * The method can be implemented to update the node's internal state after it was used to render an object.
   * The {@link Node#updateAfterType} property defines how often the update is executed.
   *
   * @abstract
   * @param {NodeFrame} frame - A reference to the current node frame.
   * @return {?boolean} An optional bool that indicates whether the implementation actually performed an update or not (e.g. due to caching).
   */
  updateAfter() {
    console.warn("Abstract function.");
  }
  /**
   * The method can be implemented to update the node's internal state when it is used to render an object.
   * The {@link Node#updateType} property defines how often the update is executed.
   *
   * @abstract
   * @param {NodeFrame} frame - A reference to the current node frame.
   * @return {?boolean} An optional bool that indicates whether the implementation actually performed an update or not (e.g. due to caching).
   */
  update() {
    console.warn("Abstract function.");
  }
  /**
   * This method performs the build of a node. The behavior and return value depend on the current build stage:
   * - **setup**: Prepares the node and its children for the build process. This process can also create new nodes. Returns the node itself or a variant.
   * - **analyze**: Analyzes the node hierarchy for optimizations in the code generation stage. Returns `null`.
   * - **generate**: Generates the shader code for the node. Returns the generated shader string.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {?(string|Node)} [output=null] - Can be used to define the output type.
   * @return {?(Node|string)} The result of the build process, depending on the build stage.
   */
  build(e, t = null) {
    const s = this.getShared(e);
    if (this !== s)
      return s.build(e, t);
    const i = e.getDataFromNode(this);
    i.buildStages = i.buildStages || {}, i.buildStages[e.buildStage] = true;
    const n = LC[e.buildStage];
    if (n && i.buildStages[n] !== true) {
      const l = e.getBuildStage();
      e.setBuildStage(n), this.build(e), e.setBuildStage(l);
    }
    e.addNode(this), e.addChain(this);
    let r = null;
    const o = e.getBuildStage();
    if (o === "setup") {
      this.updateReference(e);
      const l = e.getNodeProperties(this);
      if (l.initialized !== true) {
        l.initialized = true, l.outputNode = this.setup(e) || l.outputNode || null;
        for (const c of Object.values(l))
          if (c && c.isNode === true) {
            if (c.parents === true) {
              const u = e.getNodeProperties(c);
              u.parents = u.parents || [], u.parents.push(this);
            }
            c.build(e);
          }
      }
      r = l.outputNode;
    } else if (o === "analyze")
      this.analyze(e, t);
    else if (o === "generate") {
      if (this.generate.length === 1) {
        const c = this.getNodeType(e), u = e.getDataFromNode(this);
        r = u.snippet, r === void 0 ? u.generated === void 0 ? (u.generated = true, r = this.generate(e) || "", u.snippet = r) : (console.warn("THREE.Node: Recursion detected.", this), r = "/* Recursion detected. */") : u.flowCodes !== void 0 && e.context.nodeBlock !== void 0 && e.addFlowCodeHierarchy(this, e.context.nodeBlock), r = e.format(r, c, t);
      } else
        r = this.generate(e, t) || "";
      r === "" && t !== null && t !== "void" && t !== "OutputType" && (console.error(`THREE.TSL: Invalid generated code, expected a "${t}".`), r = e.generateConst(t));
    }
    return e.removeChain(this), e.addSequentialNode(this), r;
  }
  /**
   * Returns the child nodes as a JSON object.
   *
   * @return {Generator<Object>} An iterable list of serialized child objects as JSON.
   */
  getSerializeChildren() {
    return nh(this);
  }
  /**
   * Serializes the node to JSON.
   *
   * @param {Object} json - The output JSON object.
   */
  serialize(e) {
    const t = this.getSerializeChildren(), s = {};
    for (const { property: i, index: n, childNode: r } of t)
      n !== void 0 ? (s[i] === void 0 && (s[i] = Number.isInteger(n) ? [] : {}), s[i][n] = r.toJSON(e.meta).uuid) : s[i] = r.toJSON(e.meta).uuid;
    Object.keys(s).length > 0 && (e.inputNodes = s);
  }
  /**
   * Deserializes the node from the given JSON.
   *
   * @param {Object} json - The JSON object.
   */
  deserialize(e) {
    if (e.inputNodes !== void 0) {
      const t = e.meta.nodes;
      for (const s in e.inputNodes)
        if (Array.isArray(e.inputNodes[s])) {
          const i = [];
          for (const n of e.inputNodes[s])
            i.push(t[n]);
          this[s] = i;
        } else if (typeof e.inputNodes[s] == "object") {
          const i = {};
          for (const n in e.inputNodes[s]) {
            const r = e.inputNodes[s][n];
            i[n] = t[r];
          }
          this[s] = i;
        } else {
          const i = e.inputNodes[s];
          this[s] = t[i];
        }
    }
  }
  /**
   * Serializes the node into the three.js JSON Object/Scene format.
   *
   * @param {?Object} meta - An optional JSON object that already holds serialized data from other scene objects.
   * @return {Object} The serialized node.
   */
  toJSON(e) {
    const { uuid: t, type: s } = this, i = e === void 0 || typeof e == "string";
    i && (e = {
      textures: {},
      images: {},
      nodes: {}
    });
    let n = e.nodes[t];
    n === void 0 && (n = {
      uuid: t,
      type: s,
      meta: e,
      metadata: {
        version: 4.7,
        type: "Node",
        generator: "Node.toJSON"
      }
    }, i !== true && (e.nodes[n.uuid] = n), this.serialize(n), delete n.meta);
    function r(o) {
      const l = [];
      for (const c in o) {
        const u = o[c];
        delete u.metadata, l.push(u);
      }
      return l;
    }
    if (i) {
      const o = r(e.textures), l = r(e.images), c = r(e.nodes);
      o.length > 0 && (n.textures = o), l.length > 0 && (n.images = l), c.length > 0 && (n.nodes = c);
    }
    return n;
  }
}
class ql extends Ie {
  // @TODO: If extending from TempNode it breaks webgpu_compute
  static get type() {
    return "ArrayElementNode";
  }
  /**
   * Constructs an array element node.
   *
   * @param {Node} node - The array-like node.
   * @param {Node} indexNode - The index node that defines the element access.
   */
  constructor(e, t) {
    super(), this.node = e, this.indexNode = t, this.isArrayElementNode = true;
  }
  /**
   * This method is overwritten since the node type is inferred from the array-like node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.node.getElementType(e);
  }
  generate(e) {
    const t = this.indexNode.getNodeType(e), s = this.node.build(e), i = this.indexNode.build(e, !e.isVector(t) && e.isInteger(t) ? t : "uint");
    return `${s}[ ${i} ]`;
  }
}
class gv extends Ie {
  static get type() {
    return "ConvertNode";
  }
  /**
   * Constructs a new convert node.
   *
   * @param {Node} node - The node which type should be converted.
   * @param {string} convertTo - The target node type. Multiple types can be defined by separating them with a `|` sign.
   */
  constructor(e, t) {
    super(), this.node = e, this.convertTo = t;
  }
  /**
   * This method is overwritten since the implementation tries to infer the best
   * matching type from the {@link ConvertNode#convertTo} property.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    const t = this.node.getNodeType(e);
    let s = null;
    for (const i of this.convertTo.split("|"))
      (s === null || e.getTypeLength(t) === e.getTypeLength(i)) && (s = i);
    return s;
  }
  serialize(e) {
    super.serialize(e), e.convertTo = this.convertTo;
  }
  deserialize(e) {
    super.deserialize(e), this.convertTo = e.convertTo;
  }
  generate(e, t) {
    const s = this.node, i = this.getNodeType(e), n = s.build(e, i);
    return e.format(n, i, t);
  }
}
class es extends Ie {
  static get type() {
    return "TempNode";
  }
  /**
   * Constructs a temp node.
   *
   * @param {?string} nodeType - The node type.
   */
  constructor(e = null) {
    super(e), this.isTempNode = true;
  }
  /**
   * Whether this node is used more than once in context of other nodes.
   *
   * @param {NodeBuilder} builder - The node builder.
   * @return {boolean} A flag that indicates if there is more than one dependency to other nodes.
   */
  hasDependencies(e) {
    return e.getDataFromNode(this).usageCount > 1;
  }
  build(e, t) {
    if (e.getBuildStage() === "generate") {
      const i = e.getVectorType(this.getNodeType(e, t)), n = e.getDataFromNode(this);
      if (n.propertyName !== void 0)
        return e.format(n.propertyName, i, t);
      if (i !== "void" && t !== "void" && this.hasDependencies(e)) {
        const r = super.build(e, i), o = e.getVarFromNode(this, null, i), l = e.getPropertyName(o);
        return e.addLineFlowCode(`${l} = ${r}`, this), n.snippet = r, n.propertyName = l, e.format(n.propertyName, i, t);
      }
    }
    return super.build(e, t);
  }
}
class UC extends es {
  static get type() {
    return "JoinNode";
  }
  /**
   * Constructs a new join node.
   *
   * @param {Array<Node>} nodes - An array of nodes that should be joined.
   * @param {?string} [nodeType=null] - The node type.
   */
  constructor(e = [], t = null) {
    super(t), this.nodes = e;
  }
  /**
   * This method is overwritten since the node type must be inferred from the
   * joined data length if not explicitly defined.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.nodeType !== null ? e.getVectorType(this.nodeType) : e.getTypeFromLength(this.nodes.reduce((t, s) => t + e.getTypeLength(s.getNodeType(e)), 0));
  }
  generate(e, t) {
    const s = this.getNodeType(e), i = e.getTypeLength(s), n = this.nodes, r = e.getComponentType(s), o = [];
    let l = 0;
    for (const u of n) {
      if (l >= i) {
        console.error(`THREE.TSL: Length of parameters exceeds maximum length of function '${s}()' type.`);
        break;
      }
      let h = u.getNodeType(e), f = e.getTypeLength(h), d;
      if (l + f > i && (console.error(`THREE.TSL: Length of '${s}()' data exceeds maximum length of output type.`), f = i - l, h = e.getTypeFromLength(f)), l += f, d = u.build(e, h), e.getComponentType(h) !== r) {
        const m3 = e.getTypeFromLength(f, r);
        d = e.format(d, h, m3);
      }
      o.push(d);
    }
    const c = `${e.getType(s)}( ${o.join(", ")} )`;
    return e.format(c, s, t);
  }
}
const kC = Aa.join("");
class zC extends Ie {
  static get type() {
    return "SplitNode";
  }
  /**
   * Constructs a new split node.
   *
   * @param {Node} node - The node that should be accessed.
   * @param {string} [components='x'] - The components that should be accessed.
   */
  constructor(e, t = "x") {
    super(), this.node = e, this.components = t, this.isSplitNode = true;
  }
  /**
   * Returns the vector length which is computed based on the requested components.
   *
   * @return {number} The vector length.
   */
  getVectorLength() {
    let e = this.components.length;
    for (const t of this.components)
      e = Math.max(Aa.indexOf(t) + 1, e);
    return e;
  }
  /**
   * Returns the component type of the node's type.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The component type.
   */
  getComponentType(e) {
    return e.getComponentType(this.node.getNodeType(e));
  }
  /**
   * This method is overwritten since the node type is inferred from requested components.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return e.getTypeFromLength(this.components.length, this.getComponentType(e));
  }
  /**
   * Returns the scope of the node.
   *
   * @return {Node} The scope of the node.
   */
  getScope() {
    return this.node.getScope();
  }
  generate(e, t) {
    const s = this.node, i = e.getTypeLength(s.getNodeType(e));
    let n = null;
    if (i > 1) {
      let r = null;
      this.getVectorLength() >= i && (r = e.getTypeFromLength(this.getVectorLength(), this.getComponentType(e)));
      const l = s.build(e, r);
      this.components.length === i && this.components === kC.slice(0, this.components.length) ? n = e.format(l, r, t) : n = e.format(`${l}.${this.components}`, this.getNodeType(e), t);
    } else
      n = s.build(e, t);
    return n;
  }
  serialize(e) {
    super.serialize(e), e.components = this.components;
  }
  deserialize(e) {
    super.deserialize(e), this.components = e.components;
  }
}
class GC extends es {
  static get type() {
    return "SetNode";
  }
  /**
   * Constructs a new set node.
   *
   * @param {Node} sourceNode - The node that should be updated.
   * @param {string} components - The components that should be updated.
   * @param {Node} targetNode - The value node.
   */
  constructor(e, t, s) {
    super(), this.sourceNode = e, this.components = t, this.targetNode = s;
  }
  /**
   * This method is overwritten since the node type is inferred from {@link SetNode#sourceNode}.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.sourceNode.getNodeType(e);
  }
  generate(e) {
    const { sourceNode: t, components: s, targetNode: i } = this, n = this.getNodeType(e), r = e.getComponentType(i.getNodeType(e)), o = e.getTypeFromLength(s.length, r), l = i.build(e, o), c = t.build(e, n), u = e.getTypeLength(n), h = [];
    for (let f = 0; f < u; f++) {
      const d = Aa[f];
      d === s[0] ? (h.push(l), f += s.length - 1) : h.push(c + "." + d);
    }
    return `${e.getType(n)}( ${h.join(", ")} )`;
  }
}
class VC extends es {
  static get type() {
    return "FlipNode";
  }
  /**
   * Constructs a new flip node.
   *
   * @param {Node} sourceNode - The node which component(s) should be flipped.
   * @param {string} components - The components that should be flipped e.g. `'x'` or `'xy'`.
   */
  constructor(e, t) {
    super(), this.sourceNode = e, this.components = t;
  }
  /**
   * This method is overwritten since the node type is inferred from the source node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.sourceNode.getNodeType(e);
  }
  generate(e) {
    const { components: t, sourceNode: s } = this, i = this.getNodeType(e), n = s.build(e), r = e.getVarFromNode(this), o = e.getPropertyName(r);
    e.addLineFlowCode(o + " = " + n, this);
    const l = e.getTypeLength(i), c = [];
    let u = 0;
    for (let h = 0; h < l; h++) {
      const f = Aa[h];
      f === t[u] ? (c.push("1.0 - " + (o + "." + f)), u++) : c.push(o + "." + f);
    }
    return `${e.getType(i)}( ${c.join(", ")} )`;
  }
}
class vm extends Ie {
  static get type() {
    return "InputNode";
  }
  /**
   * Constructs a new input node.
   *
   * @param {any} value - The value of this node. This can be any JS primitive, functions, array buffers or even three.js objects (vector, matrices, colors).
   * @param {?string} nodeType - The node type. If no explicit type is defined, the node tries to derive the type from its value.
   */
  constructor(e, t = null) {
    super(t), this.isInputNode = true, this.value = e, this.precision = null;
  }
  getNodeType() {
    return this.nodeType === null ? rh(this.value) : this.nodeType;
  }
  /**
   * Returns the input type of the node which is by default the node type. Derived modules
   * might overwrite this method and use a fixed type or compute one analytically.
   *
   * A typical example for different input and node types are textures. The input type of a
   * normal RGBA texture is `texture` whereas its node type is `vec4`.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType(e) {
    return this.getNodeType(e);
  }
  /**
   * Sets the precision to the given value. The method can be
   * overwritten in derived classes if the final precision must be computed
   * analytically.
   *
   * @param {('low'|'medium'|'high')} precision - The precision of the input value in the shader.
   * @return {InputNode} A reference to this node.
   */
  setPrecision(e) {
    return this.precision = e, this;
  }
  serialize(e) {
    super.serialize(e), e.value = this.value, this.value && this.value.toArray && (e.value = this.value.toArray()), e.valueType = rh(this.value), e.nodeType = this.nodeType, e.valueType === "ArrayBuffer" && (e.value = BC(e.value)), e.precision = this.precision;
  }
  deserialize(e) {
    super.deserialize(e), this.nodeType = e.nodeType, this.value = Array.isArray(e.value) ? xm(e.valueType, ...e.value) : e.value, this.precision = e.precision || null, this.value && this.value.fromArray && (this.value = this.value.fromArray(e.value));
  }
  generate() {
    console.warn("Abstract function.");
  }
}
const Gy = /float|u?int/;
class cn extends vm {
  static get type() {
    return "ConstNode";
  }
  /**
   * Constructs a new input node.
   *
   * @param {any} value - The value of this node. Usually a JS primitive or three.js object (vector, matrix, color).
   * @param {?string} nodeType - The node type. If no explicit type is defined, the node tries to derive the type from its value.
   */
  constructor(e, t = null) {
    super(e, t), this.isConstNode = true;
  }
  /**
   * Generates the shader string of the value with the current node builder.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The generated value as a shader string.
   */
  generateConst(e) {
    return e.generateConst(this.getNodeType(e), this.value);
  }
  generate(e, t) {
    const s = this.getNodeType(e);
    return Gy.test(s) && Gy.test(t) ? e.generateConst(t, this.value) : e.format(this.generateConst(e), s, t);
  }
}
class HC extends Ie {
  static get type() {
    return "MemberNode";
  }
  /**
   * Constructs a member node.
   *
   * @param {Node} structNode - The struct node.
   * @param {string} property - The property name.
   */
  constructor(e, t) {
    super(), this.structNode = e, this.property = t, this.isMemberNode = true;
  }
  hasMember(e) {
    return this.structNode.isMemberNode && this.structNode.hasMember(e) === false ? false : this.structNode.getMemberType(e, this.property) !== "void";
  }
  getNodeType(e) {
    return this.hasMember(e) === false ? "float" : this.structNode.getMemberType(e, this.property);
  }
  getMemberType(e, t) {
    if (this.hasMember(e) === false)
      return "float";
    const s = this.getNodeType(e);
    return e.getStructTypeNode(s).getMemberType(e, t);
  }
  generate(e) {
    if (this.hasMember(e) === false) {
      console.warn(`THREE.TSL: Member "${this.property}" does not exist in struct.`);
      const s = this.getNodeType(e);
      return e.generateConst(s);
    }
    return this.structNode.build(e) + "." + this.property;
  }
}
let ro = null;
const dp = /* @__PURE__ */ new Map();
function se(a, e) {
  if (dp.has(a)) {
    console.warn(`THREE.TSL: Redefinition of method chaining '${a}'.`);
    return;
  }
  if (typeof e != "function") throw new Error(`THREE.TSL: Node element ${a} is not a function`);
  dp.set(a, e), a !== "assign" && (Ie.prototype[a] = function(...t) {
    return this.isStackNode ? this.add(e(...t)) : e(this, ...t);
  }, Ie.prototype[a + "Assign"] = function(...t) {
    return this.isStackNode ? this.assign(t[0], e(...t)) : this.assign(e(this, ...t));
  });
}
const $C = (a) => a.replace(/r|s/g, "x").replace(/g|t/g, "y").replace(/b|p/g, "z").replace(/a|q/g, "w"), Vy = (a) => $C(a).split("").sort().join("");
Ie.prototype.assign = function(...a) {
  if (this.isStackNode !== true)
    return console.error("THREE.TSL: No stack defined for assign operation. Make sure the assign is inside a Fn()."), this;
  {
    const e = dp.get("assign");
    return this.add(e(...a));
  }
};
Ie.prototype.toVarIntent = function() {
  return this;
};
Ie.prototype.get = function(a) {
  return new HC(this, a);
};
const _l = {};
function $c(a, e, t) {
  _l[a] = _l[e] = _l[t] = {
    get() {
      this._cache = this._cache || {};
      let r = this._cache[a];
      return r === void 0 && (r = new zC(this, a), this._cache[a] = r), r;
    },
    set(r) {
      this[a].assign(pe(r));
    }
  };
  const s = a.toUpperCase(), i = e.toUpperCase(), n = t.toUpperCase();
  Ie.prototype["set" + s] = Ie.prototype["set" + i] = Ie.prototype["set" + n] = function(r) {
    const o = Vy(a);
    return new GC(this, o, pe(r));
  }, Ie.prototype["flip" + s] = Ie.prototype["flip" + i] = Ie.prototype["flip" + n] = function() {
    const r = Vy(a);
    return new VC(this, r);
  };
}
const Gi = ["x", "y", "z", "w"], Vi = ["r", "g", "b", "a"], Hi = ["s", "t", "p", "q"];
for (let a = 0; a < 4; a++) {
  let e = Gi[a], t = Vi[a], s = Hi[a];
  $c(e, t, s);
  for (let i = 0; i < 4; i++) {
    e = Gi[a] + Gi[i], t = Vi[a] + Vi[i], s = Hi[a] + Hi[i], $c(e, t, s);
    for (let n = 0; n < 4; n++) {
      e = Gi[a] + Gi[i] + Gi[n], t = Vi[a] + Vi[i] + Vi[n], s = Hi[a] + Hi[i] + Hi[n], $c(e, t, s);
      for (let r = 0; r < 4; r++)
        e = Gi[a] + Gi[i] + Gi[n] + Gi[r], t = Vi[a] + Vi[i] + Vi[n] + Vi[r], s = Hi[a] + Hi[i] + Hi[n] + Hi[r], $c(e, t, s);
    }
  }
}
for (let a = 0; a < 32; a++)
  _l[a] = {
    get() {
      this._cache = this._cache || {};
      let e = this._cache[a];
      return e === void 0 && (e = new ql(this, new cn(a, "uint")), this._cache[a] = e), e;
    },
    set(e) {
      this[a].assign(pe(e));
    }
  };
Object.defineProperties(Ie.prototype, _l);
const Hy = /* @__PURE__ */ new WeakMap(), WC = function(a, e = null) {
  const t = rh(a);
  return t === "node" ? a : e === null && (t === "float" || t === "boolean") || t && t !== "shader" && t !== "string" ? pe(fp(a, e)) : t === "shader" ? a.isFn ? a : he(a) : a;
}, jC = function(a, e = null) {
  for (const t in a)
    a[t] = pe(a[t], e);
  return a;
}, qC = function(a, e = null) {
  const t = a.length;
  for (let s = 0; s < t; s++)
    a[s] = pe(a[s], e);
  return a;
}, yv = function(a, e = null, t = null, s = null) {
  function i(u) {
    return s !== null ? (u = pe(Object.assign(u, s)), s.intent === true && (u = u.toVarIntent())) : u = pe(u), u;
  }
  let n, r = e, o, l;
  function c(u) {
    let h;
    return r ? h = /[a-z]/i.test(r) ? r + "()" : r : h = a.type, o !== void 0 && u.length < o ? (console.error(`THREE.TSL: "${h}" parameter length is less than minimum required.`), u.concat(new Array(o - u.length).fill(0))) : l !== void 0 && u.length > l ? (console.error(`THREE.TSL: "${h}" parameter length exceeds limit.`), u.slice(0, l)) : u;
  }
  return e === null ? n = (...u) => i(new a(...ra(c(u)))) : t !== null ? (t = pe(t), n = (...u) => i(new a(e, ...ra(c(u)), t))) : n = (...u) => i(new a(e, ...ra(c(u)))), n.setParameterLength = (...u) => (u.length === 1 ? o = l = u[0] : u.length === 2 && ([o, l] = u), n), n.setName = (u) => (r = u, n), n;
}, XC = function(a, ...e) {
  return pe(new a(...ra(e)));
};
class YC extends Ie {
  constructor(e, t) {
    super(), this.shaderNode = e, this.rawInputs = t, this.isShaderCallNodeInternal = true;
  }
  getNodeType(e) {
    return this.shaderNode.nodeType || this.getOutputNode(e).getNodeType(e);
  }
  getMemberType(e, t) {
    return this.getOutputNode(e).getMemberType(e, t);
  }
  call(e) {
    const { shaderNode: t, rawInputs: s } = this, i = e.getNodeProperties(t), n = e.getClosestSubBuild(t.subBuilds) || "", r = n || "default";
    if (i[r])
      return i[r];
    const o = e.subBuildFn;
    e.subBuildFn = n;
    let l = null;
    if (t.layout) {
      let c = Hy.get(e.constructor);
      c === void 0 && (c = /* @__PURE__ */ new WeakMap(), Hy.set(e.constructor, c));
      let u = c.get(t);
      u === void 0 && (u = pe(e.buildFunctionNode(t)), c.set(t, u)), e.addInclude(u);
      const h = s ? KC(s) : null;
      l = pe(u.call(h));
    } else {
      const c = new Proxy(e, {
        get: (p, m3, g) => {
          let y3;
          return Symbol.iterator === m3 ? y3 = function* () {
            yield void 0;
          } : y3 = Reflect.get(p, m3, g), y3;
        }
      }), u = s ? ZC(s) : null, h = Array.isArray(s) ? s.length > 0 : s !== null, f = t.jsFunc, d = h || f.length > 1 ? f(u, c) : f(c);
      l = pe(d);
    }
    return e.subBuildFn = o, t.once && (i[r] = l), l;
  }
  setupOutput(e) {
    return e.addStack(), e.stack.outputNode = this.call(e), e.removeStack();
  }
  getOutputNode(e) {
    const t = e.getNodeProperties(this), s = e.getSubBuildOutput(this);
    return t[s] = t[s] || this.setupOutput(e), t[s].subBuild = e.getClosestSubBuild(this), t[s];
  }
  build(e, t = null) {
    let s = null;
    const i = e.getBuildStage(), n = e.getNodeProperties(this), r = e.getSubBuildOutput(this), o = this.getOutputNode(e);
    if (i === "setup") {
      const l = e.getSubBuildProperty("initialized", this);
      if (n[l] !== true && (n[l] = true, n[r] = this.getOutputNode(e), n[r].build(e), this.shaderNode.subBuilds))
        for (const c of e.chaining) {
          const u = e.getDataFromNode(c, "any");
          u.subBuilds = u.subBuilds || /* @__PURE__ */ new Set();
          for (const h of this.shaderNode.subBuilds)
            u.subBuilds.add(h);
        }
      s = n[r];
    } else i === "analyze" ? o.build(e, t) : i === "generate" && (s = o.build(e, t) || "");
    return s;
  }
}
function KC(a) {
  let e;
  return wm(a), a[0] && (a[0].isNode || Object.getPrototypeOf(a[0]) !== Object.prototype) ? e = [...a] : e = a[0], e;
}
function ZC(a) {
  let e = 0;
  return wm(a), new Proxy(a, {
    get: (t, s, i) => {
      let n;
      if (s === "length")
        return n = a.length, n;
      if (Symbol.iterator === s)
        n = function* () {
          for (const r of a)
            yield pe(r);
        };
      else {
        if (a.length > 0)
          if (Object.getPrototypeOf(a[0]) === Object.prototype) {
            const r = a[0];
            r[s] === void 0 ? n = r[e++] : n = Reflect.get(r, s, i);
          } else a[0] instanceof Ie && (a[s] === void 0 ? n = a[e++] : n = Reflect.get(a, s, i));
        else
          n = Reflect.get(t, s, i);
        n = pe(n);
      }
      return n;
    }
  });
}
class QC extends Ie {
  constructor(e, t) {
    super(t), this.jsFunc = e, this.layout = null, this.global = true, this.once = false;
  }
  setLayout(e) {
    return this.layout = e, this;
  }
  call(e = null) {
    return pe(new YC(this, e));
  }
  setup() {
    return this.call();
  }
}
const JC = [false, true], eN = [0, 1, 2, 3], tN = [-1, -2], xv = [0.5, 1.5, 1 / 3, 1e-6, 1e6, Math.PI, Math.PI * 2, 1 / Math.PI, 2 / Math.PI, 1 / (Math.PI * 2), Math.PI / 2], _m = /* @__PURE__ */ new Map();
for (const a of JC) _m.set(a, new cn(a));
const Tm = /* @__PURE__ */ new Map();
for (const a of eN) Tm.set(a, new cn(a, "uint"));
const bm = new Map([...Tm].map((a) => new cn(a.value, "int")));
for (const a of tN) bm.set(a, new cn(a, "int"));
const Ch = new Map([...bm].map((a) => new cn(a.value)));
for (const a of xv) Ch.set(a, new cn(a));
for (const a of xv) Ch.set(-a, new cn(-a));
const Nh = { bool: _m, uint: Tm, ints: bm, float: Ch }, $y = new Map([..._m, ...Ch]), fp = (a, e) => $y.has(a) ? $y.get(a) : a.isNode === true ? a : new cn(a, e), qt = function(a, e = null) {
  return (...t) => {
    for (const i of t)
      if (i === void 0)
        return console.error(`THREE.TSL: Invalid parameter for the type "${a}".`), pe(new cn(0, a));
    if ((t.length === 0 || !["bool", "float", "int", "uint"].includes(a) && t.every((i) => {
      const n = typeof i;
      return n !== "object" && n !== "function";
    })) && (t = [xm(a, ...t)]), t.length === 1 && e !== null && e.has(t[0]))
      return Wc(e.get(t[0]));
    if (t.length === 1) {
      const i = fp(t[0], a);
      return i.nodeType === a ? Wc(i) : Wc(new gv(i, a));
    }
    const s = t.map((i) => fp(i));
    return Wc(new UC(s, a));
  };
}, sN = (a) => a != null ? a.nodeType || a.convertTo || (typeof a == "string" ? a : null) : null;
function ll(a, e) {
  return new QC(a, e);
}
const pe = (a, e = null) => (
  /* new */
  WC(a, e)
), Wc = (a, e = null) => (
  /* new */
  pe(a, e).toVarIntent()
), wm = (a, e = null) => new jC(a, e), ra = (a, e = null) => new qC(a, e), ut = (a, e = null, t = null, s = null) => new yv(a, e, t, s), Te = (a, ...e) => new XC(a, ...e), Re = (a, e = null, t = null, s = {}) => new yv(a, e, t, { intent: true, ...s });
let iN = 0;
class nN extends Ie {
  constructor(e, t = null) {
    super();
    let s = null;
    t !== null && (typeof t == "object" ? s = t.return : (typeof t == "string" ? s = t : console.error("THREE.TSL: Invalid layout type."), t = null)), this.shaderNode = new ll(e, s), t !== null && this.setLayout(t), this.isFn = true;
  }
  setLayout(e) {
    const t = this.shaderNode.nodeType;
    if (typeof e.inputs != "object") {
      const s = {
        name: "fn" + iN++,
        type: t,
        inputs: []
      };
      for (const i in e)
        i !== "return" && s.inputs.push({
          name: i,
          type: e[i]
        });
      e = s;
    }
    return this.shaderNode.setLayout(e), this;
  }
  getNodeType(e) {
    return this.shaderNode.getNodeType(e) || "float";
  }
  call(...e) {
    const t = this.shaderNode.call(e);
    return this.shaderNode.nodeType === "void" && t.toStack(), t.toVarIntent();
  }
  once(e = null) {
    return this.shaderNode.once = true, this.shaderNode.subBuilds = e, this;
  }
  generate(e) {
    const t = this.getNodeType(e);
    return console.error('THREE.TSL: "Fn()" was declared but not invoked. Try calling it like "Fn()( ...params )".'), e.generateConst(t);
  }
}
function he(a, e = null) {
  const t = new nN(a, e);
  return new Proxy(() => {
  }, {
    apply(s, i, n) {
      return t.call(...n);
    },
    get(s, i, n) {
      return Reflect.get(t, i, n);
    },
    set(s, i, n, r) {
      return Reflect.set(t, i, n, r);
    }
  });
}
const Gt = (...a) => ro.If(...a);
function vv(a) {
  return a;
}
se("toStack", vv);
const rN = new qt("color"), ae = new qt("float", Nh.float), Nt = new qt("int", Nh.ints), oN = new qt("uint", Nh.uint), Mm = new qt("bool", Nh.bool), be = new qt("vec2"), Tn = new qt("ivec2"), aN = new qt("uvec2"), lN = new qt("bvec2"), le = new qt("vec3"), cN = new qt("ivec3"), uN = new qt("uvec3"), hN = new qt("bvec3"), We = new qt("vec4"), dN = new qt("ivec4"), fN = new qt("uvec4"), pN = new qt("bvec4"), Am = new qt("mat2"), Es2 = new qt("mat3"), oa = new qt("mat4");
se("toColor", rN);
se("toFloat", ae);
se("toInt", Nt);
se("toUint", oN);
se("toBool", Mm);
se("toVec2", be);
se("toIVec2", Tn);
se("toUVec2", aN);
se("toBVec2", lN);
se("toVec3", le);
se("toIVec3", cN);
se("toUVec3", uN);
se("toBVec3", hN);
se("toVec4", We);
se("toIVec4", dN);
se("toUVec4", fN);
se("toBVec4", pN);
se("toMat2", Am);
se("toMat3", Es2);
se("toMat4", oa);
const mN = /* @__PURE__ */ ut(ql).setParameterLength(2), gN = (a, e) => pe(new gv(pe(a), e));
se("element", mN);
se("convert", gN);
se("append", (a) => (console.warn("THREE.TSL: .append() has been renamed to .toStack()."), vv(a)));
class Tt extends Ie {
  static get type() {
    return "PropertyNode";
  }
  /**
   * Constructs a new property node.
   *
   * @param {string} nodeType - The type of the node.
   * @param {?string} [name=null] - The name of the property in the shader.
   * @param {boolean} [varying=false] - Whether this property is a varying or not.
   */
  constructor(e, t = null, s = false) {
    super(e), this.name = t, this.varying = s, this.isPropertyNode = true, this.global = true;
  }
  getHash(e) {
    return this.name || super.getHash(e);
  }
  generate(e) {
    let t;
    return this.varying === true ? (t = e.getVaryingFromNode(this, this.name), t.needsInterpolation = true) : t = e.getVarFromNode(this, this.name), e.getPropertyName(t);
  }
}
const pr = (a, e) => pe(new Tt(a, e)), dt = /* @__PURE__ */ Te(Tt, "vec4", "DiffuseColor"), Tl = /* @__PURE__ */ Te(Tt, "vec4", "Output");
class Av extends Ie {
  static get type() {
    return "UniformGroupNode";
  }
  /**
   * Constructs a new uniform group node.
   *
   * @param {string} name - The name of the uniform group node.
   * @param {boolean} [shared=false] - Whether this uniform group node is shared or not.
   * @param {number} [order=1] - Influences the internal sorting.
   */
  constructor(e, t = false, s = 1) {
    super("string"), this.name = e, this.shared = t, this.order = s, this.isUniformGroup = true;
  }
  serialize(e) {
    super.serialize(e), e.name = this.name, e.version = this.version, e.shared = this.shared;
  }
  deserialize(e) {
    super.deserialize(e), this.name = e.name, this.version = e.version, this.shared = e.shared;
  }
}
const yN = (a) => new Av(a), Cm = (a, e = 0) => new Av(a, true, e), De = /* @__PURE__ */ Cm("render"), Ev = /* @__PURE__ */ yN("object");
class Xl extends vm {
  static get type() {
    return "UniformNode";
  }
  /**
   * Constructs a new uniform node.
   *
   * @param {any} value - The value of this node. Usually a JS primitive or three.js object (vector, matrix, color, texture).
   * @param {?string} nodeType - The node type. If no explicit type is defined, the node tries to derive the type from its value.
   */
  constructor(e, t = null) {
    super(e, t), this.isUniformNode = true, this.name = "", this.groupNode = Ev;
  }
  /**
   * Sets the {@link UniformNode#name} property.
   *
   * @param {string} name - The name of the uniform.
   * @return {UniformNode} A reference to this node.
   */
  setName(e) {
    return this.name = e, this;
  }
  /**
   * Sets the {@link UniformNode#name} property.
   *
   * @deprecated
   * @param {string} name - The name of the uniform.
   * @return {UniformNode} A reference to this node.
   */
  label(e) {
    return console.warn('THREE.TSL: "label()" has been deprecated. Use "setName()" instead.'), this.setName(e);
  }
  /**
   * Sets the {@link UniformNode#groupNode} property.
   *
   * @param {UniformGroupNode} group - The uniform group.
   * @return {UniformNode} A reference to this node.
   */
  setGroup(e) {
    return this.groupNode = e, this;
  }
  /**
   * Returns the {@link UniformNode#groupNode}.
   *
   * @return {UniformGroupNode} The uniform group.
   */
  getGroup() {
    return this.groupNode;
  }
  /**
   * By default, this method returns the result of {@link Node#getHash} but derived
   * classes might overwrite this method with a different implementation.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The uniform hash.
   */
  getUniformHash(e) {
    return this.getHash(e);
  }
  onUpdate(e, t) {
    return e = e.bind(this), super.onUpdate((s) => {
      const i = e(s, this);
      i !== void 0 && (this.value = i);
    }, t);
  }
  getInputType(e) {
    let t = super.getInputType(e);
    return t === "bool" && (t = "uint"), t;
  }
  generate(e, t) {
    const s = this.getNodeType(e), i = this.getUniformHash(e);
    let n = e.getNodeFromHash(i);
    n === void 0 && (e.setHashNode(this, i), n = this);
    const r = n.getInputType(e), o = e.getUniformFromNode(n, r, e.shaderStage, this.name || e.context.nodeName), l = e.getPropertyName(o);
    e.context.nodeName !== void 0 && delete e.context.nodeName;
    let c = l;
    if (s === "bool") {
      const u = e.getDataFromNode(this);
      let h = u.propertyName;
      if (h === void 0) {
        const f = e.getVarFromNode(this, null, "bool");
        h = e.getPropertyName(f), u.propertyName = h, c = e.format(l, r, s), e.addLineFlowCode(`${h} = ${c}`, this);
      }
      c = h;
    }
    return e.format(c, s, t);
  }
}
const Ue = (a, e) => {
  const t = sN(e || a);
  return t === a && (a = xm(t)), a = a && a.isNode === true ? a.node && a.node.value || a.value : a, pe(new Xl(a, t));
};
class Xy extends es {
  static get type() {
    return "ArrayNode";
  }
  /**
   * Constructs a new array node.
   *
   * @param {?string} nodeType - The data type of the elements.
   * @param {number} count - Size of the array.
   * @param {?Array<Node>} [values=null] - Array default values.
   */
  constructor(e, t, s = null) {
    super(e), this.count = t, this.values = s, this.isArrayNode = true;
  }
  /**
   * Returns the number of elements in the node array.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {number} The number of elements in the node array.
   */
  getArrayCount() {
    return this.count;
  }
  /**
   * Returns the node's type.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The type of the node.
   */
  getNodeType(e) {
    return this.nodeType === null && (this.nodeType = this.values[0].getNodeType(e)), this.nodeType;
  }
  /**
   * Returns the node's type.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The type of the node.
   */
  getElementType(e) {
    return this.getNodeType(e);
  }
  /**
   * This method builds the output node and returns the resulting array as a shader string.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The generated shader string.
   */
  generate(e) {
    const t = this.getNodeType(e);
    return e.generateArray(t, this.count, this.values);
  }
}
const vN = (...a) => {
  let e;
  if (a.length === 1) {
    const t = a[0];
    e = new Xy(null, t.length, t);
  } else {
    const t = a[0], s = a[1];
    e = new Xy(t, s);
  }
  return pe(e);
};
se("toArray", (a, e) => vN(Array(e).fill(a)));
class _N extends es {
  static get type() {
    return "AssignNode";
  }
  /**
   * Constructs a new assign node.
   *
   * @param {Node} targetNode - The target node.
   * @param {Node} sourceNode - The source type.
   */
  constructor(e, t) {
    super(), this.targetNode = e, this.sourceNode = t, this.isAssignNode = true;
  }
  /**
   * Whether this node is used more than once in context of other nodes. This method
   * is overwritten since it always returns `false` (assigns are unique).
   *
   * @return {boolean} A flag that indicates if there is more than one dependency to other nodes. Always `false`.
   */
  hasDependencies() {
    return false;
  }
  getNodeType(e, t) {
    return t !== "void" ? this.targetNode.getNodeType(e) : "void";
  }
  /**
   * Whether a split is required when assigning source to target. This can happen when the component length of
   * target and source data type does not match.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {boolean} Whether a split is required when assigning source to target.
   */
  needsSplitAssign(e) {
    const { targetNode: t } = this;
    if (e.isAvailable("swizzleAssign") === false && t.isSplitNode && t.components.length > 1) {
      const s = e.getTypeLength(t.node.getNodeType(e));
      return Aa.join("").slice(0, s) !== t.components;
    }
    return false;
  }
  setup(e) {
    const { targetNode: t, sourceNode: s } = this, i = t.getScope(), n = e.getNodeProperties(i);
    n.assign = true;
    const r = e.getNodeProperties(this);
    r.sourceNode = s, r.targetNode = t.context({ assign: true });
  }
  generate(e, t) {
    const { targetNode: s, sourceNode: i } = e.getNodeProperties(this), n = this.needsSplitAssign(e), r = s.build(e), o = s.getNodeType(e), l = i.build(e, o), c = i.getNodeType(e), u = e.getDataFromNode(this);
    let h;
    if (u.initialized === true)
      t !== "void" && (h = r);
    else if (n) {
      const f = e.getVarFromNode(this, null, o), d = e.getPropertyName(f);
      e.addLineFlowCode(`${d} = ${l}`, this);
      const p = s.node, g = p.node.context({ assign: true }).build(e);
      for (let y3 = 0; y3 < p.components.length; y3++) {
        const x = p.components[y3];
        e.addLineFlowCode(`${g}.${x} = ${d}[ ${y3} ]`, this);
      }
      t !== "void" && (h = r);
    } else
      h = `${r} = ${l}`, (t === "void" || c === "void") && (e.addLineFlowCode(h, this), t !== "void" && (h = r));
    return u.initialized = true, e.format(h, o, t);
  }
}
const TN = /* @__PURE__ */ ut(_N).setParameterLength(2);
se("assign", TN);
class bN extends es {
  static get type() {
    return "FunctionCallNode";
  }
  /**
   * Constructs a new function call node.
   *
   * @param {?FunctionNode} functionNode - The function node.
   * @param {Object<string, Node>} [parameters={}] - The parameters for the function call.
   */
  constructor(e = null, t = {}) {
    super(), this.functionNode = e, this.parameters = t;
  }
  /**
   * Sets the parameters of the function call node.
   *
   * @param {Object<string, Node>} parameters - The parameters to set.
   * @return {FunctionCallNode} A reference to this node.
   */
  setParameters(e) {
    return this.parameters = e, this;
  }
  /**
   * Returns the parameters of the function call node.
   *
   * @return {Object<string, Node>} The parameters of this node.
   */
  getParameters() {
    return this.parameters;
  }
  /**
   * Returns the type of this function call node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @returns {string} The type of this node.
   */
  getNodeType(e) {
    return this.functionNode.getNodeType(e);
  }
  /**
   * Returns the function node of this function call node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} [name] - The name of the member.
   * @returns {string} The type of the member.
   */
  getMemberType(e, t) {
    return this.functionNode.getMemberType(e, t);
  }
  generate(e) {
    const t = [], s = this.functionNode, i = s.getInputs(e), n = this.parameters, r = (l, c) => {
      const u = c.type, h = u === "pointer";
      let f;
      return h ? f = "&" + l.build(e) : f = l.build(e, u), f;
    };
    if (Array.isArray(n)) {
      if (n.length > i.length)
        console.error("THREE.TSL: The number of provided parameters exceeds the expected number of inputs in 'Fn()'."), n.length = i.length;
      else if (n.length < i.length)
        for (console.error("THREE.TSL: The number of provided parameters is less than the expected number of inputs in 'Fn()'."); n.length < i.length; )
          n.push(ae(0));
      for (let l = 0; l < n.length; l++)
        t.push(r(n[l], i[l]));
    } else
      for (const l of i) {
        const c = n[l.name];
        c !== void 0 ? t.push(r(c, l)) : (console.error(`THREE.TSL: Input '${l.name}' not found in 'Fn()'.`), t.push(r(ae(0), l)));
      }
    return `${s.build(e, "property")}( ${t.join(", ")} )`;
  }
}
const wN = (a, ...e) => (e = e.length > 1 || e[0] && e[0].isNode === true ? ra(e) : wm(e[0]), pe(new bN(pe(a), e)));
se("call", wN);
const SN = {
  "==": "equal",
  "!=": "notEqual",
  "<": "lessThan",
  ">": "greaterThan",
  "<=": "lessThanEqual",
  ">=": "greaterThanEqual",
  "%": "mod"
};
class Dt extends es {
  static get type() {
    return "OperatorNode";
  }
  /**
   * Constructs a new operator node.
   *
   * @param {string} op - The operator.
   * @param {Node} aNode - The first input.
   * @param {Node} bNode - The second input.
   * @param {...Node} params - Additional input parameters.
   */
  constructor(e, t, s, ...i) {
    if (super(), i.length > 0) {
      let n = new Dt(e, t, s);
      for (let r = 0; r < i.length - 1; r++)
        n = new Dt(e, n, i[r]);
      t = n, s = i[i.length - 1];
    }
    this.op = e, this.aNode = t, this.bNode = s, this.isOperatorNode = true;
  }
  /**
   * Returns the operator method name.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} output - The output type.
   * @returns {string} The operator method name.
   */
  getOperatorMethod(e, t) {
    return e.getMethod(SN[this.op], t);
  }
  /**
   * This method is overwritten since the node type is inferred from the operator
   * and the input node types.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {?string} [output=null] - The output type.
   * @return {string} The node type.
   */
  getNodeType(e, t = null) {
    const s = this.op, i = this.aNode, n = this.bNode, r = i.getNodeType(e), o = n ? n.getNodeType(e) : null;
    if (r === "void" || o === "void")
      return t || "void";
    if (s === "%")
      return r;
    if (s === "~" || s === "&" || s === "|" || s === "^" || s === ">>" || s === "<<")
      return e.getIntegerType(r);
    if (s === "!" || s === "&&" || s === "||" || s === "^^")
      return "bool";
    if (s === "==" || s === "!=" || s === "<" || s === ">" || s === "<=" || s === ">=") {
      const l = Math.max(e.getTypeLength(r), e.getTypeLength(o));
      return l > 1 ? `bvec${l}` : "bool";
    } else {
      if (e.isMatrix(r)) {
        if (o === "float")
          return r;
        if (e.isVector(o))
          return e.getVectorFromMatrix(r);
        if (e.isMatrix(o))
          return r;
      } else if (e.isMatrix(o)) {
        if (r === "float")
          return o;
        if (e.isVector(r))
          return e.getVectorFromMatrix(o);
      }
      return e.getTypeLength(o) > e.getTypeLength(r) ? o : r;
    }
  }
  generate(e, t) {
    const s = this.op, { aNode: i, bNode: n } = this, r = this.getNodeType(e, t);
    let o = null, l = null;
    r !== "void" ? (o = i.getNodeType(e), l = n ? n.getNodeType(e) : null, s === "<" || s === ">" || s === "<=" || s === ">=" || s === "==" || s === "!=" ? e.isVector(o) ? l = o : e.isVector(l) ? o = l : o !== l && (o = l = "float") : s === ">>" || s === "<<" ? (o = r, l = e.changeComponentType(l, "uint")) : s === "%" ? (o = r, l = e.isInteger(o) && e.isInteger(l) ? l : o) : e.isMatrix(o) ? l === "float" ? l = "float" : e.isVector(l) ? l = e.getVectorFromMatrix(o) : e.isMatrix(l) || (o = l = r) : e.isMatrix(l) ? o === "float" ? o = "float" : e.isVector(o) ? o = e.getVectorFromMatrix(l) : o = l = r : o = l = r) : o = l = r;
    const c = i.build(e, o), u = n ? n.build(e, l) : null, h = e.getFunctionOperator(s);
    if (t !== "void") {
      const f = e.renderer.coordinateSystem === Qs;
      if (s === "==" || s === "!=" || s === "<" || s === ">" || s === "<=" || s === ">=")
        return f ? e.isVector(o) ? e.format(`${this.getOperatorMethod(e, t)}( ${c}, ${u} )`, r, t) : e.format(`( ${c} ${s} ${u} )`, r, t) : e.format(`( ${c} ${s} ${u} )`, r, t);
      if (s === "%")
        return e.isInteger(l) ? e.format(`( ${c} % ${u} )`, r, t) : e.format(`${this.getOperatorMethod(e, r)}( ${c}, ${u} )`, r, t);
      if (s === "!" || s === "~")
        return e.format(`(${s}${c})`, o, t);
      if (h)
        return e.format(`${h}( ${c}, ${u} )`, r, t);
      if (e.isMatrix(o) && l === "float")
        return e.format(`( ${u} ${s} ${c} )`, r, t);
      if (o === "float" && e.isMatrix(l))
        return e.format(`${c} ${s} ${u}`, r, t);
      {
        let d = `( ${c} ${s} ${u} )`;
        return !f && r === "bool" && e.isVector(o) && e.isVector(l) && (d = `all${d}`), e.format(d, r, t);
      }
    } else if (o !== "void")
      return h ? e.format(`${h}( ${c}, ${u} )`, r, t) : e.isMatrix(o) && l === "float" ? e.format(`${u} ${s} ${c}`, r, t) : e.format(`${c} ${s} ${u}`, r, t);
  }
  serialize(e) {
    super.serialize(e), e.op = this.op;
  }
  deserialize(e) {
    super.deserialize(e), this.op = e.op;
  }
}
const ks = /* @__PURE__ */ Re(Dt, "+").setParameterLength(2, 1 / 0).setName("add"), bs = /* @__PURE__ */ Re(Dt, "-").setParameterLength(2, 1 / 0).setName("sub"), Ye = /* @__PURE__ */ Re(Dt, "*").setParameterLength(2, 1 / 0).setName("mul"), nn = /* @__PURE__ */ Re(Dt, "/").setParameterLength(2, 1 / 0).setName("div"), Nm = /* @__PURE__ */ Re(Dt, "%").setParameterLength(2).setName("mod"), Rv = /* @__PURE__ */ Re(Dt, "==").setParameterLength(2).setName("equal"), MN = /* @__PURE__ */ Re(Dt, "!=").setParameterLength(2).setName("notEqual"), AN = /* @__PURE__ */ Re(Dt, "<").setParameterLength(2).setName("lessThan"), EN = /* @__PURE__ */ Re(Dt, ">").setParameterLength(2).setName("greaterThan"), RN = /* @__PURE__ */ Re(Dt, "<=").setParameterLength(2).setName("lessThanEqual"), CN = /* @__PURE__ */ Re(Dt, ">=").setParameterLength(2).setName("greaterThanEqual"), NN = /* @__PURE__ */ Re(Dt, "&&").setParameterLength(2, 1 / 0).setName("and"), PN = /* @__PURE__ */ Re(Dt, "||").setParameterLength(2, 1 / 0).setName("or"), IN = /* @__PURE__ */ Re(Dt, "!").setParameterLength(1).setName("not"), BN = /* @__PURE__ */ Re(Dt, "^^").setParameterLength(2).setName("xor"), FN = /* @__PURE__ */ Re(Dt, "&").setParameterLength(2).setName("bitAnd"), DN = /* @__PURE__ */ Re(Dt, "~").setParameterLength(2).setName("bitNot"), LN = /* @__PURE__ */ Re(Dt, "|").setParameterLength(2).setName("bitOr"), ON = /* @__PURE__ */ Re(Dt, "^").setParameterLength(2).setName("bitXor"), UN = /* @__PURE__ */ Re(Dt, "<<").setParameterLength(2).setName("shiftLeft"), kN = /* @__PURE__ */ Re(Dt, ">>").setParameterLength(2).setName("shiftRight"), zN = he(([a]) => (a.addAssign(1), a)), GN = he(([a]) => (a.subAssign(1), a)), VN = /* @__PURE__ */ he(([a]) => {
  const e = Nt(a).toConst();
  return a.addAssign(1), e;
}), HN = /* @__PURE__ */ he(([a]) => {
  const e = Nt(a).toConst();
  return a.subAssign(1), e;
});
se("add", ks);
se("sub", bs);
se("mul", Ye);
se("div", nn);
se("mod", Nm);
se("equal", Rv);
se("notEqual", MN);
se("lessThan", AN);
se("greaterThan", EN);
se("lessThanEqual", RN);
se("greaterThanEqual", CN);
se("and", NN);
se("or", PN);
se("not", IN);
se("xor", BN);
se("bitAnd", FN);
se("bitNot", DN);
se("bitOr", LN);
se("bitXor", ON);
se("shiftLeft", UN);
se("shiftRight", kN);
se("incrementBefore", zN);
se("decrementBefore", GN);
se("increment", VN);
se("decrement", HN);
const $N = (a, e) => (console.warn('THREE.TSL: "modInt()" is deprecated. Use "mod( int( ... ) )" instead.'), Nm(Nt(a), Nt(e)));
se("modInt", $N);
class X extends es {
  static get type() {
    return "MathNode";
  }
  /**
   * Constructs a new math node.
   *
   * @param {string} method - The method name.
   * @param {Node} aNode - The first input.
   * @param {?Node} [bNode=null] - The second input.
   * @param {?Node} [cNode=null] - The third input.
   */
  constructor(e, t, s = null, i = null) {
    if (super(), (e === X.MAX || e === X.MIN) && arguments.length > 3) {
      let n = new X(e, t, s);
      for (let r = 2; r < arguments.length - 1; r++)
        n = new X(e, n, arguments[r]);
      t = n, s = arguments[arguments.length - 1], i = null;
    }
    this.method = e, this.aNode = t, this.bNode = s, this.cNode = i, this.isMathNode = true;
  }
  /**
   * The input type is inferred from the node types of the input nodes.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType(e) {
    const t = this.aNode.getNodeType(e), s = this.bNode ? this.bNode.getNodeType(e) : null, i = this.cNode ? this.cNode.getNodeType(e) : null, n = e.isMatrix(t) ? 0 : e.getTypeLength(t), r = e.isMatrix(s) ? 0 : e.getTypeLength(s), o = e.isMatrix(i) ? 0 : e.getTypeLength(i);
    return n > r && n > o ? t : r > o ? s : o > n ? i : t;
  }
  /**
   * The selected method as well as the input type determine the node type of this node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    const t = this.method;
    return t === X.LENGTH || t === X.DISTANCE || t === X.DOT ? "float" : t === X.CROSS ? "vec3" : t === X.ALL || t === X.ANY ? "bool" : t === X.EQUALS ? e.changeComponentType(this.aNode.getNodeType(e), "bool") : this.getInputType(e);
  }
  setup(e) {
    const { aNode: t, bNode: s, method: i } = this;
    let n = null;
    if (i === X.ONE_MINUS)
      n = bs(1, t);
    else if (i === X.RECIPROCAL)
      n = nn(1, t);
    else if (i === X.DIFFERENCE)
      n = ai(bs(t, s));
    else if (i === X.TRANSFORM_DIRECTION) {
      let r = t, o = s;
      e.isMatrix(r.getNodeType(e)) ? o = We(le(o), 0) : r = We(le(r), 0);
      const l = Ye(r, o).xyz;
      n = Fl(l);
    }
    return n !== null ? n : super.setup(e);
  }
  generate(e, t) {
    if (e.getNodeProperties(this).outputNode)
      return super.generate(e, t);
    let i = this.method;
    const n = this.getNodeType(e), r = this.getInputType(e), o = this.aNode, l = this.bNode, c = this.cNode, u = e.renderer.coordinateSystem;
    if (i === X.NEGATE)
      return e.format("( - " + o.build(e, r) + " )", n, t);
    {
      const h = [];
      return i === X.CROSS ? h.push(
        o.build(e, n),
        l.build(e, n)
      ) : u === Qs && i === X.STEP ? h.push(
        o.build(e, e.getTypeLength(o.getNodeType(e)) === 1 ? "float" : r),
        l.build(e, r)
      ) : u === Qs && (i === X.MIN || i === X.MAX) ? h.push(
        o.build(e, r),
        l.build(e, e.getTypeLength(l.getNodeType(e)) === 1 ? "float" : r)
      ) : i === X.REFRACT ? h.push(
        o.build(e, r),
        l.build(e, r),
        c.build(e, "float")
      ) : i === X.MIX ? h.push(
        o.build(e, r),
        l.build(e, r),
        c.build(e, e.getTypeLength(c.getNodeType(e)) === 1 ? "float" : r)
      ) : (u === yr && i === X.ATAN && l !== null && (i = "atan2"), e.shaderStage !== "fragment" && (i === X.DFDX || i === X.DFDY) && (console.warn(`THREE.TSL: '${i}' is not supported in the ${e.shaderStage} stage.`), i = "/*" + i + "*/"), h.push(o.build(e, r)), l !== null && h.push(l.build(e, r)), c !== null && h.push(c.build(e, r))), e.format(`${e.getMethod(i, n)}( ${h.join(", ")} )`, n, t);
    }
  }
  serialize(e) {
    super.serialize(e), e.method = this.method;
  }
  deserialize(e) {
    super.deserialize(e), this.method = e.method;
  }
}
X.ALL = "all";
X.ANY = "any";
X.RADIANS = "radians";
X.DEGREES = "degrees";
X.EXP = "exp";
X.EXP2 = "exp2";
X.LOG = "log";
X.LOG2 = "log2";
X.SQRT = "sqrt";
X.INVERSE_SQRT = "inversesqrt";
X.FLOOR = "floor";
X.CEIL = "ceil";
X.NORMALIZE = "normalize";
X.FRACT = "fract";
X.SIN = "sin";
X.COS = "cos";
X.TAN = "tan";
X.ASIN = "asin";
X.ACOS = "acos";
X.ATAN = "atan";
X.ABS = "abs";
X.SIGN = "sign";
X.LENGTH = "length";
X.NEGATE = "negate";
X.ONE_MINUS = "oneMinus";
X.DFDX = "dFdx";
X.DFDY = "dFdy";
X.ROUND = "round";
X.RECIPROCAL = "reciprocal";
X.TRUNC = "trunc";
X.FWIDTH = "fwidth";
X.TRANSPOSE = "transpose";
X.DETERMINANT = "determinant";
X.INVERSE = "inverse";
X.EQUALS = "equals";
X.MIN = "min";
X.MAX = "max";
X.STEP = "step";
X.REFLECT = "reflect";
X.DISTANCE = "distance";
X.DIFFERENCE = "difference";
X.DOT = "dot";
X.CROSS = "cross";
X.POW = "pow";
X.TRANSFORM_DIRECTION = "transformDirection";
X.MIX = "mix";
X.CLAMP = "clamp";
X.REFRACT = "refract";
X.SMOOTHSTEP = "smoothstep";
X.FACEFORWARD = "faceforward";
const jN = /* @__PURE__ */ ae(Math.PI), qN = /* @__PURE__ */ Re(X, X.ALL).setParameterLength(1), XN = /* @__PURE__ */ Re(X, X.ANY).setParameterLength(1), YN = /* @__PURE__ */ Re(X, X.RADIANS).setParameterLength(1), KN = /* @__PURE__ */ Re(X, X.DEGREES).setParameterLength(1), Cv = /* @__PURE__ */ Re(X, X.EXP).setParameterLength(1), Bl = /* @__PURE__ */ Re(X, X.EXP2).setParameterLength(1), Nv = /* @__PURE__ */ Re(X, X.LOG).setParameterLength(1), Dn = /* @__PURE__ */ Re(X, X.LOG2).setParameterLength(1), Pm = /* @__PURE__ */ Re(X, X.SQRT).setParameterLength(1), ZN = /* @__PURE__ */ Re(X, X.INVERSE_SQRT).setParameterLength(1), Jr = /* @__PURE__ */ Re(X, X.FLOOR).setParameterLength(1), Im = /* @__PURE__ */ Re(X, X.CEIL).setParameterLength(1), Fl = /* @__PURE__ */ Re(X, X.NORMALIZE).setParameterLength(1), _r = /* @__PURE__ */ Re(X, X.FRACT).setParameterLength(1), Ei = /* @__PURE__ */ Re(X, X.SIN).setParameterLength(1), nr = /* @__PURE__ */ Re(X, X.COS).setParameterLength(1), QN = /* @__PURE__ */ Re(X, X.TAN).setParameterLength(1), JN = /* @__PURE__ */ Re(X, X.ASIN).setParameterLength(1), Pv = /* @__PURE__ */ Re(X, X.ACOS).setParameterLength(1), Iv = /* @__PURE__ */ Re(X, X.ATAN).setParameterLength(1, 2), ai = /* @__PURE__ */ Re(X, X.ABS).setParameterLength(1), hh = /* @__PURE__ */ Re(X, X.SIGN).setParameterLength(1), Ln = /* @__PURE__ */ Re(X, X.LENGTH).setParameterLength(1), e2 = /* @__PURE__ */ Re(X, X.NEGATE).setParameterLength(1), t2 = /* @__PURE__ */ Re(X, X.ONE_MINUS).setParameterLength(1), Bv = /* @__PURE__ */ Re(X, X.DFDX).setParameterLength(1), Fv = /* @__PURE__ */ Re(X, X.DFDY).setParameterLength(1), s2 = /* @__PURE__ */ Re(X, X.ROUND).setParameterLength(1), i2 = /* @__PURE__ */ Re(X, X.RECIPROCAL).setParameterLength(1), n2 = /* @__PURE__ */ Re(X, X.TRUNC).setParameterLength(1), r2 = /* @__PURE__ */ Re(X, X.FWIDTH).setParameterLength(1), o2 = /* @__PURE__ */ Re(X, X.TRANSPOSE).setParameterLength(1), a2 = /* @__PURE__ */ Re(X, X.DETERMINANT).setParameterLength(1), l2 = /* @__PURE__ */ Re(X, X.INVERSE).setParameterLength(1), c2 = (a, e) => (console.warn('THREE.TSL: "equals" is deprecated. Use "equal" inside a vector instead, like: "bvec*( equal( ... ) )"'), Rv(a, e)), ya = /* @__PURE__ */ Re(X, X.MIN).setParameterLength(2, 1 / 0), xs = /* @__PURE__ */ Re(X, X.MAX).setParameterLength(2, 1 / 0), Dv = /* @__PURE__ */ Re(X, X.STEP).setParameterLength(2), u2 = /* @__PURE__ */ Re(X, X.REFLECT).setParameterLength(2), h2 = /* @__PURE__ */ Re(X, X.DISTANCE).setParameterLength(2), d2 = /* @__PURE__ */ Re(X, X.DIFFERENCE).setParameterLength(2), Bm = /* @__PURE__ */ Re(X, X.DOT).setParameterLength(2), Lv = /* @__PURE__ */ Re(X, X.CROSS).setParameterLength(2), Ph = /* @__PURE__ */ Re(X, X.POW).setParameterLength(2), Ov = (a) => Ye(a, a), f2 = (a) => Ye(a, a, a), p2 = (a) => Ye(a, a, a, a), m2 = /* @__PURE__ */ Re(X, X.TRANSFORM_DIRECTION).setParameterLength(2), g2 = (a) => Ye(hh(a), Ph(ai(a), 1 / 3)), Uv = (a) => Bm(a, a), It = /* @__PURE__ */ Re(X, X.MIX).setParameterLength(3), zn = (a, e = 0, t = 1) => pe(new X(X.CLAMP, pe(a), pe(e), pe(t))), kv = (a) => zn(a), zv = /* @__PURE__ */ Re(X, X.REFRACT).setParameterLength(3), xr = /* @__PURE__ */ Re(X, X.SMOOTHSTEP).setParameterLength(3), y2 = /* @__PURE__ */ Re(X, X.FACEFORWARD).setParameterLength(3), x2 = /* @__PURE__ */ he(([a]) => {
  const s = 43758.5453, i = Bm(a.xy, be(12.9898, 78.233)), n = Nm(i, jN);
  return _r(Ei(n).mul(s));
}), v2 = (a, e, t) => It(e, t, a), _2 = (a, e, t) => xr(e, t, a), T2 = (a, e) => Dv(e, a), b2 = (a, e) => (console.warn('THREE.TSL: "atan2" is overloaded. Use "atan" instead.'), Iv(a, e));
se("all", qN);
se("any", XN);
se("equals", c2);
se("radians", YN);
se("degrees", KN);
se("exp", Cv);
se("exp2", Bl);
se("log", Nv);
se("log2", Dn);
se("sqrt", Pm);
se("inverseSqrt", ZN);
se("floor", Jr);
se("ceil", Im);
se("normalize", Fl);
se("fract", _r);
se("sin", Ei);
se("cos", nr);
se("tan", QN);
se("asin", JN);
se("acos", Pv);
se("atan", Iv);
se("abs", ai);
se("sign", hh);
se("length", Ln);
se("lengthSq", Uv);
se("negate", e2);
se("oneMinus", t2);
se("dFdx", Bv);
se("dFdy", Fv);
se("round", s2);
se("reciprocal", i2);
se("trunc", n2);
se("fwidth", r2);
se("atan2", b2);
se("min", ya);
se("max", xs);
se("step", T2);
se("reflect", u2);
se("distance", h2);
se("dot", Bm);
se("cross", Lv);
se("pow", Ph);
se("pow2", Ov);
se("pow3", f2);
se("pow4", p2);
se("transformDirection", m2);
se("mix", v2);
se("clamp", zn);
se("refract", zv);
se("smoothstep", _2);
se("faceForward", y2);
se("difference", d2);
se("saturate", kv);
se("cbrt", g2);
se("transpose", o2);
se("determinant", a2);
se("inverse", l2);
se("rand", x2);
class w2 extends Ie {
  static get type() {
    return "ConditionalNode";
  }
  /**
   * Constructs a new conditional node.
   *
   * @param {Node} condNode - The node that defines the condition.
   * @param {Node} ifNode - The node that is evaluate when the condition ends up `true`.
   * @param {?Node} [elseNode=null] - The node that is evaluate when the condition ends up `false`.
   */
  constructor(e, t, s = null) {
    super(), this.condNode = e, this.ifNode = t, this.elseNode = s;
  }
  /**
   * This method is overwritten since the node type is inferred from the if/else
   * nodes.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    const { ifNode: t, elseNode: s } = e.getNodeProperties(this);
    if (t === void 0)
      return e.flowBuildStage(this, "setup"), this.getNodeType(e);
    const i = t.getNodeType(e);
    if (s !== null) {
      const n = s.getNodeType(e);
      if (e.getTypeLength(n) > e.getTypeLength(i))
        return n;
    }
    return i;
  }
  setup(e) {
    const t = this.condNode.cache(), s = this.ifNode.cache(), i = this.elseNode ? this.elseNode.cache() : null, n = e.context.nodeBlock;
    e.getDataFromNode(s).parentNodeBlock = n, i !== null && (e.getDataFromNode(i).parentNodeBlock = n);
    const r = e.context.uniformFlow, o = e.getNodeProperties(this);
    o.condNode = t, o.ifNode = r ? s : s.context({ nodeBlock: s }), o.elseNode = i ? r ? i : i.context({ nodeBlock: i }) : null;
  }
  generate(e, t) {
    const s = this.getNodeType(e), i = e.getDataFromNode(this);
    if (i.nodeProperty !== void 0)
      return i.nodeProperty;
    const { condNode: n, ifNode: r, elseNode: o } = e.getNodeProperties(this), l = e.currentFunctionNode, c = t !== "void", u = c ? pr(s).build(e) : "";
    i.nodeProperty = u;
    const h = n.build(e, "bool");
    if (e.context.uniformFlow && o !== null) {
      const p = r.build(e, s), m3 = o.build(e, s), g = e.getTernary(h, p, m3);
      return e.format(g, s, t);
    }
    e.addFlowCode(`
${e.tab}if ( ${h} ) {

`).addFlowTab();
    let d = r.build(e, s);
    if (d && (c ? d = u + " = " + d + ";" : (d = "return " + d + ";", l === null && (console.warn("THREE.TSL: Return statement used in an inline 'Fn()'. Define a layout struct to allow return values."), d = "// " + d))), e.removeFlowTab().addFlowCode(e.tab + "	" + d + `

` + e.tab + "}"), o !== null) {
      e.addFlowCode(` else {

`).addFlowTab();
      let p = o.build(e, s);
      p && (c ? p = u + " = " + p + ";" : (p = "return " + p + ";", l === null && (console.warn("THREE.TSL: Return statement used in an inline 'Fn()'. Define a layout struct to allow return values."), p = "// " + p))), e.removeFlowTab().addFlowCode(e.tab + "	" + p + `

` + e.tab + `}

`);
    } else
      e.addFlowCode(`

`);
    return e.format(u, s, t);
  }
}
const Ss = /* @__PURE__ */ ut(w2).setParameterLength(2, 3);
se("select", Ss);
class Gv extends Ie {
  static get type() {
    return "ContextNode";
  }
  /**
   * Constructs a new context node.
   *
   * @param {Node} node - The node whose context should be modified.
   * @param {Object} [value={}] - The modified context data.
   */
  constructor(e, t = {}) {
    super(), this.isContextNode = true, this.node = e, this.value = t;
  }
  /**
   * This method is overwritten to ensure it returns the reference to {@link ContextNode#node}.
   *
   * @return {Node} A reference to {@link ContextNode#node}.
   */
  getScope() {
    return this.node.getScope();
  }
  /**
   * This method is overwritten to ensure it returns the type of {@link ContextNode#node}.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.node.getNodeType(e);
  }
  /**
   * This method is overwritten to ensure it returns the member type of {@link ContextNode#node}.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} name - The member name.
   * @returns {string} The member type.
   */
  getMemberType(e, t) {
    return this.node.getMemberType(e, t);
  }
  analyze(e) {
    const t = e.getContext();
    e.setContext({ ...e.context, ...this.value }), this.node.build(e), e.setContext(t);
  }
  setup(e) {
    const t = e.getContext();
    e.setContext({ ...e.context, ...this.value }), this.node.build(e), e.setContext(t);
  }
  generate(e, t) {
    const s = e.getContext();
    e.setContext({ ...e.context, ...this.value });
    const i = this.node.build(e, t);
    return e.setContext(s), i;
  }
}
const Ih = /* @__PURE__ */ ut(Gv).setParameterLength(1, 2), S2 = (a) => Ih(a, { uniformFlow: true }), Vv = (a, e) => Ih(a, { nodeName: e });
function M2(a, e) {
  return console.warn('THREE.TSL: "label()" has been deprecated. Use "setName()" instead.'), Vv(a, e);
}
se("context", Ih);
se("label", M2);
se("uniformFlow", S2);
se("setName", Vv);
class pu extends Ie {
  static get type() {
    return "VarNode";
  }
  /**
   * Constructs a new variable node.
   *
   * @param {Node} node - The node for which a variable should be created.
   * @param {?string} [name=null] - The name of the variable in the shader.
   * @param {boolean} [readOnly=false] - The read-only flag.
   */
  constructor(e, t = null, s = false) {
    super(), this.node = e, this.name = t, this.global = true, this.isVarNode = true, this.readOnly = s, this.parents = true, this.intent = false;
  }
  /**
   * Sets the intent flag for this node.
   *
   * This flag is used to indicate that this node is used for intent
   * and should not be built directly. Instead, it is used to indicate that
   * the node should be treated as a variable intent.
   *
   * It's useful for assigning variables without needing creating a new variable node.
   *
   * @param {boolean} value - The value to set for the intent flag.
   * @returns {VarNode} This node.
   */
  setIntent(e) {
    return this.intent = e, this;
  }
  /**
   * Returns the intent flag of this node.
   *
   * @return {boolean} The intent flag.
   */
  getIntent() {
    return this.intent;
  }
  getMemberType(e, t) {
    return this.node.getMemberType(e, t);
  }
  getElementType(e) {
    return this.node.getElementType(e);
  }
  getNodeType(e) {
    return this.node.getNodeType(e);
  }
  getArrayCount(e) {
    return this.node.getArrayCount(e);
  }
  build(...e) {
    return this.intent === true && e[0].getNodeProperties(this).assign !== true ? this.node.build(...e) : super.build(...e);
  }
  generate(e) {
    const { node: t, name: s, readOnly: i } = this, { renderer: n } = e, r = n.backend.isWebGPUBackend === true;
    let o = false, l = false;
    i && (o = e.isDeterministic(t), l = r ? i : o);
    const c = e.getVectorType(this.getNodeType(e)), u = t.build(e, c), h = e.getVarFromNode(this, s, c, void 0, l), f = e.getPropertyName(h);
    let d = f;
    if (l)
      if (r)
        d = o ? `const ${f}` : `let ${f}`;
      else {
        const p = t.getArrayCount(e);
        d = `const ${e.getVar(h.type, f, p)}`;
      }
    return e.addLineFlowCode(`${d} = ${u}`, this), f;
  }
}
const Fm = /* @__PURE__ */ ut(pu), A2 = (a, e = null) => Fm(a, e).toStack(), E2 = (a, e = null) => Fm(a, e, true).toStack(), R2 = (a) => a;
se("toVar", A2);
se("toConst", E2);
se("toVarIntent", R2);
class C2 extends Ie {
  static get type() {
    return "SubBuild";
  }
  constructor(e, t, s = null) {
    super(s), this.node = e, this.name = t, this.isSubBuildNode = true;
  }
  getNodeType(e) {
    if (this.nodeType !== null) return this.nodeType;
    e.addSubBuild(this.name);
    const t = this.node.getNodeType(e);
    return e.removeSubBuild(), t;
  }
  build(e, ...t) {
    e.addSubBuild(this.name);
    const s = this.node.build(e, ...t);
    return e.removeSubBuild(), s;
  }
}
const bl = (a, e, t = null) => pe(new C2(pe(a), e, t));
class N2 extends Ie {
  static get type() {
    return "VaryingNode";
  }
  /**
   * Constructs a new varying node.
   *
   * @param {Node} node - The node for which a varying should be created.
   * @param {?string} name - The name of the varying in the shader.
   */
  constructor(e, t = null) {
    super(), this.node = e, this.name = t, this.isVaryingNode = true, this.interpolationType = null, this.interpolationSampling = null, this.global = true;
  }
  /**
   * Defines the interpolation type of the varying.
   *
   * @param {string} type - The interpolation type.
   * @param {?string} sampling - The interpolation sampling type
   * @return {VaryingNode} A reference to this node.
   */
  setInterpolation(e, t = null) {
    return this.interpolationType = e, this.interpolationSampling = t, this;
  }
  getHash(e) {
    return this.name || super.getHash(e);
  }
  getNodeType(e) {
    return this.node.getNodeType(e);
  }
  /**
   * This method performs the setup of a varying node with the current node builder.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {NodeVarying} The node varying from the node builder.
   */
  setupVarying(e) {
    const t = e.getNodeProperties(this);
    let s = t.varying;
    if (s === void 0) {
      const i = this.name, n = this.getNodeType(e), r = this.interpolationType, o = this.interpolationSampling;
      t.varying = s = e.getVaryingFromNode(this, i, n, r, o), t.node = bl(this.node, "VERTEX");
    }
    return s.needsInterpolation || (s.needsInterpolation = e.shaderStage === "fragment"), s;
  }
  setup(e) {
    this.setupVarying(e), e.flowNodeFromShaderStage(Hc.VERTEX, this.node);
  }
  analyze(e) {
    this.setupVarying(e), e.flowNodeFromShaderStage(Hc.VERTEX, this.node);
  }
  generate(e) {
    const t = e.getSubBuildProperty("property", e.currentStack), s = e.getNodeProperties(this), i = this.setupVarying(e);
    if (s[t] === void 0) {
      const n = this.getNodeType(e), r = e.getPropertyName(i, Hc.VERTEX);
      e.flowNodeFromShaderStage(Hc.VERTEX, s.node, n, r), s[t] = r;
    }
    return e.getPropertyName(i);
  }
}
const Tr = /* @__PURE__ */ ut(N2).setParameterLength(1, 2), P2 = (a) => Tr(a);
se("toVarying", Tr);
se("toVertexStage", P2);
se("varying", (...a) => (console.warn("THREE.TSL: .varying() has been renamed to .toVarying()."), Tr(...a)));
se("vertexStage", (...a) => (console.warn("THREE.TSL: .vertexStage() has been renamed to .toVertexStage()."), Tr(...a)));
const I2 = /* @__PURE__ */ he(([a]) => {
  const e = a.mul(0.9478672986).add(0.0521327014).pow(2.4), t = a.mul(0.0773993808), s = a.lessThanEqual(0.04045);
  return It(e, t, s);
}).setLayout({
  name: "sRGBTransferEOTF",
  type: "vec3",
  inputs: [
    { name: "color", type: "vec3" }
  ]
}), B2 = /* @__PURE__ */ he(([a]) => {
  const e = a.pow(0.41666).mul(1.055).sub(0.055), t = a.mul(12.92), s = a.lessThanEqual(31308e-7);
  return It(e, t, s);
}).setLayout({
  name: "sRGBTransferOETF",
  type: "vec3",
  inputs: [
    { name: "color", type: "vec3" }
  ]
}), Dm = "WorkingColorSpace", F2 = "OutputColorSpace";
class Hv extends es {
  static get type() {
    return "ColorSpaceNode";
  }
  /**
   * Constructs a new color space node.
   *
   * @param {Node} colorNode - Represents the color to convert.
   * @param {string} source - The source color space.
   * @param {string} target - The target color space.
   */
  constructor(e, t, s) {
    super("vec4"), this.colorNode = e, this.source = t, this.target = s;
  }
  /**
   * This method resolves the constants `WORKING_COLOR_SPACE` and
   * `OUTPUT_COLOR_SPACE` based on the current configuration of the
   * color management and renderer.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} colorSpace - The color space to resolve.
   * @return {string} The resolved color space.
   */
  resolveColorSpace(e, t) {
    return t === Dm ? yt.workingColorSpace : t === F2 ? e.context.outputColorSpace || e.renderer.outputColorSpace : t;
  }
  setup(e) {
    const { colorNode: t } = this, s = this.resolveColorSpace(e, this.source), i = this.resolveColorSpace(e, this.target);
    let n = t;
    return yt.enabled === false || s === i || !s || !i || (yt.getTransfer(s) === ze && (n = We(I2(n.rgb), n.a)), yt.getPrimaries(s) !== yt.getPrimaries(i) && (n = We(
      Es2(yt._getMatrix(new zs(), s, i)).mul(n.rgb),
      n.a
    )), yt.getTransfer(i) === ze && (n = We(B2(n.rgb), n.a))), n;
  }
}
const D2 = (a, e) => pe(new Hv(pe(a), Dm, e)), Lm = (a, e) => pe(new Hv(pe(a), e, Dm));
se("workingToColorSpace", D2);
se("colorSpaceToWorking", Lm);
let L2 = class extends ql {
  static get type() {
    return "ReferenceElementNode";
  }
  /**
   * Constructs a new reference element node.
   *
   * @param {ReferenceBaseNode} referenceNode - The reference node.
   * @param {Node} indexNode - The index node that defines the element access.
   */
  constructor(e, t) {
    super(e, t), this.referenceNode = e, this.isReferenceElementNode = true;
  }
  /**
   * This method is overwritten since the node type is inferred from
   * the uniform type of the reference node.
   *
   * @return {string} The node type.
   */
  getNodeType() {
    return this.referenceNode.uniformType;
  }
  generate(e) {
    const t = super.generate(e), s = this.referenceNode.getNodeType(), i = this.getNodeType();
    return e.format(t, s, i);
  }
};
class $v extends Ie {
  static get type() {
    return "ReferenceBaseNode";
  }
  /**
   * Constructs a new reference base node.
   *
   * @param {string} property - The name of the property the node refers to.
   * @param {string} uniformType - The uniform type that should be used to represent the property value.
   * @param {?Object} [object=null] - The object the property belongs to.
   * @param {?number} [count=null] - When the linked property is an array-like, this parameter defines its length.
   */
  constructor(e, t, s = null, i = null) {
    super(), this.property = e, this.uniformType = t, this.object = s, this.count = i, this.properties = e.split("."), this.reference = s, this.node = null, this.group = null, this.updateType = Xe.OBJECT;
  }
  /**
   * Sets the uniform group for this reference node.
   *
   * @param {UniformGroupNode} group - The uniform group to set.
   * @return {ReferenceBaseNode} A reference to this node.
   */
  setGroup(e) {
    return this.group = e, this;
  }
  /**
   * When the referred property is array-like, this method can be used
   * to access elements via an index node.
   *
   * @param {IndexNode} indexNode - indexNode.
   * @return {ReferenceElementNode} A reference to an element.
   */
  element(e) {
    return pe(new L2(this, pe(e)));
  }
  /**
   * Sets the node type which automatically defines the internal
   * uniform type.
   *
   * @param {string} uniformType - The type to set.
   */
  setNodeType(e) {
    const t = Ue(null, e);
    this.group !== null && t.setGroup(this.group), this.node = t;
  }
  /**
   * This method is overwritten since the node type is inferred from
   * the type of the reference node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.node === null && (this.updateReference(e), this.updateValue()), this.node.getNodeType(e);
  }
  /**
   * Returns the property value from the given referred object.
   *
   * @param {Object} [object=this.reference] - The object to retrieve the property value from.
   * @return {any} The value.
   */
  getValueFromReference(e = this.reference) {
    const { properties: t } = this;
    let s = e[t[0]];
    for (let i = 1; i < t.length; i++)
      s = s[t[i]];
    return s;
  }
  /**
   * Allows to update the reference based on the given state. The state is only
   * evaluated {@link ReferenceBaseNode#object} is not set.
   *
   * @param {(NodeFrame|NodeBuilder)} state - The current state.
   * @return {Object} The updated reference.
   */
  updateReference(e) {
    return this.reference = this.object !== null ? this.object : e.object, this.reference;
  }
  /**
   * The output of the reference node is the internal uniform node.
   *
   * @return {UniformNode} The output node.
   */
  setup() {
    return this.updateValue(), this.node;
  }
  /**
   * Overwritten to update the internal uniform value.
   *
   * @param {NodeFrame} frame - A reference to the current node frame.
   */
  update() {
    this.updateValue();
  }
  /**
   * Retrieves the value from the referred object property and uses it
   * to updated the internal uniform.
   */
  updateValue() {
    this.node === null && this.setNodeType(this.uniformType);
    const e = this.getValueFromReference();
    Array.isArray(e) ? this.node.array = e : this.node.value = e;
  }
}
class U2 extends $v {
  static get type() {
    return "RendererReferenceNode";
  }
  /**
   * Constructs a new renderer reference node.
   *
   * @param {string} property - The name of the property the node refers to.
   * @param {string} inputType - The uniform type that should be used to represent the property value.
   * @param {?Renderer} [renderer=null] - The renderer the property belongs to. When no renderer is set,
   * the node refers to the renderer of the current state.
   */
  constructor(e, t, s = null) {
    super(e, t, s), this.renderer = s, this.setGroup(De);
  }
  /**
   * Updates the reference based on the given state. The state is only evaluated
   * {@link RendererReferenceNode#renderer} is not set.
   *
   * @param {(NodeFrame|NodeBuilder)} state - The current state.
   * @return {Object} The updated reference.
   */
  updateReference(e) {
    return this.reference = this.renderer !== null ? this.renderer : e.renderer, this.reference;
  }
}
const k2 = (a, e, t = null) => pe(new U2(a, e, t));
class z2 extends es {
  static get type() {
    return "ToneMappingNode";
  }
  /**
   * Constructs a new tone mapping node.
   *
   * @param {number} toneMapping - The tone mapping type.
   * @param {Node} exposureNode - The tone mapping exposure.
   * @param {Node} [colorNode=null] - The color node to process.
   */
  constructor(e, t = V2, s = null) {
    super("vec3"), this.toneMapping = e, this.exposureNode = t, this.colorNode = s;
  }
  /**
   * Overwrites the default `customCacheKey()` implementation by including the tone
   * mapping type into the cache key.
   *
   * @return {number} The hash.
   */
  customCacheKey() {
    return ih(this.toneMapping);
  }
  setup(e) {
    const t = this.colorNode || e.context.color, s = this.toneMapping;
    if (s === ta) return t;
    let i = null;
    const n = e.renderer.library.getToneMappingFunction(s);
    return n !== null ? i = We(n(t.rgb, this.exposureNode), t.a) : (console.error("ToneMappingNode: Unsupported Tone Mapping configuration.", s), i = t), i;
  }
}
const G2 = (a, e, t) => pe(new z2(a, pe(e), pe(t))), V2 = /* @__PURE__ */ k2("toneMappingExposure", "float");
se("toneMapping", (a, e, t) => G2(e, t, a));
class H2 extends vm {
  static get type() {
    return "BufferAttributeNode";
  }
  /**
   * Constructs a new buffer attribute node.
   *
   * @param {BufferAttribute|InterleavedBuffer|TypedArray} value - The attribute data.
   * @param {?string} [bufferType=null] - The buffer type (e.g. `'vec3'`).
   * @param {number} [bufferStride=0] - The buffer stride.
   * @param {number} [bufferOffset=0] - The buffer offset.
   */
  constructor(e, t = null, s = 0, i = 0) {
    super(e, t), this.isBufferNode = true, this.bufferType = t, this.bufferStride = s, this.bufferOffset = i, this.usage = sh, this.instanced = false, this.attribute = null, this.global = true, e && e.isBufferAttribute === true && (this.attribute = e, this.usage = e.usage, this.instanced = e.isInstancedBufferAttribute);
  }
  /**
   * This method is overwritten since the attribute data might be shared
   * and thus the hash should be shared as well.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The hash.
   */
  getHash(e) {
    if (this.bufferStride === 0 && this.bufferOffset === 0) {
      let t = e.globalCache.getData(this.value);
      return t === void 0 && (t = {
        node: this
      }, e.globalCache.setData(this.value, t)), t.node.uuid;
    }
    return this.uuid;
  }
  /**
   * This method is overwritten since the node type is inferred from
   * the buffer attribute.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.bufferType === null && (this.bufferType = e.getTypeFromAttribute(this.attribute)), this.bufferType;
  }
  /**
   * Depending on which value was passed to the node, `setup()` behaves
   * differently. If no instance of `BufferAttribute` was passed, the method
   * creates an internal attribute and configures it respectively.
   *
   * @param {NodeBuilder} builder - The current node builder.
   */
  setup(e) {
    if (this.attribute !== null) return;
    const t = this.getNodeType(e), s = this.value, i = e.getTypeLength(t), n = this.bufferStride || i, r = this.bufferOffset, o = s.isInterleavedBuffer === true ? s : new hv(s, n), l = new lm(o, i, r);
    o.setUsage(this.usage), this.attribute = l, this.attribute.isInstancedBufferAttribute = this.instanced;
  }
  /**
   * Generates the code snippet of the buffer attribute node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The generated code snippet.
   */
  generate(e) {
    const t = this.getNodeType(e), s = e.getBufferAttributeFromNode(this, t), i = e.getPropertyName(s);
    let n = null;
    return e.shaderStage === "vertex" || e.shaderStage === "compute" ? (this.name = i, n = i) : n = Tr(this).build(e, t), n;
  }
  /**
   * Overwrites the default implementation to return a fixed value `'bufferAttribute'`.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType() {
    return "bufferAttribute";
  }
  /**
   * Sets the `usage` property to the given value.
   *
   * @param {number} value - The usage to set.
   * @return {BufferAttributeNode} A reference to this node.
   */
  setUsage(e) {
    return this.usage = e, this.attribute && this.attribute.isBufferAttribute === true && (this.attribute.usage = e), this;
  }
  /**
   * Sets the `instanced` property to the given value.
   *
   * @param {boolean} value - The value to set.
   * @return {BufferAttributeNode} A reference to this node.
   */
  setInstanced(e) {
    return this.instanced = e, this;
  }
}
const Om = (a, e = null, t = 0, s = 0) => pe(new H2(a, e, t, s));
se("toAttribute", (a) => Om(a.value));
class W2 extends Ie {
  static get type() {
    return "ComputeNode";
  }
  /**
   * Constructs a new compute node.
   *
   * @param {Node} computeNode - TODO
   * @param {Array<number>} workgroupSize - TODO.
   */
  constructor(e, t) {
    super("void"), this.isComputeNode = true, this.computeNode = e, this.workgroupSize = t, this.count = null, this.version = 1, this.name = "", this.updateBeforeType = Xe.OBJECT, this.onInitFunction = null;
  }
  setCount(e) {
    return this.count = e, this;
  }
  getCount() {
    return this.count;
  }
  /**
   * Executes the `dispose` event for this node.
   */
  dispose() {
    this.dispatchEvent({ type: "dispose" });
  }
  /**
   * Sets the {@link ComputeNode#name} property.
   *
   * @param {string} name - The name of the uniform.
   * @return {ComputeNode} A reference to this node.
   */
  setName(e) {
    return this.name = e, this;
  }
  /**
   * Sets the {@link ComputeNode#name} property.
   *
   * @deprecated
   * @param {string} name - The name of the uniform.
   * @return {ComputeNode} A reference to this node.
   */
  label(e) {
    return console.warn('THREE.TSL: "label()" has been deprecated. Use "setName()" instead.'), this.setName(e);
  }
  /**
   * TODO
   *
   * @param {Function} callback - TODO.
   * @return {ComputeNode} A reference to this node.
   */
  onInit(e) {
    return this.onInitFunction = e, this;
  }
  /**
   * The method execute the compute for this node.
   *
   * @param {NodeFrame} frame - A reference to the current node frame.
   */
  updateBefore({ renderer: e }) {
    e.compute(this);
  }
  setup(e) {
    const t = this.computeNode.build(e);
    if (t) {
      const s = e.getNodeProperties(this);
      s.outputComputeNode = t.outputNode, t.outputNode = null;
    }
    return t;
  }
  generate(e, t) {
    const { shaderStage: s } = e;
    if (s === "compute") {
      const i = this.computeNode.build(e, "void");
      i !== "" && e.addLineFlowCode(i, this);
    } else {
      const n = e.getNodeProperties(this).outputComputeNode;
      if (n)
        return n.build(e, t);
    }
  }
}
const Wv = (a, e = [64]) => {
  (e.length === 0 || e.length > 3) && console.error("THREE.TSL: compute() workgroupSize must have 1, 2, or 3 elements");
  for (let t = 0; t < e.length; t++) {
    const s = e[t];
    (typeof s != "number" || s <= 0 || !Number.isInteger(s)) && console.error(`THREE.TSL: compute() workgroupSize element at index [ ${t} ] must be a positive integer`);
  }
  for (; e.length < 3; ) e.push(1);
  return pe(new W2(pe(a), e));
}, j2 = (a, e, t) => Wv(a, t).setCount(e);
se("compute", j2);
se("computeKernel", Wv);
class q2 extends Ie {
  static get type() {
    return "CacheNode";
  }
  /**
   * Constructs a new cache node.
   *
   * @param {Node} node - The node that should be cached.
   * @param {boolean} [parent=true] - Whether this node refers to a shared parent cache or not.
   */
  constructor(e, t = true) {
    super(), this.node = e, this.parent = t, this.isCacheNode = true;
  }
  getNodeType(e) {
    const t = e.getCache(), s = e.getCacheFromNode(this, this.parent);
    e.setCache(s);
    const i = this.node.getNodeType(e);
    return e.setCache(t), i;
  }
  build(e, ...t) {
    const s = e.getCache(), i = e.getCacheFromNode(this, this.parent);
    e.setCache(i);
    const n = this.node.build(e, ...t);
    return e.setCache(s), n;
  }
}
const mu = (a, e) => pe(new q2(pe(a), e));
se("cache", mu);
class X2 extends Ie {
  static get type() {
    return "BypassNode";
  }
  /**
   * Constructs a new bypass node.
   *
   * @param {Node} outputNode - The output node.
   * @param {Node} callNode - The call node.
   */
  constructor(e, t) {
    super(), this.isBypassNode = true, this.outputNode = e, this.callNode = t;
  }
  getNodeType(e) {
    return this.outputNode.getNodeType(e);
  }
  generate(e) {
    const t = this.callNode.build(e, "void");
    return t !== "" && e.addLineFlowCode(t, this), this.outputNode.build(e);
  }
}
const Y2 = /* @__PURE__ */ ut(X2).setParameterLength(2);
se("bypass", Y2);
class jv extends Ie {
  static get type() {
    return "RemapNode";
  }
  /**
   * Constructs a new remap node.
   *
   * @param {Node} node - The node that should be remapped.
   * @param {Node} inLowNode - The source or current lower bound of the range.
   * @param {Node} inHighNode - The source or current upper bound of the range.
   * @param {Node} [outLowNode=float(0)] - The target lower bound of the range.
   * @param {Node} [outHighNode=float(1)] - The target upper bound of the range.
   */
  constructor(e, t, s, i = ae(0), n = ae(1)) {
    super(), this.node = e, this.inLowNode = t, this.inHighNode = s, this.outLowNode = i, this.outHighNode = n, this.doClamp = true;
  }
  setup() {
    const { node: e, inLowNode: t, inHighNode: s, outLowNode: i, outHighNode: n, doClamp: r } = this;
    let o = e.sub(t).div(s.sub(t));
    return r === true && (o = o.clamp()), o.mul(n.sub(i)).add(i);
  }
}
const K2 = /* @__PURE__ */ ut(jv, null, null, { doClamp: false }).setParameterLength(3, 5), Z2 = /* @__PURE__ */ ut(jv).setParameterLength(3, 5);
se("remap", K2);
se("remapClamp", Z2);
class gu extends Ie {
  static get type() {
    return "ExpressionNode";
  }
  /**
   * Constructs a new expression node.
   *
   * @param {string} [snippet=''] - The native code snippet.
   * @param {string} [nodeType='void'] - The node type.
   */
  constructor(e = "", t = "void") {
    super(t), this.snippet = e;
  }
  generate(e, t) {
    const s = this.getNodeType(e), i = this.snippet;
    if (s === "void")
      e.addLineFlowCode(i, this);
    else
      return e.format(i, s, t);
  }
}
const xa = /* @__PURE__ */ ut(gu).setParameterLength(1, 2), Q2 = (a) => (a ? Ss(a, xa("discard")) : xa("discard")).toStack();
se("discard", Q2);
class J2 extends es {
  static get type() {
    return "RenderOutputNode";
  }
  /**
   * Constructs a new render output node.
   *
   * @param {Node} colorNode - The color node to process.
   * @param {?number} toneMapping - The tone mapping type.
   * @param {?string} outputColorSpace - The output color space.
   */
  constructor(e, t, s) {
    super("vec4"), this.colorNode = e, this.toneMapping = t, this.outputColorSpace = s, this.isRenderOutputNode = true;
  }
  setup({ context: e }) {
    let t = this.colorNode || e.color;
    const s = (this.toneMapping !== null ? this.toneMapping : e.toneMapping) || ta, i = (this.outputColorSpace !== null ? this.outputColorSpace : e.outputColorSpace) || gr;
    return s !== ta && (t = t.toneMapping(s)), i !== gr && i !== yt.workingColorSpace && (t = t.workingToColorSpace(i)), t;
  }
}
const eP = (a, e = null, t = null) => pe(new J2(pe(a), e, t));
se("renderOutput", eP);
class tP extends es {
  static get type() {
    return "DebugNode";
  }
  constructor(e, t = null) {
    super(), this.node = e, this.callback = t;
  }
  getNodeType(e) {
    return this.node.getNodeType(e);
  }
  setup(e) {
    return this.node.build(e);
  }
  analyze(e) {
    return this.node.build(e);
  }
  generate(e) {
    const t = this.callback, s = this.node.build(e), i = "--- TSL debug - " + e.shaderStage + " shader ---", n = "-".repeat(i.length);
    let r = "";
    return r += "// #" + i + `#
`, r += e.flow.code.replace(/^\t/mg, "") + `
`, r += "/* ... */ " + s + ` /* ... */
`, r += "// #" + n + `#
`, t !== null ? t(e, r) : console.log(r), s;
  }
}
const sP = (a, e = null) => pe(new tP(pe(a), e)).toStack();
se("debug", sP);
class qv extends Ie {
  static get type() {
    return "AttributeNode";
  }
  /**
   * Constructs a new attribute node.
   *
   * @param {string} attributeName - The name of the attribute.
   * @param {?string} nodeType - The node type.
   */
  constructor(e, t = null) {
    super(t), this.global = true, this._attributeName = e;
  }
  getHash(e) {
    return this.getAttributeName(e);
  }
  getNodeType(e) {
    let t = this.nodeType;
    if (t === null) {
      const s = this.getAttributeName(e);
      if (e.hasGeometryAttribute(s)) {
        const i = e.geometry.getAttribute(s);
        t = e.getTypeFromAttribute(i);
      } else
        t = "float";
    }
    return t;
  }
  /**
   * Sets the attribute name to the given value. The method can be
   * overwritten in derived classes if the final name must be computed
   * analytically.
   *
   * @param {string} attributeName - The name of the attribute.
   * @return {AttributeNode} A reference to this node.
   */
  setAttributeName(e) {
    return this._attributeName = e, this;
  }
  /**
   * Returns the attribute name of this node. The method can be
   * overwritten in derived classes if the final name must be computed
   * analytically.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The attribute name.
   */
  getAttributeName() {
    return this._attributeName;
  }
  generate(e) {
    const t = this.getAttributeName(e), s = this.getNodeType(e);
    if (e.hasGeometryAttribute(t) === true) {
      const n = e.geometry.getAttribute(t), r = e.getTypeFromAttribute(n), o = e.getAttribute(t, r);
      return e.shaderStage === "vertex" ? e.format(o.name, r, s) : Tr(this).build(e, s);
    } else
      return console.warn(`AttributeNode: Vertex attribute "${t}" not found on geometry.`), e.generateConst(s);
  }
  serialize(e) {
    super.serialize(e), e.global = this.global, e._attributeName = this._attributeName;
  }
  deserialize(e) {
    super.deserialize(e), this.global = e.global, this._attributeName = e._attributeName;
  }
}
const vr = (a, e = null) => pe(new qv(a, e)), Yl = (a = 0) => vr("uv" + (a > 0 ? a : ""), "vec2");
class iP extends Ie {
  static get type() {
    return "TextureSizeNode";
  }
  /**
   * Constructs a new texture size node.
   *
   * @param {TextureNode} textureNode - A texture node which size should be retrieved.
   * @param {?Node<int>} [levelNode=null] - A level node which defines the requested mip.
   */
  constructor(e, t = null) {
    super("uvec2"), this.isTextureSizeNode = true, this.textureNode = e, this.levelNode = t;
  }
  generate(e, t) {
    const s = this.textureNode.build(e, "property"), i = this.levelNode === null ? "0" : this.levelNode.build(e, "int");
    return e.format(`${e.getMethod("textureDimensions")}( ${s}, ${i} )`, this.getNodeType(e), t);
  }
}
const la = /* @__PURE__ */ ut(iP).setParameterLength(1, 2);
class nP extends Xl {
  static get type() {
    return "MaxMipLevelNode";
  }
  /**
   * Constructs a new max mip level node.
   *
   * @param {TextureNode} textureNode - The texture node to compute the max mip level for.
   */
  constructor(e) {
    super(0), this._textureNode = e, this.updateType = Xe.FRAME;
  }
  /**
   * The texture node to compute the max mip level for.
   *
   * @readonly
   * @type {TextureNode}
   */
  get textureNode() {
    return this._textureNode;
  }
  /**
   * The texture.
   *
   * @readonly
   * @type {Texture}
   */
  get texture() {
    return this._textureNode.value;
  }
  update() {
    const e = this.texture, t = e.images, s = t && t.length > 0 ? t[0] && t[0].image || t[0] : e.image;
    if (s && s.width !== void 0) {
      const { width: i, height: n } = s;
      this.value = Math.log2(Math.max(i, n));
    }
  }
}
const rP = /* @__PURE__ */ ut(nP).setParameterLength(1), Xv = /* @__PURE__ */ new ys();
class Ea extends Xl {
  static get type() {
    return "TextureNode";
  }
  /**
   * Constructs a new texture node.
   *
   * @param {Texture} [value=EmptyTexture] - The texture.
   * @param {?Node<vec2|vec3>} [uvNode=null] - The uv node.
   * @param {?Node<int>} [levelNode=null] - The level node.
   * @param {?Node<float>} [biasNode=null] - The bias node.
   */
  constructor(e = Xv, t = null, s = null, i = null) {
    super(e), this.isTextureNode = true, this.uvNode = t, this.levelNode = s, this.biasNode = i, this.compareNode = null, this.depthNode = null, this.gradNode = null, this.offsetNode = null, this.sampler = true, this.updateMatrix = false, this.updateType = Xe.NONE, this.referenceNode = null, this._value = e, this._matrixUniform = null, this.setUpdateMatrix(t === null);
  }
  set value(e) {
    this.referenceNode ? this.referenceNode.value = e : this._value = e;
  }
  /**
   * The texture value.
   *
   * @type {Texture}
   */
  get value() {
    return this.referenceNode ? this.referenceNode.value : this._value;
  }
  /**
   * Overwritten since the uniform hash is defined by the texture's UUID.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The uniform hash.
   */
  getUniformHash() {
    return this.value.uuid;
  }
  /**
   * Overwritten since the node type is inferred from the texture type.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType() {
    return this.value.isDepthTexture === true ? "float" : this.value.type === zt ? "uvec4" : this.value.type === fs ? "ivec4" : "vec4";
  }
  /**
   * Overwrites the default implementation to return a fixed value `'texture'`.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType() {
    return "texture";
  }
  /**
   * Returns a default uvs based on the current texture's channel.
   *
   * @return {AttributeNode<vec2>} The default uvs.
   */
  getDefaultUV() {
    return Yl(this.value.channel);
  }
  /**
   * Overwritten to always return the texture reference of the node.
   *
   * @param {any} state - This method can be invocated in different contexts so `state` can refer to any object type.
   * @return {Texture} The texture reference.
   */
  updateReference() {
    return this.value;
  }
  /**
   * Transforms the given uv node with the texture transformation matrix.
   *
   * @param {Node} uvNode - The uv node to transform.
   * @return {Node} The transformed uv node.
   */
  getTransformedUV(e) {
    return this._matrixUniform === null && (this._matrixUniform = Ue(this.value.matrix)), this._matrixUniform.mul(le(e, 1)).xy;
  }
  /**
   * Defines whether the uv transformation matrix should automatically be updated or not.
   *
   * @param {boolean} value - The update toggle.
   * @return {TextureNode} A reference to this node.
   */
  setUpdateMatrix(e) {
    return this.updateMatrix = e, this.updateType = e ? Xe.OBJECT : Xe.NONE, this;
  }
  /**
   * Setups the uv node. Depending on the backend as well as texture's image and type, it might be necessary
   * to modify the uv node for correct sampling.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {Node} uvNode - The uv node to setup.
   * @return {Node} The updated uv node.
   */
  setupUV(e, t) {
    const s = this.value;
    return e.isFlipY() && (s.image instanceof ImageBitmap && s.flipY === true || s.isRenderTargetTexture === true || s.isFramebufferTexture === true || s.isDepthTexture === true) && (this.sampler ? t = t.flipY() : t = t.setY(Nt(la(this, this.levelNode).y).sub(t.y).sub(1))), t;
  }
  /**
   * Setups texture node by preparing the internal nodes for code generation.
   *
   * @param {NodeBuilder} builder - The current node builder.
   */
  setup(e) {
    const t = e.getNodeProperties(this);
    t.referenceNode = this.referenceNode;
    const s = this.value;
    if (!s || s.isTexture !== true)
      throw new Error("THREE.TSL: `texture( value )` function expects a valid instance of THREE.Texture().");
    let i = this.uvNode;
    (i === null || e.context.forceUVContext === true) && e.context.getUV && (i = e.context.getUV(this, e)), i || (i = this.getDefaultUV()), this.updateMatrix === true && (i = this.getTransformedUV(i)), i = this.setupUV(e, i);
    let n = this.levelNode;
    n === null && e.context.getTextureLevel && (n = e.context.getTextureLevel(this)), t.uvNode = i, t.levelNode = n, t.biasNode = this.biasNode, t.compareNode = this.compareNode, t.gradNode = this.gradNode, t.depthNode = this.depthNode, t.offsetNode = this.offsetNode;
  }
  /**
   * Generates the uv code snippet.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {Node} uvNode - The uv node to generate code for.
   * @return {string} The generated code snippet.
   */
  generateUV(e, t) {
    return t.build(e, this.sampler === true ? "vec2" : "ivec2");
  }
  /**
   * Generates the offset code snippet.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {Node} offsetNode - The offset node to generate code for.
   * @return {string} The generated code snippet.
   */
  generateOffset(e, t) {
    return t.build(e, "ivec2");
  }
  /**
   * Generates the snippet for the texture sampling.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} textureProperty - The texture property.
   * @param {string} uvSnippet - The uv snippet.
   * @param {?string} levelSnippet - The level snippet.
   * @param {?string} biasSnippet - The bias snippet.
   * @param {?string} depthSnippet - The depth snippet.
   * @param {?string} compareSnippet - The compare snippet.
   * @param {?Array<string>} gradSnippet - The grad snippet.
   * @param {?string} offsetSnippet - The offset snippet.
   * @return {string} The generated code snippet.
   */
  generateSnippet(e, t, s, i, n, r, o, l, c) {
    const u = this.value;
    let h;
    return i ? h = e.generateTextureLevel(u, t, s, i, r, c) : n ? h = e.generateTextureBias(u, t, s, n, r, c) : l ? h = e.generateTextureGrad(u, t, s, l, r, c) : o ? h = e.generateTextureCompare(u, t, s, o, r, c) : this.sampler === false ? h = e.generateTextureLoad(u, t, s, r, c) : h = e.generateTexture(u, t, s, r, c), h;
  }
  /**
   * Generates the code snippet of the texture node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {string} output - The current output.
   * @return {string} The generated code snippet.
   */
  generate(e, t) {
    const s = this.value, i = e.getNodeProperties(this), n = super.generate(e, "property");
    if (/^sampler/.test(t))
      return n + "_sampler";
    if (e.isReference(t))
      return n;
    {
      const r = e.getDataFromNode(this);
      let o = r.propertyName;
      if (o === void 0) {
        const { uvNode: u, levelNode: h, biasNode: f, compareNode: d, depthNode: p, gradNode: m3, offsetNode: g } = i, y3 = this.generateUV(e, u), x = h ? h.build(e, "float") : null, v = f ? f.build(e, "float") : null, w = p ? p.build(e, "int") : null, A = d ? d.build(e, "float") : null, b = m3 ? [m3[0].build(e, "vec2"), m3[1].build(e, "vec2")] : null, M = g ? this.generateOffset(e, g) : null, _ = e.getVarFromNode(this);
        o = e.getPropertyName(_);
        const T = this.generateSnippet(e, n, y3, x, v, w, A, b, M);
        e.addLineFlowCode(`${o} = ${T}`, this), r.snippet = T, r.propertyName = o;
      }
      let l = o;
      const c = this.getNodeType(e);
      return e.needsToWorkingColorSpace(s) && (l = Lm(xa(l, c), s.colorSpace).setup(e).build(e, c)), e.format(l, c, t);
    }
  }
  /**
   * Sets the sampler value.
   *
   * @param {boolean} value - The sampler value to set.
   * @return {TextureNode} A reference to this texture node.
   */
  setSampler(e) {
    return this.sampler = e, this;
  }
  /**
   * Returns the sampler value.
   *
   * @return {boolean} The sampler value.
   */
  getSampler() {
    return this.sampler;
  }
  // @TODO: Move to TSL
  /**
   * @function
   * @deprecated since r172. Use {@link TextureNode#sample} instead.
   *
   * @param {Node} uvNode - The uv node.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  uv(e) {
    return console.warn("THREE.TextureNode: .uv() has been renamed. Use .sample() instead."), this.sample(e);
  }
  /**
   * Samples the texture with the given uv node.
   *
   * @param {Node} uvNode - The uv node.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  sample(e) {
    const t = this.clone();
    return t.uvNode = pe(e), t.referenceNode = this.getBase(), pe(t);
  }
  /**
   * TSL function for creating a texture node that fetches/loads texels without interpolation.
   *
   * @param {Node<uvec2>} uvNode - The uv node.
   * @returns {TextureNode} A texture node representing the texture load.
   */
  load(e) {
    return this.sample(e).setSampler(false);
  }
  /**
   * Samples a blurred version of the texture by defining an internal bias.
   *
   * @param {Node<float>} amountNode - How blurred the texture should be.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  blur(e) {
    const t = this.clone();
    t.biasNode = pe(e).mul(rP(t)), t.referenceNode = this.getBase();
    const s = t.value;
    return t.generateMipmaps === false && (s && s.generateMipmaps === false || s.minFilter === Zt || s.magFilter === Zt) && (console.warn("THREE.TSL: texture().blur() requires mipmaps and sampling. Use .generateMipmaps=true and .minFilter/.magFilter=THREE.LinearFilter in the Texture."), t.biasNode = null), pe(t);
  }
  /**
   * Samples a specific mip of the texture.
   *
   * @param {Node<int>} levelNode - The mip level to sample.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  level(e) {
    const t = this.clone();
    return t.levelNode = pe(e), t.referenceNode = this.getBase(), pe(t);
  }
  /**
   * Returns the texture size of the requested level.
   *
   * @param {Node<int>} levelNode - The level to compute the size for.
   * @return {TextureSizeNode} The texture size.
   */
  size(e) {
    return la(this, e);
  }
  /**
   * Samples the texture with the given bias.
   *
   * @param {Node<float>} biasNode - The bias node.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  bias(e) {
    const t = this.clone();
    return t.biasNode = pe(e), t.referenceNode = this.getBase(), pe(t);
  }
  /**
   * Returns the base texture of this node.
   * @return {TextureNode} The base texture node.
   */
  getBase() {
    return this.referenceNode ? this.referenceNode.getBase() : this;
  }
  /**
   * Samples the texture by executing a compare operation.
   *
   * @param {Node<float>} compareNode - The node that defines the compare value.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  compare(e) {
    const t = this.clone();
    return t.compareNode = pe(e), t.referenceNode = this.getBase(), pe(t);
  }
  /**
   * Samples the texture using an explicit gradient.
   *
   * @param {Node<vec2>} gradNodeX - The gradX node.
   * @param {Node<vec2>} gradNodeY - The gradY node.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  grad(e, t) {
    const s = this.clone();
    return s.gradNode = [pe(e), pe(t)], s.referenceNode = this.getBase(), pe(s);
  }
  /**
   * Samples the texture by defining a depth node.
   *
   * @param {Node<int>} depthNode - The depth node.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  depth(e) {
    const t = this.clone();
    return t.depthNode = pe(e), t.referenceNode = this.getBase(), pe(t);
  }
  /**
   * Samples the texture by defining an offset node.
   *
   * @param {Node<ivec2>} offsetNode - The offset node.
   * @return {TextureNode} A texture node representing the texture sample.
   */
  offset(e) {
    const t = this.clone();
    return t.offsetNode = pe(e), t.referenceNode = this.getBase(), pe(t);
  }
  // --
  serialize(e) {
    super.serialize(e), e.value = this.value.toJSON(e.meta).uuid, e.sampler = this.sampler, e.updateMatrix = this.updateMatrix, e.updateType = this.updateType;
  }
  deserialize(e) {
    super.deserialize(e), this.value = e.meta.textures[e.value], this.sampler = e.sampler, this.updateMatrix = e.updateMatrix, this.updateType = e.updateType;
  }
  /**
   * The update is used to implement the update of the uv transformation matrix.
   */
  update() {
    const e = this.value, t = this._matrixUniform;
    t !== null && (t.value = e.matrix), e.matrixAutoUpdate === true && e.updateMatrix();
  }
  /**
   * Clones the texture node.
   *
   * @return {TextureNode} The cloned texture node.
   */
  clone() {
    const e = new this.constructor(this.value, this.uvNode, this.levelNode, this.biasNode);
    return e.sampler = this.sampler, e.depthNode = this.depthNode, e.compareNode = this.compareNode, e.gradNode = this.gradNode, e.offsetNode = this.offsetNode, e;
  }
}
const oP = /* @__PURE__ */ ut(Ea).setParameterLength(1, 4).setName("texture"), ct = (a = Xv, e = null, t = null, s = null) => {
  let i;
  return a && a.isTextureNode === true ? (i = pe(a.clone()), i.referenceNode = a.getBase(), e !== null && (i.uvNode = pe(e)), t !== null && (i.levelNode = pe(t)), s !== null && (i.biasNode = pe(s))) : i = oP(a, e, t, s), i;
};
class Yv extends Xl {
  static get type() {
    return "BufferNode";
  }
  /**
   * Constructs a new buffer node.
   *
   * @param {Array<number>} value - Array-like buffer data.
   * @param {string} bufferType - The data type of the buffer.
   * @param {number} [bufferCount=0] - The count of buffer elements.
   */
  constructor(e, t, s = 0) {
    super(e, t), this.isBufferNode = true, this.bufferType = t, this.bufferCount = s;
  }
  /**
   * The data type of the buffer elements.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The element type.
   */
  getElementType(e) {
    return this.getNodeType(e);
  }
  /**
   * Overwrites the default implementation to return a fixed value `'buffer'`.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType() {
    return "buffer";
  }
}
const Kv = (a, e, t) => pe(new Yv(a, e, t));
class aP extends ql {
  static get type() {
    return "UniformArrayElementNode";
  }
  /**
   * Constructs a new buffer node.
   *
   * @param {UniformArrayNode} uniformArrayNode - The uniform array node to access.
   * @param {IndexNode} indexNode - The index data that define the position of the accessed element in the array.
   */
  constructor(e, t) {
    super(e, t), this.isArrayBufferElementNode = true;
  }
  generate(e) {
    const t = super.generate(e), s = this.getNodeType(), i = this.node.getPaddedType();
    return e.format(t, i, s);
  }
}
class lP extends Yv {
  static get type() {
    return "UniformArrayNode";
  }
  /**
   * Constructs a new uniform array node.
   *
   * @param {Array<any>} value - Array holding the buffer data.
   * @param {?string} [elementType=null] - The data type of a buffer element.
   */
  constructor(e, t = null) {
    super(null), this.array = e, this.elementType = t === null ? rh(e[0]) : t, this.paddedType = this.getPaddedType(), this.updateType = Xe.RENDER, this.isArrayBufferNode = true;
  }
  /**
   * This method is overwritten since the node type is inferred from the
   * {@link UniformArrayNode#paddedType}.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType() {
    return this.paddedType;
  }
  /**
   * The data type of the array elements.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The element type.
   */
  getElementType() {
    return this.elementType;
  }
  /**
   * Returns the padded type based on the element type.
   *
   * @return {string} The padded type.
   */
  getPaddedType() {
    const e = this.elementType;
    let t = "vec4";
    return e === "mat2" ? t = "mat2" : /mat/.test(e) === true ? t = "mat4" : e.charAt(0) === "i" ? t = "ivec4" : e.charAt(0) === "u" && (t = "uvec4"), t;
  }
  /**
   * The update makes sure to correctly transfer the data from the (complex) objects
   * in the array to the internal, correctly padded value buffer.
   *
   * @param {NodeFrame} frame - A reference to the current node frame.
   */
  update() {
    const { array: e, value: t } = this, s = this.elementType;
    if (s === "float" || s === "int" || s === "uint")
      for (let i = 0; i < e.length; i++) {
        const n = i * 4;
        t[n] = e[i];
      }
    else if (s === "color")
      for (let i = 0; i < e.length; i++) {
        const n = i * 4, r = e[i];
        t[n] = r.r, t[n + 1] = r.g, t[n + 2] = r.b || 0;
      }
    else if (s === "mat2")
      for (let i = 0; i < e.length; i++) {
        const n = i * 4, r = e[i];
        t[n] = r.elements[0], t[n + 1] = r.elements[1], t[n + 2] = r.elements[2], t[n + 3] = r.elements[3];
      }
    else if (s === "mat3")
      for (let i = 0; i < e.length; i++) {
        const n = i * 16, r = e[i];
        t[n] = r.elements[0], t[n + 1] = r.elements[1], t[n + 2] = r.elements[2], t[n + 4] = r.elements[3], t[n + 5] = r.elements[4], t[n + 6] = r.elements[5], t[n + 8] = r.elements[6], t[n + 9] = r.elements[7], t[n + 10] = r.elements[8], t[n + 15] = 1;
      }
    else if (s === "mat4")
      for (let i = 0; i < e.length; i++) {
        const n = i * 16, r = e[i];
        for (let o = 0; o < r.elements.length; o++)
          t[n + o] = r.elements[o];
      }
    else
      for (let i = 0; i < e.length; i++) {
        const n = i * 4, r = e[i];
        t[n] = r.x, t[n + 1] = r.y, t[n + 2] = r.z || 0, t[n + 3] = r.w || 0;
      }
  }
  /**
   * Implement the value buffer creation based on the array data.
   *
   * @param {NodeBuilder} builder - A reference to the current node builder.
   * @return {null}
   */
  setup(e) {
    const t = this.array.length, s = this.elementType;
    let i = Float32Array;
    const n = this.paddedType, r = e.getTypeLength(n);
    return s.charAt(0) === "i" && (i = Int32Array), s.charAt(0) === "u" && (i = Uint32Array), this.value = new i(t * r), this.bufferCount = t, this.bufferType = n, super.setup(e);
  }
  /**
   * Overwrites the default `element()` method to provide element access
   * based on {@link UniformArrayNode}.
   *
   * @param {IndexNode} indexNode - The index node.
   * @return {UniformArrayElementNode}
   */
  element(e) {
    return pe(new aP(this, pe(e)));
  }
}
const Ni = (a, e) => pe(new lP(a, e));
class cP extends Ie {
  /**
   * Constructs a new builtin node.
   *
   * @param {string} name - The name of the built-in shader variable.
   */
  constructor(e) {
    super("float"), this.name = e, this.isBuiltinNode = true;
  }
  /**
   * Generates the code snippet of the builtin node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The generated code snippet.
   */
  generate() {
    return this.name;
  }
}
const Kl = ut(cP).setParameterLength(1);
let qa, Xa;
class Mt extends Ie {
  static get type() {
    return "ScreenNode";
  }
  /**
   * Constructs a new screen node.
   *
   * @param {('coordinate'|'viewport'|'size'|'uv'|'dpr')} scope - The node's scope.
   */
  constructor(e) {
    super(), this.scope = e, this._output = null, this.isViewportNode = true;
  }
  /**
   * This method is overwritten since the node type depends on the selected scope.
   *
   * @return {('float'|'vec2'|'vec4')} The node type.
   */
  getNodeType() {
    return this.scope === Mt.DPR ? "float" : this.scope === Mt.VIEWPORT ? "vec4" : "vec2";
  }
  /**
   * This method is overwritten since the node's update type depends on the selected scope.
   *
   * @return {NodeUpdateType} The update type.
   */
  getUpdateType() {
    let e = Xe.NONE;
    return (this.scope === Mt.SIZE || this.scope === Mt.VIEWPORT || this.scope === Mt.DPR) && (e = Xe.RENDER), this.updateType = e, e;
  }
  /**
   * `ScreenNode` implements {@link Node#update} to retrieve viewport and size information
   * from the current renderer.
   *
   * @param {NodeFrame} frame - A reference to the current node frame.
   */
  update({ renderer: e }) {
    const t = e.getRenderTarget();
    this.scope === Mt.VIEWPORT ? t !== null ? Xa.copy(t.viewport) : (e.getViewport(Xa), Xa.multiplyScalar(e.getPixelRatio())) : this.scope === Mt.DPR ? this._output.value = e.getPixelRatio() : t !== null ? (qa.width = t.width, qa.height = t.height) : e.getDrawingBufferSize(qa);
  }
  setup() {
    const e = this.scope;
    let t = null;
    return e === Mt.SIZE ? t = Ue(qa || (qa = new Ke())) : e === Mt.VIEWPORT ? t = Ue(Xa || (Xa = new et())) : e === Mt.DPR ? t = Ue(1) : t = be(Bh.div(xp)), this._output = t, t;
  }
  generate(e) {
    if (this.scope === Mt.COORDINATE) {
      let t = e.getFragCoord();
      if (e.isFlipY()) {
        const s = e.getNodeProperties(xp).outputNode.build(e);
        t = `${e.getType("vec2")}( ${t}.x, ${s}.y - ${t}.y )`;
      }
      return t;
    }
    return super.generate(e);
  }
}
Mt.COORDINATE = "coordinate";
Mt.VIEWPORT = "viewport";
Mt.SIZE = "size";
Mt.UV = "uv";
Mt.DPR = "dpr";
const ca = /* @__PURE__ */ Te(Mt, Mt.UV), xp = /* @__PURE__ */ Te(Mt, Mt.SIZE), Bh = /* @__PURE__ */ Te(Mt, Mt.COORDINATE), Zv = /* @__PURE__ */ Te(Mt, Mt.VIEWPORT);
Zv.zw;
Zv.xy;
const Um = /* @__PURE__ */ Ue(0, "uint").setName("u_cameraIndex").setGroup(Cm("cameraIndex")).toVarying("v_cameraIndex"), $r = /* @__PURE__ */ Ue("float").setName("cameraNear").setGroup(De).onRenderUpdate(({ camera: a }) => a.near), Wr = /* @__PURE__ */ Ue("float").setName("cameraFar").setGroup(De).onRenderUpdate(({ camera: a }) => a.far), Hn = /* @__PURE__ */ he(({ camera: a }) => {
  let e;
  if (a.isArrayCamera && a.cameras.length > 0) {
    const t = [];
    for (const i of a.cameras)
      t.push(i.matrixWorldInverse);
    e = Ni(t).setGroup(De).setName("cameraViewMatrices").element(a.isMultiViewCamera ? Kl("gl_ViewID_OVR") : Um).toConst("cameraViewMatrix");
  } else
    e = Ue("mat4").setName("cameraViewMatrix").setGroup(De).onRenderUpdate(({ camera: t }) => t.matrixWorldInverse);
  return e;
}).once()(), Zy = /* @__PURE__ */ new Ah();
class St extends Ie {
  static get type() {
    return "Object3DNode";
  }
  /**
   * Constructs a new object 3D node.
   *
   * @param {('position'|'viewPosition'|'direction'|'scale'|'worldMatrix')} scope - The node represents a different type of transformation depending on the scope.
   * @param {?Object3D} [object3d=null] - The 3D object.
   */
  constructor(e, t = null) {
    super(), this.scope = e, this.object3d = t, this.updateType = Xe.OBJECT, this.uniformNode = new Xl(null);
  }
  /**
   * Overwritten since the node type is inferred from the scope.
   *
   * @return {('mat4'|'vec3'|'float')} The node type.
   */
  getNodeType() {
    const e = this.scope;
    if (e === St.WORLD_MATRIX)
      return "mat4";
    if (e === St.POSITION || e === St.VIEW_POSITION || e === St.DIRECTION || e === St.SCALE)
      return "vec3";
    if (e === St.RADIUS)
      return "float";
  }
  /**
   * Updates the uniform value depending on the scope.
   *
   * @param {NodeFrame} frame - The current node frame.
   */
  update(e) {
    const t = this.object3d, s = this.uniformNode, i = this.scope;
    if (i === St.WORLD_MATRIX)
      s.value = t.matrixWorld;
    else if (i === St.POSITION)
      s.value = s.value || new Y(), s.value.setFromMatrixPosition(t.matrixWorld);
    else if (i === St.SCALE)
      s.value = s.value || new Y(), s.value.setFromMatrixScale(t.matrixWorld);
    else if (i === St.DIRECTION)
      s.value = s.value || new Y(), t.getWorldDirection(s.value);
    else if (i === St.VIEW_POSITION) {
      const n = e.camera;
      s.value = s.value || new Y(), s.value.setFromMatrixPosition(t.matrixWorld), s.value.applyMatrix4(n.matrixWorldInverse);
    } else if (i === St.RADIUS) {
      const n = e.object.geometry;
      n.boundingSphere === null && n.computeBoundingSphere(), Zy.copy(n.boundingSphere).applyMatrix4(t.matrixWorld), s.value = Zy.radius;
    }
  }
  /**
   * Generates the code snippet of the uniform node. The node type of the uniform
   * node also depends on the selected scope.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The generated code snippet.
   */
  generate(e) {
    const t = this.scope;
    return t === St.WORLD_MATRIX ? this.uniformNode.nodeType = "mat4" : t === St.POSITION || t === St.VIEW_POSITION || t === St.DIRECTION || t === St.SCALE ? this.uniformNode.nodeType = "vec3" : t === St.RADIUS && (this.uniformNode.nodeType = "float"), this.uniformNode.build(e);
  }
  serialize(e) {
    super.serialize(e), e.scope = this.scope;
  }
  deserialize(e) {
    super.deserialize(e), this.scope = e.scope;
  }
}
St.WORLD_MATRIX = "worldMatrix";
St.POSITION = "position";
St.SCALE = "scale";
St.VIEW_POSITION = "viewPosition";
St.DIRECTION = "direction";
St.RADIUS = "radius";
class yi extends St {
  static get type() {
    return "ModelNode";
  }
  /**
   * Constructs a new object model node.
   *
   * @param {('position'|'viewPosition'|'direction'|'scale'|'worldMatrix')} scope - The node represents a different type of transformation depending on the scope.
   */
  constructor(e) {
    super(e);
  }
  /**
   * Extracts the model reference from the frame state and then
   * updates the uniform value depending on the scope.
   *
   * @param {NodeFrame} frame - The current node frame.
   */
  update(e) {
    this.object3d = e.object, super.update(e);
  }
}
const oo = /* @__PURE__ */ Te(yi, yi.WORLD_MATRIX);
const pP = /* @__PURE__ */ Ue(new zs()).onObjectUpdate(({ object: a }, e) => e.value.getNormalMatrix(a.matrixWorld)), Fh = /* @__PURE__ */ he((a) => a.renderer.overrideNodes.modelViewMatrix || mP).once()().toVar("modelViewMatrix"), mP = /* @__PURE__ */ Hn.mul(oo), Ht = /* @__PURE__ */ he((a) => a.context.setupPositionView().toVarying("v_positionView"), "vec3").once(["POSITION"])(), Ut = /* @__PURE__ */ Ht.negate().toVarying("v_positionViewDirection").normalize().toVar("positionViewDirection");
class gP extends Ie {
  static get type() {
    return "FrontFacingNode";
  }
  /**
   * Constructs a new front facing node.
   */
  constructor() {
    super("bool"), this.isFrontFacingNode = true;
  }
  generate(e) {
    if (e.shaderStage !== "fragment") return "true";
    const { material: t } = e;
    return t.side === Ms ? "false" : e.getFrontFacing();
  }
}
const yP = /* @__PURE__ */ Te(gP), e_ = /* @__PURE__ */ ae(yP).mul(2).sub(1), Zl = /* @__PURE__ */ he(([a], { material: e }) => {
  const t = e.side;
  return t === Ms ? a = a.mul(-1) : t === Qr && (a = a.mul(e_)), a;
}), t_ = /* @__PURE__ */ vr("normal", "vec3"), rn = /* @__PURE__ */ he((a) => a.geometry.hasAttribute("normal") === false ? (console.warn('THREE.TSL: Vertex attribute "normal" not found on geometry.'), le(0, 1, 0)) : t_, "vec3").once()().toVar("normalLocal"), xP = /* @__PURE__ */ Ht.dFdx().cross(Ht.dFdy()).normalize().toVar("normalFlat"), Dl = /* @__PURE__ */ he((a) => {
  let e;
  return a.material.flatShading === true ? e = xP : e = s_(rn).toVarying("v_normalViewGeometry").normalize(), e;
}, "vec3").once()().toVar("normalViewGeometry"), wt = /* @__PURE__ */ he(({ subBuildFn: a, material: e, context: t }) => {
  let s;
  return a === "NORMAL" || a === "VERTEX" ? (s = Dl, e.flatShading !== true && (s = Zl(s))) : s = t.setupNormal().context({ getUV: null }), s;
}, "vec3").once(["NORMAL", "VERTEX"])().toVar("normalView"), Ra = /* @__PURE__ */ wt.transformDirection(Hn).toVar("normalWorld"), Yo = /* @__PURE__ */ he(({ subBuildFn: a, context: e }) => {
  let t;
  return a === "NORMAL" || a === "VERTEX" ? t = wt : t = e.setupClearcoatNormal().context({ getUV: null }), t;
}, "vec3").once(["NORMAL", "VERTEX"])().toVar("clearcoatNormalView"), s_ = /* @__PURE__ */ he(([a], e) => {
  const t = e.renderer.overrideNodes.modelNormalViewMatrix;
  if (t !== null)
    return t.transformDirection(a);
  const s = pP.mul(a);
  return Hn.transformDirection(s);
});
he(() => (console.warn('THREE.TSL: "transformedNormalView" is deprecated. Use "normalView" instead.'), wt)).once(["NORMAL", "VERTEX"])();
he(() => (console.warn('THREE.TSL: "transformedNormalWorld" is deprecated. Use "normalWorld" instead.'), Ra)).once(["NORMAL", "VERTEX"])();
he(() => (console.warn('THREE.TSL: "transformedClearcoatNormalView" is deprecated. Use "clearcoatNormalView" instead.'), Yo)).once(["NORMAL", "VERTEX"])();
const t0 = /* @__PURE__ */ new gi(), nf = /* @__PURE__ */ new Rt(), TP = /* @__PURE__ */ Ue(0).onReference(({ material: a }) => a).onObjectUpdate(({ material: a }) => a.refractionRatio), i_ = /* @__PURE__ */ Ue(new Rt()).onReference(function(a) {
  return a.material;
}).onObjectUpdate(function({ material: a, scene: e }) {
  const t = e.environment !== null && a.envMap === null ? e.environmentRotation : a.envMapRotation;
  return t ? (t0.copy(t), nf.makeRotationFromEuler(t0)) : nf.identity(), nf;
}), bP = /* @__PURE__ */ Ut.negate().reflect(wt), wP = /* @__PURE__ */ Ut.negate().refract(wt, TP), SP = /* @__PURE__ */ bP.transformDirection(Hn).toVar("reflectVector"), MP = /* @__PURE__ */ wP.transformDirection(Hn).toVar("reflectVector"), AP = /* @__PURE__ */ new Eh();
class EP extends Ea {
  static get type() {
    return "CubeTextureNode";
  }
  /**
   * Constructs a new cube texture node.
   *
   * @param {CubeTexture} value - The cube texture.
   * @param {?Node<vec3>} [uvNode=null] - The uv node.
   * @param {?Node<int>} [levelNode=null] - The level node.
   * @param {?Node<float>} [biasNode=null] - The bias node.
   */
  constructor(e, t = null, s = null, i = null) {
    super(e, t, s, i), this.isCubeTextureNode = true;
  }
  /**
   * Overwrites the default implementation to return a fixed value `'cubeTexture'`.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType() {
    return "cubeTexture";
  }
  /**
   * Returns a default uvs based on the mapping type of the cube texture.
   *
   * @return {Node<vec3>} The default uv attribute.
   */
  getDefaultUV() {
    const e = this.value;
    return e.mapping === Nl ? SP : e.mapping === Iu ? MP : (console.error('THREE.CubeTextureNode: Mapping "%s" not supported.', e.mapping), le(0, 0, 0));
  }
  /**
   * Overwritten with an empty implementation since the `updateMatrix` flag is ignored
   * for cube textures. The uv transformation matrix is not applied to cube textures.
   *
   * @param {boolean} value - The update toggle.
   */
  setUpdateMatrix() {
  }
  // Ignore .updateMatrix for CubeTextureNode
  /**
   * Setups the uv node. Depending on the backend as well as the texture type, it might be necessary
   * to modify the uv node for correct sampling.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {Node} uvNode - The uv node to setup.
   * @return {Node} The updated uv node.
   */
  setupUV(e, t) {
    const s = this.value;
    return (e.renderer.coordinateSystem === yr || !s.isRenderTargetTexture) && (t = le(t.x.negate(), t.yz)), i_.mul(t);
  }
  /**
   * Generates the uv code snippet.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @param {Node} cubeUV - The uv node to generate code for.
   * @return {string} The generated code snippet.
   */
  generateUV(e, t) {
    return t.build(e, "vec3");
  }
}
const RP = /* @__PURE__ */ ut(EP).setParameterLength(1, 4).setName("cubeTexture"), Ll = (a = AP, e = null, t = null, s = null) => {
  let i;
  return a && a.isCubeTextureNode === true ? (i = pe(a.clone()), i.referenceNode = a, e !== null && (i.uvNode = pe(e)), t !== null && (i.levelNode = pe(t)), s !== null && (i.biasNode = pe(s))) : i = RP(a, e, t, s), i;
};
class CP extends ql {
  static get type() {
    return "ReferenceElementNode";
  }
  /**
   * Constructs a new reference element node.
   *
   * @param {?ReferenceNode} referenceNode - The reference node.
   * @param {Node} indexNode - The index node that defines the element access.
   */
  constructor(e, t) {
    super(e, t), this.referenceNode = e, this.isReferenceElementNode = true;
  }
  /**
   * This method is overwritten since the node type is inferred from
   * the uniform type of the reference node.
   *
   * @return {string} The node type.
   */
  getNodeType() {
    return this.referenceNode.uniformType;
  }
  generate(e) {
    const t = super.generate(e), s = this.referenceNode.getNodeType(), i = this.getNodeType();
    return e.format(t, s, i);
  }
}
class km extends Ie {
  static get type() {
    return "ReferenceNode";
  }
  /**
   * Constructs a new reference node.
   *
   * @param {string} property - The name of the property the node refers to.
   * @param {string} uniformType - The uniform type that should be used to represent the property value.
   * @param {?Object} [object=null] - The object the property belongs to.
   * @param {?number} [count=null] - When the linked property is an array-like, this parameter defines its length.
   */
  constructor(e, t, s = null, i = null) {
    super(), this.property = e, this.uniformType = t, this.object = s, this.count = i, this.properties = e.split("."), this.reference = s, this.node = null, this.group = null, this.name = null, this.updateType = Xe.OBJECT;
  }
  /**
   * When the referred property is array-like, this method can be used
   * to access elements via an index node.
   *
   * @param {IndexNode} indexNode - indexNode.
   * @return {ReferenceElementNode} A reference to an element.
   */
  element(e) {
    return pe(new CP(this, pe(e)));
  }
  /**
   * Sets the uniform group for this reference node.
   *
   * @param {UniformGroupNode} group - The uniform group to set.
   * @return {ReferenceNode} A reference to this node.
   */
  setGroup(e) {
    return this.group = e, this;
  }
  /**
   * Sets the name for the internal uniform.
   *
   * @param {string} name - The label to set.
   * @return {ReferenceNode} A reference to this node.
   */
  setName(e) {
    return this.name = e, this;
  }
  /**
   * Sets the label for the internal uniform.
   *
   * @deprecated
   * @param {string} name - The label to set.
   * @return {ReferenceNode} A reference to this node.
   */
  label(e) {
    return console.warn('THREE.TSL: "label()" has been deprecated. Use "setName()" instead.'), this.setName(e);
  }
  /**
   * Sets the node type which automatically defines the internal
   * uniform type.
   *
   * @param {string} uniformType - The type to set.
   */
  setNodeType(e) {
    let t = null;
    this.count !== null ? t = Kv(null, e, this.count) : Array.isArray(this.getValueFromReference()) ? t = Ni(null, e) : e === "texture" ? t = ct(null) : e === "cubeTexture" ? t = Ll(null) : t = Ue(null, e), this.group !== null && t.setGroup(this.group), this.name !== null && t.setName(this.name), this.node = t;
  }
  /**
   * This method is overwritten since the node type is inferred from
   * the type of the reference node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.node === null && (this.updateReference(e), this.updateValue()), this.node.getNodeType(e);
  }
  /**
   * Returns the property value from the given referred object.
   *
   * @param {Object} [object=this.reference] - The object to retrieve the property value from.
   * @return {any} The value.
   */
  getValueFromReference(e = this.reference) {
    const { properties: t } = this;
    let s = e[t[0]];
    for (let i = 1; i < t.length; i++)
      s = s[t[i]];
    return s;
  }
  /**
   * Allows to update the reference based on the given state. The state is only
   * evaluated {@link ReferenceNode#object} is not set.
   *
   * @param {(NodeFrame|NodeBuilder)} state - The current state.
   * @return {Object} The updated reference.
   */
  updateReference(e) {
    return this.reference = this.object !== null ? this.object : e.object, this.reference;
  }
  /**
   * The output of the reference node is the internal uniform node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {UniformNode} The output node.
   */
  setup() {
    return this.updateValue(), this.node;
  }
  /**
   * Overwritten to update the internal uniform value.
   *
   * @param {NodeFrame} frame - A reference to the current node frame.
   */
  update() {
    this.updateValue();
  }
  /**
   * Retrieves the value from the referred object property and uses it
   * to updated the internal uniform.
   */
  updateValue() {
    this.node === null && this.setNodeType(this.uniformType);
    const e = this.getValueFromReference();
    Array.isArray(e) ? this.node.array = e : this.node.value = e;
  }
}
const At = (a, e, t) => pe(new km(a, e, t));
class NP extends km {
  static get type() {
    return "MaterialReferenceNode";
  }
  /**
   * Constructs a new material reference node.
   *
   * @param {string} property - The name of the property the node refers to.
   * @param {string} inputType - The uniform type that should be used to represent the property value.
   * @param {?Material} [material=null] - The material the property belongs to. When no material is set,
   * the node refers to the material of the current rendered object.
   */
  constructor(e, t, s = null) {
    super(e, t, s), this.material = s, this.isMaterialReferenceNode = true;
  }
  /**
   * Updates the reference based on the given state. The state is only evaluated
   * {@link MaterialReferenceNode#material} is not set.
   *
   * @param {(NodeFrame|NodeBuilder)} state - The current state.
   * @return {Object} The updated reference.
   */
  updateReference(e) {
    return this.reference = this.material !== null ? this.material : e.material, this.reference;
  }
}
const or = (a, e, t = null) => pe(new NP(a, e, t)), n_ = Yl(), PP = Ht.dFdx(), IP = Ht.dFdy(), r_ = n_.dFdx(), o_ = n_.dFdy(), a_ = wt, l_ = IP.cross(a_), c_ = a_.cross(PP), vp = l_.mul(r_.x).add(c_.mul(o_.x)), _p = l_.mul(r_.y).add(c_.mul(o_.y)), i0 = vp.dot(vp).max(_p.dot(_p)), u_ = i0.equal(0).select(0, i0.inverseSqrt()), BP = /* @__PURE__ */ vp.mul(u_).toVar("tangentViewFrame"), FP = /* @__PURE__ */ _p.mul(u_).toVar("bitangentViewFrame"), h_ = /* @__PURE__ */ he((a) => (a.geometry.hasAttribute("tangent") === false && a.geometry.computeTangents(), vr("tangent", "vec4")))(), zm = /* @__PURE__ */ h_.xyz.toVar("tangentLocal"), d_ = /* @__PURE__ */ he(({ subBuildFn: a, geometry: e, material: t }) => {
  let s;
  return a === "VERTEX" || e.hasAttribute("tangent") ? s = Fh.mul(We(zm, 0)).xyz.toVarying("v_tangentView").normalize() : s = BP, t.flatShading !== true && (s = Zl(s)), s;
}, "vec3").once(["NORMAL", "VERTEX"])().toVar("tangentView"), DP = /* @__PURE__ */ he(([a, e], { subBuildFn: t, material: s }) => {
  let i = a.mul(h_.w).xyz;
  return t === "NORMAL" && s.flatShading !== true && (i = i.toVarying(e)), i;
}).once(["NORMAL"]), LP = /* @__PURE__ */ he(({ subBuildFn: a, geometry: e, material: t }) => {
  let s;
  return a === "VERTEX" || e.hasAttribute("tangent") ? s = DP(wt.cross(d_), "v_bitangentView").normalize() : s = FP, t.flatShading !== true && (s = Zl(s)), s;
}, "vec3").once(["NORMAL", "VERTEX"])().toVar("bitangentView"), cl = /* @__PURE__ */ Es2(d_, LP, wt).toVar("TBNViewMatrix");
class UP extends es {
  static get type() {
    return "NormalMapNode";
  }
  /**
   * Constructs a new normal map node.
   *
   * @param {Node<vec3>} node - Represents the normal map data.
   * @param {?Node<vec2>} [scaleNode=null] - Controls the intensity of the effect.
   */
  constructor(e, t = null) {
    super("vec3"), this.node = e, this.scaleNode = t, this.normalMapType = mr;
  }
  setup({ material: e }) {
    const { normalMapType: t, scaleNode: s } = this;
    let i = this.node.mul(2).sub(1);
    if (s !== null) {
      let r = s;
      e.flatShading === true && (r = Zl(r)), i = le(i.xy.mul(r), i.z);
    }
    let n = null;
    return t === jE ? n = s_(i) : t === mr ? n = cl.mul(i).normalize() : (console.error(`THREE.NodeMaterial: Unsupported normal map type: ${t}`), n = wt), n;
  }
}
const n0 = /* @__PURE__ */ ut(UP).setParameterLength(1, 2), kP = he(({ textureNode: a, bumpScale: e }) => {
  const t = (i) => a.cache().context({ getUV: (n) => i(n.uvNode || Yl()), forceUVContext: true }), s = ae(t((i) => i));
  return be(
    ae(t((i) => i.add(i.dFdx()))).sub(s),
    ae(t((i) => i.add(i.dFdy()))).sub(s)
  ).mul(e);
}), zP = he((a) => {
  const { surf_pos: e, surf_norm: t, dHdxy: s } = a, i = e.dFdx().normalize(), n = e.dFdy().normalize(), r = t, o = n.cross(r), l = r.cross(i), c = i.dot(o).mul(e_), u = c.sign().mul(s.x.mul(o).add(s.y.mul(l)));
  return c.abs().mul(t).sub(u).normalize();
});
class GP extends es {
  static get type() {
    return "BumpMapNode";
  }
  /**
   * Constructs a new bump map node.
   *
   * @param {Node<float>} textureNode - Represents the bump map data.
   * @param {?Node<float>} [scaleNode=null] - Controls the intensity of the bump effect.
   */
  constructor(e, t = null) {
    super("vec3"), this.textureNode = e, this.scaleNode = t;
  }
  setup() {
    const e = this.scaleNode !== null ? this.scaleNode : 1, t = kP({ textureNode: this.textureNode, bumpScale: e });
    return zP({
      surf_pos: Ht,
      surf_norm: wt,
      dHdxy: t
    });
  }
}
const VP = /* @__PURE__ */ ut(GP).setParameterLength(1, 2), r0 = /* @__PURE__ */ new Map();
class ne extends Ie {
  static get type() {
    return "MaterialNode";
  }
  /**
   * Constructs a new material node.
   *
   * @param {string} scope - The scope defines what kind of material property is referred by the node.
   */
  constructor(e) {
    super(), this.scope = e;
  }
  /**
   * Returns a cached reference node for the given property and type.
   *
   * @param {string} property - The name of the material property.
   * @param {string} type - The uniform type of the property.
   * @return {MaterialReferenceNode} A material reference node representing the property access.
   */
  getCache(e, t) {
    let s = r0.get(e);
    return s === void 0 && (s = or(e, t), r0.set(e, s)), s;
  }
  /**
   * Returns a float-typed material reference node for the given property name.
   *
   * @param {string} property - The name of the material property.
   * @return {MaterialReferenceNode<float>} A material reference node representing the property access.
   */
  getFloat(e) {
    return this.getCache(e, "float");
  }
  /**
   * Returns a color-typed material reference node for the given property name.
   *
   * @param {string} property - The name of the material property.
   * @return {MaterialReferenceNode<color>} A material reference node representing the property access.
   */
  getColor(e) {
    return this.getCache(e, "color");
  }
  /**
   * Returns a texture-typed material reference node for the given property name.
   *
   * @param {string} property - The name of the material property.
   * @return {MaterialReferenceNode} A material reference node representing the property access.
   */
  getTexture(e) {
    return this.getCache(e === "map" ? "map" : e + "Map", "texture");
  }
  /**
   * The node setup is done depending on the selected scope. Multiple material properties
   * might be grouped into a single node composition if they logically belong together.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Node} The node representing the selected scope.
   */
  setup(e) {
    const t = e.context.material, s = this.scope;
    let i = null;
    if (s === ne.COLOR) {
      const n = t.color !== void 0 ? this.getColor(s) : le();
      t.map && t.map.isTexture === true ? i = n.mul(this.getTexture("map")) : i = n;
    } else if (s === ne.OPACITY) {
      const n = this.getFloat(s);
      t.alphaMap && t.alphaMap.isTexture === true ? i = n.mul(this.getTexture("alpha")) : i = n;
    } else if (s === ne.SPECULAR_STRENGTH)
      t.specularMap && t.specularMap.isTexture === true ? i = this.getTexture("specular").r : i = ae(1);
    else if (s === ne.SPECULAR_INTENSITY) {
      const n = this.getFloat(s);
      t.specularIntensityMap && t.specularIntensityMap.isTexture === true ? i = n.mul(this.getTexture(s).a) : i = n;
    } else if (s === ne.SPECULAR_COLOR) {
      const n = this.getColor(s);
      t.specularColorMap && t.specularColorMap.isTexture === true ? i = n.mul(this.getTexture(s).rgb) : i = n;
    } else if (s === ne.ROUGHNESS) {
      const n = this.getFloat(s);
      t.roughnessMap && t.roughnessMap.isTexture === true ? i = n.mul(this.getTexture(s).g) : i = n;
    } else if (s === ne.METALNESS) {
      const n = this.getFloat(s);
      t.metalnessMap && t.metalnessMap.isTexture === true ? i = n.mul(this.getTexture(s).b) : i = n;
    } else if (s === ne.EMISSIVE) {
      const n = this.getFloat("emissiveIntensity"), r = this.getColor(s).mul(n);
      t.emissiveMap && t.emissiveMap.isTexture === true ? i = r.mul(this.getTexture(s)) : i = r;
    } else if (s === ne.NORMAL)
      t.normalMap ? (i = n0(this.getTexture("normal"), this.getCache("normalScale", "vec2")), i.normalMapType = t.normalMapType) : t.bumpMap ? i = VP(this.getTexture("bump").r, this.getFloat("bumpScale")) : i = wt;
    else if (s === ne.CLEARCOAT) {
      const n = this.getFloat(s);
      t.clearcoatMap && t.clearcoatMap.isTexture === true ? i = n.mul(this.getTexture(s).r) : i = n;
    } else if (s === ne.CLEARCOAT_ROUGHNESS) {
      const n = this.getFloat(s);
      t.clearcoatRoughnessMap && t.clearcoatRoughnessMap.isTexture === true ? i = n.mul(this.getTexture(s).r) : i = n;
    } else if (s === ne.CLEARCOAT_NORMAL)
      t.clearcoatNormalMap ? i = n0(this.getTexture(s), this.getCache(s + "Scale", "vec2")) : i = wt;
    else if (s === ne.SHEEN) {
      const n = this.getColor("sheenColor").mul(this.getFloat("sheen"));
      t.sheenColorMap && t.sheenColorMap.isTexture === true ? i = n.mul(this.getTexture("sheenColor").rgb) : i = n;
    } else if (s === ne.SHEEN_ROUGHNESS) {
      const n = this.getFloat(s);
      t.sheenRoughnessMap && t.sheenRoughnessMap.isTexture === true ? i = n.mul(this.getTexture(s).a) : i = n, i = i.clamp(0.07, 1);
    } else if (s === ne.ANISOTROPY)
      if (t.anisotropyMap && t.anisotropyMap.isTexture === true) {
        const n = this.getTexture(s);
        i = Am(Ya.x, Ya.y, Ya.y.negate(), Ya.x).mul(n.rg.mul(2).sub(be(1)).normalize().mul(n.b));
      } else
        i = Ya;
    else if (s === ne.IRIDESCENCE_THICKNESS) {
      const n = At("1", "float", t.iridescenceThicknessRange);
      if (t.iridescenceThicknessMap) {
        const r = At("0", "float", t.iridescenceThicknessRange);
        i = n.sub(r).mul(this.getTexture(s).g).add(r);
      } else
        i = n;
    } else if (s === ne.TRANSMISSION) {
      const n = this.getFloat(s);
      t.transmissionMap ? i = n.mul(this.getTexture(s).r) : i = n;
    } else if (s === ne.THICKNESS) {
      const n = this.getFloat(s);
      t.thicknessMap ? i = n.mul(this.getTexture(s).g) : i = n;
    } else if (s === ne.IOR)
      i = this.getFloat(s);
    else if (s === ne.LIGHT_MAP)
      i = this.getTexture(s).rgb.mul(this.getFloat("lightMapIntensity"));
    else if (s === ne.AO)
      i = this.getTexture(s).r.sub(1).mul(this.getFloat("aoMapIntensity")).add(1);
    else if (s === ne.LINE_DASH_OFFSET)
      i = t.dashOffset ? this.getFloat(s) : ae(0);
    else {
      const n = this.getNodeType(e);
      i = this.getCache(s, n);
    }
    return i;
  }
}
ne.ALPHA_TEST = "alphaTest";
ne.COLOR = "color";
ne.OPACITY = "opacity";
ne.SHININESS = "shininess";
ne.SPECULAR = "specular";
ne.SPECULAR_STRENGTH = "specularStrength";
ne.SPECULAR_INTENSITY = "specularIntensity";
ne.SPECULAR_COLOR = "specularColor";
ne.REFLECTIVITY = "reflectivity";
ne.ROUGHNESS = "roughness";
ne.METALNESS = "metalness";
ne.NORMAL = "normal";
ne.CLEARCOAT = "clearcoat";
ne.CLEARCOAT_ROUGHNESS = "clearcoatRoughness";
ne.CLEARCOAT_NORMAL = "clearcoatNormal";
ne.EMISSIVE = "emissive";
ne.ROTATION = "rotation";
ne.SHEEN = "sheen";
ne.SHEEN_ROUGHNESS = "sheenRoughness";
ne.ANISOTROPY = "anisotropy";
ne.IRIDESCENCE = "iridescence";
ne.IRIDESCENCE_IOR = "iridescenceIOR";
ne.IRIDESCENCE_THICKNESS = "iridescenceThickness";
ne.IOR = "ior";
ne.TRANSMISSION = "transmission";
ne.THICKNESS = "thickness";
ne.ATTENUATION_DISTANCE = "attenuationDistance";
ne.ATTENUATION_COLOR = "attenuationColor";
ne.LINE_SCALE = "scale";
ne.LINE_DASH_SIZE = "dashSize";
ne.LINE_GAP_SIZE = "gapSize";
ne.LINE_WIDTH = "linewidth";
ne.LINE_DASH_OFFSET = "dashOffset";
ne.POINT_SIZE = "size";
ne.DISPERSION = "dispersion";
ne.LIGHT_MAP = "light";
ne.AO = "ao";
const Ya = /* @__PURE__ */ Ue(new Ke()).onReference(function(a) {
  return a.material;
}).onRenderUpdate(function({ material: a }) {
  this.value.set(a.anisotropy * Math.cos(a.anisotropyRotation), a.anisotropy * Math.sin(a.anisotropyRotation));
});
class Bt extends Ie {
  static get type() {
    return "IndexNode";
  }
  /**
   * Constructs a new index node.
   *
   * @param {('vertex'|'instance'|'subgroup'|'invocationLocal'|'invocationSubgroup'|'draw')} scope - The scope of the index node.
   */
  constructor(e) {
    super("uint"), this.scope = e, this.isIndexNode = true;
  }
  generate(e) {
    const t = this.getNodeType(e), s = this.scope;
    let i;
    if (s === Bt.VERTEX)
      i = e.getVertexIndex();
    else if (s === Bt.INSTANCE)
      i = e.getInstanceIndex();
    else if (s === Bt.DRAW)
      i = e.getDrawIndex();
    else if (s === Bt.INVOCATION_LOCAL)
      i = e.getInvocationLocalIndex();
    else if (s === Bt.INVOCATION_SUBGROUP)
      i = e.getInvocationSubgroupIndex();
    else if (s === Bt.SUBGROUP)
      i = e.getSubgroupIndex();
    else
      throw new Error("THREE.IndexNode: Unknown scope: " + s);
    let n;
    return e.shaderStage === "vertex" || e.shaderStage === "compute" ? n = i : n = Tr(this).build(e, t), n;
  }
}
Bt.VERTEX = "vertex";
Bt.INSTANCE = "instance";
Bt.SUBGROUP = "subgroup";
Bt.INVOCATION_LOCAL = "invocationLocal";
Bt.INVOCATION_SUBGROUP = "invocationSubgroup";
Bt.DRAW = "draw";
class CI extends Ie {
  static get type() {
    return "LoopNode";
  }
  /**
   * Constructs a new loop node.
   *
   * @param {Array<any>} params - Depending on the loop type, array holds different parameterization values for the loop.
   */
  constructor(e = []) {
    super(), this.params = e;
  }
  /**
   * Returns a loop variable name based on an index. The pattern is
   * `0` = `i`, `1`= `j`, `2`= `k` and so on.
   *
   * @param {number} index - The index.
   * @return {string} The loop variable name.
   */
  getVarName(e) {
    return String.fromCharCode(105 + e);
  }
  /**
   * Returns properties about this node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Object} The node properties.
   */
  getProperties(e) {
    const t = e.getNodeProperties(this);
    if (t.stackNode !== void 0) return t;
    const s = {};
    for (let r = 0, o = this.params.length - 1; r < o; r++) {
      const l = this.params[r], c = l.isNode !== true && l.name || this.getVarName(r), u = l.isNode !== true && l.type || "int";
      s[c] = xa(c, u);
    }
    const i = e.addStack();
    t.returnsNode = this.params[this.params.length - 1](s, e), t.stackNode = i;
    const n = this.params[0];
    return n.isNode !== true && typeof n.update == "function" && (t.updateNode = he(this.params[0].update)(s)), e.removeStack(), t;
  }
  /**
   * This method is overwritten since the node type is inferred based on the loop configuration.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    const { returnsNode: t } = this.getProperties(e);
    return t ? t.getNodeType(e) : "void";
  }
  setup(e) {
    this.getProperties(e);
  }
  generate(e) {
    const t = this.getProperties(e), s = this.params, i = t.stackNode;
    for (let o = 0, l = s.length - 1; o < l; o++) {
      const c = s[o];
      let u = false, h = null, f = null, d = null, p = null, m3 = null, g = null;
      c.isNode ? c.getNodeType(e) === "bool" ? (u = true, p = "bool", f = c.build(e, p)) : (p = "int", d = this.getVarName(o), h = "0", f = c.build(e, p), m3 = "<") : (p = c.type || "int", d = c.name || this.getVarName(o), h = c.start, f = c.end, m3 = c.condition, g = c.update, typeof h == "number" ? h = e.generateConst(p, h) : h && h.isNode && (h = h.build(e, p)), typeof f == "number" ? f = e.generateConst(p, f) : f && f.isNode && (f = f.build(e, p)), h !== void 0 && f === void 0 ? (h = h + " - 1", f = "0", m3 = ">=") : f !== void 0 && h === void 0 && (h = "0", m3 = "<"), m3 === void 0 && (Number(h) > Number(f) ? m3 = ">=" : m3 = "<"));
      let y3;
      if (u)
        y3 = `while ( ${f} )`;
      else {
        const x = { start: h, end: f }, v = x.start, w = x.end;
        let A;
        const b = () => m3.includes("<") ? "+=" : "-=";
        if (g != null)
          switch (typeof g) {
            case "function":
              A = e.flowStagesNode(t.updateNode, "void").code.replace(/\t|;/g, "");
              break;
            case "number":
              A = d + " " + b() + " " + e.generateConst(p, g);
              break;
            case "string":
              A = d + " " + g;
              break;
            default:
              g.isNode ? A = d + " " + b() + " " + g.build(e) : (console.error("THREE.TSL: 'Loop( { update: ... } )' is not a function, string or number."), A = "break /* invalid update */");
          }
        else
          p === "int" || p === "uint" ? g = m3.includes("<") ? "++" : "--" : g = b() + " 1.", A = d + " " + g;
        const M = e.getVar(p, d) + " = " + v, _ = d + " " + m3 + " " + w;
        y3 = `for ( ${M}; ${_}; ${A} )`;
      }
      e.addFlowCode((o === 0 ? `
` : "") + e.tab + y3 + ` {

`).addFlowTab();
    }
    const n = i.build(e, "void"), r = t.returnsNode ? t.returnsNode.build(e) : "";
    e.removeFlowTab().addFlowCode(`
` + e.tab + n);
    for (let o = 0, l = this.params.length - 1; o < l; o++)
      e.addFlowCode((o === 0 ? "" : e.tab) + `}

`).removeFlowTab();
    return e.addFlowTab(), r;
  }
}
const Pi = (...a) => pe(new CI(ra(a, "int"))).toStack();
const Uo = /* @__PURE__ */ new Ke();
class g_ extends Ea {
  static get type() {
    return "ViewportTextureNode";
  }
  /**
   * Constructs a new viewport texture node.
   *
   * @param {Node} [uvNode=screenUV] - The uv node.
   * @param {?Node} [levelNode=null] - The level node.
   * @param {?Texture} [framebufferTexture=null] - A framebuffer texture holding the viewport data. If not provided, a framebuffer texture is created automatically.
   */
  constructor(e = ca, t = null, s = null) {
    let i = null;
    s === null ? (i = new rC(), i.minFilter = Pn, s = i) : i = s, super(s, e, t), this.generateMipmaps = false, this.defaultFramebuffer = i, this.isOutputTextureNode = true, this.updateBeforeType = Xe.FRAME, this._cacheTextures = /* @__PURE__ */ new WeakMap();
  }
  /**
   * This methods returns a texture for the given render target reference.
   *
   * To avoid rendering errors, `ViewportTextureNode` must use unique framebuffer textures
   * for different render contexts.
   *
   * @param {?RenderTarget} [reference=null] - The render target reference.
   * @return {Texture} The framebuffer texture.
   */
  getTextureForReference(e = null) {
    let t, s;
    if (this.referenceNode ? (t = this.referenceNode.defaultFramebuffer, s = this.referenceNode._cacheTextures) : (t = this.defaultFramebuffer, s = this._cacheTextures), e === null)
      return t;
    if (s.has(e) === false) {
      const i = t.clone();
      s.set(e, i);
    }
    return s.get(e);
  }
  updateReference(e) {
    const t = e.renderer.getRenderTarget();
    return this.value = this.getTextureForReference(t), this.value;
  }
  updateBefore(e) {
    const t = e.renderer, s = t.getRenderTarget();
    s === null ? t.getDrawingBufferSize(Uo) : Uo.set(s.width, s.height);
    const i = this.getTextureForReference(s);
    (i.image.width !== Uo.width || i.image.height !== Uo.height) && (i.image.width = Uo.width, i.image.height = Uo.height, i.needsUpdate = true);
    const n = i.generateMipmaps;
    i.generateMipmaps = this.generateMipmaps, t.copyFramebufferToTexture(i), i.generateMipmaps = n;
  }
  clone() {
    const e = new this.constructor(this.uvNode, this.levelNode, this.value);
    return e.generateMipmaps = this.generateMipmaps, e;
  }
}
let jc = null;
class UI extends g_ {
  static get type() {
    return "ViewportDepthTextureNode";
  }
  /**
   * Constructs a new viewport depth texture node.
   *
   * @param {Node} [uvNode=screenUV] - The uv node.
   * @param {?Node} [levelNode=null] - The level node.
   */
  constructor(e = ca, t = null) {
    jc === null && (jc = new en()), super(e, t, jc);
  }
  /**
   * Overwritten so the method always returns the unique shared
   * depth texture.
   *
   * @return {DepthTexture} The shared depth texture.
   */
  getTextureForReference() {
    return jc;
  }
}
const kI = /* @__PURE__ */ ut(UI).setParameterLength(0, 2);
class Ls extends Ie {
  static get type() {
    return "ViewportDepthNode";
  }
  /**
   * Constructs a new viewport depth node.
   *
   * @param {('depth'|'depthBase'|'linearDepth')} scope - The node's scope.
   * @param {?Node} [valueNode=null] - The value node.
   */
  constructor(e, t = null) {
    super("float"), this.scope = e, this.valueNode = t, this.isViewportDepthNode = true;
  }
  generate(e) {
    const { scope: t } = this;
    return t === Ls.DEPTH_BASE ? e.getFragDepth() : super.generate(e);
  }
  setup({ camera: e }) {
    const { scope: t } = this, s = this.valueNode;
    let i = null;
    if (t === Ls.DEPTH_BASE)
      s !== null && (i = __().assign(s));
    else if (t === Ls.DEPTH)
      e.isPerspectiveCamera ? i = zI(Ht.z, $r, Wr) : i = wl(Ht.z, $r, Wr);
    else if (t === Ls.LINEAR_DEPTH)
      if (s !== null)
        if (e.isPerspectiveCamera) {
          const n = x_(s, $r, Wr);
          i = wl(n, $r, Wr);
        } else
          i = s;
      else
        i = wl(Ht.z, $r, Wr);
    return i;
  }
}
Ls.DEPTH_BASE = "depthBase";
Ls.DEPTH = "depth";
Ls.LINEAR_DEPTH = "linearDepth";
const wl = (a, e, t) => a.add(e).div(e.sub(t)), zI = (a, e, t) => e.add(a).mul(t).div(t.sub(e).mul(a)), x_ = (a, e, t) => e.mul(t).div(t.sub(e).mul(a).sub(t)), __ = /* @__PURE__ */ ut(Ls, Ls.DEPTH_BASE), T_ = /* @__PURE__ */ Te(Ls, Ls.DEPTH);
kI();
T_.assign = (a) => __(a);
class mi extends Ie {
  static get type() {
    return "ClippingNode";
  }
  /**
   * Constructs a new clipping node.
   *
   * @param {('default'|'hardware'|'alphaToCoverage')} [scope='default'] - The node's scope. Similar to other nodes,
   * the selected scope influences the behavior of the node and what type of code is generated.
   */
  constructor(e = mi.DEFAULT) {
    super(), this.scope = e;
  }
  /**
   * Setups the node depending on the selected scope.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Node} The result node.
   */
  setup(e) {
    super.setup(e);
    const t = e.clippingContext, { intersectionPlanes: s, unionPlanes: i } = t;
    return this.hardwareClipping = e.material.hardwareClipping, this.scope === mi.ALPHA_TO_COVERAGE ? this.setupAlphaToCoverage(s, i) : this.scope === mi.HARDWARE ? this.setupHardwareClipping(i, e) : this.setupDefault(s, i);
  }
  /**
   * Setups alpha to coverage.
   *
   * @param {Array<Vector4>} intersectionPlanes - The intersection planes.
   * @param {Array<Vector4>} unionPlanes - The union planes.
   * @return {Node} The result node.
   */
  setupAlphaToCoverage(e, t) {
    return he(() => {
      const s = ae().toVar("distanceToPlane"), i = ae().toVar("distanceToGradient"), n = ae(1).toVar("clipOpacity"), r = t.length;
      if (this.hardwareClipping === false && r > 0) {
        const l = Ni(t).setGroup(De);
        Pi(r, ({ i: c }) => {
          const u = l.element(c);
          s.assign(Ht.dot(u.xyz).negate().add(u.w)), i.assign(s.fwidth().div(2)), n.mulAssign(xr(i.negate(), i, s));
        });
      }
      const o = e.length;
      if (o > 0) {
        const l = Ni(e).setGroup(De), c = ae(1).toVar("intersectionClipOpacity");
        Pi(o, ({ i: u }) => {
          const h = l.element(u);
          s.assign(Ht.dot(h.xyz).negate().add(h.w)), i.assign(s.fwidth().div(2)), c.mulAssign(xr(i.negate(), i, s).oneMinus());
        }), n.mulAssign(c.oneMinus());
      }
      dt.a.mulAssign(n), dt.a.equal(0).discard();
    })();
  }
  /**
   * Setups the default clipping.
   *
   * @param {Array<Vector4>} intersectionPlanes - The intersection planes.
   * @param {Array<Vector4>} unionPlanes - The union planes.
   * @return {Node} The result node.
   */
  setupDefault(e, t) {
    return he(() => {
      const s = t.length;
      if (this.hardwareClipping === false && s > 0) {
        const n = Ni(t).setGroup(De);
        Pi(s, ({ i: r }) => {
          const o = n.element(r);
          Ht.dot(o.xyz).greaterThan(o.w).discard();
        });
      }
      const i = e.length;
      if (i > 0) {
        const n = Ni(e).setGroup(De), r = Mm(true).toVar("clipped");
        Pi(i, ({ i: o }) => {
          const l = n.element(o);
          r.assign(Ht.dot(l.xyz).greaterThan(l.w).and(r));
        }), r.discard();
      }
    })();
  }
  /**
   * Setups hardware clipping.
   *
   * @param {Array<Vector4>} unionPlanes - The union planes.
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Node} The result node.
   */
  setupHardwareClipping(e, t) {
    const s = e.length;
    return t.enableHardwareClipping(s), he(() => {
      const i = Ni(e).setGroup(De), n = Kl(t.getClipDistance());
      Pi(s, ({ i: r }) => {
        const o = i.element(r), l = Ht.dot(o.xyz).sub(o.w).negate();
        n.element(r).assign(l);
      });
    })();
  }
}
mi.ALPHA_TO_COVERAGE = "alphaToCoverage";
mi.DEFAULT = "default";
mi.HARDWARE = "hardware";
le(0.04);
ae(1);
const VB = /* @__PURE__ */ he(([a, e]) => {
  const t = a.toVar();
  t.assign(Ye(2, t).sub(1));
  const s = le(t, 1).toVar();
  return Gt(e.equal(0), () => {
    s.assign(s.zyx);
  }).ElseIf(e.equal(1), () => {
    s.assign(s.xzy), s.xz.mulAssign(-1);
  }).ElseIf(e.equal(2), () => {
    s.x.mulAssign(-1);
  }).ElseIf(e.equal(3), () => {
    s.assign(s.zyx), s.xz.mulAssign(-1);
  }).ElseIf(e.equal(4), () => {
    s.assign(s.xzy), s.xy.mulAssign(-1);
  }).ElseIf(e.equal(5), () => {
    s.z.mulAssign(-1);
  }), s;
}).setLayout({
  name: "getDirection",
  type: "vec3",
  inputs: [
    { name: "uv", type: "vec2" },
    { name: "face", type: "float" }
  ]
});
const xf = /* @__PURE__ */ VB(Yl(), vr("faceIndex")).normalize();
/* @__PURE__ */ le(xf.x, xf.y, xf.z);
pr("vec3");
pr("vec3");
pr("vec3");
new ir();
new Y();
new Y();
new Y();
new Rt();
new Y(0, 0, -1);
new et();
new Y();
new Y();
new et();
new Ke();
const ZF = new uo();
ca.flipX();
ZF.depthTexture = new en(1, 1);
class Ul extends Ie {
  static get type() {
    return "EventNode";
  }
  /**
   * Creates an EventNode.
   *
   * @param {string} eventType - The type of event
   * @param {Function} callback - The callback to execute on update.
   */
  constructor(e, t) {
    super("void"), this.eventType = e, this.callback = t, e === Ul.OBJECT ? this.updateType = Xe.OBJECT : e === Ul.MATERIAL && (this.updateType = Xe.RENDER);
  }
  update(e) {
    this.callback(e);
  }
}
Ul.OBJECT = "object";
Ul.MATERIAL = "material";
const Qa = /* @__PURE__ */ new gi(), bf = /* @__PURE__ */ new Rt();
class Os extends Ie {
  static get type() {
    return "SceneNode";
  }
  /**
   * Constructs a new scene node.
   *
   * @param {('backgroundBlurriness'|'backgroundIntensity'|'backgroundRotation')} scope - The scope defines the type of scene property that is accessed.
   * @param {?Scene} [scene=null] - A reference to the scene.
   */
  constructor(e = Os.BACKGROUND_BLURRINESS, t = null) {
    super(), this.scope = e, this.scene = t;
  }
  /**
   * Depending on the scope, the method returns a different type of node that represents
   * the respective scene property.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Node} The output node.
   */
  setup(e) {
    const t = this.scope, s = this.scene !== null ? this.scene : e.scene;
    let i;
    return t === Os.BACKGROUND_BLURRINESS ? i = At("backgroundBlurriness", "float", s) : t === Os.BACKGROUND_INTENSITY ? i = At("backgroundIntensity", "float", s) : t === Os.BACKGROUND_ROTATION ? i = Ue("mat4").setName("backgroundRotation").setGroup(De).onRenderUpdate(() => {
      const n = s.background;
      return n !== null && n.isTexture && n.mapping !== Qp ? (Qa.copy(s.backgroundRotation), Qa.x *= -1, Qa.y *= -1, Qa.z *= -1, bf.makeRotationFromEuler(Qa)) : bf.identity(), bf;
    }) : console.error("THREE.SceneNode: Unknown scope:", t), i;
  }
}
Os.BACKGROUND_BLURRINESS = "backgroundBlurriness";
Os.BACKGROUND_INTENSITY = "backgroundIntensity";
Os.BACKGROUND_ROTATION = "backgroundRotation";
he(({ texture: a, uv: e }) => {
  const s = le().toVar();
  return Gt(e.x.lessThan(1e-4), () => {
    s.assign(le(1, 0, 0));
  }).ElseIf(e.y.lessThan(1e-4), () => {
    s.assign(le(0, 1, 0));
  }).ElseIf(e.z.lessThan(1e-4), () => {
    s.assign(le(0, 0, 1));
  }).ElseIf(e.x.greaterThan(1 - 1e-4), () => {
    s.assign(le(-1, 0, 0));
  }).ElseIf(e.y.greaterThan(1 - 1e-4), () => {
    s.assign(le(0, -1, 0));
  }).ElseIf(e.z.greaterThan(1 - 1e-4), () => {
    s.assign(le(0, 0, -1));
  }).Else(() => {
    const n = a.sample(e.add(le(-0.01, 0, 0))).r.sub(a.sample(e.add(le(0.01, 0, 0))).r), r = a.sample(e.add(le(0, -0.01, 0))).r.sub(a.sample(e.add(le(0, 0.01, 0))).r), o = a.sample(e.add(le(0, 0, -0.01))).r.sub(a.sample(e.add(le(0, 0, 0.01))).r);
    s.assign(le(n, r, o));
  }), s.normalize();
});
const Qc = /* @__PURE__ */ new Ke();
class rD extends Ea {
  static get type() {
    return "PassTextureNode";
  }
  /**
   * Constructs a new pass texture node.
   *
   * @param {PassNode} passNode - The pass node.
   * @param {Texture} texture - The output texture.
   */
  constructor(e, t) {
    super(t), this.passNode = e, this.setUpdateMatrix(false);
  }
  setup(e) {
    return this.passNode.build(e), super.setup(e);
  }
  clone() {
    return new this.constructor(this.passNode, this.value);
  }
}
class k0 extends rD {
  static get type() {
    return "PassMultipleTextureNode";
  }
  /**
   * Constructs a new pass texture node.
   *
   * @param {PassNode} passNode - The pass node.
   * @param {string} textureName - The output texture name.
   * @param {boolean} [previousTexture=false] - Whether previous frame data should be used or not.
   */
  constructor(e, t, s = false) {
    super(e, null), this.textureName = t, this.previousTexture = s;
  }
  /**
   * Updates the texture reference of this node.
   */
  updateTexture() {
    this.value = this.previousTexture ? this.passNode.getPreviousTexture(this.textureName) : this.passNode.getTexture(this.textureName);
  }
  setup(e) {
    return this.updateTexture(), super.setup(e);
  }
  clone() {
    const e = new this.constructor(this.passNode, this.textureName, this.previousTexture);
    return e.uvNode = this.uvNode, e.levelNode = this.levelNode, e.biasNode = this.biasNode, e.sampler = this.sampler, e.depthNode = this.depthNode, e.compareNode = this.compareNode, e.gradNode = this.gradNode, e;
  }
}
class Uh extends es {
  static get type() {
    return "PassNode";
  }
  /**
   * Constructs a new pass node.
   *
   * @param {('color'|'depth')} scope - The scope of the pass. The scope determines whether the node outputs color or depth.
   * @param {Scene} scene - A reference to the scene.
   * @param {Camera} camera - A reference to the camera.
   * @param {Object} options - Options for the internal render target.
   */
  constructor(e, t, s, i = {}) {
    super("vec4"), this.scope = e, this.scene = t, this.camera = s, this.options = i, this._pixelRatio = 1, this._width = 1, this._height = 1;
    const n = new en();
    n.isRenderTargetTexture = true, n.name = "depth";
    const r = new uo(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: Ks, ...i });
    r.texture.name = "output", r.depthTexture = n, this.renderTarget = r, this._textures = {
      output: r.texture,
      depth: n
    }, this._textureNodes = {}, this._linearDepthNodes = {}, this._viewZNodes = {}, this._previousTextures = {}, this._previousTextureNodes = {}, this._cameraNear = Ue(0), this._cameraFar = Ue(0), this._mrt = null, this._layers = null, this._resolution = 1, this._viewport = null, this._scissor = null, this.isPassNode = true, this.updateBeforeType = Xe.FRAME, this.global = true;
  }
  /**
   * Sets the resolution for the pass.
   * The resolution is a factor that is multiplied with the renderer's width and height.
   *
   * @param {number} resolution - The resolution to set. A value of `1` means full resolution.
   * @return {PassNode} A reference to this pass.
   */
  setResolution(e) {
    return this._resolution = e, this;
  }
  /**
   * Gets the current resolution of the pass.
   *
   * @return {number} The current resolution. A value of `1` means full resolution.
   */
  getResolution() {
    return this._resolution;
  }
  /**
   * Sets the layer configuration that should be used when rendering the pass.
   *
   * @param {Layers} layers - The layers object to set.
   * @return {PassNode} A reference to this pass.
   */
  setLayers(e) {
    return this._layers = e, this;
  }
  /**
   * Gets the current layer configuration of the pass.
   *
   * @return {?Layers} .
   */
  getLayers() {
    return this._layers;
  }
  /**
   * Sets the given MRT node to setup MRT for this pass.
   *
   * @param {MRTNode} mrt - The MRT object.
   * @return {PassNode} A reference to this pass.
   */
  setMRT(e) {
    return this._mrt = e, this;
  }
  /**
   * Returns the current MRT node.
   *
   * @return {MRTNode} The current MRT node.
   */
  getMRT() {
    return this._mrt;
  }
  /**
   * Returns the texture for the given output name.
   *
   * @param {string} name - The output name to get the texture for.
   * @return {Texture} The texture.
   */
  getTexture(e) {
    let t = this._textures[e];
    return t === void 0 && (t = this.renderTarget.texture.clone(), t.name = e, this._textures[e] = t, this.renderTarget.textures.push(t)), t;
  }
  /**
   * Returns the texture holding the data of the previous frame for the given output name.
   *
   * @param {string} name - The output name to get the texture for.
   * @return {Texture} The texture holding the data of the previous frame.
   */
  getPreviousTexture(e) {
    let t = this._previousTextures[e];
    return t === void 0 && (t = this.getTexture(e).clone(), this._previousTextures[e] = t), t;
  }
  /**
   * Switches current and previous textures for the given output name.
   *
   * @param {string} name - The output name.
   */
  toggleTexture(e) {
    const t = this._previousTextures[e];
    if (t !== void 0) {
      const s = this._textures[e], i = this.renderTarget.textures.indexOf(s);
      this.renderTarget.textures[i] = t, this._textures[e] = t, this._previousTextures[e] = s, this._textureNodes[e].updateTexture(), this._previousTextureNodes[e].updateTexture();
    }
  }
  /**
   * Returns the texture node for the given output name.
   *
   * @param {string} [name='output'] - The output name to get the texture node for.
   * @return {TextureNode} The texture node.
   */
  getTextureNode(e = "output") {
    let t = this._textureNodes[e];
    return t === void 0 && (t = pe(new k0(this, e)), t.updateTexture(), this._textureNodes[e] = t), t;
  }
  /**
   * Returns the previous texture node for the given output name.
   *
   * @param {string} [name='output'] - The output name to get the previous texture node for.
   * @return {TextureNode} The previous texture node.
   */
  getPreviousTextureNode(e = "output") {
    let t = this._previousTextureNodes[e];
    return t === void 0 && (this._textureNodes[e] === void 0 && this.getTextureNode(e), t = pe(new k0(this, e, true)), t.updateTexture(), this._previousTextureNodes[e] = t), t;
  }
  /**
   * Returns a viewZ node of this pass.
   *
   * @param {string} [name='depth'] - The output name to get the viewZ node for. In most cases the default `'depth'` can be used however the parameter exists for custom depth outputs.
   * @return {Node} The viewZ node.
   */
  getViewZNode(e = "depth") {
    let t = this._viewZNodes[e];
    if (t === void 0) {
      const s = this._cameraNear, i = this._cameraFar;
      this._viewZNodes[e] = t = x_(this.getTextureNode(e), s, i);
    }
    return t;
  }
  /**
   * Returns a linear depth node of this pass.
   *
   * @param {string} [name='depth'] - The output name to get the linear depth node for. In most cases the default `'depth'` can be used however the parameter exists for custom depth outputs.
   * @return {Node} The linear depth node.
   */
  getLinearDepthNode(e = "depth") {
    let t = this._linearDepthNodes[e];
    if (t === void 0) {
      const s = this._cameraNear, i = this._cameraFar, n = this.getViewZNode(e);
      this._linearDepthNodes[e] = t = wl(n, s, i);
    }
    return t;
  }
  /**
   * Precompiles the pass.
   *
   * Note that this method must be called after the pass configuration is complete.
   * So calls like `setMRT()` and `getTextureNode()` must proceed the precompilation.
   *
   * @async
   * @param {Renderer} renderer - The renderer.
   * @return {Promise} A Promise that resolves when the compile has been finished.
   * @see {@link Renderer#compileAsync}
   */
  async compileAsync(e) {
    const t = e.getRenderTarget(), s = e.getMRT();
    e.setRenderTarget(this.renderTarget), e.setMRT(this._mrt), await e.compileAsync(this.scene, this.camera), e.setRenderTarget(t), e.setMRT(s);
  }
  setup({ renderer: e }) {
    return this.renderTarget.samples = this.options.samples === void 0 ? e.samples : this.options.samples, this.renderTarget.texture.type = e.getColorBufferType(), this.scope === Uh.COLOR ? this.getTextureNode() : this.getLinearDepthNode();
  }
  updateBefore(e) {
    const { renderer: t } = e, { scene: s } = this;
    let i, n;
    const r = t.getOutputRenderTarget();
    r && r.isXRRenderTarget === true ? (n = 1, i = t.xr.getCamera(), t.xr.updateCamera(i), Qc.set(r.width, r.height)) : (i = this.camera, n = t.getPixelRatio(), t.getSize(Qc)), this._pixelRatio = n, this.setSize(Qc.width, Qc.height);
    const o = t.getRenderTarget(), l = t.getMRT(), c = i.layers.mask;
    this._cameraNear.value = i.near, this._cameraFar.value = i.far, this._layers !== null && (i.layers.mask = this._layers.mask);
    for (const u in this._previousTextures)
      this.toggleTexture(u);
    t.setRenderTarget(this.renderTarget), t.setMRT(this._mrt), t.render(s, i), t.setRenderTarget(o), t.setMRT(l), i.layers.mask = c;
  }
  /**
   * Sets the size of the pass's render target. Honors the pixel ratio.
   *
   * @param {number} width - The width to set.
   * @param {number} height - The height to set.
   */
  setSize(e, t) {
    this._width = e, this._height = t;
    const s = this._width * this._pixelRatio * this._resolution, i = this._height * this._pixelRatio * this._resolution;
    this.renderTarget.setSize(s, i), this._scissor !== null && this.renderTarget.scissor.copy(this._scissor), this._viewport !== null && this.renderTarget.viewport.copy(this._viewport);
  }
  /**
   * This method allows to define the pass's scissor rectangle. By default, the scissor rectangle is kept
   * in sync with the pass's dimensions. To reverse the process and use auto-sizing again, call the method
   * with `null` as the single argument.
   *
   * @param {?(number | Vector4)} x - The horizontal coordinate for the lower left corner of the box in logical pixel unit.
   * Instead of passing four arguments, the method also works with a single four-dimensional vector.
   * @param {number} y - The vertical coordinate for the lower left corner of the box in logical pixel unit.
   * @param {number} width - The width of the scissor box in logical pixel unit.
   * @param {number} height - The height of the scissor box in logical pixel unit.
   */
  setScissor(e, t, s, i) {
    e === null ? this._scissor = null : (this._scissor === null && (this._scissor = new et()), e.isVector4 ? this._scissor.copy(e) : this._scissor.set(e, t, s, i), this._scissor.multiplyScalar(this._pixelRatio * this._resolution).floor());
  }
  /**
   * This method allows to define the pass's viewport. By default, the viewport is kept in sync
   * with the pass's dimensions. To reverse the process and use auto-sizing again, call the method
   * with `null` as the single argument.
   *
   * @param {number | Vector4} x - The horizontal coordinate for the lower left corner of the viewport origin in logical pixel unit.
   * @param {number} y - The vertical coordinate for the lower left corner of the viewport origin  in logical pixel unit.
   * @param {number} width - The width of the viewport in logical pixel unit.
   * @param {number} height - The height of the viewport in logical pixel unit.
   */
  setViewport(e, t, s, i) {
    e === null ? this._viewport = null : (this._viewport === null && (this._viewport = new et()), e.isVector4 ? this._viewport.copy(e) : this._viewport.set(e, t, s, i), this._viewport.multiplyScalar(this._pixelRatio * this._resolution).floor());
  }
  /**
   * Sets the pixel ratio the pass's render target and updates the size.
   *
   * @param {number} pixelRatio - The pixel ratio to set.
   */
  setPixelRatio(e) {
    this._pixelRatio = e, this.setSize(this._width, this._height);
  }
  /**
   * Frees internal resources. Should be called when the node is no longer in use.
   */
  dispose() {
    this.renderTarget.dispose();
  }
}
Uh.COLOR = "color";
Uh.DEPTH = "depth";
/* @__PURE__ */ Es2(le(1.6605, -0.1246, -0.0182), le(-0.5876, 1.1329, -0.1006), le(-0.0728, -83e-4, 1.1187));
/* @__PURE__ */ Es2(le(0.6274, 0.0691, 0.0164), le(0.3293, 0.9195, 0.088), le(0.0433, 0.0113, 0.8956));
class _s extends Ie {
  static get type() {
    return "CodeNode";
  }
  /**
   * Constructs a new code node.
   *
   * @param {string} [code=''] - The native code.
   * @param {Array<Node>} [includes=[]] - An array of includes.
   * @param {('js'|'wgsl'|'glsl')} [language=''] - The used language.
   */
  constructor(e = "", t = [], s = "") {
    super("code"), this.isCodeNode = true, this.global = true, this.code = e, this.includes = t, this.language = s;
  }
  /**
   * Sets the includes of this code node.
   *
   * @param {Array<Node>} includes - The includes to set.
   * @return {CodeNode} A reference to this node.
   */
  setIncludes(e) {
    return this.includes = e, this;
  }
  /**
   * Returns the includes of this code node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {Array<Node>} The includes.
   */
  getIncludes() {
    return this.includes;
  }
  generate(e) {
    const t = this.getIncludes(e);
    for (const i of t)
      i.build(e);
    const s = e.getCodeFromNode(this, this.getNodeType(e));
    return s.code = this.code, s.code;
  }
  serialize(e) {
    super.serialize(e), e.code = this.code, e.language = this.language;
  }
  deserialize(e) {
    super.deserialize(e), this.code = e.code, this.language = e.language;
  }
}
function V_(a) {
  let e;
  const t = a.context.getViewZ;
  return t !== void 0 && (e = t(this)), (e || Ht.z).negate();
}
he(([a, e], t) => {
  const s = V_(t);
  return xr(a, e, s);
});
he(([a], e) => {
  const t = V_(e);
  return a.mul(a, t, t).negate().exp().oneMinus();
});
he(([a, e]) => We(e.toFloat().mix(Tl.rgb, a.toVec3()), Tl.a));
class vD extends Ie {
  /**
   * Constructs a new barrier node.
   *
   * @param {string} scope - The scope defines the behavior of the node.
   */
  constructor(e) {
    super(), this.scope = e;
  }
  generate(e) {
    const { scope: t } = this, { renderer: s } = e;
    s.backend.isWebGLBackend === true ? e.addFlowCode(`	// ${t}Barrier 
`) : e.addLineFlowCode(`${t}Barrier()`, this);
  }
}
ut(vD);
class un extends Ie {
  static get type() {
    return "AtomicFunctionNode";
  }
  /**
   * Constructs a new atomic function node.
   *
   * @param {string} method - The signature of the atomic function to construct.
   * @param {Node} pointerNode - An atomic variable or element of an atomic buffer.
   * @param {Node} valueNode - The value that mutates the atomic variable.
   */
  constructor(e, t, s) {
    super("uint"), this.method = e, this.pointerNode = t, this.valueNode = s, this.parents = true;
  }
  /**
   * Overwrites the default implementation to return the type of
   * the pointer node.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The input type.
   */
  getInputType(e) {
    return this.pointerNode.getNodeType(e);
  }
  /**
   * Overwritten since the node type is inferred from the input type.
   *
   * @param {NodeBuilder} builder - The current node builder.
   * @return {string} The node type.
   */
  getNodeType(e) {
    return this.getInputType(e);
  }
  generate(e) {
    const t = e.getNodeProperties(this), s = t.parents, i = this.method, n = this.getNodeType(e), r = this.getInputType(e), o = this.pointerNode, l = this.valueNode, c = [];
    c.push(`&${o.build(e, r)}`), l !== null && c.push(l.build(e, r));
    const u = `${e.getMethod(i, n)}( ${c.join(", ")} )`;
    if (s ? s.length === 1 && s[0].isStackNode === true : false)
      e.addLineFlowCode(u, this);
    else
      return t.constNode === void 0 && (t.constNode = xa(u, n).toConst()), t.constNode.build(e);
  }
}
un.ATOMIC_LOAD = "atomicLoad";
un.ATOMIC_STORE = "atomicStore";
un.ATOMIC_ADD = "atomicAdd";
un.ATOMIC_SUB = "atomicSub";
un.ATOMIC_MAX = "atomicMax";
un.ATOMIC_MIN = "atomicMin";
un.ATOMIC_AND = "atomicAnd";
un.ATOMIC_OR = "atomicOr";
un.ATOMIC_XOR = "atomicXor";
ut(un);
class lt extends es {
  static get type() {
    return "SubgroupFunctionNode";
  }
  /**
   * Constructs a new function node.
   *
   * @param {string} method - The subgroup/wave intrinsic method to construct.
   * @param {Node} [aNode=null] - The method's first argument.
   * @param {Node} [bNode=null] - The method's second argument.
   */
  constructor(e, t = null, s = null) {
    super(), this.method = e, this.aNode = t, this.bNode = s;
  }
  getInputType(e) {
    const t = this.aNode ? this.aNode.getNodeType(e) : null, s = this.bNode ? this.bNode.getNodeType(e) : null, i = e.isMatrix(t) ? 0 : e.getTypeLength(t), n = e.isMatrix(s) ? 0 : e.getTypeLength(s);
    return i > n ? t : s;
  }
  getNodeType(e) {
    const t = this.method;
    return t === lt.SUBGROUP_ELECT ? "bool" : t === lt.SUBGROUP_BALLOT ? "uvec4" : this.getInputType(e);
  }
  generate(e, t) {
    const s = this.method, i = this.getNodeType(e), n = this.getInputType(e), r = this.aNode, o = this.bNode, l = [];
    if (s === lt.SUBGROUP_BROADCAST || s === lt.SUBGROUP_SHUFFLE || s === lt.QUAD_BROADCAST) {
      const u = o.getNodeType(e);
      l.push(
        r.build(e, i),
        o.build(e, u === "float" ? "int" : i)
      );
    } else s === lt.SUBGROUP_SHUFFLE_XOR || s === lt.SUBGROUP_SHUFFLE_DOWN || s === lt.SUBGROUP_SHUFFLE_UP ? l.push(
      r.build(e, i),
      o.build(e, "uint")
    ) : (r !== null && l.push(r.build(e, n)), o !== null && l.push(o.build(e, n)));
    const c = l.length === 0 ? "()" : `( ${l.join(", ")} )`;
    return e.format(`${e.getMethod(s, i)}${c}`, i, t);
  }
  serialize(e) {
    super.serialize(e), e.method = this.method;
  }
  deserialize(e) {
    super.deserialize(e), this.method = e.method;
  }
}
lt.SUBGROUP_ELECT = "subgroupElect";
lt.SUBGROUP_BALLOT = "subgroupBallot";
lt.SUBGROUP_ADD = "subgroupAdd";
lt.SUBGROUP_INCLUSIVE_ADD = "subgroupInclusiveAdd";
lt.SUBGROUP_EXCLUSIVE_AND = "subgroupExclusiveAdd";
lt.SUBGROUP_MUL = "subgroupMul";
lt.SUBGROUP_INCLUSIVE_MUL = "subgroupInclusiveMul";
lt.SUBGROUP_EXCLUSIVE_MUL = "subgroupExclusiveMul";
lt.SUBGROUP_AND = "subgroupAnd";
lt.SUBGROUP_OR = "subgroupOr";
lt.SUBGROUP_XOR = "subgroupXor";
lt.SUBGROUP_MIN = "subgroupMin";
lt.SUBGROUP_MAX = "subgroupMax";
lt.SUBGROUP_ALL = "subgroupAll";
lt.SUBGROUP_ANY = "subgroupAny";
lt.SUBGROUP_BROADCAST_FIRST = "subgroupBroadcastFirst";
lt.QUAD_SWAP_X = "quadSwapX";
lt.QUAD_SWAP_Y = "quadSwapY";
lt.QUAD_SWAP_DIAGONAL = "quadSwapDiagonal";
lt.SUBGROUP_BROADCAST = "subgroupBroadcast";
lt.SUBGROUP_SHUFFLE = "subgroupShuffle";
lt.SUBGROUP_SHUFFLE_XOR = "subgroupShuffleXor";
lt.SUBGROUP_SHUFFLE_UP = "subgroupShuffleUp";
lt.SUBGROUP_SHUFFLE_DOWN = "subgroupShuffleDown";
lt.QUAD_BROADCAST = "quadBroadcast";
he(([a = Yl()], { renderer: e, material: t }) => {
  const s = Uv(a.mul(2).sub(1));
  let i;
  if (t.alphaToCoverage && e.samples > 1) {
    const n = ae(s.fwidth()).toVar();
    i = xr(n.oneMinus(), n.add(1), s).oneMinus();
  } else
    i = Ss(s.greaterThan(1), 0, 1);
  return i;
});
const $o = typeof self < "u" ? self.GPUShaderStage : { VERTEX: 1, FRAGMENT: 2, COMPUTE: 4 };
({
  vertex: $o ? $o.VERTEX : 1,
  fragment: $o ? $o.FRAGMENT : 2,
  compute: $o ? $o.COMPUTE : 4
});
({
  tsl_xor: new _s("fn tsl_xor( a : bool, b : bool ) -> bool { return ( a || b ) && !( a && b ); }"),
  mod_float: new _s("fn tsl_mod_float( x : f32, y : f32 ) -> f32 { return x - y * floor( x / y ); }"),
  mod_vec2: new _s("fn tsl_mod_vec2( x : vec2f, y : vec2f ) -> vec2f { return x - y * floor( x / y ); }"),
  mod_vec3: new _s("fn tsl_mod_vec3( x : vec3f, y : vec3f ) -> vec3f { return x - y * floor( x / y ); }"),
  mod_vec4: new _s("fn tsl_mod_vec4( x : vec4f, y : vec4f ) -> vec4f { return x - y * floor( x / y ); }"),
  equals_bool: new _s("fn tsl_equals_bool( a : bool, b : bool ) -> bool { return a == b; }"),
  equals_bvec2: new _s("fn tsl_equals_bvec2( a : vec2f, b : vec2f ) -> vec2<bool> { return vec2<bool>( a.x == b.x, a.y == b.y ); }"),
  equals_bvec3: new _s("fn tsl_equals_bvec3( a : vec3f, b : vec3f ) -> vec3<bool> { return vec3<bool>( a.x == b.x, a.y == b.y, a.z == b.z ); }"),
  equals_bvec4: new _s("fn tsl_equals_bvec4( a : vec4f, b : vec4f ) -> vec4<bool> { return vec4<bool>( a.x == b.x, a.y == b.y, a.z == b.z, a.w == b.w ); }"),
  repeatWrapping_float: new _s("fn tsl_repeatWrapping_float( coord: f32 ) -> f32 { return fract( coord ); }"),
  mirrorWrapping_float: new _s("fn tsl_mirrorWrapping_float( coord: f32 ) -> f32 { let mirrored = fract( coord * 0.5 ) * 2.0; return 1.0 - abs( 1.0 - mirrored ); }"),
  clampWrapping_float: new _s("fn tsl_clampWrapping_float( coord: f32 ) -> f32 { return clamp( coord, 0.0, 1.0 ); }"),
  biquadraticTexture: new _s(
    /* wgsl */
    `
fn tsl_biquadraticTexture( map : texture_2d<f32>, coord : vec2f, iRes : vec2u, level : u32 ) -> vec4f {

	let res = vec2f( iRes );

	let uvScaled = coord * res;
	let uvWrapping = ( ( uvScaled % res ) + res ) % res;

	// https://www.shadertoy.com/view/WtyXRy

	let uv = uvWrapping - 0.5;
	let iuv = floor( uv );
	let f = fract( uv );

	let rg1 = textureLoad( map, vec2u( iuv + vec2( 0.5, 0.5 ) ) % iRes, level );
	let rg2 = textureLoad( map, vec2u( iuv + vec2( 1.5, 0.5 ) ) % iRes, level );
	let rg3 = textureLoad( map, vec2u( iuv + vec2( 0.5, 1.5 ) ) % iRes, level );
	let rg4 = textureLoad( map, vec2u( iuv + vec2( 1.5, 1.5 ) ) % iRes, level );

	return mix( mix( rg1, rg2, f.x ), mix( rg3, rg4, f.x ), f.y );

}
`
  )
});
const uT = /* @__PURE__ */ new Map([
  [Int8Array, ["sint8", "snorm8"]],
  [Uint8Array, ["uint8", "unorm8"]],
  [Int16Array, ["sint16", "snorm16"]],
  [Uint16Array, ["uint16", "unorm16"]],
  [Int32Array, ["sint32", "snorm32"]],
  [Uint32Array, ["uint32", "unorm32"]],
  [Float32Array, ["float32"]]
]);
typeof Float16Array < "u" && uT.set(Float16Array, ["float16"]);
defineComponent({
  name: "BakeShadows",
  setup() {
    const { renderer: a } = Fs();
    watchEffect(() => {
      a instanceof WebGLRenderer && (a.shadowMap.autoUpdate = false, a.shadowMap.needsUpdate = true);
    });
  }
});
var J3 = `void main() {
  gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
}`, eO = `#include <common>

void main() {
  vec2 center = vec2(0., 1.);
  float rotation = 0.0;

  
  
  float size = 0.03;

  vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
  vec2 scale;
  scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
  scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );

  bool isPerspective = isPerspectiveMatrix( projectionMatrix );
  if ( isPerspective ) scale *= - mvPosition.z;

  vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale * size;
  vec2 rotatedPosition;
  rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
  rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
  mvPosition.xy += rotatedPosition;

  gl_Position = projectionMatrix * mvPosition;
}`;
const Ql = new Vector3(0, 0, 0), Zm = new Vector3(0, 0, 0), tO = new Vector3(0, 0, 0);
function y1(a, e, t) {
  const s = Ql.setFromMatrixPosition(a.matrixWorld);
  s.project(e);
  const i = t.width / 2, n = t.height / 2;
  return [
    (Number.isNaN(s.x) ? 0 : s.x) * i + i,
    -(s.y * n) + n,
    s.z
  ];
}
function sO(a, e) {
  const t = Ql.setFromMatrixPosition(a.matrixWorld), s = Zm.setFromMatrixPosition(e.matrixWorld), i = t.sub(s), n = e.getWorldDirection(tO);
  return i.angleTo(n) > Math.PI / 2;
}
function iO(a, e, t, s) {
  const i = Ql.setFromMatrixPosition(a.matrixWorld), n = i.clone();
  n.project(e), t.setFromCamera(new Vector2(n.x, n.y), e);
  const r = t.intersectObjects(s, true);
  if (r.length > 0) {
    const o = r[0].distance;
    return i.distanceTo(t.ray.origin) < o;
  }
  return true;
}
function nO(a, e) {
  if (e instanceof OrthographicCamera)
    return e.zoom;
  if (e instanceof PerspectiveCamera) {
    const t = Ql.setFromMatrixPosition(a.matrixWorld), s = Zm.setFromMatrixPosition(e.matrixWorld), i = e.fov * Math.PI / 180, n = t.distanceTo(s);
    return 1 / (2 * Math.tan(i / 2) * n);
  } else
    return 1;
}
function rO(a, e, t) {
  if (e instanceof PerspectiveCamera || e instanceof OrthographicCamera) {
    const s = Ql.setFromMatrixPosition(a.matrixWorld), i = Zm.setFromMatrixPosition(e.matrixWorld), n = s.distanceTo(i), r = (t[1] - t[0]) / (e.far - e.near), o = t[1] - r * e.far;
    return Math.round(r * n + o);
  }
}
const Cp = (a) => Math.abs(a) < 1e-10 ? 0 : a;
function hT(a, e, t = "") {
  let s = "matrix3d(";
  for (let i = 0; i !== 16; i++)
    s += Cp(e[i] * a.elements[i]) + (i !== 15 ? "," : ")");
  return t + s;
}
const oO = /* @__PURE__ */ ((a) => (e) => hT(e, a))([1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1, 1, -1, 1, 1]), aO = /* @__PURE__ */ ((a) => (e, t) => hT(e, a(t), "translate(-50%,-50%)"))((a) => [1 / a, 1 / a, 1 / a, 1, -1 / a, -1 / a, -1 / a, -1, 1 / a, 1 / a, 1 / a, 1, 1, 1, 1, 1]), lO = ["geometry", "material"];
/* @__PURE__ */ defineComponent({
  __name: "HTML",
  props: {
    geometry: { default: new PlaneGeometry() },
    material: {},
    as: { default: "div" },
    transform: { type: Boolean, default: false },
    portal: {},
    wrapperClass: {},
    eps: { default: 1e-4 },
    distanceFactor: {},
    fullscreen: { type: Boolean },
    center: { type: Boolean },
    pointerEvents: { default: "auto" },
    sprite: { type: Boolean, default: false },
    zIndexRange: { default: () => [16777271, 0] },
    occlude: { type: [Object, null, Array, Boolean, String] }
  },
  emits: ["onOcclude"],
  setup(a, { expose: e, emit: t }) {
    const s = a, i = t, n = useSlots(), r = useAttrs(), o = ref(), l = ref(), {
      geometry: c,
      material: u,
      as: h,
      transform: f,
      portal: d,
      wrapperClass: p,
      eps: m3,
      distanceFactor: g,
      fullscreen: y3,
      center: x,
      pointerEvents: v,
      sprite: w,
      occlude: A,
      zIndexRange: b
    } = toRefs(s), { renderer: M, scene: _, camera: T, sizes: S3 } = zr(), E = computed(() => (void 0).createElement(h.value)), C = ref([0, 0, 0]), B3 = ref(0), D = ref(), G3 = ref(new Raycaster()), O = computed(() => f.value ? {
      position: "absolute",
      top: 0,
      left: 0,
      width: `${S3.width.value}px`,
      height: `${S3.height.value}px`,
      transformStyle: "preserve-3d",
      pointerEvents: "none",
      zIndex: 2
    } : {
      position: "absolute",
      transform: x.value ? "translate3d(-50%,-50%,0)" : "none",
      ...y3.value && {
        top: -S3.height.value / 2,
        left: -S3.width.value / 2,
        width: `${S3.width.value}px`,
        height: `${S3.height.value}px`
      },
      zIndex: 2,
      ...Object.assign({}, r.style)
    }), ce2 = computed(() => ({
      position: "absolute",
      pointerEvents: v.value
    })), te = ref(null), H = ref(false), ie = computed(
      () => A?.value && A?.value !== "blending" || Array.isArray(A?.value) && A?.value.length && isRef(A.value[0])
    );
    watch(
      () => A,
      ({ value: $ }) => {
        $ === "blending" ? (E.value.style.zIndex = `${Math.floor(b.value[0] / 2)}`, E.value.style.position = "absolute", E.value.style.pointerEvents = "none") : (E.value.style.zIndex = null, E.value.style.position = null, E.value.style.pointerEvents = null);
      }
    ), watch(
      () => [o.value, M.instance, S3.width.value, S3.height.value, n.default?.()],
      ([$, z]) => {
        if ($ && z) {
          const F3 = d?.value || z.domElement;
          if (_.value?.updateMatrixWorld(), f.value)
            E.value.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;overflow:hidden;";
          else {
            const N3 = y1($, T.activeCamera.value, {
              width: S3.width.value,
              height: S3.height.value
            });
            E.value.style.cssText = `position:absolute;top:0;left:0;transform:translate3d(${N3[0]}px,${N3[1]}px,0);transform-origin:0 0;`;
          }
          F3 && !E.value.parentNode && F3.parentNode?.appendChild(E.value), f.value ? D.value = createVNode("div", { id: "outer", style: O.value }, [
            createVNode("div", { id: "inner", style: ce2.value }, [
              createVNode("div", {
                key: l.value?.uuid,
                id: _?.value.uuid,
                class: r.class,
                style: r.style
              }, n.default?.())
            ])
          ]) : D.value = createVNode("div", {
            key: l.value?.uuid,
            id: _?.value.uuid,
            style: O.value
          }, n.default?.()), render(D.value, E.value);
        }
      }
    ), watchEffect(() => {
      p?.value && (E.value.className = p.value);
    });
    const ue2 = ref(true), { onBeforeRender: ge2 } = _l$1();
    ge2(() => {
      if (o.value && T.activeCamera.value && M.instance) {
        T.activeCamera.value?.updateMatrixWorld(), o.value.updateWorldMatrix(true, false);
        const $ = f.value ? C.value : y1(o.value, T.activeCamera.value, {
          width: S3.width.value || 0,
          height: S3.height.value || 0
        });
        if (f.value || Math.abs(B3.value - T.activeCamera.value.zoom) > m3.value || Math.abs(C.value[0] - $[0]) > m3.value || Math.abs(C.value[1] - $[1]) > m3.value || Math.abs(C.value[2] - $[2]) > m3.value) {
          const z = sO(o.value, T.activeCamera.value);
          let F3 = false;
          ie.value && (Array.isArray(A?.value) ? F3 = A?.value : A?.value !== "blending" && (F3 = [_.value]));
          const N3 = ue2.value;
          if (F3) {
            const I = iO(
              o.value,
              T.activeCamera.value,
              G3.value,
              F3
            );
            ue2.value = I && !z;
          } else
            ue2.value = !z;
          N3 !== ue2.value && (i("onOcclude", !ue2.value), E.value.style.display = ue2.value ? "block" : "none");
          const R = Math.floor(b.value[0] / 2), P = A?.value ? ie.value ? [b.value[0], R] : [R - 1, 0] : b.value;
          if (E.value.style.zIndex = `${rO(o.value, T.activeCamera.value, P)}`, f.value) {
            const [I, j3] = [
              S3.width.value / 2,
              S3.height.value / 2
            ], K = T.activeCamera.value.projectionMatrix.elements[5] * j3, { isOrthographicCamera: ee2, top: J, left: fe2, bottom: Se, right: ye2 } = T.activeCamera.value, q = oO(T.activeCamera.value.matrixWorldInverse), L3 = ee2 ? `scale(${K})translate(${Cp(-(ye2 + fe2) / 2)}px,${Cp((J + Se) / 2)}px)` : `translateZ(${K}px)`;
            let xe = o.value.matrixWorld;
            if (w.value && (xe = T.activeCamera.value.matrixWorldInverse.clone().transpose().copyPosition(xe).scale(o.value.scale), xe.elements[3] = xe.elements[7] = xe.elements[11] = 0, xe.elements[15] = 1), E.value.style.width = `${S3.width.value}px`, E.value.style.height = `${S3.height.value}px`, E.value.style.perspective = ee2 ? "" : `${K}px`, D.value?.el && D.value?.children && Array.isArray(D.value.children)) {
              D.value.el.style.transform = `${L3}${q}translate(${I}px,${j3}px)`;
              const Ne2 = D.value.children[0];
              Ne2 && Ne2.el && (Ne2.el.style.transform = aO(
                xe,
                1 / ((g?.value || 10) / 400)
              ));
            }
          } else {
            const I = g?.value === void 0 ? 1 : nO(o.value, T.activeCamera.value) * g?.value;
            E.value.style.transform = `translate3d(${$[0]}px,${$[1]}px,0) scale(${I})`;
          }
        }
        C.value = $, B3.value = T.activeCamera.value.zoom;
      }
      if (!ie.value && l.value && !H.value)
        if (f.value) {
          if (D.value?.el && D.value?.children) {
            const $ = (D.value?.children)[0];
            if ($?.clientWidth && $?.clientHeight) {
              const { isOrthographicCamera: z } = T.activeCamera.value;
              if (z || c)
                r.scale && (Array.isArray(r.scale) ? r.scale instanceof Vector3 ? l.value.scale.copy(r.scale.clone().divideScalar(1)) : l.value.scale.set(1 / r.scale[0], 1 / r.scale[1], 1 / r.scale[2]) : l.value.scale.setScalar(1 / r.scale));
              else {
                const F3 = (g?.value || 10) / 400, N3 = $.clientWidth * F3, R = $.clientHeight * F3;
                l.value.scale.set(N3, R, 1);
              }
              H.value = true;
            }
          }
        } else {
          const $ = E.value.children[0];
          if ($?.clientWidth && $?.clientHeight) {
            const F3 = $.clientWidth * 1, N3 = $.clientHeight * 1;
            l.value.scale.set(F3, N3, 1), H.value = true;
          }
          te.value.lookAt(T.activeCamera.value?.position);
        }
    });
    const we = computed(() => ({
      vertexShader: f.value ? void 0 : eO,
      fragmentShader: J3
    })), W = computed(() => {
      const $ = we.value;
      return u.value || new ShaderMaterial({
        vertexShader: $.vertexShader,
        fragmentShader: $.fragmentShader,
        side: DoubleSide
      });
    });
    return e({ instance: o }), ($, z) => (openBlock(), createElementBlock("TresGroup", {
      ref_key: "groupRef",
      ref: o
    }, [
      unref(A) && !ie.value ? (openBlock(), createElementBlock("TresMesh", {
        key: 0,
        ref_key: "meshRef",
        ref: l,
        geometry: unref(c),
        material: W.value
      }, null, 8, lO)) : createCommentVNode("", true)
    ], 512));
  }
});
var xu = { exports: {} }, cO = xu.exports, x1;
function uO() {
  return x1 || (x1 = 1, (function(a, e) {
    (function(t, s) {
      a.exports = s();
    })(cO, function() {
      var t = function() {
        function s(d) {
          return r.appendChild(d.dom), d;
        }
        function i(d) {
          for (var p = 0; p < r.children.length; p++) r.children[p].style.display = p === d ? "block" : "none";
          n = d;
        }
        var n = 0, r = (void 0).createElement("div");
        r.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", r.addEventListener("click", function(d) {
          d.preventDefault(), i(++n % r.children.length);
        }, false);
        var o = (performance || Date).now(), l = o, c = 0, u = s(new t.Panel("FPS", "#0ff", "#002")), h = s(new t.Panel("MS", "#0f0", "#020"));
        if (self.performance && self.performance.memory) var f = s(new t.Panel("MB", "#f08", "#201"));
        return i(0), { REVISION: 16, dom: r, addPanel: s, showPanel: i, begin: function() {
          o = (performance || Date).now();
        }, end: function() {
          c++;
          var d = (performance || Date).now();
          if (h.update(d - o, 200), d > l + 1e3 && (u.update(1e3 * c / (d - l), 100), l = d, c = 0, f)) {
            var p = performance.memory;
            f.update(p.usedJSHeapSize / 1048576, p.jsHeapSizeLimit / 1048576);
          }
          return d;
        }, update: function() {
          o = this.end();
        }, domElement: r, setMode: i };
      };
      return t.Panel = function(s, i, n) {
        var r = 1 / 0, o = 0, l = Math.round, c = l((void 0).devicePixelRatio || 1), u = 80 * c, h = 48 * c, f = 3 * c, d = 2 * c, p = 3 * c, m3 = 15 * c, g = 74 * c, y3 = 30 * c, x = (void 0).createElement("canvas");
        x.width = u, x.height = h, x.style.cssText = "width:80px;height:48px";
        var v = x.getContext("2d");
        return v.font = "bold " + 9 * c + "px Helvetica,Arial,sans-serif", v.textBaseline = "top", v.fillStyle = n, v.fillRect(0, 0, u, h), v.fillStyle = i, v.fillText(s, f, d), v.fillRect(p, m3, g, y3), v.fillStyle = n, v.globalAlpha = 0.9, v.fillRect(p, m3, g, y3), { dom: x, update: function(w, A) {
          r = Math.min(r, w), o = Math.max(o, w), v.fillStyle = n, v.globalAlpha = 1, v.fillRect(0, 0, u, m3), v.fillStyle = i, v.fillText(l(w) + " " + s + " (" + l(r) + "-" + l(o) + ")", f, d), v.drawImage(x, p + c, m3, g - c, y3, p, m3, g - c, y3), v.fillRect(p + g - c, m3, c, y3), v.fillStyle = n, v.globalAlpha = 0.9, v.fillRect(p + g - c, m3, c, l((1 - w / A) * y3));
        } };
      }, t;
    });
  })(xu)), xu.exports;
}
var hO = uO();
const dO = /* @__PURE__ */ $l(hO);
defineComponent({
  name: "Stats",
  props: {
    showPanel: {
      type: Number,
      default: 0
    }
  },
  setup(a, { expose: e }) {
    const t = new dO();
    e({ instance: t });
    const s = (void 0).body;
    t.showPanel(a.showPanel || 0), s?.appendChild(t.dom);
    const { onBeforeRender: i, onRender: n } = _l$1();
    i(() => t.begin(), Number.NEGATIVE_INFINITY), n(() => t.end(), Number.POSITIVE_INFINITY);
  }
});
class fO {
  constructor(e, t, s) {
    this.name = e, this.fg = t, this.bg = s, this.gradient = null, this.PR = Math.round((void 0).devicePixelRatio || 1), this.WIDTH = 90 * this.PR, this.HEIGHT = 48 * this.PR, this.TEXT_X = 3 * this.PR, this.TEXT_Y = 2 * this.PR, this.GRAPH_X = 3 * this.PR, this.GRAPH_Y = 15 * this.PR, this.GRAPH_WIDTH = 84 * this.PR, this.GRAPH_HEIGHT = 30 * this.PR, this.canvas = (void 0).createElement("canvas"), this.canvas.width = this.WIDTH, this.canvas.height = this.HEIGHT, this.canvas.style.width = "90px", this.canvas.style.height = "48px", this.canvas.style.position = "absolute", this.canvas.style.cssText = "width:90px;height:48px", this.context = this.canvas.getContext("2d"), this.initializeCanvas();
  }
  createGradient() {
    if (!this.context)
      throw new Error("No context");
    const e = this.context.createLinearGradient(
      0,
      this.GRAPH_Y,
      0,
      this.GRAPH_Y + this.GRAPH_HEIGHT
    );
    let t;
    const s = this.fg;
    switch (this.fg.toLowerCase()) {
      case "#0ff":
        t = "#006666";
        break;
      case "#0f0":
        t = "#006600";
        break;
      case "#ff0":
        t = "#666600";
        break;
      case "#e1e1e1":
        t = "#666666";
        break;
      default:
        t = this.bg;
        break;
    }
    return e.addColorStop(0, t), e.addColorStop(1, s), e;
  }
  initializeCanvas() {
    this.context && (this.context.font = "bold " + 9 * this.PR + "px Helvetica,Arial,sans-serif", this.context.textBaseline = "top", this.gradient = this.createGradient(), this.context.fillStyle = this.bg, this.context.fillRect(0, 0, this.WIDTH, this.HEIGHT), this.context.fillStyle = this.fg, this.context.fillText(this.name, this.TEXT_X, this.TEXT_Y), this.context.fillStyle = this.fg, this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT), this.context.fillStyle = this.bg, this.context.globalAlpha = 0.9, this.context.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT));
  }
  update(e, t, s, i, n = 0) {
    if (!this.context || !this.gradient)
      return;
    const r = Math.min(1 / 0, e), o = Math.max(s, e);
    i = Math.max(i, t), this.context.globalAlpha = 1, this.context.fillStyle = this.bg, this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y), this.context.fillStyle = this.fg, this.context.fillText(
      `${e.toFixed(n)} ${this.name} (${r.toFixed(n)}-${parseFloat(
        o.toFixed(n)
      )})`,
      this.TEXT_X,
      this.TEXT_Y
    ), this.context.drawImage(
      this.canvas,
      this.GRAPH_X + this.PR,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT,
      this.GRAPH_X,
      this.GRAPH_Y,
      this.GRAPH_WIDTH - this.PR,
      this.GRAPH_HEIGHT
    );
    const l = this.GRAPH_HEIGHT - (1 - t / i) * this.GRAPH_HEIGHT;
    l > 0 && (this.context.globalAlpha = 1, this.context.fillStyle = this.gradient, this.context.fillRect(
      this.GRAPH_X + this.GRAPH_WIDTH - this.PR,
      this.GRAPH_Y + this.GRAPH_HEIGHT - l,
      this.PR,
      l
    ));
  }
}
const dT = class Wo {
  constructor({
    trackGPU: e = false,
    logsPerSecond: t = 30,
    samplesLog: s = 60,
    samplesGraph: i = 10,
    precision: n = 2,
    minimal: r = false,
    horizontal: o = true,
    mode: l = 0
  } = {}) {
    this.gl = null, this.ext = null, this.activeQuery = null, this.gpuQueries = [], this.threeRendererPatched = false, this.frames = 0, this.renderCount = 0, this.isRunningCPUProfiling = false, this.totalCpuDuration = 0, this.totalGpuDuration = 0, this.totalGpuDurationCompute = 0, this.totalFps = 0, this.gpuPanel = null, this.gpuPanelCompute = null, this.averageFps = { logs: [], graph: [] }, this.averageCpu = { logs: [], graph: [] }, this.averageGpu = { logs: [], graph: [] }, this.averageGpuCompute = { logs: [], graph: [] }, this.handleClick = (c) => {
      c.preventDefault(), this.showPanel(++this.mode % this.dom.children.length);
    }, this.handleResize = () => {
      this.resizePanel(this.fpsPanel, 0), this.resizePanel(this.msPanel, 1), this.gpuPanel && this.resizePanel(this.gpuPanel, 2), this.gpuPanelCompute && this.resizePanel(this.gpuPanelCompute, 3);
    }, this.mode = l, this.horizontal = o, this.minimal = r, this.trackGPU = e, this.samplesLog = s, this.samplesGraph = i, this.precision = n, this.logsPerSecond = t, this.dom = (void 0).createElement("div"), this.initializeDOM(), this.beginTime = performance.now(), this.prevTime = this.beginTime, this.prevCpuTime = this.beginTime, this.fpsPanel = this.addPanel(new Wo.Panel("FPS", "#0ff", "#002"), 0), this.msPanel = this.addPanel(new Wo.Panel("CPU", "#0f0", "#020"), 1), this.setupEventListeners();
  }
  initializeDOM() {
    this.dom.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      opacity: 0.9;
      z-index: 10000;
      ${this.minimal ? "cursor: pointer;" : ""}
    `;
  }
  setupEventListeners() {
    this.minimal ? (this.dom.addEventListener("click", this.handleClick), this.showPanel(this.mode)) : (void 0).addEventListener("resize", this.handleResize);
  }
  async init(e) {
    if (!e) {
      console.error('Stats: The "canvas" parameter is undefined.');
      return;
    }
    this.handleThreeRenderer(e) || await this.handleWebGPURenderer(e) || this.initializeWebGL(e);
  }
  handleThreeRenderer(e) {
    return e.isWebGLRenderer && !this.threeRendererPatched ? (this.patchThreeRenderer(e), this.gl = e.getContext(), this.trackGPU && this.initializeGPUTracking(), true) : false;
  }
  async handleWebGPURenderer(e) {
    return e.isWebGPURenderer ? (this.trackGPU && (e.backend.trackTimestamp = true, await e.hasFeatureAsync("timestamp-query") && this.initializeWebGPUPanels()), this.info = e.info, true) : false;
  }
  initializeWebGPUPanels() {
    this.gpuPanel = this.addPanel(new Wo.Panel("GPU", "#ff0", "#220"), 2), this.gpuPanelCompute = this.addPanel(
      new Wo.Panel("CPT", "#e1e1e1", "#212121"),
      3
    );
  }
  initializeWebGL(e) {
    if (e instanceof WebGL2RenderingContext)
      this.gl = e;
    else if (e instanceof HTMLCanvasElement || e instanceof OffscreenCanvas) {
      if (this.gl = e.getContext("webgl2"), !this.gl)
        return console.error("Stats: Unable to obtain WebGL2 context."), false;
    } else
      return console.error(
        "Stats: Invalid input type. Expected WebGL2RenderingContext, HTMLCanvasElement, or OffscreenCanvas."
      ), false;
    return true;
  }
  initializeGPUTracking() {
    this.gl && (this.ext = this.gl.getExtension("EXT_disjoint_timer_query_webgl2"), this.ext && (this.gpuPanel = this.addPanel(new Wo.Panel("GPU", "#ff0", "#220"), 2)));
  }
  begin() {
    this.isRunningCPUProfiling || this.beginProfiling("cpu-started"), !(!this.gl || !this.ext) && (this.activeQuery && this.gl.endQuery(this.ext.TIME_ELAPSED_EXT), this.activeQuery = this.gl.createQuery(), this.activeQuery && this.gl.beginQuery(this.ext.TIME_ELAPSED_EXT, this.activeQuery));
  }
  end() {
    this.renderCount++, this.gl && this.ext && this.activeQuery && (this.gl.endQuery(this.ext.TIME_ELAPSED_EXT), this.gpuQueries.push({ query: this.activeQuery }), this.activeQuery = null);
  }
  update() {
    this.info ? this.processWebGPUTimestamps() : this.processGpuQueries(), this.endProfiling("cpu-started", "cpu-finished", "cpu-duration"), this.updateAverages(), this.resetCounters();
  }
  processWebGPUTimestamps() {
    this.totalGpuDuration = this.info.render.timestamp, this.totalGpuDurationCompute = this.info.compute.timestamp, this.addToAverage(this.totalGpuDurationCompute, this.averageGpuCompute);
  }
  updateAverages() {
    this.addToAverage(this.totalCpuDuration, this.averageCpu), this.addToAverage(this.totalGpuDuration, this.averageGpu);
  }
  resetCounters() {
    this.renderCount = 0, this.totalCpuDuration === 0 && this.beginProfiling("cpu-started"), this.totalCpuDuration = 0, this.totalFps = 0, this.beginTime = this.endInternal();
  }
  resizePanel(e, t) {
    e.canvas.style.position = "absolute", this.minimal ? e.canvas.style.display = "none" : (e.canvas.style.display = "block", this.horizontal ? (e.canvas.style.top = "0px", e.canvas.style.left = t * e.WIDTH / e.PR + "px") : (e.canvas.style.left = "0px", e.canvas.style.top = t * e.HEIGHT / e.PR + "px"));
  }
  addPanel(e, t) {
    return e.canvas && (this.dom.appendChild(e.canvas), this.resizePanel(e, t)), e;
  }
  showPanel(e) {
    for (let t = 0; t < this.dom.children.length; t++) {
      const s = this.dom.children[t];
      s.style.display = t === e ? "block" : "none";
    }
    this.mode = e;
  }
  processGpuQueries() {
    !this.gl || !this.ext || (this.totalGpuDuration = 0, this.gpuQueries.forEach((e, t) => {
      if (this.gl) {
        const s = this.gl.getQueryParameter(e.query, this.gl.QUERY_RESULT_AVAILABLE), i = this.gl.getParameter(this.ext.GPU_DISJOINT_EXT);
        if (s && !i) {
          const r = this.gl.getQueryParameter(e.query, this.gl.QUERY_RESULT) * 1e-6;
          this.totalGpuDuration += r, this.gl.deleteQuery(e.query), this.gpuQueries.splice(t, 1);
        }
      }
    }));
  }
  endInternal() {
    this.frames++;
    const e = (performance || Date).now(), t = e - this.prevTime;
    if (e >= this.prevCpuTime + 1e3 / this.logsPerSecond) {
      const s = Math.round(this.frames * 1e3 / t);
      this.addToAverage(s, this.averageFps), this.updatePanel(this.fpsPanel, this.averageFps, 0), this.updatePanel(this.msPanel, this.averageCpu, this.precision), this.updatePanel(this.gpuPanel, this.averageGpu, this.precision), this.gpuPanelCompute && this.updatePanel(this.gpuPanelCompute, this.averageGpuCompute), this.frames = 0, this.prevCpuTime = e, this.prevTime = e;
    }
    return e;
  }
  addToAverage(e, t) {
    t.logs.push(e), t.logs.length > this.samplesLog && t.logs.shift(), t.graph.push(e), t.graph.length > this.samplesGraph && t.graph.shift();
  }
  beginProfiling(e) {
    (void 0).performance && ((void 0).performance.mark(e), this.isRunningCPUProfiling = true);
  }
  endProfiling(e, t, s) {
    if ((void 0).performance && t && this.isRunningCPUProfiling) {
      (void 0).performance.mark(t);
      const i = performance.measure(s, e, t);
      this.totalCpuDuration += i.duration, this.isRunningCPUProfiling = false;
    }
  }
  updatePanel(e, t, s = 2) {
    if (t.logs.length > 0) {
      let i = 0, n = 0.01;
      for (let l = 0; l < t.logs.length; l++)
        i += t.logs[l], t.logs[l] > n && (n = t.logs[l]);
      let r = 0, o = 0.01;
      for (let l = 0; l < t.graph.length; l++)
        r += t.graph[l], t.graph[l] > o && (o = t.graph[l]);
      e && e.update(i / Math.min(t.logs.length, this.samplesLog), r / Math.min(t.graph.length, this.samplesGraph), n, o, s);
    }
  }
  get domElement() {
    return this.dom;
  }
  patchThreeRenderer(e) {
    const t = e.render, s = this;
    e.render = function(i, n) {
      s.begin(), t.call(this, i, n), s.end();
    }, this.threeRendererPatched = true;
  }
};
dT.Panel = fO;
let pO = dT;
defineComponent({
  name: "StatsGl",
  props: [
    "logsPerSecond",
    "samplesLog",
    "samplesGraph",
    "precision",
    "horizontal",
    "minimal",
    "mode"
  ],
  setup(a, { expose: e }) {
    const t = new pO({
      logsPerSecond: a.logsPerSecond,
      samplesLog: a.samplesLog,
      samplesGraph: a.samplesGraph,
      precision: a.precision,
      horizontal: a.horizontal,
      minimal: a.minimal,
      mode: a.mode
    });
    e({ instance: t });
    const s = (void 0).body, i = t.container;
    s?.appendChild(i);
    const { renderer: n } = zr(), { onRender: r } = _l$1();
    t.init(n.instance), r(() => t.update(), Number.POSITIVE_INFINITY);
  }
});
/* @__PURE__ */ gh(
  {
    color: new Color(),
    blend: 2,
    alphaTest: 0.75,
    opacity: 0,
    map: null
  },
  `varying vec2 vUv;
   void main() {
     gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.);
     vUv = uv;
   }`,
  `varying vec2 vUv;
   uniform sampler2D map;
   uniform vec3 color;
   uniform float opacity;
   uniform float alphaTest;
   uniform float blend;
   void main() {
     vec4 sampledDiffuseColor = texture2D(map, vUv);
     gl_FragColor = vec4(color * sampledDiffuseColor.r * blend, max(0.0, (1.0 - (sampledDiffuseColor.r + sampledDiffuseColor.g + sampledDiffuseColor.b) / alphaTest)) * opacity);
     #include <tonemapping_fragment>
     #include <colorspace_fragment>
   }`
);
const sk = {
  key: 0,
  args: [0, 1, 64]
}, ik = {
  key: 1,
  args: [0.5, 1, 64]
}, nk = { key: 2 }, rk = ["tone-mapped", "map", "side", "color"];
/* @__PURE__ */ defineComponent({
  __name: "index",
  props: {
    args: { default: null },
    form: { default: "rect" },
    toneMapped: { type: Boolean, default: false },
    map: { default: null },
    intensity: { default: 1 },
    color: { default: new Color(16777215) }
  },
  setup(a, { expose: e }) {
    const t = a, s = ref(), i = ref();
    return watchEffect(() => {
      s.value && (s.value.color.copy(new Color(t.color)), s.value.color.multiplyScalar(t.intensity), s.value.needsUpdate = true);
    }), e({ mesh: i }), (n, r) => (openBlock(), createElementBlock("TresMesh", {
      ref_key: "mesh",
      ref: i
    }, [
      a.form === "circle" ? (openBlock(), createElementBlock("TresRingGeometry", sk)) : a.form === "ring" ? (openBlock(), createElementBlock("TresRingGeometry", ik)) : a.form === "rect" ? (openBlock(), createElementBlock("TresPlaneGeometry", nk)) : (openBlock(), createBlock(t.form, {
        key: 3,
        args: a.args
      }, null, 8, ["args"])),
      createElementVNode("TresMeshBasicMaterial", {
        ref_key: "material",
        ref: s,
        "tone-mapped": a.toneMapped,
        map: a.map,
        side: unref(DoubleSide),
        color: a.color
      }, null, 8, rk)
    ], 512));
  }
});
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "WhiteCubePlaceholder",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean, default: true },
    opacity: { default: 1 }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.visible) {
        _push(`<TresMesh${ssrRenderAttrs(mergeProps({
          position: [0, 0, 0],
          rotation: [0, Math.PI / 6, 0]
        }, _attrs))} data-v-2dc39462><TresBoxGeometry${ssrRenderAttr("args", [15, 12, 15])} data-v-2dc39462></TresBoxGeometry><TresMeshStandardMaterial${ssrRenderAttr("color", "#FFFFFF")}${ssrRenderAttr("roughness", 0.8)}${ssrRenderAttr("metalness", 0.1)}${ssrRenderAttr("emissive", "#FFFFFF")}${ssrRenderAttr("emissiveIntensity", 0.02)}${ssrRenderAttr("transparent", true)}${ssrRenderAttr("opacity", props.opacity)} data-v-2dc39462></TresMeshStandardMaterial></TresMesh>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WhiteCubePlaceholder.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const WhiteCubePlaceholder = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["__scopeId", "data-v-2dc39462"]]), { __name: "WhiteCubePlaceholder" });
function useCameraControls(config = {}) {
  const {
    baseRadius = 45,
    autoRotationSpeed = 2 * Math.PI / 90,
    // Full rotation in 90 seconds
    sensitivity = 3e-3,
    damping = 0.08,
    minPhi = 0.05,
    maxPhi = Math.PI / 2 - 0.05
  } = config;
  const runtimeCamera = ref(null);
  const lookAtTarget = ref(null);
  const sphericalCoords = ref({
    radius: baseRadius,
    theta: 0,
    phi: Math.PI / 3
  });
  const targetSpherical = ref({
    theta: 0,
    phi: Math.PI / 3
  });
  const currentSpherical = ref({
    theta: 0,
    phi: Math.PI / 3
  });
  const isInteracting = ref(false);
  const isAutoRotating = ref(true);
  const previousInteractionPosition = ref({ x: 0, y: 0 });
  const clock = markRaw(new Ki.Clock());
  const sphericalToCartesian = (radius, theta, phi) => {
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y3 = radius * Math.cos(phi);
    return new Ki.Vector3(x, y3, z);
  };
  const clampPhi = (phi) => {
    return Math.max(minPhi, Math.min(maxPhi, phi));
  };
  const initializeFromCamera = (camera, target) => {
    runtimeCamera.value = markRaw(camera);
    lookAtTarget.value = markRaw(target);
    const targetPos = new Ki.Vector3();
    target.getWorldPosition(targetPos);
    const cameraPos = new Ki.Vector3();
    camera.getWorldPosition(cameraPos);
    const offset = cameraPos.clone().sub(targetPos);
    const distance = offset.length();
    sphericalCoords.value = {
      radius: distance || baseRadius,
      theta: Math.atan2(offset.z, offset.x),
      phi: Math.acos(Math.max(-1, Math.min(1, offset.y / distance)))
    };
    targetSpherical.value.theta = sphericalCoords.value.theta;
    targetSpherical.value.phi = sphericalCoords.value.phi;
    currentSpherical.value.theta = sphericalCoords.value.theta;
    currentSpherical.value.phi = sphericalCoords.value.phi;
  };
  const createDefaultCamera = () => {
    const camera = new Ki.PerspectiveCamera(50, 1, 0.1, 1e3);
    camera.position.set(30, 20, 30);
    const target = new Ki.Object3D();
    target.position.set(0, 0, 0);
    initializeFromCamera(camera, target);
    return camera;
  };
  const startInteraction = (x, y3) => {
    isInteracting.value = true;
    isAutoRotating.value = false;
    previousInteractionPosition.value = { x, y: y3 };
  };
  const updateInteraction = (x, y3) => {
    if (!isInteracting.value) return;
    const deltaX = x - previousInteractionPosition.value.x;
    const deltaY = y3 - previousInteractionPosition.value.y;
    targetSpherical.value.theta -= deltaX * sensitivity;
    targetSpherical.value.phi += deltaY * sensitivity;
    targetSpherical.value.phi = clampPhi(targetSpherical.value.phi);
    previousInteractionPosition.value = { x, y: y3 };
  };
  const endInteraction = () => {
    isInteracting.value = false;
    setTimeout(() => {
      if (!isInteracting.value) {
        isAutoRotating.value = true;
      }
    }, 1e3);
  };
  const updateCameraPosition = (effectiveRadius, deltaTime, phiAdjustment) => {
    if (!runtimeCamera.value || !lookAtTarget.value) return;
    const delta = deltaTime ?? clock.getDelta();
    if (isAutoRotating.value && !isInteracting.value) {
      targetSpherical.value.theta += autoRotationSpeed * delta;
    }
    currentSpherical.value.theta += (targetSpherical.value.theta - currentSpherical.value.theta) * damping;
    currentSpherical.value.phi += (targetSpherical.value.phi - currentSpherical.value.phi) * damping;
    const targetWorldPos = new Ki.Vector3();
    lookAtTarget.value.getWorldPosition(targetWorldPos);
    const adjustedPhi = phiAdjustment !== void 0 ? currentSpherical.value.phi + phiAdjustment : currentSpherical.value.phi;
    const radius = effectiveRadius ?? sphericalCoords.value.radius;
    const cameraOffset = sphericalToCartesian(
      radius,
      currentSpherical.value.theta,
      adjustedPhi
    );
    runtimeCamera.value.position.copy(targetWorldPos).add(cameraOffset);
    runtimeCamera.value.lookAt(targetWorldPos);
    runtimeCamera.value.updateMatrixWorld();
  };
  const setAutoRotation = (enabled) => {
    isAutoRotating.value = enabled;
  };
  const resetCamera = () => {
    targetSpherical.value.theta = 0;
    targetSpherical.value.phi = Math.PI / 3;
  };
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
    createDefaultCamera,
    startInteraction,
    updateInteraction,
    endInteraction,
    updateCameraPosition,
    setAutoRotation,
    resetCamera,
    sphericalToCartesian,
    clampPhi
  };
}
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval$1 = () => {
  console.error(intervalError);
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HouseModelRig",
  __ssrInlineRender: true,
  props: {
    canvasElement: {},
    loadModel: { type: Boolean },
    scrollControlledRadius: {},
    isScrollingActive: { type: Boolean },
    responsiveMode: {}
  },
  emits: ["camera-ready", "model-ready", "loading-started", "loading-progress", "loading-complete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { state, progress } = NA("/models/ok10b_circle.glb", {
      draco: true
    });
    const isModelLoading = ref(false);
    const hasEmittedComplete = ref(false);
    const houseModel = shallowRef(null);
    const cubeOpacity = ref(1);
    ref(0);
    const showHouseModel = computed(() => props.loadModel && hasEmittedComplete.value);
    const {
      runtimeCamera,
      lookAtTarget,
      sphericalCoords,
      isInteracting,
      initializeFromCamera,
      startInteraction,
      updateInteraction,
      endInteraction,
      setAutoRotation
    } = useCameraControls({
      baseRadius: 45,
      autoRotationSpeed: 2 * Math.PI / 90,
      sensitivity: props.responsiveMode === "mobile" ? 5e-3 : 3e-3,
      // Higher sensitivity for mobile
      damping: 0.08
    });
    computed(() => {
      return props.scrollControlledRadius ?? sphericalCoords.value.radius;
    });
    computed(() => {
      if (props.responsiveMode !== "mobile") return 0;
      const maxRadius = 50;
      const minRadius = 22;
      const currentRadius = props.scrollControlledRadius ?? maxRadius;
      const zoomProgress = 1 - (currentRadius - minRadius) / (maxRadius - minRadius);
      const clampedProgress = Math.max(0, Math.min(1, zoomProgress));
      const zoomedOutPhiAdjustment = -0.15;
      const zoomedInPhiAdjustment = 0.1;
      return zoomedOutPhiAdjustment + (zoomedInPhiAdjustment - zoomedOutPhiAdjustment) * clampedProgress;
    });
    const isScrollControlled = computed(() => {
      if (props.responsiveMode === "mobile") {
        return props.isScrollingActive ?? false;
      }
      return props.isScrollingActive ?? false;
    });
    const scene = computed(() => state.value?.scene ?? null);
    watch(progress, (newProgress) => {
      console.log("[HouseModelRig] Progress:", newProgress);
      if (newProgress > 0 && !isModelLoading.value) {
        console.log("[HouseModelRig] Starting load");
        isModelLoading.value = true;
        emit("loading-started");
      }
      if (newProgress > 0 && newProgress < 1) {
        const percentage = Math.round(newProgress * 100);
        console.log(`[HouseModelRig] Progress: ${percentage}%`);
        emit("loading-progress", percentage);
      }
    });
    watch(
      scene,
      (loadedScene) => {
        console.log(
          "[HouseModelRig] Scene changed:",
          loadedScene ? "loaded" : "null"
        );
        if (loadedScene && !hasEmittedComplete.value) {
          console.log(
            "[HouseModelRig] Scene is loaded! Emitting loading-complete event"
          );
          hasEmittedComplete.value = true;
          isModelLoading.value = false;
          emit("loading-complete");
        }
      },
      { immediate: true }
    );
    watch(showHouseModel, (shouldShow) => {
      if (shouldShow) {
        setInterval$1();
      }
    });
    const handleMouseDown = (event) => {
      startInteraction(event.clientX, event.clientY);
      if (props.canvasElement) {
        props.canvasElement.style.cursor = "grabbing";
      }
    };
    const handleMouseUp = () => {
      endInteraction();
      if (props.canvasElement) {
        props.canvasElement.style.cursor = "grab";
      }
    };
    const handleMouseMove = (event) => {
      updateInteraction(event.clientX, event.clientY);
    };
    const handleMouseLeave = () => {
      endInteraction();
      if (props.canvasElement) {
        props.canvasElement.style.cursor = "grab";
      }
    };
    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!touch) return;
      startInteraction(touch.clientX, touch.clientY);
    };
    const handleTouchMove = (event) => {
      if (!isInteracting.value || event.touches.length !== 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      if (!touch) return;
      updateInteraction(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = () => {
      endInteraction();
    };
    const initializeListeners = () => {
      if (!props.canvasElement) return;
      const canvas = props.canvasElement;
      canvas.style.cursor = "grab";
      canvas.addEventListener("mousedown", handleMouseDown);
      (void 0).addEventListener("mouseup", handleMouseUp);
      (void 0).addEventListener("mousemove", handleMouseMove);
      canvas.addEventListener("mouseleave", handleMouseLeave);
      canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
      canvas.addEventListener("touchend", handleTouchEnd);
    };
    const processScene = async (loadedScene) => {
      let foundHouseModel = void 0;
      let foundCamera = void 0;
      let foundLookAtTarget = void 0;
      loadedScene.traverse((child) => {
        console.log(`Object: ${child.name}, Type: ${child.type}`);
        if (child.name === "EmptyLookAtTarget") {
          foundLookAtTarget = child;
        } else if (child.name === "Camera") {
          foundCamera = child;
        } else if (child.name === "ok10b11291") {
          foundHouseModel = child;
          console.log("Found house model:", child.name);
        }
      });
      if (foundHouseModel) {
        houseModel.value = markRaw(foundHouseModel);
        emit("model-ready", foundHouseModel);
      }
      if (foundLookAtTarget) {
        lookAtTarget.value = markRaw(foundLookAtTarget);
      }
      if (foundCamera && foundLookAtTarget) {
        const camera = foundCamera;
        const target = foundLookAtTarget;
        initializeFromCamera(camera, target);
        if (camera.parent) {
          camera.parent.remove(camera);
        }
        loadedScene.add(camera);
        emit("camera-ready", camera);
        await nextTick();
      }
    };
    watch(
      scene,
      async (loadedScene) => {
        if (!loadedScene) return;
        if (!props.loadModel) return;
        await processScene(loadedScene);
      },
      { immediate: true }
    );
    watch(
      () => props.loadModel,
      (shouldLoad) => {
        if (shouldLoad && scene.value) {
          processScene(scene.value);
        }
      }
    );
    watch(
      () => props.canvasElement,
      (canvas) => {
        if (canvas && !isScrollControlled.value) {
          initializeListeners();
        }
      },
      { immediate: true }
    );
    watch(
      isScrollControlled,
      (scrollControlled) => {
        if (scrollControlled) {
          setAutoRotation(false);
        } else {
          setAutoRotation(true);
          if (props.canvasElement) {
            initializeListeners();
          }
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      if (cubeOpacity.value > 0) {
        _push(ssrRenderComponent(WhiteCubePlaceholder, { opacity: cubeOpacity.value }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (scene.value && showHouseModel.value) {
        _push(`<primitive${ssrRenderAttr("object", scene.value)}></primitive>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(runtimeCamera)) {
        _push(`<primitive${ssrRenderAttr("object", unref(runtimeCamera))} attach="camera"></primitive>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<TresAmbientLight${ssrRenderAttr("intensity", 3)}></TresAmbientLight><!--]-->`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HouseModelRig.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const HouseModelRig = Object.assign(_sfc_main$3, { __name: "HouseModelRig" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ModelSelector",
  __ssrInlineRender: true,
  props: {
    models: {},
    selectedModelId: { default: null },
    loadingModelId: { default: null },
    loadedModelIds: { default: () => [] },
    isAnyLoading: { type: Boolean, default: false },
    variant: { default: "horizontal" },
    showDescriptions: { type: Boolean, default: false },
    showFileSizes: { type: Boolean, default: true }
  },
  emits: ["select-model", "load-model"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const userInitiatedModels = ref(/* @__PURE__ */ new Set());
    const getButtonState = (model) => {
      const isLoading = props.loadingModelId === model.id;
      const isLoaded = props.loadedModelIds.includes(model.id);
      const isSelected = props.selectedModelId === model.id;
      const hasInitiated = userInitiatedModels.value.has(model.id);
      return {
        isLoading,
        isLoaded,
        isSelected,
        hasInitiated,
        isDisabled: props.isAnyLoading && !isLoading
      };
    };
    const getButtonLabel = (model) => {
      const state = getButtonState(model);
      if (state.isLoading) {
        return "Laden...";
      }
      if (state.isLoaded && state.isSelected) {
        return "Actief";
      }
      if (state.isLoaded) {
        return "Bekijk";
      }
      return model.buttonLabel;
    };
    const containerClasses = computed(() => {
      const baseClasses = "flex gap-3";
      switch (props.variant) {
        case "vertical":
          return `${baseClasses} flex-col`;
        case "grid":
          return "grid grid-cols-2 md:grid-cols-3 gap-3";
        case "horizontal":
        default:
          return `${baseClasses} flex-row flex-wrap`;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "model-selector" }, _attrs))} data-v-836252e3><div class="${ssrRenderClass(containerClasses.value)}" data-v-836252e3><!--[-->`);
      ssrRenderList(__props.models, (model) => {
        _push(`<div class="model-item" data-v-836252e3><button${ssrIncludeBooleanAttr(getButtonState(model).isDisabled) ? " disabled" : ""} class="${ssrRenderClass([
          "model-button",
          "relative px-6 py-3",
          "bg-white border border-gray-200 rounded-lg",
          "transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400",
          {
            "shadow-sm hover:shadow-md hover:scale-102 active:scale-98": !getButtonState(model).isDisabled && !getButtonState(model).isLoading,
            "opacity-50 cursor-not-allowed": getButtonState(model).isDisabled,
            "cursor-wait": getButtonState(model).isLoading,
            "ring-2 ring-gray-400 shadow-md": getButtonState(model).isSelected
          }
        ])}" style="${ssrRenderStyle({ boxShadow: getButtonState(model).isSelected ? "0 4px 12px rgba(0, 0, 0, 0.15)" : "0 2px 8px rgba(0, 0, 0, 0.1)" })}" data-v-836252e3>`);
        if (getButtonState(model).isLoading) {
          _push(`<span class="flex items-center gap-2 text-gray-600" data-v-836252e3><svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-v-836252e3><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" data-v-836252e3></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" data-v-836252e3></path></svg> ${ssrInterpolate(getButtonLabel(model))}</span>`);
        } else {
          _push(`<span class="${ssrRenderClass([
            "font-medium",
            getButtonState(model).isSelected ? "text-gray-900" : "text-gray-700"
          ])}" data-v-836252e3>${ssrInterpolate(getButtonLabel(model))}</span>`);
        }
        if (__props.showFileSizes && model.loading?.fileSize && !getButtonState(model).hasInitiated) {
          _push(`<span class="absolute -top-2 -right-2 px-2 py-0.5 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-500" data-v-836252e3>${ssrInterpolate(model.loading.fileSize)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (getButtonState(model).isLoaded && !getButtonState(model).isSelected) {
          _push(`<span class="absolute -top-2 -right-2 w-3 h-3 bg-green-400 border-2 border-white rounded-full" data-v-836252e3></span>`);
        } else {
          _push(`<!---->`);
        }
        if (getButtonState(model).isSelected) {
          _push(`<span class="absolute -top-2 -right-2 w-3 h-3 bg-gray-700 border-2 border-white rounded-full animate-pulse" data-v-836252e3></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</button>`);
        if (__props.showDescriptions && model.description) {
          _push(`<p class="mt-2 text-sm text-gray-600 max-w-xs" data-v-836252e3>${ssrInterpolate(model.description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      if (__props.loadingModelId) {
        _push(`<div class="mt-4 text-xs text-gray-500 tracking-wider uppercase font-medium flex items-center gap-2" data-v-836252e3><span data-v-836252e3>Loading model</span><div class="flex gap-1" data-v-836252e3><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" data-v-836252e3></div><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-836252e3></div><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}" data-v-836252e3></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModelSelector.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ModelSelector = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-836252e3"]]), { __name: "ModelSelector" });
const _imports_0 = publicAssetsURL("/images/loading-pagina-logo.png");
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Navigation",
  __ssrInlineRender: true,
  setup(__props) {
    const buttons = [
      { id: "home", label: "Home", href: "#home" },
      { id: "gallery", label: "Gallery", href: "#gallery" },
      { id: "contact", label: "Contact", href: "#contact" }
    ];
    const isVisible = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: [
          "fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-1.5 sm:py-3 transition-all duration-700 bg-white border-b border-gray-200",
          isVisible.value ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        ],
        style: { "box-shadow": "0 2px 8px rgba(0, 0, 0, 0.1)" }
      }, _attrs, {
        style: isVisible.value ? null : { display: "none" }
      }))} data-v-9c9db4fc><div class="max-w-7xl mx-auto grid grid-cols-3 items-center py-1 sm:py-2" data-v-9c9db4fc><div class="flex items-center justify-start" data-v-9c9db4fc><div class="flex items-center space-x-4" data-v-9c9db4fc><img${ssrRenderAttr("src", _imports_0)} alt="Ekster Logo" class="h-10 w-10 sm:h-16 sm:w-16 lg:h-20 lg:w-20 object-contain" data-v-9c9db4fc></div></div><div data-v-9c9db4fc></div><div class="flex items-center justify-end gap-1.5 sm:gap-2" data-v-9c9db4fc><!--[-->`);
      ssrRenderList(buttons, (button, index2) => {
        _push(`<a${ssrRenderAttr("href", button.href)} style="${ssrRenderStyle([`animation-delay: ${index2 * 100}ms;`, { "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.1)", "transition": "all 0.2s ease-out" }])}" class="${ssrRenderClass([[
          "text-gray-700 hover:text-gray-900",
          "hover:scale-102 active:scale-98",
          "hover:shadow-lg",
          isVisible.value ? "animate-slide-in" : "opacity-0"
        ], "relative px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 ease-out cursor-pointer select-none group bg-white border border-gray-200 hover:border-gray-300"])}" data-v-9c9db4fc><span class="relative z-10 font-sans" data-v-9c9db4fc>${ssrInterpolate(button.label)}</span><div class="absolute inset-0 rounded-lg ring-2 ring-gray-400/0 group-focus-visible:ring-gray-400/50 transition-all duration-200" data-v-9c9db4fc></div></a>`);
      });
      _push(`<!--]--></div></div></nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Navigation.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Navigation = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["__scopeId", "data-v-9c9db4fc"]]), { __name: "Navigation" });
const MODELS = [
  {
    id: "house-circle-rig",
    name: "Ekster House",
    path: "/models/ok12b_circle_rig.glb",
    buttonLabel: "Laad huis",
    description: "Architectural visualization of the main house with circular rig",
    sceneObjects: {
      meshName: "ok10b11291",
      cameraName: "Camera",
      lookAtTargetName: "EmptyLookAtTarget"
    },
    camera: {
      position: [30, 20, 30],
      fov: 50,
      sphericalRadius: 45,
      initialTheta: Math.atan2(30, 30),
      initialPhi: Math.PI / 3
    },
    placeholder: {
      dimensions: [15, 12, 15],
      rotation: [0, Math.PI / 6, 0],
      color: "#FFFFFF"
    },
    loading: {
      fileSize: "25.3 MB",
      loadingMessage: "Loading house model...",
      useDraco: true
    },
    tags: ["architecture", "residential", "main"]
  }
  // Example configuration for a second model (to be added later)
  /*
    {
      id: 'office-building',
      name: 'Office Complex',
      path: '/models/office_complex.glb',
      buttonLabel: 'Laad kantoor',
      description: 'Modern office building design',
  
      sceneObjects: {
        meshName: 'office_mesh',
        cameraName: 'Camera',
        lookAtTargetName: 'CameraTarget',
      },
  
      camera: {
        position: [40, 25, 40],
        fov: 45,
        sphericalRadius: 50,
        initialTheta: Math.PI / 4,
        initialPhi: Math.PI / 3.5,
      },
  
      placeholder: {
        dimensions: [20, 18, 20],
        rotation: [0, Math.PI / 4, 0],
        color: '#FAFAFA',
      },
  
      loading: {
        fileSize: '18.7 MB',
        loadingMessage: 'Loading office model...',
        useDraco: true,
      },
  
      tags: ['architecture', 'commercial', 'office'],
    },
    */
];
function getModelById(id2) {
  return MODELS.find((model) => model.id === id2);
}
function useScrollCamera(config = {}) {
  const {
    startRadius: startRadiusConfig = 45,
    endRadius: endRadiusConfig = 20,
    scrollDebounceMs = 150,
    enabled = true
  } = config;
  const unwrap = (value) => {
    if (value && typeof value === "object" && "value" in value) {
      return value.value;
    }
    return value;
  };
  const startRadius = computed(() => unwrap(startRadiusConfig));
  const endRadius = computed(() => unwrap(endRadiusConfig));
  computed(
    () => typeof enabled === "boolean" ? enabled : enabled.value
  );
  const scrollProgress = ref(0);
  const isScrolling = ref(false);
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };
  const easedScrollProgress = computed(() => {
    return easeInOutQuad(scrollProgress.value);
  });
  const cameraRadius = computed(() => {
    const start = startRadius.value;
    const end = endRadius.value;
    return start - easedScrollProgress.value * (start - end);
  });
  const updateScrollProgress = () => {
    return;
  };
  return {
    scrollProgress,
    easedScrollProgress,
    cameraRadius,
    isScrolling,
    // Expose methods for manual control if needed
    updateScrollProgress
  };
}
function useResponsive() {
  const viewport = ref({
    width: 1024,
    // Default to desktop for SSR
    height: 768,
    orientation: "landscape"
  });
  const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    largeDesktop: 1536
  };
  const isMobile = computed(() => viewport.value.width < BREAKPOINTS.mobile);
  const isTablet = computed(
    () => viewport.value.width >= BREAKPOINTS.mobile && viewport.value.width < BREAKPOINTS.tablet
  );
  const isDesktop = computed(() => viewport.value.width >= BREAKPOINTS.tablet);
  const isLargeDesktop = computed(() => viewport.value.width >= BREAKPOINTS.largeDesktop);
  const isTouchDevice = ref(false);
  const updateViewport = () => {
    return;
  };
  return {
    // Viewport info
    viewport: computed(() => viewport.value),
    // Breakpoints
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Touch detection
    isTouchDevice,
    // Utility functions
    updateViewport,
    // Raw breakpoints for custom checks
    breakpoints: BREAKPOINTS
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { isMobile } = useResponsive();
    const activeCamera = ref(null);
    const canvasElement = ref(null);
    const showModel = ref(false);
    const isLoadingModel = ref(false);
    const modelLoaded = ref(false);
    const userInitiatedLoad = ref(false);
    const selectedModelId = ref(null);
    const loadingModelId = ref(null);
    const loadedModelIds = ref([]);
    computed(
      () => selectedModelId.value ? getModelById(selectedModelId.value) : null
    );
    const viewportHeight = ref(844);
    const getResponsiveRadius = (baseRadius) => {
      return baseRadius;
    };
    const mobileStartRadius = computed(() => {
      const baseRadius = isMobile.value ? 50 : 45;
      return isMobile.value ? getResponsiveRadius(baseRadius) : baseRadius;
    });
    const mobileEndRadius = computed(() => {
      const baseRadius = isMobile.value ? 22 : 20;
      return isMobile.value ? getResponsiveRadius(baseRadius) : baseRadius;
    });
    const { easedScrollProgress, cameraRadius, isScrolling } = useScrollCamera({
      startRadius: mobileStartRadius,
      endRadius: mobileEndRadius,
      scrollDebounceMs: 100,
      // Quick detection of scroll end for snappy rotation resume
      enabled: true
      // Always enabled (was: computed(() => !isMobile.value))
    });
    const section1Opacity = computed(() => {
      return Math.max(0, 1 - easedScrollProgress.value * 2);
    });
    const section2Opacity = computed(() => {
      return Math.max(0, Math.min(1, (easedScrollProgress.value - 0.5) * 2));
    });
    const section2OverlapPx = computed(() => {
      if (!isMobile.value) return 0;
      const maxOverlapVh = 0.3;
      const maxOverlapPx = viewportHeight.value * maxOverlapVh;
      return Math.round(easedScrollProgress.value * maxOverlapPx);
    });
    const mobileCanvasTranslateY = computed(() => {
      if (!isMobile.value) return 75;
      const startOffset = 75;
      const endOffset = 45;
      return startOffset - easedScrollProgress.value * (startOffset - endOffset);
    });
    const onCameraReady = (camera) => {
      activeCamera.value = camera;
    };
    const onLoadingStarted = () => {
      console.log("[Index] Loading started");
      isLoadingModel.value = true;
    };
    const onLoadingProgress = (progress) => {
      console.log(`[Index] Loading progress: ${progress}%`);
    };
    const onLoadingComplete = () => {
      console.log("[Index] Loading complete! Setting modelLoaded = true");
      isLoadingModel.value = false;
      modelLoaded.value = true;
      console.log("[Index] modelLoaded value:", modelLoaded.value);
      if (loadingModelId.value) {
        loadedModelIds.value.push(loadingModelId.value);
        loadingModelId.value = null;
      }
    };
    const handleSelectModel = (modelId) => {
      selectedModelId.value = modelId;
      if (modelId === "house-circle-rig") {
        showModel.value = true;
      }
    };
    const handleLoadModel = (modelId) => {
      if (loadingModelId.value) return;
      const model = getModelById(modelId);
      if (!model) return;
      if (modelId === "house-circle-rig") {
        userInitiatedLoad.value = true;
        showModel.value = true;
        selectedModelId.value = modelId;
        loadingModelId.value = modelId;
      } else {
        selectedModelId.value = modelId;
        loadingModelId.value = modelId;
      }
    };
    watch(modelLoaded, (newValue) => {
      console.log("[Index] modelLoaded changed to:", newValue);
      console.log("[Index] Cube should now be:", newValue ? "hidden" : "visible");
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["bg-[#F7F9F7]", { "snap-y snap-mandatory": !unref(isMobile) }]
      }, _attrs))} data-v-523183ea>`);
      _push(ssrRenderComponent(Navigation, null, null, _parent));
      if (!unref(isMobile)) {
        _push(`<div class="relative lg:grid lg:grid-cols-2 pt-16 lg:pt-20" data-v-523183ea><div data-v-523183ea><div class="snap-start min-h-screen flex items-center justify-center px-6 lg:px-12 transition-opacity duration-700" style="${ssrRenderStyle({ opacity: section1Opacity.value })}" data-v-523183ea><div class="max-w-xl space-y-8 lg:space-y-12" data-v-523183ea><div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed" data-v-523183ea><p class="text-base lg:text-lg font-light leading-relaxed" data-v-523183ea> De Ekstergroep doet beheer, exploitatie, renovatie en verbetering van zowel monumentaal als gewoon vastgoed. </p><p class="text-sm lg:text-base leading-relaxed" data-v-523183ea> Wij leggen de focus op esthetiek, waarbij degelijkheid en levensduur als vereisten worden meegenomen. </p><p class="text-sm lg:text-base leading-relaxed" data-v-523183ea> We werken samen als team en pakken jaarlijks een aantal totalrenovaties op. Daarin begeleiden we de client van begin tot eind. Samen met de architect zetten we de dromen op papier, die we vervolgens door de constructeur laten doorrekenen. Na het uitgeebreid bespreken en plannen van de uit te voeren taken komt het team ten tonele en streven we er naar alles naar planning uit te voeren. </p></div><div class="space-y-3 lg:space-y-4 pt-4 lg:pt-6" data-v-523183ea><p class="text-sm lg:text-base leading-relaxed text-gray-700" data-v-523183ea> Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen? </p><div class="flex flex-col sm:inline-flex sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 group" data-v-523183ea><span class="text-sm text-gray-600" data-v-523183ea>Neem contact op via</span><a href="mailto:info@ekstergroep.nl" class="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 hover:shadow-md transition-all duration-200 hover:scale-102 text-sm" style="${ssrRenderStyle({ "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.1)" })}" data-v-523183ea> info@ekstergroep.nl </a></div></div><div class="pt-6 lg:pt-8 border-t border-gray-200 relative" data-v-523183ea><div class="text-xs text-gray-500 tracking-wider uppercase font-medium flex items-center space-x-2" data-v-523183ea><span data-v-523183ea>Start scrolling to explore</span><div class="flex space-x-1" data-v-523183ea><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" data-v-523183ea></div><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-523183ea></div><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}" data-v-523183ea></div></div></div></div></div></div><div class="snap-start min-h-screen flex items-center justify-center px-6 lg:px-12 transition-opacity duration-700" style="${ssrRenderStyle({ opacity: section2Opacity.value })}" data-v-523183ea><div class="max-w-xl space-y-8 lg:space-y-12" data-v-523183ea><div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed" data-v-523183ea><h2 class="text-2xl lg:text-3xl font-light text-gray-900" data-v-523183ea> Discover Our Craftsmanship </h2><p class="text-base lg:text-lg font-light leading-relaxed" data-v-523183ea> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p><p class="text-sm lg:text-base leading-relaxed" data-v-523183ea> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p><p class="text-sm lg:text-base leading-relaxed" data-v-523183ea> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. </p></div></div></div></div><div class="relative h-screen lg:sticky lg:top-0 flex flex-col snap-start" data-v-523183ea><div class="flex-1 relative" data-v-523183ea>`);
        _push(ssrRenderComponent(unref(ol), {
          "clear-color": "#F7F9F7",
          camera: activeCamera.value || void 0,
          class: "w-full h-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(HouseModelRig, {
                "canvas-element": canvasElement.value,
                "load-model": showModel.value,
                "scroll-controlled-radius": unref(cameraRadius),
                "is-scrolling-active": unref(isScrolling),
                onCameraReady,
                onModelReady: (model) => console.log("[Index] Model ready:", model),
                onLoadingStarted,
                onLoadingProgress,
                onLoadingComplete
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(HouseModelRig, {
                  "canvas-element": canvasElement.value,
                  "load-model": showModel.value,
                  "scroll-controlled-radius": unref(cameraRadius),
                  "is-scrolling-active": unref(isScrolling),
                  onCameraReady,
                  onModelReady: (model) => console.log("[Index] Model ready:", model),
                  onLoadingStarted,
                  onLoadingProgress,
                  onLoadingComplete
                }, null, 8, ["canvas-element", "load-model", "scroll-controlled-radius", "is-scrolling-active", "onModelReady"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (!userInitiatedLoad.value) {
          _push(`<div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10" data-v-523183ea>`);
          _push(ssrRenderComponent(ModelSelector, {
            models: unref(MODELS),
            "selected-model-id": selectedModelId.value,
            "loading-model-id": loadingModelId.value,
            "loaded-model-ids": loadedModelIds.value,
            "is-any-loading": isLoadingModel.value,
            variant: "horizontal",
            "show-file-sizes": true,
            onSelectModel: handleSelectModel,
            onLoadModel: handleLoadModel
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="relative pt-12 bg-[#F7F9F7]" data-v-523183ea><div class="px-3 pt-4 pb-4" data-v-523183ea><div class="mobile-text-card" data-v-523183ea><div class="space-y-4 text-gray-700" data-v-523183ea><p class="text-base font-light leading-7" data-v-523183ea> De Ekstergroep doet beheer, exploitatie, renovatie en verbetering van zowel monumentaal als gewoon vastgoed. </p><p class="text-sm leading-6" data-v-523183ea> Wij leggen de focus op esthetiek, waarbij degelijkheid en levensduur als vereisten worden meegenomen. </p><p class="text-sm leading-6" data-v-523183ea> We werken samen als team en pakken jaarlijks een aantal totalrenovaties op. Daarin begeleiden we de client van begin tot eind. </p></div><div class="pt-5 mt-5 border-t border-gray-200" data-v-523183ea><p class="text-sm leading-6 text-gray-700 mb-4" data-v-523183ea> Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen? </p><a href="mailto:info@ekstergroep.nl" class="flex items-center justify-center w-full px-5 py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 text-sm" style="${ssrRenderStyle({ "box-shadow": "0 2px 8px rgba(0, 0, 0, 0.15)" })}" data-v-523183ea> info@ekstergroep.nl </a></div></div></div><div class="relative h-[90vh] overflow-hidden bg-[#F7F9F7] z-0" data-v-523183ea><div class="absolute left-0 right-0 top-[40%]" style="${ssrRenderStyle({ transform: `translateY(-${mobileCanvasTranslateY.value}%)`, height: "100vh" })}" data-v-523183ea>`);
        _push(ssrRenderComponent(unref(ol), {
          "clear-color": "#F7F9F7",
          camera: activeCamera.value || void 0,
          class: "w-full h-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(HouseModelRig, {
                "canvas-element": canvasElement.value,
                "load-model": showModel.value,
                "scroll-controlled-radius": unref(cameraRadius),
                "is-scrolling-active": unref(isScrolling),
                "responsive-mode": "mobile",
                onCameraReady,
                onModelReady: (model) => console.log("[Index] Model ready:", model),
                onLoadingStarted,
                onLoadingProgress,
                onLoadingComplete
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(HouseModelRig, {
                  "canvas-element": canvasElement.value,
                  "load-model": showModel.value,
                  "scroll-controlled-radius": unref(cameraRadius),
                  "is-scrolling-active": unref(isScrolling),
                  "responsive-mode": "mobile",
                  onCameraReady,
                  onModelReady: (model) => console.log("[Index] Model ready:", model),
                  onLoadingStarted,
                  onLoadingProgress,
                  onLoadingComplete
                }, null, 8, ["canvas-element", "load-model", "scroll-controlled-radius", "is-scrolling-active", "onModelReady"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="mobile-model-gradient-top" data-v-523183ea></div><div class="mobile-model-gradient-bottom" data-v-523183ea></div><div class="mobile-model-gradient-left" data-v-523183ea></div><div class="mobile-model-gradient-right" data-v-523183ea></div></div><div class="px-3 pb-8 relative z-10" style="${ssrRenderStyle({ marginTop: `-${section2OverlapPx.value}px` })}" data-v-523183ea><div class="mobile-text-card" data-v-523183ea><h2 class="text-xl font-light text-gray-900 mb-4" data-v-523183ea> Discover Our Craftsmanship </h2><div class="space-y-4 text-gray-700" data-v-523183ea><p class="text-base font-light leading-7" data-v-523183ea> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p><p class="text-sm leading-6" data-v-523183ea> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p><p class="text-sm leading-6" data-v-523183ea> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p></div></div></div><div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-20" style="${ssrRenderStyle({ opacity: section1Opacity.value })}" data-v-523183ea><div class="mobile-scroll-indicator" data-v-523183ea><span data-v-523183ea>Scroll to explore</span><div class="flex space-x-1 ml-2" data-v-523183ea><div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" data-v-523183ea></div><div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-523183ea></div><div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}" data-v-523183ea></div></div></div></div>`);
        if (!userInitiatedLoad.value) {
          _push(`<div class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20" data-v-523183ea>`);
          _push(ssrRenderComponent(ModelSelector, {
            models: unref(MODELS),
            "selected-model-id": selectedModelId.value,
            "loading-model-id": loadingModelId.value,
            "loaded-model-ids": loadedModelIds.value,
            "is-any-loading": isLoadingModel.value,
            variant: "horizontal",
            "show-file-sizes": false,
            onSelectModel: handleSelectModel,
            onLoadModel: handleLoadModel
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-523183ea"]]);

export { index as default };
//# sourceMappingURL=index--pxQsLku.mjs.map
