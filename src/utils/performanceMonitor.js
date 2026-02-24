/**
 * Performance monitoring & adaptive quality utilities.
 *
 * Tracks FPS, draw calls, triangles, and memory usage.
 * Provides adaptive quality scaling based on real-time performance.
 */

import * as THREE from 'three';

/* ─── Constants ─────────────────────────────────────────── */

const FPS_SAMPLE_SIZE = 60;
const LOW_FPS_THRESHOLD = 30;
const HIGH_FPS_THRESHOLD = 55;
const QUALITY_STEP_DOWN_DELAY = 2000; // ms before reducing quality
const QUALITY_STEP_UP_DELAY = 5000;   // ms before increasing quality

/** Quality tiers: 0 = potato, 1 = low, 2 = medium, 3 = high */
const QUALITY_PRESETS = Object.freeze({
    0: { label: 'potato',  dpr: 0.5, shadows: false, postProcessing: false, particleCount: 0.1  },
    1: { label: 'low',     dpr: 0.75, shadows: false, postProcessing: false, particleCount: 0.3 },
    2: { label: 'medium',  dpr: 1,    shadows: true,  postProcessing: false, particleCount: 0.6 },
    3: { label: 'high',    dpr: 1.5,  shadows: true,  postProcessing: true,  particleCount: 1   },
});

/* ─── FPS Tracker ───────────────────────────────────────── */

/**
 * Lightweight FPS counter that maintains a rolling average.
 */
export class FPSTracker {
    constructor() {
        /** @type {number[]} */
        this._samples = [];
        this._lastTime = performance.now();
    }

    /** Call once per frame (e.g. inside useFrame). */
    tick() {
        const now = performance.now();
        const delta = now - this._lastTime;
        this._lastTime = now;

        if (delta > 0) {
            this._samples.push(1000 / delta);
            if (this._samples.length > FPS_SAMPLE_SIZE) {
                this._samples.shift();
            }
        }
    }

    /** @returns {number} Rolling average FPS */
    get fps() {
        if (this._samples.length === 0) return 60;
        return this._samples.reduce((a, b) => a + b, 0) / this._samples.length;
    }

    /** @returns {number} Minimum FPS in the current window */
    get minFps() {
        return this._samples.length ? Math.min(...this._samples) : 60;
    }
}

/* ─── Adaptive Quality Manager ──────────────────────────── */

/**
 * Monitors FPS and adjusts a quality tier to keep rendering smooth.
 *
 * Usage:
 *   const aq = new AdaptiveQuality();
 *   // inside useFrame:
 *   aq.update();
 *   const { dpr, shadows } = aq.preset;
 */
export class AdaptiveQuality {
    /**
     * @param {Object} [opts]
     * @param {number} [opts.initialTier=3]
     * @param {(tier: number, preset: typeof QUALITY_PRESETS[0]) => void} [opts.onChange]
     */
    constructor(opts = {}) {
        this.tier = opts.initialTier ?? 3;
        this._onChange = opts.onChange;
        this._fps = new FPSTracker();
        this._lastStepDown = 0;
        this._lastStepUp = 0;
    }

    /** @returns {typeof QUALITY_PRESETS[0]} */
    get preset() {
        return QUALITY_PRESETS[this.tier];
    }

    /** Call once per frame. */
    update() {
        this._fps.tick();
        const now = performance.now();
        const avg = this._fps.fps;

        // Step down
        if (avg < LOW_FPS_THRESHOLD && this.tier > 0 && now - this._lastStepDown > QUALITY_STEP_DOWN_DELAY) {
            this.tier -= 1;
            this._lastStepDown = now;
            this._onChange?.(this.tier, this.preset);
        }

        // Step up
        if (avg > HIGH_FPS_THRESHOLD && this.tier < 3 && now - this._lastStepUp > QUALITY_STEP_UP_DELAY) {
            this.tier += 1;
            this._lastStepUp = now;
            this._onChange?.(this.tier, this.preset);
        }
    }
}

/* ─── Scene Statistics ──────────────────────────────────── */

/**
 * Collect renderer stats (draw calls, triangles, textures, memory).
 *
 * @param {THREE.WebGLRenderer} renderer
 * @returns {{ drawCalls: number, triangles: number, textures: number, geometries: number, programs: number }}
 */
export function getRendererStats(renderer) {
    const info = renderer.info;
    return {
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        textures: info.memory.textures,
        geometries: info.memory.geometries,
        programs: info.programs?.length ?? 0,
    };
}

/**
 * Estimate GPU memory in MB (rough heuristic).
 *
 * @param {THREE.WebGLRenderer} renderer
 * @returns {number} Estimated MB
 */
export function estimateGPUMemory(renderer) {
    const info = renderer.info.memory;
    // rough: each geometry ~100KB, each texture ~1MB
    return ((info.geometries ?? 0) * 0.1 + (info.textures ?? 0) * 1).toFixed(1);
}

/* ─── Viewport Visibility (for lazy loading) ────────────── */

/**
 * Check whether a 3D object is within the camera frustum.
 *
 * @param {THREE.Object3D} object
 * @param {THREE.Camera}   camera
 * @returns {boolean}
 */
export function isInFrustum(object, camera) {
    const frustum = new THREE.Frustum();
    const matrix = new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse,
    );
    frustum.setFromProjectionMatrix(matrix);

    if (object.geometry) {
        if (!object.geometry.boundingSphere) {
            object.geometry.computeBoundingSphere();
        }
        const sphere = object.geometry.boundingSphere.clone();
        sphere.applyMatrix4(object.matrixWorld);
        return frustum.intersectsSphere(sphere);
    }

    // Fallback: use position
    return frustum.containsPoint(object.getWorldPosition(new THREE.Vector3()));
}

/* ─── Texture Compression Helpers ───────────────────────── */

/**
 * Downscale a texture to maxSize for performance.
 *
 * @param {THREE.Texture} texture
 * @param {number} [maxSize=1024]
 * @returns {THREE.Texture}
 */
export function compressTexture(texture, maxSize = 1024) {
    if (!texture?.image) return texture;

    const { width, height } = texture.image;
    if (width <= maxSize && height <= maxSize) return texture;

    const canvas = document.createElement('canvas');
    const aspect = width / height;

    if (width > height) {
        canvas.width = maxSize;
        canvas.height = Math.round(maxSize / aspect);
    } else {
        canvas.height = maxSize;
        canvas.width = Math.round(maxSize * aspect);
    }

    const ctx = canvas.getContext('2d');
    ctx.drawImage(texture.image, 0, 0, canvas.width, canvas.height);

    const compressed = texture.clone();
    compressed.image = canvas;
    compressed.needsUpdate = true;

    return compressed;
}

/**
 * Compress all textures on a material to the given max size.
 *
 * @param {THREE.Material|THREE.Material[]} mat
 * @param {number} [maxSize=1024]
 */
export function compressMaterialTextures(mat, maxSize = 1024) {
    const materials = Array.isArray(mat) ? mat : [mat];
    const textureKeys = [
        'map', 'normalMap', 'roughnessMap', 'metalnessMap',
        'emissiveMap', 'aoMap', 'displacementMap', 'alphaMap',
        'envMap', 'lightMap', 'bumpMap',
    ];

    materials.forEach((m) => {
        textureKeys.forEach((key) => {
            if (m[key]) {
                m[key] = compressTexture(m[key], maxSize);
            }
        });
    });
}

/* ─── Loading Manager ───────────────────────────────────── */

/**
 * Create a centralised THREE.LoadingManager with progress callbacks.
 *
 * @param {Object} [opts]
 * @param {(progress: number) => void} [opts.onProgress] - 0–1
 * @param {() => void}                 [opts.onComplete]
 * @param {(url: string, err: Error) => void} [opts.onError]
 * @returns {THREE.LoadingManager}
 */
export function createLoadingManager(opts = {}) {
    let total = 0;
    let loaded = 0;

    const manager = new THREE.LoadingManager(
        // onLoad
        () => {
            opts.onComplete?.();
        },
        // onProgress
        (_url, itemsLoaded, itemsTotal) => {
            total = itemsTotal;
            loaded = itemsLoaded;
            opts.onProgress?.(total > 0 ? loaded / total : 0);
        },
        // onError
        (url) => {
            console.error(`[LoadingManager] Failed to load: ${url}`);
            opts.onError?.(url, new Error(`Failed to load ${url}`));
        },
    );

    /** @returns {{ loaded: number, total: number, progress: number }} */
    manager.getProgress = () => ({
        loaded,
        total,
        progress: total > 0 ? loaded / total : 0,
    });

    return manager;
}

/* ─── LOD Helper ────────────────────────────────────────── */

/**
 * Create a THREE.LOD object from an array of level definitions.
 *
 * @param {Array<{ object: THREE.Object3D, distance: number }>} levels
 * @returns {THREE.LOD}
 *
 * @example
 *   const lod = createLOD([
 *     { object: highDetailMesh,   distance: 0 },
 *     { object: mediumDetailMesh, distance: 10 },
 *     { object: lowDetailMesh,    distance: 25 },
 *   ]);
 */
export function createLOD(levels) {
    const lod = new THREE.LOD();
    levels
        .sort((a, b) => a.distance - b.distance)
        .forEach(({ object, distance }) => lod.addLevel(object, distance));
    return lod;
}

/**
 * Generate a simplified version of a mesh for LOD.
 * Produces a lower-poly version by reducing sphere/box segment counts.
 *
 * @param {THREE.Mesh}  original
 * @param {number}      factor   - Simplification factor (0-1, lower = simpler)
 * @returns {THREE.Mesh}
 */
export function createSimplifiedMesh(original, factor = 0.5) {
    const clone = original.clone();

    // For known geometry types, reduce segments
    const geo = original.geometry;
    const params = geo.parameters;

    if (params) {
        const segments = Math.max(4, Math.floor((params.widthSegments ?? 32) * factor));

        if (geo.type === 'SphereGeometry') {
            clone.geometry = new THREE.SphereGeometry(
                params.radius,
                segments,
                Math.max(4, Math.floor((params.heightSegments ?? 32) * factor)),
            );
        } else if (geo.type === 'BoxGeometry') {
            clone.geometry = new THREE.BoxGeometry(
                params.width, params.height, params.depth,
                Math.max(1, Math.floor((params.widthSegments ?? 1) * factor)),
                Math.max(1, Math.floor((params.heightSegments ?? 1) * factor)),
                Math.max(1, Math.floor((params.depthSegments ?? 1) * factor)),
            );
        }
    }

    // Simpler material for far LOD
    if (factor < 0.3 && clone.material) {
        const mat = clone.material.clone();
        mat.flatShading = true;
        clone.material = mat;
    }

    return clone;
}

/* ─── Dev-only Perf Overlay (React component helper) ───── */

/**
 * Configuration for the drei <Perf> component.
 * Import this in MainScene and spread onto <Perf {...PERF_CONFIG} />.
 */
export const PERF_CONFIG = {
    position: 'top-left',
    showGraph: true,
    minimal: false,
    matrixUpdate: true,
    deepAnalyze: true,
    overClock: true,
};

export { QUALITY_PRESETS };
