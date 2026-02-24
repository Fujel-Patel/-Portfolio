import { Suspense, useEffect, useRef, useMemo, useState, Component } from 'react';
import { useGLTF, useIntersect } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { optimizeModel, disposeModel } from '../../utils/modelOptimizer';
import { createSimplifiedMesh, createLOD } from '../../utils/performanceMonitor';
import Loader3D from '../Common/Loader3D';

/* ═══════════════════════════════════════════════════════
   Error Boundary — catches errors inside React Three Fiber
   (class component required for componentDidCatch)
   ═══════════════════════════════════════════════════════ */

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {import('react').ReactNode} children
 * @property {import('react').ReactNode} [fallback]
 */

class ModelErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('[ModelLoader] failed to load model:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback ?? (
                    <mesh>
                        <boxGeometry args={[0.5, 0.5, 0.5]} />
                        <meshStandardMaterial color="#e94560" wireframe />
                    </mesh>
                )
            );
        }
        return this.props.children;
    }
}

/* ═══════════════════════════════════════════════════════
   Inner component that actually loads the GLTF
   ═══════════════════════════════════════════════════════ */

/**
 * @param {Object}  props
 * @param {string}  props.url             - Path to .glb / .gltf
 * @param {[number,number,number]} [props.position=[0,0,0]]
 * @param {[number,number,number]} [props.rotation=[0,0,0]]
 * @param {number|[number,number,number]} [props.scale=1]
 * @param {boolean} [props.castShadow=true]
 * @param {boolean} [props.receiveShadow=true]
 * @param {boolean} [props.enableLOD=false]    - Enable Level of Detail
 * @param {boolean} [props.lazyLoad=false]     - Only render when in viewport
 * @param {Function} [props.onLoaded]          - Callback when model is ready
 */
function GLTFModel({
    url,
    position = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = 1,
    castShadow = true,
    receiveShadow = true,
    enableLOD = false,
    lazyLoad = false,
    onLoaded,
}) {
    const groupRef = useRef();
    const [isVisible, setIsVisible] = useState(!lazyLoad);
    const { scene } = useGLTF(url, true); // true = Draco support

    // Clone scene so multiple instances don't share state
    const clonedScene = useMemo(() => scene.clone(true), [scene]);

    /* ── Lazy loading: only render when within camera frustum ── */
    const intersectRef = useIntersect((visible) => {
        if (lazyLoad) setIsVisible(visible);
    });

    // Optimise once on mount
    useEffect(() => {
        optimizeModel(clonedScene, {
            castShadow,
            receiveShadow,
            compressTextures: true,
            maxTextureSize: 1024,
        });
        onLoaded?.({ scene: clonedScene });

        return () => {
            disposeModel(clonedScene);
        };
    }, [clonedScene, castShadow, receiveShadow, onLoaded]);

    /* ── Build LOD levels from the scene ── */
    const lodObject = useMemo(() => {
        if (!enableLOD) return null;

        const lod = new THREE.LOD();

        // High detail — distance 0
        const high = clonedScene.clone(true);
        lod.addLevel(high, 0);

        // Medium detail — distance 10 (reduced segments)
        const medium = clonedScene.clone(true);
        medium.traverse((child) => {
            if (child.isMesh && child.geometry?.parameters) {
                const simplified = createSimplifiedMesh(child, 0.5);
                child.geometry.dispose();
                child.geometry = simplified.geometry;
            }
        });
        lod.addLevel(medium, 10);

        // Low detail — distance 25 (very simplified)
        const low = clonedScene.clone(true);
        low.traverse((child) => {
            if (child.isMesh && child.geometry?.parameters) {
                const simplified = createSimplifiedMesh(child, 0.2);
                child.geometry.dispose();
                child.geometry = simplified.geometry;
                if (child.material) {
                    child.material = child.material.clone();
                    child.material.flatShading = true;
                }
            }
        });
        lod.addLevel(low, 25);

        return lod;
    }, [clonedScene, enableLOD]);

    /* Update LOD every frame */
    const { camera } = useThree();
    useFrame(() => {
        if (lodObject) {
            lodObject.update(camera);
        }
    });

    const normalizedScale = typeof scale === 'number' ? [scale, scale, scale] : scale;

    if (!isVisible) {
        // Invisible bounding box for intersection detection
        return (
            <group ref={intersectRef} position={position}>
                <mesh visible={false}>
                    <boxGeometry args={[1, 1, 1]} />
                </mesh>
            </group>
        );
    }

    return (
        <group
            ref={(node) => {
                groupRef.current = node;
                if (intersectRef) intersectRef.current = node;
            }}
            position={position}
            rotation={rotation}
            scale={normalizedScale}
        >
            {enableLOD && lodObject ? (
                <primitive object={lodObject} />
            ) : (
                <primitive object={clonedScene} />
            )}
        </group>
    );
}

/* ═══════════════════════════════════════════════════════
   ModelLoader — public API
   ═══════════════════════════════════════════════════════ */

/**
 * Reusable GLTF model loader with Suspense loading state,
 * error boundary, Draco support, and auto-optimisation.
 *
 * @param {Object}  props
 * @param {string}  props.url                              - Path to .glb / .gltf
 * @param {[number,number,number]} [props.position]
 * @param {[number,number,number]} [props.rotation]
 * @param {number|[number,number,number]} [props.scale]
 * @param {boolean} [props.castShadow]
 * @param {boolean} [props.receiveShadow]
 * @param {boolean} [props.enableLOD]                       - Enable Level of Detail
 * @param {boolean} [props.lazyLoad]                        - Only render when in viewport
 * @param {import('react').ReactNode} [props.fallback]     - Custom loading fallback
 * @param {import('react').ReactNode} [props.errorFallback] - Custom error fallback
 * @param {Function} [props.onLoaded]
 */
export default function ModelLoader({
    url,
    position,
    rotation,
    scale,
    castShadow,
    receiveShadow,
    enableLOD = false,
    lazyLoad = false,
    fallback,
    errorFallback,
    onLoaded,
}) {
    if (!url) {
        console.warn('[ModelLoader] No url provided — rendering placeholder.');
        return (
            <mesh position={position}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="#e94560" wireframe />
            </mesh>
        );
    }

    return (
        <ModelErrorBoundary fallback={errorFallback}>
            <Suspense fallback={fallback ?? <Loader3D position={position} />}>
                <GLTFModel
                    url={url}
                    position={position}
                    rotation={rotation}
                    scale={scale}
                    castShadow={castShadow}
                    receiveShadow={receiveShadow}
                    enableLOD={enableLOD}
                    lazyLoad={lazyLoad}
                    onLoaded={onLoaded}
                />
            </Suspense>
        </ModelErrorBoundary>
    );
}

/**
 * Pre-load a model for instant display later.
 * Call this at module scope or in useEffect.
 *
 * @param {string} url
 */
ModelLoader.preload = (url) => {
    useGLTF.preload(url, true);
};
