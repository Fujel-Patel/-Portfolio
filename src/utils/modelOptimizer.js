/**
 * Model optimization utilities for Three.js/R3F scenes.
 * Reduces draw calls, optimises materials, enables shadows,
 * compresses textures, and enforces frustum culling.
 */

import * as THREE from 'three';
import { compressMaterialTextures } from './performanceMonitor';

/**
 * Traverse a loaded GLTF scene and apply production-ready defaults.
 *
 * @param {THREE.Group} scene  – root of the loaded model
 * @param {Object}  [opts]
 * @param {boolean} [opts.castShadow=true]
 * @param {boolean} [opts.receiveShadow=true]
 * @param {boolean} [opts.optimizeMaterials=true]
 * @param {boolean} [opts.frustumCull=true]
 * @param {boolean} [opts.compressTextures=true]
 * @param {number}  [opts.maxTextureSize=1024]
 */
export function optimizeModel(scene, opts = {}) {
    const {
        castShadow = true,
        receiveShadow = true,
        optimizeMaterials = true,
        frustumCull = true,
        compressTextures = true,
        maxTextureSize = 1024,
    } = opts;

    scene.traverse((child) => {
        // Force frustum culling on all objects
        child.frustumCulled = frustumCull;

        if (child.isMesh) {
            child.castShadow = castShadow;
            child.receiveShadow = receiveShadow;

            // Pre-compute bounding sphere for faster frustum tests
            if (child.geometry && !child.geometry.boundingSphere) {
                child.geometry.computeBoundingSphere();
            }

            if (child.material) {
                if (optimizeMaterials) {
                    applyMaterialDefaults(child.material);
                }
                if (compressTextures) {
                    compressMaterialTextures(child.material, maxTextureSize);
                }
            }
        }
    });
}

/**
 * Set sane defaults on a material to improve visual quality.
 * @param {THREE.Material | THREE.Material[]} mat
 */
function applyMaterialDefaults(mat) {
    const materials = Array.isArray(mat) ? mat : [mat];

    materials.forEach((m) => {
        if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
            m.envMapIntensity = m.envMapIntensity ?? 1;
            m.needsUpdate = true;
        }
    });
}

/**
 * Dispose all geometries & materials inside a scene to free GPU memory.
 * Call this when the model is removed / component unmounts.
 *
 * @param {THREE.Group} scene
 */
export function disposeModel(scene) {
    scene.traverse((child) => {
        if (child.isMesh) {
            child.geometry?.dispose();

            const materials = Array.isArray(child.material)
                ? child.material
                : [child.material];

            materials.forEach((m) => {
                // Dispose all maps
                Object.keys(m).forEach((key) => {
                    const value = m[key];
                    if (value && value.isTexture) {
                        value.dispose();
                    }
                });
                m.dispose();
            });
        }
    });
}

/**
 * Count triangles and draw calls in a scene — useful for diagnostics.
 *
 * @param {THREE.Group} scene
 * @returns {{ triangles: number, meshes: number }}
 */
export function getSceneStats(scene) {
    let triangles = 0;
    let meshes = 0;

    scene.traverse((child) => {
        if (child.isMesh) {
            meshes += 1;
            const geo = child.geometry;
            if (geo.index) {
                triangles += geo.index.count / 3;
            } else if (geo.attributes.position) {
                triangles += geo.attributes.position.count / 3;
            }
        }
    });

    return { triangles, meshes };
}
