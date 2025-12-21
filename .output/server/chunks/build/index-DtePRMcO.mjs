import { ref, defineComponent, useSSRContext, mergeProps, shallowRef, computed, watch, markRaw, nextTick, unref, withCtx, createVNode, useSlots, getCurrentInstance, createElementBlock, openBlock, normalizeStyle, normalizeClass } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderList, ssrRenderStyle, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import * as THREE from 'three';
import { Vector3, SphereGeometry, Object3D, Triangle, Vector2, Matrix4, Line3, Plane, Ray, Quaternion, Sphere, PCFSoftShadowMap, ACESFilmicToneMapping, Scene, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
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

const _i = "@tresjs/core", mi = "module", gi = "5.1.0", Ei = "pnpm@10.17.0", vi = "Declarative ThreeJS using Vue Components", yi = "Alvaro Saburido <hola@alvarosaburido.dev> (https://github.com/alvarosabu/)", Ci = "MIT", bi = { type: "git", url: "git+https://github.com/Tresjs/tres.git", directory: "packages/core" }, wi = ["vue", "3d", "threejs", "three", "threejs-vue"], Ai = false, Ti = { ".": { types: "./dist/index.d.ts", import: "./dist/tres.js", default: "./dist/tres.js" }, "./components": { types: "./dist/src/components/index.d.ts" }, "./composables": { types: "./dist/src/composables/index.d.ts" }, "./types": { types: "./dist/src/types/index.d.ts" }, "./utils": { types: "./dist/src/utils/index.d.ts" }, "./*": "./*" }, Oi = "./dist/tres.js", Si = "./dist/index.d.ts", Pi = ["*.d.ts", "dist"], Ii = { access: "public" }, Di = { build: "vite build", test: "vitest", "test:ci": "vitest run", "test:ui": "vitest --ui --coverage.enabled=true", coverage: "vitest run --coverage", lint: "eslint .", "lint:fix": "eslint . --fix", typecheck: "vue-tsc --noEmit" }, ki = { three: ">=0.133", vue: ">=3.4" }, xi = { "@pmndrs/pointer-events": "^6.6.17", "@vue/devtools-api": "^7.7.2", "@vueuse/core": "catalog:", radashi: "^12.6.2" }, Ri = { "@tresjs/eslint-config": "workspace:*", "@types/three": "catalog:", "@typescript-eslint/eslint-plugin": "catalog:", "@typescript-eslint/parser": "catalog:", "@vitejs/plugin-vue": "catalog:", "@vitest/coverage-v8": "3.2.4", "@vitest/ui": "catalog:", "@vue/test-utils": "catalog:", eslint: "catalog:", "eslint-plugin-vue": "catalog:", jsdom: "catalog:", kolorist: "catalog:", pathe: "catalog:", "rollup-plugin-analyzer": "catalog:", "rollup-plugin-copy": "^3.5.0", "rollup-plugin-visualizer": "catalog:", three: "catalog:", vite: "catalog:", "vite-plugin-banner": "catalog:", "vite-plugin-dts": "catalog:", "vite-plugin-inspect": "^11.3.3", vitest: "catalog:", vue: "catalog:", "vue-demi": "^0.14.10", "vue-tsc": "catalog:" }, Li = { implicitDependencies: ["!@tresjs/core-*"] }, Fi = {
  name: _i,
  type: mi,
  version: gi,
  packageManager: Ei,
  description: vi,
  author: yi,
  license: Ci,
  repository: bi,
  keywords: wi,
  sideEffects: Ai,
  exports: Ti,
  module: Oi,
  types: Si,
  files: Pi,
  publishConfig: Ii,
  scripts: Di,
  peerDependencies: ki,
  dependencies: xi,
  devDependencies: Ri,
  nx: Li
};
function en(e) {
  ((n) => "map" in n && !!n.map)(e) && e.map.dispose(), e.dispose();
}
function Ne(e) {
  if (e.parent && e.removeFromParent?.(), delete e.__tres, [...e.children].forEach((n) => Ne(n)), !(e instanceof Scene)) {
    const n = e;
    e && e.dispose?.(), n.geometry && n.geometry.dispose(), Array.isArray(n.material) ? n.material.forEach((r) => en(r)) : n.material && en(n.material);
  }
}
const dt = ref({}), pt = (e) => Object.assign(dt.value, e);
new Vector3();
const us = 1e10;
new SphereGeometry(us);
globalThis.pointerEventspointerMap ??= /* @__PURE__ */ new Map();
Object3D.prototype.setPointerCapture = function(e) {
  St(e)?.setCapture(this);
};
Object3D.prototype.releasePointerCapture = function(e) {
  const t = St(e);
  t == null || !t.hasCaptured(this) || t.setCapture(void 0);
};
Object3D.prototype.hasPointerCapture = function(e) {
  return St(e)?.hasCaptured(this) ?? false;
};
function St(e) {
  return globalThis.pointerEventspointerMap?.get(e);
}
new Triangle();
new Triangle();
new Vector2();
new Vector2();
new Vector2();
new Vector3();
new Matrix4();
new Vector3();
new Matrix4();
new Line3();
new Vector3();
new Plane();
new Ray();
new Vector2();
new Vector3(0, 0, 0), new Vector3(0, 0, 1);
new Matrix4();
new Vector3();
new Vector3(0, 0, -1);
new Plane();
new Vector2();
new Vector3();
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
var js = Object.create, $r = Object.defineProperty, zs = Object.getOwnPropertyDescriptor, Pt = Object.getOwnPropertyNames, $s = Object.getPrototypeOf, Ks = Object.prototype.hasOwnProperty, Ws = (e, t) => function() {
  return e && (t = (0, e[Pt(e)[0]])(e = 0)), t;
}, Gs = (e, t) => function() {
  return t || (0, e[Pt(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, Ys = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of Pt(t))
      !Ks.call(e, o) && o !== n && $r(e, o, { get: () => t[o], enumerable: !(r = zs(t, o)) || r.enumerable });
  return e;
}, qs = (e, t, n) => (n = e != null ? js($s(e)) : {}, Ys(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  $r(n, "default", { value: e, enumerable: true }),
  e
)), Oe = Ws({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), Xs = Gs({
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
var Qs = qs(Xs()), Zs = /(?:^|[-_/])(\w)/g;
function Js(e, t) {
  return t ? t.toUpperCase() : "";
}
function ea(e) {
  return e && `${e}`.replace(Zs, Js);
}
function ta(e, t) {
  let n = e.replace(/^[a-z]:/i, "").replace(/\\/g, "/");
  n.endsWith(`index${t}`) && (n = n.replace(`/index${t}`, t));
  const r = n.lastIndexOf("/"), o = n.substring(r + 1);
  {
    const i = o.lastIndexOf(t);
    return o.substring(0, i);
  }
}
var _n = (0, Qs.default)({ circles: true });
const na = {
  trailing: true
};
function ae(e, t = 25, n = {}) {
  if (n = { ...na, ...n }, !Number.isFinite(t))
    throw new TypeError("Expected `wait` to be a finite number");
  let r, o, i = [], s, a;
  const u = (l, c) => (s = ra(e, l, c), s.finally(() => {
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
async function ra(e, t, n) {
  return await e.apply(t, n);
}
function ht(e, t = {}, n) {
  for (const r in e) {
    const o = e[r], i = n ? `${n}:${r}` : r;
    typeof o == "object" && o !== null ? ht(o, t, i) : typeof o == "function" && (t[i] = o);
  }
  return t;
}
const oa = { run: (e) => e() }, ia = () => oa, Wr = typeof console.createTask < "u" ? console.createTask : ia;
function sa(e, t) {
  const n = t.shift(), r = Wr(n);
  return e.reduce(
    (o, i) => o.then(() => r.run(() => i(...t))),
    Promise.resolve()
  );
}
function aa(e, t) {
  const n = t.shift(), r = Wr(n);
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
var la = Object.create, Yr = Object.defineProperty, ca = Object.getOwnPropertyDescriptor, It = Object.getOwnPropertyNames, fa = Object.getPrototypeOf, da = Object.prototype.hasOwnProperty, pa = (e, t) => function() {
  return e && (t = (0, e[It(e)[0]])(e = 0)), t;
}, qr = (e, t) => function() {
  return t || (0, e[It(e)[0]])((t = { exports: {} }).exports, t), t.exports;
}, ha = (e, t, n, r) => {
  if (t && typeof t == "object" || typeof t == "function")
    for (let o of It(t))
      !da.call(e, o) && o !== n && Yr(e, o, { get: () => t[o], enumerable: !(r = ca(t, o)) || r.enumerable });
  return e;
}, _a = (e, t, n) => (n = e != null ? la(fa(e)) : {}, ha(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  Yr(n, "default", { value: e, enumerable: true }),
  e
)), m = pa({
  "../../node_modules/.pnpm/tsup@8.4.0_@microsoft+api-extractor@7.51.1_@types+node@22.13.14__jiti@2.4.2_postcss@8.5_96eb05a9d65343021e53791dd83f3773/node_modules/tsup/assets/esm_shims.js"() {
  }
}), ma = qr({
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
        var C = "-", b = "", P = "", M = true, A = {}, O, T, E, x, R, Ut, de, te, Ht, z, w, Se, H, ne, K = "";
        if (typeof p != "string")
          return "";
        if (typeof g == "string" && (C = g), de = a.en, te = s.en, typeof g == "object") {
          O = g.maintainCase || false, A = g.custom && typeof g.custom == "object" ? g.custom : A, E = +g.truncate > 1 && g.truncate || false, x = g.uric || false, R = g.uricNoSlash || false, Ut = g.mark || false, M = !(g.symbols === false || g.lang === false), C = g.separator || C, x && (K += u), R && (K += l), Ut && (K += c), de = g.lang && a[g.lang] && M ? a[g.lang] : M ? a.en : {}, te = g.lang && s[g.lang] ? s[g.lang] : g.lang === false || g.lang === true ? {} : s.en, g.titleCase && typeof g.titleCase.length == "number" && Array.prototype.toString.call(g.titleCase) ? (g.titleCase.forEach(function(U) {
            A[U + ""] = U + "";
          }), T = true) : T = !!g.titleCase, g.custom && typeof g.custom.length == "number" && Array.prototype.toString.call(g.custom) && g.custom.forEach(function(U) {
            A[U + ""] = U + "";
          }), Object.keys(A).forEach(function(U) {
            var pe;
            U.length > 1 ? pe = new RegExp("\\b" + d(U) + "\\b", "gi") : pe = new RegExp(d(U), "gi"), p = p.replace(pe, A[U]);
          });
          for (w in A)
            K += w;
        }
        for (K += C, K = d(K), p = p.replace(/(^\s+|\s+$)/g, ""), H = false, ne = false, z = 0, Se = p.length; z < Se; z++)
          w = p[z], _(w, A) ? H = false : te[w] ? (w = H && te[w].match(/[A-Za-z0-9]/) ? " " + te[w] : te[w], H = false) : w in r ? (z + 1 < Se && o.indexOf(p[z + 1]) >= 0 ? (P += w, w = "") : ne === true ? (w = i[P] + r[w], P = "") : w = H && r[w].match(/[A-Za-z0-9]/) ? " " + r[w] : r[w], H = false, ne = false) : w in i ? (P += w, w = "", z === Se - 1 && (w = i[P]), ne = true) : (
            /* process symbol chars */
            de[w] && !(x && u.indexOf(w) !== -1) && !(R && l.indexOf(w) !== -1) ? (w = H || b.substr(-1).match(/[A-Za-z0-9]/) ? C + de[w] : de[w], w += p[z + 1] !== void 0 && p[z + 1].match(/[A-Za-z0-9]/) ? C : "", H = true) : (ne === true ? (w = i[P] + w, P = "", ne = false) : H && (/[A-Za-z0-9]/.test(w) || b.substr(-1).match(/A-Za-z0-9]/)) && (w = " " + w), H = false)
          ), b += w.replace(new RegExp("[^\\w\\s" + K + "_-]", "g"), C);
        return T && (b = b.replace(/(\w)(\S*)/g, function(U, pe, jt) {
          var Ye = pe.toUpperCase() + (jt !== null ? jt : "");
          return Object.keys(A).indexOf(Ye.toLowerCase()) < 0 ? Ye : Ye.toLowerCase();
        })), b = b.replace(/\s+/g, C).replace(new RegExp("\\" + C + "+", "g"), C).replace(new RegExp("(^\\" + C + "+|\\" + C + "+$)", "g"), ""), E && b.length > E && (Ht = b.charAt(E) === C, b = b.slice(0, E), Ht || (b = b.slice(0, b.lastIndexOf(C)))), !O && !T && (b = b.toLowerCase()), b;
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
}), ga = qr({
  "../../node_modules/.pnpm/speakingurl@14.0.1/node_modules/speakingurl/index.js"(e, t) {
    m(), t.exports = ma();
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
function Ea(e) {
  var t;
  const n = e.name || e._componentTag || e.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ || e.__name;
  return n === "index" && ((t = e.__file) != null && t.endsWith("index.vue")) ? "" : n;
}
function va(e) {
  const t = e.__file;
  if (t)
    return ea(ta(t, ".vue"));
}
function mn(e, t) {
  return e.type.__VUE_DEVTOOLS_COMPONENT_GUSSED_NAME__ = t, t;
}
function Dt(e) {
  if (e.__VUE_DEVTOOLS_NEXT_APP_RECORD__)
    return e.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
  if (e.root)
    return e.appContext.app.__VUE_DEVTOOLS_NEXT_APP_RECORD__;
}
function Xr(e) {
  var t, n;
  const r = (t = e.subTree) == null ? void 0 : t.type, o = Dt(e);
  return o ? ((n = o?.types) == null ? void 0 : n.Fragment) === r : false;
}
function Ke(e) {
  var t, n, r;
  const o = Ea(e?.type || {});
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
function ya(e) {
  var t, n, r;
  const o = (r = (n = (t = e?.appContext) == null ? void 0 : t.app) == null ? void 0 : n.__VUE_DEVTOOLS_NEXT_APP_RECORD_ID__) != null ? r : 0, i = e === e?.root ? "root" : e.uid;
  return `${o}:${i}`;
}
function _t(e, t) {
  return t = t || `${e.id}:root`, e.instanceMap.get(t) || e.instanceMap.get(":root");
}
var gn = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: 0,
  height: 0
};
function ee(e) {
  e.subTree.el;
  return gn;
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
var Qr = "__vue-devtools-component-inspector__", Zr = "__vue-devtools-component-inspector__card__", Jr = "__vue-devtools-component-inspector__name__", eo = "__vue-devtools-component-inspector__indicator__", to = {
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
  return (void 0).getElementById(Qr);
}
function Pa() {
  return (void 0).getElementById(Zr);
}
function Ia() {
  return (void 0).getElementById(eo);
}
function Da() {
  return (void 0).getElementById(Jr);
}
function xt(e) {
  return {
    left: `${Math.round(e.left * 100) / 100}px`,
    top: `${Math.round(e.top * 100) / 100}px`,
    width: `${Math.round(e.width * 100) / 100}px`,
    height: `${Math.round(e.height * 100) / 100}px`
  };
}
function Rt(e) {
  var t;
  const n = (void 0).createElement("div");
  n.id = (t = e.elementId) != null ? t : Qr, Object.assign(n.style, {
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
  o.id = Jr, o.innerHTML = `&lt;${e.name}&gt;&nbsp;&nbsp;`;
  const i = (void 0).createElement("i");
  return i.id = eo, i.innerHTML = `${Math.round(e.bounds.width * 100) / 100} x ${Math.round(e.bounds.height * 100) / 100}`, Object.assign(i.style, Sa), r.appendChild(o), r.appendChild(i), n.appendChild(r), (void 0).body.appendChild(n), n;
}
function Lt(e) {
  const t = ce(), n = Pa(), r = Da(), o = Ia();
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
  const n = Ke(e);
  ce() ? Lt({ bounds: t, name: n }) : Rt({ bounds: t, name: n });
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
      const o = ee(n), i = Ke(n);
      ce() ? Lt({ bounds: o, name: i }) : Rt({ bounds: o, name: i });
    }
  }
}
function xa(e, t) {
  if (e.preventDefault(), e.stopPropagation(), mt) {
    const n = ya(mt);
    t(n);
  }
}
var Ue = null;
function Ra() {
  no(), (void 0).removeEventListener("mouseover", gt), (void 0).removeEventListener("click", Ue, true), Ue = null;
}
function La() {
  return (void 0).addEventListener("mouseover", gt), new Promise((e) => {
    function t(n) {
      n.preventDefault(), n.stopPropagation(), xa(n, (r) => {
        (void 0).removeEventListener("click", t, true), Ue = null, (void 0).removeEventListener("mouseover", gt);
        const o = ce();
        o && (o.style.display = "none"), e(JSON.stringify({ id: r }));
      });
    }
    Ue = t, (void 0).addEventListener("click", t, true);
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
        const o = Ke(t), i = ce();
        i ? Lt({ ...e, name: o, bounds: r }) : Rt({ ...e, name: o, bounds: r }), setTimeout(() => {
          i && (i.style.display = "none");
        }, 1500);
      }
    }, 1200);
  }
}
m();
var En;
(En = y).__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ != null || (En.__VUE_DEVTOOLS_COMPONENT_INSPECTOR_ENABLED__ = true);
function Ma(e) {
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
function Va() {
  return new Promise((e) => {
    function t() {
      Na(), e(y.__VUE_INSPECTOR__);
    }
    y.__VUE_INSPECTOR__ ? t() : Ma(() => {
      t();
    });
  });
}
m();
m();
function Ba(e) {
  return !!(e && e.__v_isReadonly);
}
function ro(e) {
  return Ba(e) ? ro(e.__v_raw) : !!(e && e.__v_isReactive);
}
function nt(e) {
  return !!(e && e.__v_isRef === true);
}
function _e(e) {
  const t = e && e.__v_raw;
  return t ? _e(t) : e;
}
var Ua = class {
  constructor() {
    this.refEditor = new Ha();
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
}, Ha = class {
  set(e, t) {
    if (nt(e))
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
    return nt(e) ? e.value : e;
  }
  isRef(e) {
    return nt(e) || ro(e);
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
var $a = new Proxy(y.__VUE_DEVTOOLS_KIT_TIMELINE_LAYERS, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function Ka(e, t) {
  k.timelineLayersState[t.id] = false, $a.push({
    ...e,
    descriptorId: t.id,
    appRecord: Dt(t.app)
  });
}
var bn;
(bn = y).__VUE_DEVTOOLS_KIT_INSPECTOR__ != null || (bn.__VUE_DEVTOOLS_KIT_INSPECTOR__ = []);
var Ft = new Proxy(y.__VUE_DEVTOOLS_KIT_INSPECTOR__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
}), oo = ae(() => {
  fe.hooks.callHook("sendInspectorToClient", io());
});
function Wa(e, t) {
  var n, r;
  Ft.push({
    options: e,
    descriptor: t,
    treeFilterPlaceholder: (n = e.treeFilterPlaceholder) != null ? n : "Search tree...",
    stateFilterPlaceholder: (r = e.stateFilterPlaceholder) != null ? r : "Search state...",
    treeFilter: "",
    selectedNodeId: "",
    appRecord: Dt(t.app)
  }), oo();
}
function io() {
  return Ft.filter((e) => e.descriptor.app === F.value.app).filter((e) => e.descriptor.id !== "components").map((e) => {
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
function Re(e, t) {
  return Ft.find((n) => n.options.id === e && (t ? n.descriptor.app === t : true));
}
function Ga() {
  const e = Gr();
  e.hook("addInspector", ({ inspector: r, plugin: o }) => {
    Wa(r, o.descriptor);
  });
  const t = ae(async ({ inspectorId: r, plugin: o }) => {
    var i;
    if (!r || !((i = o?.descriptor) != null && i.app) || k.highPerfModeEnabled)
      return;
    const s = Re(r, o.descriptor.app), a = {
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
  const n = ae(async ({ inspectorId: r, plugin: o }) => {
    var i;
    if (!r || !((i = o?.descriptor) != null && i.app) || k.highPerfModeEnabled)
      return;
    const s = Re(r, o.descriptor.app), a = {
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
    const s = Re(r, i.descriptor.app);
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
  }), e.hook("getComponentBounds", async ({ instance: r }) => ee(r)), e.hook("getComponentName", ({ instance: r }) => Ke(r)), e.hook("componentHighlight", ({ uid: r }) => {
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
var Pn;
(Pn = y).__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ != null || (Pn.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = "");
var Dn;
(Dn = y).__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ != null || (Dn.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ = []);
var xn;
(xn = y).__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ != null || (xn.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ = []);
var Z = "__VUE_DEVTOOLS_KIT_GLOBAL_STATE__";
function Ya() {
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
var Ln;
(Ln = y)[Z] != null || (Ln[Z] = Ya());
var qa = ae((e) => {
  fe.hooks.callHook("devtoolsStateUpdated", { state: e });
});
ae((e, t) => {
  fe.hooks.callHook("devtoolsConnectedUpdated", { state: e, oldState: t });
});
var We = new Proxy(y.__VUE_DEVTOOLS_KIT_APP_RECORDS__, {
  get(e, t, n) {
    return t === "value" ? y.__VUE_DEVTOOLS_KIT_APP_RECORDS__ : y.__VUE_DEVTOOLS_KIT_APP_RECORDS__[t];
  }
}), F = new Proxy(y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__, {
  get(e, t, n) {
    return t === "value" ? y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ : t === "id" ? y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ : y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__[t];
  }
});
function so() {
  qa({
    ...y[Z],
    appRecords: We.value,
    activeAppRecordId: F.id,
    tabs: y.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__,
    commands: y.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__
  });
}
function Xa(e) {
  y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD__ = e, so();
}
function Qa(e) {
  y.__VUE_DEVTOOLS_KIT_ACTIVE_APP_RECORD_ID__ = e, so();
}
var k = new Proxy(y[Z], {
  get(e, t) {
    return t === "appRecords" ? We : t === "activeAppRecordId" ? F.id : t === "tabs" ? y.__VUE_DEVTOOLS_KIT_CUSTOM_TABS__ : t === "commands" ? y.__VUE_DEVTOOLS_KIT_CUSTOM_COMMANDS__ : y[Z][t];
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
var Mt = new Proxy(y.__VUE_DEVTOOLS_KIT_PLUGIN_BUFFER__, {
  get(e, t, n) {
    return Reflect.get(e, t, n);
  }
});
function Et(e) {
  const t = {};
  return Object.keys(e).forEach((n) => {
    t[n] = e[n].defaultValue;
  }), t;
}
function Nt(e) {
  return `__VUE_DEVTOOLS_NEXT_PLUGIN_SETTINGS__${e}__`;
}
function Ja(e) {
  var t, n, r;
  const o = (n = (t = Mt.find((i) => {
    var s;
    return i[0].id === e && !!((s = i[0]) != null && s.settings);
  })) == null ? void 0 : t[0]) != null ? n : null;
  return (r = o?.settings) != null ? r : null;
}
function ao(e, t) {
  var n, r, o;
  const i = Nt(e);
  if (i) {
    const s = localStorage.getItem(i);
    if (s)
      return JSON.parse(s);
  }
  if (e) {
    const s = (r = (n = Mt.find((a) => a[0].id === e)) == null ? void 0 : n[0]) != null ? r : null;
    return Et((o = s?.settings) != null ? o : {});
  }
  return Et(t);
}
function eu(e, t) {
  const n = Nt(e);
  localStorage.getItem(n) || localStorage.setItem(n, JSON.stringify(Et(t)));
}
function tu(e, t, n) {
  const r = Nt(e), o = localStorage.getItem(r), i = JSON.parse(o || "{}"), s = {
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
var Vn, Bn, V = (Bn = (Vn = y).__VUE_DEVTOOLS_HOOK) != null ? Bn : Vn.__VUE_DEVTOOLS_HOOK = Gr(), nu = {
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
}, uo = {
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
function lo(e, t) {
  y.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.has(e) || k.highPerfModeEnabled && !t?.inspectingComponent || (y.__VUE_DEVTOOLS_KIT__REGISTERED_PLUGIN_APPS__.add(e), Mt.forEach((n) => {
    fu(n, e);
  }));
}
m();
m();
var ve = "__VUE_DEVTOOLS_ROUTER__", ue = "__VUE_DEVTOOLS_ROUTER_INFO__", jn;
(jn = y)[ue] != null || (jn[ue] = {
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
function pu(e) {
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
    const o = (r = e.app) == null ? void 0 : r.config.globalProperties.$router, i = pu(o?.currentRoute.value), s = Vt(du(o)), a = console.warn;
    console.warn = () => {
    }, y[ue] = {
      currentRoute: i ? _n(i) : {},
      routes: _n(s)
    }, y[ve] = o, console.warn = a;
  }
  n(), uo.on.componentUpdated(ae(() => {
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
      const n = Re(t);
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
      return Ra();
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
    getVueInspector: Va,
    // toggle app
    toggleApp(t, n) {
      const r = We.value.find((o) => o.id === t);
      r && (Qa(t), Xa(r), hu(r, F), oo(), lo(r.app, n));
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
var Wn;
(Wn = y).__VUE_DEVTOOLS_ENV__ != null || (Wn.__VUE_DEVTOOLS_ENV__ = {
  vitePluginDetected: false
});
var Yn = Ga(), qn;
(qn = y).__VUE_DEVTOOLS_KIT_CONTEXT__ != null || (qn.__VUE_DEVTOOLS_KIT_CONTEXT__ = {
  hooks: Yn,
  get state() {
    return {
      ...k,
      activeAppRecordId: F.id,
      activeAppRecord: F.value,
      appRecords: We.value
    };
  },
  api: _u(Yn)
});
var fe = y.__VUE_DEVTOOLS_KIT_CONTEXT__;
m();
_a(ga());
var Qn;
(Qn = y).__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ != null || (Qn.__VUE_DEVTOOLS_NEXT_APP_RECORD_INFO__ = {
  id: 0,
  appIds: /* @__PURE__ */ new Set()
});
m();
m();
function mu(e) {
  k.highPerfModeEnabled = e ?? !k.highPerfModeEnabled, !e && F.value && lo(F.value.app);
}
m();
m();
m();
function gu(e) {
  k.devtoolsClientDetected = {
    ...k.devtoolsClientDetected,
    ...e
  };
  const t = Object.values(k.devtoolsClientDetected).some(Boolean);
  mu(!t);
}
var Jn;
(Jn = y).__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ != null || (Jn.__VUE_DEVTOOLS_UPDATE_CLIENT_DETECTED__ = gu);
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
}, co = class {
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
}, vu = class extends co {
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
function le(e, t) {
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
var wu = (e) => Object.prototype.toString.call(e).slice(8, -1), fo = (e) => typeof e > "u", Au = (e) => e === null, ye = (e) => typeof e != "object" || e === null || e === Object.prototype ? false : Object.getPrototypeOf(e) === null ? true : Object.getPrototypeOf(e) === Object.prototype, vt = (e) => ye(e) && Object.keys(e).length === 0, G = (e) => Array.isArray(e), Tu = (e) => typeof e == "string", Ou = (e) => typeof e == "number" && !isNaN(e), Su = (e) => typeof e == "boolean", Pu = (e) => e instanceof RegExp, Ce = (e) => e instanceof Map, be = (e) => e instanceof Set, po = (e) => wu(e) === "Symbol", Iu = (e) => e instanceof Date && !isNaN(e.valueOf()), Du = (e) => e instanceof Error, nr = (e) => typeof e == "number" && isNaN(e), ku = (e) => Su(e) || Au(e) || fo(e) || Ou(e) || Tu(e) || po(e), xu = (e) => typeof e == "bigint", Ru = (e) => e === 1 / 0 || e === -1 / 0, Lu = (e) => ArrayBuffer.isView(e) && !(e instanceof DataView), Fu = (e) => e instanceof URL;
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
  j(xu, "bigint", (e) => e.toString(), (e) => typeof BigInt < "u" ? BigInt(e) : (console.error("Please add a BigInt polyfill."), e)),
  j(Iu, "Date", (e) => e.toISOString(), (e) => new Date(e)),
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
    be,
    "set",
    // (sets only exist in es6+)
    // eslint-disable-next-line es5/no-es6-methods
    (e) => [...e.values()],
    (e) => new Set(e)
  ),
  j(Ce, "map", (e) => [...e.entries()], (e) => new Map(e)),
  j((e) => nr(e) || Ru(e), "number", (e) => nr(e) ? "NaN" : e > 0 ? "Infinity" : "-Infinity", Number),
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
function Eo(e, t) {
  return e?.constructor ? !!t.classRegistry.getIdentifier(e.constructor) : false;
}
var vo = Ge(Eo, (e, t) => ["class", t.classRegistry.getIdentifier(e.constructor)], (e, t) => {
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
}, Co = {};
_o.forEach((e) => {
  Co[e.annotation] = e;
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
    const r = Co[t];
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
    if (be(e))
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
}, yt = (e, t, n) => {
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
    else if (be(r)) {
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
  if (G(r) ? r[+o] = n(r[+o]) : ye(r) && (r[o] = n(r[o])), be(r)) {
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
    le(e, (i, s) => Ct(i, t, [...n, ...ge(s)]));
    return;
  }
  const [r, o] = e;
  o && le(o, (i, s) => {
    Ct(i, t, [...n, ...ge(s)]);
  }), t(r, n);
}
function Uu(e, t, n) {
  return Ct(t, (r, o) => {
    e = yt(e, o, (i) => Vu(i, r, n));
  }), e;
}
function Hu(e, t) {
  function n(r, o) {
    const i = Bu(e, ge(o));
    r.map(ge).forEach((s) => {
      e = yt(e, s, () => i);
    });
  }
  if (G(t)) {
    const [r, o] = t;
    r.forEach((i) => {
      e = yt(e, ge(i), () => e);
    }), o && le(o, n);
  } else
    le(t, n);
  return e;
}
var ju = (e, t) => ye(e) || G(e) || Ce(e) || be(e) || Eo(e, t);
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
  le(c, (_, v) => {
    if (v === "__proto__" || v === "constructor" || v === "prototype")
      throw new Error(`Detected property ${v}. This is a prototype pollution risk, please remove it from your object.`);
    const p = wo(_, t, n, r, [...o, v], [...i, e], s);
    f[v] = p.transformedValue, G(p.annotations) ? h[v] = p.annotations : ye(p.annotations) && le(p.annotations, (g, C) => {
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
function Ao(e) {
  return Object.prototype.toString.call(e).slice(8, -1);
}
function or(e) {
  return Ao(e) === "Array";
}
function Ku(e) {
  if (Ao(e) !== "Object")
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
function bt(e, t = {}) {
  if (or(e))
    return e.map((o) => bt(o, t));
  if (!Ku(e))
    return e;
  const n = Object.getOwnPropertyNames(e), r = Object.getOwnPropertySymbols(e);
  return [...n, ...r].reduce((o, i) => {
    if (or(t.props) && !t.props.includes(i))
      return o;
    const s = e[i], a = bt(s, t);
    return Wu(o, i, a, e, t.nonenumerable), o;
  }, {});
}
var S = class {
  /**
   * @param dedupeReferentialEqualities  If true, SuperJSON will make sure only one instance of referentially equal objects are serialized and the rest are replaced with `null`.
   */
  constructor({ dedupe: e = false } = {}) {
    this.classRegistry = new vu(), this.symbolRegistry = new co((t) => {
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
    let r = bt(t);
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
var ir;
(ir = y).__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ != null || (ir.__VUE_DEVTOOLS_KIT_MESSAGE_CHANNELS__ = []);
var ar;
(ar = y).__VUE_DEVTOOLS_KIT_RPC_CLIENT__ != null || (ar.__VUE_DEVTOOLS_KIT_RPC_CLIENT__ = null);
var lr;
(lr = y).__VUE_DEVTOOLS_KIT_RPC_SERVER__ != null || (lr.__VUE_DEVTOOLS_KIT_RPC_SERVER__ = null);
var fr;
(fr = y).__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ != null || (fr.__VUE_DEVTOOLS_KIT_VITE_RPC_CLIENT__ = null);
var pr;
(pr = y).__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ != null || (pr.__VUE_DEVTOOLS_KIT_VITE_RPC_SERVER__ = null);
var _r;
(_r = y).__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ != null || (_r.__VUE_DEVTOOLS_KIT_BROADCAST_RPC_SERVER__ = null);
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
    pt(THREE);
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
    phi: Math.PI / 4
    // Higher initial camera position (45 degrees vs 60)
  });
  const targetSpherical = ref({
    theta: 0,
    phi: Math.PI / 4
  });
  const currentSpherical = ref({
    theta: 0,
    phi: Math.PI / 4
  });
  const isInteracting = ref(false);
  const isAutoRotating = ref(true);
  const previousInteractionPosition = ref({ x: 0, y: 0 });
  const clock = markRaw(new THREE.Clock());
  const sphericalToCartesian = (radius, theta, phi) => {
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y2 = radius * Math.cos(phi);
    return new THREE.Vector3(x, y2, z);
  };
  const clampPhi = (phi) => {
    return Math.max(minPhi, Math.min(maxPhi, phi));
  };
  const initializeFromCamera = (camera, target) => {
    runtimeCamera.value = markRaw(camera);
    lookAtTarget.value = markRaw(target);
    const targetPos = new THREE.Vector3();
    target.getWorldPosition(targetPos);
    const cameraPos = new THREE.Vector3();
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
  const updateCameraReference = (camera, target) => {
    runtimeCamera.value = markRaw(camera);
    lookAtTarget.value = markRaw(target);
  };
  const createDefaultCamera = () => {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1e3);
    camera.position.set(30, 20, 30);
    const target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    initializeFromCamera(camera, target);
    return camera;
  };
  const startInteraction = (x, y2) => {
    isInteracting.value = true;
    isAutoRotating.value = false;
    previousInteractionPosition.value = { x, y: y2 };
  };
  const updateInteraction = (x, y2) => {
    if (!isInteracting.value) return;
    const deltaX = x - previousInteractionPosition.value.x;
    const deltaY = y2 - previousInteractionPosition.value.y;
    targetSpherical.value.theta -= deltaX * sensitivity;
    targetSpherical.value.phi += deltaY * sensitivity;
    targetSpherical.value.phi = clampPhi(targetSpherical.value.phi);
    previousInteractionPosition.value = { x, y: y2 };
  };
  const endInteraction = () => {
    isInteracting.value = false;
    setTimeout(() => {
      if (!isInteracting.value) {
        isAutoRotating.value = true;
      }
    }, 1e3);
  };
  const updateCameraPosition = (effectiveRadius, deltaTime, phiAdjustment, yOffset) => {
    if (!runtimeCamera.value || !lookAtTarget.value) return;
    const delta = deltaTime ?? clock.getDelta();
    if (isAutoRotating.value && !isInteracting.value) {
      targetSpherical.value.theta += autoRotationSpeed * delta;
    }
    currentSpherical.value.theta += (targetSpherical.value.theta - currentSpherical.value.theta) * damping;
    currentSpherical.value.phi += (targetSpherical.value.phi - currentSpherical.value.phi) * damping;
    const targetWorldPos = new THREE.Vector3();
    lookAtTarget.value.getWorldPosition(targetWorldPos);
    const adjustedPhi = phiAdjustment !== void 0 ? currentSpherical.value.phi + phiAdjustment : currentSpherical.value.phi;
    const radius = effectiveRadius ?? sphericalCoords.value.radius;
    const cameraOffset = sphericalToCartesian(
      radius,
      currentSpherical.value.theta,
      adjustedPhi
    );
    if (yOffset) {
      cameraOffset.y += yOffset;
    }
    runtimeCamera.value.position.copy(targetWorldPos).add(cameraOffset);
    runtimeCamera.value.lookAt(targetWorldPos);
    runtimeCamera.value.updateMatrixWorld();
  };
  const setAutoRotation = (enabled) => {
    isAutoRotating.value = enabled;
  };
  const resetCamera = () => {
    targetSpherical.value.theta = 0;
    targetSpherical.value.phi = Math.PI / 4;
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
    updateCameraReference,
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
const modelCache = /* @__PURE__ */ new Map();
function useModelCache() {
  const getCachedModel = (path) => {
    return modelCache.get(path);
  };
  const setCachedModel = (path, scene) => {
    modelCache.set(path, markRaw(scene));
  };
  const isModelCached = (path) => {
    return modelCache.has(path);
  };
  const clearCachedModel = (path) => {
    return modelCache.delete(path);
  };
  const clearAllCached = () => {
    modelCache.clear();
  };
  const getCacheSize = () => {
    return modelCache.size;
  };
  return {
    getCachedModel,
    setCachedModel,
    isModelCached,
    clearCachedModel,
    clearAllCached,
    getCacheSize
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
    modelPath: { default: "/models/ok10b_circle.glb" },
    scrollControlledRadius: {},
    isScrollingActive: { type: Boolean },
    responsiveMode: {},
    cameraYOffset: { default: 0 }
  },
  emits: ["camera-ready", "model-ready", "loading-started", "loading-progress", "loading-complete"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { getCachedModel, setCachedModel, isModelCached } = useModelCache();
    const currentScene = shallowRef(null);
    const isLoadingModel = ref(false);
    const hasLoadedFirstModel = ref(false);
    const houseModel = shallowRef(null);
    const cubeOpacity = ref(1);
    ref(0);
    const showHouseModel = computed(() => props.loadModel && hasLoadedFirstModel.value);
    let gltfLoader = null;
    let dracoLoader = null;
    const getLoader = () => {
      if (!gltfLoader) {
        dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath("/libs/draco/");
        gltfLoader = new GLTFLoader();
        gltfLoader.setDRACOLoader(dracoLoader);
      }
      return gltfLoader;
    };
    const loadModel = async (path) => {
      if (isModelCached(path)) {
        console.log(`[HouseModelRig] Using cached model: ${path}`);
        const cachedScene = getCachedModel(path);
        if (cachedScene) {
          return cachedScene;
        }
      }
      console.log(`[HouseModelRig] Loading model: ${path}`);
      isLoadingModel.value = true;
      emit("loading-started");
      try {
        const loader = getLoader();
        const gltf = await loader.loadAsync(path);
        const scene = gltf.scene;
        setCachedModel(path, scene);
        console.log(`[HouseModelRig] Model loaded and cached: ${path}`);
        isLoadingModel.value = false;
        emit("loading-complete");
        return scene;
      } catch (error) {
        console.error(`[HouseModelRig] Failed to load model: ${path}`, error);
        isLoadingModel.value = false;
        return null;
      }
    };
    const {
      runtimeCamera,
      lookAtTarget,
      sphericalCoords,
      isInteracting,
      initializeFromCamera,
      updateCameraReference,
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
    watch(
      () => props.modelPath,
      async (newPath, oldPath) => {
        if (!newPath) return;
        if (newPath === oldPath && currentScene.value) return;
        console.log(`[HouseModelRig] Model path changed: ${oldPath} -> ${newPath}`);
        const scene = await loadModel(newPath);
        if (scene && props.loadModel) {
          await processScene(scene);
          currentScene.value = scene;
          hasLoadedFirstModel.value = true;
          console.log(`[HouseModelRig] Scene displayed: ${newPath}`);
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
        } else if (child.type === "Mesh" && !foundHouseModel) {
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
        if (!hasLoadedFirstModel.value) {
          initializeFromCamera(camera, target);
        } else {
          updateCameraReference(camera, target);
        }
        if (camera.parent) {
          camera.parent.remove(camera);
        }
        loadedScene.add(camera);
        emit("camera-ready", camera);
        await nextTick();
      }
    };
    watch(
      () => props.loadModel,
      async (shouldLoad) => {
        if (shouldLoad && currentScene.value) {
          await processScene(currentScene.value);
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
      if (currentScene.value && showHouseModel.value) {
        _push(`<primitive${ssrRenderAttr("object", currentScene.value)}></primitive>`);
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
  __name: "ModelCarouselNav",
  __ssrInlineRender: true,
  props: {
    canGoNext: { type: Boolean },
    canGoPrevious: { type: Boolean },
    isLoading: { type: Boolean }
  },
  emits: ["next", "previous"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "carousel-nav-container" }, _attrs))} data-v-07bb1b71>`);
      if (__props.canGoPrevious) {
        _push(`<button class="carousel-arrow carousel-arrow-left"${ssrIncludeBooleanAttr(__props.isLoading) ? " disabled" : ""} aria-label="Previous model" data-v-07bb1b71><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07bb1b71><path d="M15 18L9 12L15 6" data-v-07bb1b71></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.canGoNext) {
        _push(`<button class="carousel-arrow carousel-arrow-right"${ssrIncludeBooleanAttr(__props.isLoading) ? " disabled" : ""} aria-label="Next model" data-v-07bb1b71><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-v-07bb1b71><path d="M9 18L15 12L9 6" data-v-07bb1b71></path></svg></button>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.isLoading) {
        _push(`<div class="carousel-loading" data-v-07bb1b71><div class="carousel-loading-spinner" data-v-07bb1b71></div><span data-v-07bb1b71>Laden...</span></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ModelCarouselNav.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ModelCarouselNav = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-07bb1b71"]]), { __name: "ModelCarouselNav" });
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
const MODELS = [
  {
    id: "ok10b",
    name: "Ekster House",
    path: "/models/ok10b_circle.glb",
    buttonLabel: "Huis 1",
    description: "Primary architectural visualization",
    sceneObjects: {
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
      fileSize: "~25 MB",
      loadingMessage: "Loading house model...",
      useDraco: true
    },
    tags: ["architecture", "residential", "main"]
  },
  {
    id: "br62b",
    name: "Ekster House 2",
    path: "/models/BIJBRAM.glb",
    buttonLabel: "Huis 2",
    description: "Secondary architectural visualization",
    sceneObjects: {
      cameraName: "Camera",
      lookAtTargetName: "EmptyLookAtTarget"
    },
    camera: {
      position: [30, 20, 30],
      fov: 50,
      sphericalRadius: 45,
      initialTheta: Math.atan2(30, 30),
      initialPhi: Math.PI / 3,
      yOffset: 15
      // Compensate for different lookAtTarget height
    },
    placeholder: {
      dimensions: [15, 12, 15],
      rotation: [0, Math.PI / 6, 0],
      color: "#FFFFFF"
    },
    loading: {
      fileSize: "~25 MB",
      loadingMessage: "Loading house model...",
      useDraco: true
    },
    tags: ["architecture", "residential"]
  }
];
function useModelCarousel(config = {}) {
  const { autoLoadFirst = true } = config;
  const currentIndex = ref(0);
  const isLoading = ref(false);
  const loadingProgress = ref(0);
  const loadedModelIds = ref([]);
  const currentModel = computed(() => {
    return MODELS[currentIndex.value];
  });
  const models = computed(() => MODELS);
  const totalModels = computed(() => MODELS.length);
  const canGoNext = computed(() => {
    return currentIndex.value < MODELS.length - 1;
  });
  const canGoPrevious = computed(() => {
    return currentIndex.value > 0;
  });
  const isModelLoaded = (modelId) => {
    return loadedModelIds.value.includes(modelId);
  };
  const markModelLoaded = (modelId) => {
    if (!loadedModelIds.value.includes(modelId)) {
      loadedModelIds.value.push(modelId);
    }
  };
  const goNext = () => {
    if (canGoNext.value) {
      currentIndex.value++;
    }
  };
  const goPrevious = () => {
    if (canGoPrevious.value) {
      currentIndex.value--;
    }
  };
  const goToIndex = (index2) => {
    if (index2 >= 0 && index2 < MODELS.length) {
      currentIndex.value = index2;
    }
  };
  const goToModel = (modelId) => {
    const index2 = MODELS.findIndex((m2) => m2.id === modelId);
    if (index2 !== -1) {
      currentIndex.value = index2;
    }
  };
  const setLoading = (loading, progress = 0) => {
    isLoading.value = loading;
    loadingProgress.value = progress;
  };
  if (autoLoadFirst && MODELS.length > 0) ;
  return {
    // State
    currentIndex: computed(() => currentIndex.value),
    currentModel,
    models,
    totalModels,
    // Navigation state
    canGoNext,
    canGoPrevious,
    // Navigation functions
    goNext,
    goPrevious,
    goToIndex,
    goToModel,
    // Loading state
    isLoading: computed(() => isLoading.value),
    loadingProgress: computed(() => loadingProgress.value),
    setLoading,
    // Loaded models tracking
    loadedModelIds: computed(() => loadedModelIds.value),
    isModelLoaded,
    markModelLoaded
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { isMobile } = useResponsive();
    const {
      currentModel,
      canGoNext,
      canGoPrevious,
      goNext,
      goPrevious,
      isLoading,
      setLoading,
      markModelLoaded
    } = useModelCarousel({ autoLoadFirst: true });
    const activeCamera = ref(null);
    const canvasElement = ref(null);
    const modelLoaded = ref(false);
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
      setLoading(true);
    };
    const onLoadingProgress = (progress) => {
      console.log(`[Index] Loading progress: ${progress}%`);
      setLoading(true, progress);
    };
    const onLoadingComplete = () => {
      console.log("[Index] Loading complete!");
      setLoading(false);
      modelLoaded.value = true;
      if (currentModel.value) {
        markModelLoaded(currentModel.value.id);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["bg-[#F7F9F7]", { "snap-y snap-mandatory": !unref(isMobile) }]
      }, _attrs))} data-v-639c449b>`);
      _push(ssrRenderComponent(Navigation, null, null, _parent));
      if (!unref(isMobile)) {
        _push(`<div class="relative lg:grid lg:grid-cols-2 pt-16 lg:pt-20" data-v-639c449b><div data-v-639c449b><div class="snap-start min-h-screen flex items-center justify-center px-6 lg:px-12 transition-opacity duration-700" style="${ssrRenderStyle({ opacity: section1Opacity.value })}" data-v-639c449b><div class="max-w-xl space-y-8 lg:space-y-12" data-v-639c449b><div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed" data-v-639c449b><p class="text-base lg:text-lg font-light leading-relaxed" data-v-639c449b> De Ekstergroep doet beheer, exploitatie, renovatie en verbetering van zowel monumentaal als gewoon vastgoed. </p><p class="text-sm lg:text-base leading-relaxed" data-v-639c449b> Wij leggen de focus op esthetiek, waarbij degelijkheid en levensduur als vereisten worden meegenomen. </p><p class="text-sm lg:text-base leading-relaxed" data-v-639c449b> We werken samen als team en pakken jaarlijks een aantal totalrenovaties op. Daarin begeleiden we de client van begin tot eind. Samen met de architect zetten we de dromen op papier, die we vervolgens door de constructeur laten doorrekenen. Na het uitgeebreid bespreken en plannen van de uit te voeren taken komt het team ten tonele en streven we er naar alles naar planning uit te voeren. </p></div><div class="space-y-3 lg:space-y-4 pt-4 lg:pt-6" data-v-639c449b><p class="text-sm lg:text-base leading-relaxed text-gray-700" data-v-639c449b> Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen? </p><div class="flex flex-col sm:inline-flex sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 group" data-v-639c449b><span class="text-sm text-gray-600" data-v-639c449b>Neem contact op via</span><a href="mailto:info@ekstergroep.nl" class="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 hover:shadow-md transition-all duration-200 hover:scale-102 text-sm" style="${ssrRenderStyle({ "box-shadow": "0 1px 3px rgba(0, 0, 0, 0.1)" })}" data-v-639c449b> info@ekstergroep.nl </a></div></div><div class="pt-6 lg:pt-8 border-t border-gray-200 relative" data-v-639c449b><div class="text-xs text-gray-500 tracking-wider uppercase font-medium flex items-center space-x-2" data-v-639c449b><span data-v-639c449b>Start scrolling to explore</span><div class="flex space-x-1" data-v-639c449b><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" data-v-639c449b></div><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-639c449b></div><div class="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}" data-v-639c449b></div></div></div></div></div></div><div class="snap-start min-h-screen flex items-center justify-center px-6 lg:px-12 transition-opacity duration-700" style="${ssrRenderStyle({ opacity: section2Opacity.value })}" data-v-639c449b><div class="max-w-xl space-y-8 lg:space-y-12" data-v-639c449b><div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed" data-v-639c449b><h2 class="text-2xl lg:text-3xl font-light text-gray-900" data-v-639c449b> Discover Our Craftsmanship </h2><p class="text-base lg:text-lg font-light leading-relaxed" data-v-639c449b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p><p class="text-sm lg:text-base leading-relaxed" data-v-639c449b> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p><p class="text-sm lg:text-base leading-relaxed" data-v-639c449b> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. </p></div></div></div></div><div class="relative h-screen lg:sticky lg:top-0 flex flex-col snap-start" data-v-639c449b><div class="flex-1 relative" data-v-639c449b>`);
        _push(ssrRenderComponent(unref(ol), {
          "clear-color": "#F7F9F7",
          camera: activeCamera.value || void 0,
          class: "w-full h-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(HouseModelRig, {
                "canvas-element": canvasElement.value,
                "load-model": true,
                "model-path": unref(currentModel)?.path,
                "scroll-controlled-radius": unref(cameraRadius),
                "is-scrolling-active": unref(isScrolling),
                "camera-y-offset": unref(currentModel)?.camera?.yOffset ?? 0,
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
                  "load-model": true,
                  "model-path": unref(currentModel)?.path,
                  "scroll-controlled-radius": unref(cameraRadius),
                  "is-scrolling-active": unref(isScrolling),
                  "camera-y-offset": unref(currentModel)?.camera?.yOffset ?? 0,
                  onCameraReady,
                  onModelReady: (model) => console.log("[Index] Model ready:", model),
                  onLoadingStarted,
                  onLoadingProgress,
                  onLoadingComplete
                }, null, 8, ["canvas-element", "model-path", "scroll-controlled-radius", "is-scrolling-active", "camera-y-offset", "onModelReady"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(ModelCarouselNav, {
          "can-go-next": unref(canGoNext),
          "can-go-previous": unref(canGoPrevious),
          "is-loading": unref(isLoading),
          onNext: unref(goNext),
          onPrevious: unref(goPrevious)
        }, null, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<div class="relative pt-12 bg-[#F7F9F7]" data-v-639c449b><div class="px-3 pt-4 pb-4" data-v-639c449b><div class="mobile-text-card" data-v-639c449b><div class="space-y-4 text-gray-700" data-v-639c449b><p class="text-base font-light leading-7" data-v-639c449b> De Ekstergroep doet beheer, exploitatie, renovatie en verbetering van zowel monumentaal als gewoon vastgoed. </p><p class="text-sm leading-6" data-v-639c449b> Wij leggen de focus op esthetiek, waarbij degelijkheid en levensduur als vereisten worden meegenomen. </p><p class="text-sm leading-6" data-v-639c449b> We werken samen als team en pakken jaarlijks een aantal totalrenovaties op. Daarin begeleiden we de client van begin tot eind. </p></div><div class="pt-5 mt-5 border-t border-gray-200" data-v-639c449b><p class="text-sm leading-6 text-gray-700 mb-4" data-v-639c449b> Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw te brengen? </p><a href="mailto:info@ekstergroep.nl" class="flex items-center justify-center w-full px-5 py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 text-sm" style="${ssrRenderStyle({ "box-shadow": "0 2px 8px rgba(0, 0, 0, 0.15)" })}" data-v-639c449b> info@ekstergroep.nl </a></div></div></div><div class="relative h-[90vh] overflow-hidden bg-[#F7F9F7] z-0" data-v-639c449b><div class="absolute left-0 right-0 top-[40%]" style="${ssrRenderStyle({ transform: `translateY(-${mobileCanvasTranslateY.value}%)`, height: "100vh" })}" data-v-639c449b>`);
        _push(ssrRenderComponent(unref(ol), {
          "clear-color": "#F7F9F7",
          camera: activeCamera.value || void 0,
          class: "w-full h-full"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(HouseModelRig, {
                "canvas-element": canvasElement.value,
                "load-model": true,
                "model-path": unref(currentModel)?.path,
                "scroll-controlled-radius": unref(cameraRadius),
                "is-scrolling-active": unref(isScrolling),
                "camera-y-offset": unref(currentModel)?.camera?.yOffset ?? 0,
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
                  "load-model": true,
                  "model-path": unref(currentModel)?.path,
                  "scroll-controlled-radius": unref(cameraRadius),
                  "is-scrolling-active": unref(isScrolling),
                  "camera-y-offset": unref(currentModel)?.camera?.yOffset ?? 0,
                  "responsive-mode": "mobile",
                  onCameraReady,
                  onModelReady: (model) => console.log("[Index] Model ready:", model),
                  onLoadingStarted,
                  onLoadingProgress,
                  onLoadingComplete
                }, null, 8, ["canvas-element", "model-path", "scroll-controlled-radius", "is-scrolling-active", "camera-y-offset", "onModelReady"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(ModelCarouselNav, {
          "can-go-next": unref(canGoNext),
          "can-go-previous": unref(canGoPrevious),
          "is-loading": unref(isLoading),
          onNext: unref(goNext),
          onPrevious: unref(goPrevious)
        }, null, _parent));
        _push(`<div class="mobile-model-gradient-top" data-v-639c449b></div><div class="mobile-model-gradient-bottom" data-v-639c449b></div><div class="mobile-model-gradient-left" data-v-639c449b></div><div class="mobile-model-gradient-right" data-v-639c449b></div></div><div class="px-3 pb-8 relative z-10" style="${ssrRenderStyle({ marginTop: `-${section2OverlapPx.value}px` })}" data-v-639c449b><div class="mobile-text-card" data-v-639c449b><h2 class="text-xl font-light text-gray-900 mb-4" data-v-639c449b> Discover Our Craftsmanship </h2><div class="space-y-4 text-gray-700" data-v-639c449b><p class="text-base font-light leading-7" data-v-639c449b> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p><p class="text-sm leading-6" data-v-639c449b> Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p><p class="text-sm leading-6" data-v-639c449b> Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </p></div></div></div><div class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20" style="${ssrRenderStyle({ opacity: section1Opacity.value })}" data-v-639c449b><div class="mobile-scroll-indicator" data-v-639c449b><span data-v-639c449b>Scroll to explore</span><div class="flex space-x-1 ml-2" data-v-639c449b><div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" data-v-639c449b></div><div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-639c449b></div><div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}" data-v-639c449b></div></div></div></div></div>`);
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
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-639c449b"]]);

export { index as default };
//# sourceMappingURL=index-DtePRMcO.mjs.map
