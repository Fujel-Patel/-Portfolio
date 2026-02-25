import { useRef, Suspense, useCallback, useEffect, useMemo, lazy } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
    Preload,
    AdaptiveDpr,
    AdaptiveEvents,
    PerformanceMonitor,
    BakeShadows,
} from '@react-three/drei';
import Lighting from './Lighting';
import Camera from './Camera';
import usePortfolioStore from '../../store/usePortfolioStore';
import useReducedMotion from '../../hooks/useReducedMotion';
import {
    FPSTracker,
    getRendererStats,
} from '../../utils/performanceMonitor';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/* ── Lazy-loaded Konami secret scene ─────────────────── */
const KonamiScene = lazy(() => import('./KonamiScene'));

/* ────────────────────────────────────────────────────────
   PlaceholderCube — rotating test mesh (frustum culled)
   ──────────────────────────────────────────────────────── */

/**
 * @param {Object}  props
 * @param {[number,number,number]} [props.position=[0,0,0]]
 * @param {string}  [props.color='#06b6d4']
 */
function PlaceholderCube({ position = [0, 0, 0], color = '#06b6d4' }) {
    const meshRef = useRef();
    const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

    useFrame((_, delta) => {
        if (meshRef.current && !reducedMotion) {
            meshRef.current.rotation.x += delta * 0.4;
            meshRef.current.rotation.y += delta * 0.6;
        }
    });

    return (
        <mesh ref={meshRef} position={position} castShadow receiveShadow frustumCulled>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
                color={color}
                metalness={0.4}
                roughness={0.3}
                emissive={color}
                emissiveIntensity={0.15}
            />
        </mesh>
    );
}

/* ────────────────────────────────────────────────────────
   Floor — ground plane with slight reflection
   ──────────────────────────────────────────────────────── */
function Floor() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow frustumCulled>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial
                color="#0a0e1a"
                metalness={0.8}
                roughness={0.4}
            />
        </mesh>
    );
}

/* ────────────────────────────────────────────────────────
   FallbackLoader — shown while scene assets load
   ──────────────────────────────────────────────────────── */
function FallbackLoader() {
    return (
        <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshBasicMaterial color="#06b6d4" wireframe />
        </mesh>
    );
}

/* ────────────────────────────────────────────────────────
   PerformanceTracker — lightweight FPS logger (inner component)
   ──────────────────────────────────────────────────────── */
function PerformanceTracker() {
    const fpsTracker = useMemo(() => new FPSTracker(), []);
    const { gl } = useThree();

    useFrame(() => {
        fpsTracker.tick();

        if (import.meta.env.DEV && fpsTracker.fps < 30) {
            const stats = getRendererStats(gl);
            console.warn(
                `[Perf] FPS: ${fpsTracker.fps.toFixed(0)} | Draws: ${stats.drawCalls} | Tris: ${stats.triangles}`,
            );
        }
    });

    return null;
}

/* ────────────────────────────────────────────────────────
   MainScene — top-level canvas wrapper with perf optimizations
   ──────────────────────────────────────────────────────── */

/**
 * MainScene wraps the R3F <Canvas> with lights, camera controls,
 * adaptive quality, frustum culling, and a placeholder cube.
 * In development mode, a <Perf /> overlay is shown.
 *
 * @param {Object}  props
 * @param {import('react').ReactNode} [props.children] - Extra 3D objects
 * @param {string}  [props.className]
 */
export default function MainScene({ children, className = '', konamiActive = false }) {
    const isMobile = usePortfolioStore((s) => s.isMobile);
    const deviceTier = usePortfolioStore((s) => s.deviceTier);
    const checkMobile = usePortfolioStore((s) => s.checkMobile);
    const toggleLoading = usePortfolioStore((s) => s.toggleLoading);
    const prefersReducedMotion = useReducedMotion();

    /* Detect mobile on mount + resize */
    useEffect(() => {
        checkMobile();
        const handleResize = () => checkMobile();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [checkMobile]);

    /** Called once the canvas has finished its first render pass */
    const handleCreated = useCallback(
        ({ gl }) => {
            gl.setClearColor('#0a0a0a');
            toggleLoading();
        },
        [toggleLoading],
    );

    /* Shadow map size: tier-based for perf */
    const shadowMapSize = deviceTier === 'mobile' ? 256 : deviceTier === 'tablet' ? 512 : 512;

    /* DPR ranges per tier */
    const dprRange = deviceTier === 'mobile' ? [1, 1] : deviceTier === 'tablet' ? [1, 1.5] : [1, 2];

    return (
        <div
            className={`canvas-container ${className}`}
            role="img"
            aria-label="Interactive 3D portfolio scene"
        >
            <Canvas
                shadows={deviceTier !== 'mobile'}
                dpr={dprRange}
                gl={{
                    antialias: deviceTier === 'desktop',
                    alpha: false,
                    powerPreference: 'high-performance',
                    stencil: false,
                    depth: true,
                    logarithmicDepthBuffer: false,
                }}
                camera={{ fov: 45, near: 0.1, far: 50, position: [0, 2, 5] }}
                onCreated={handleCreated}
                performance={{ min: 0.5 }}
                frameloop="always"
            >
                {/* Performance monitoring overlay removed as per user request */}

                {/* ── Adaptive quality ─────────────────── */}
                <PerformanceMonitor
                    onIncline={() => {
                        // Quality improving — can enable more features
                    }}
                    onDecline={() => {
                        // Quality degrading — reduce features
                    }}
                    flipflops={3}
                    onFallback={() => {
                        // Permanent fallback after too many flipflops
                    }}
                >
                    <AdaptiveDpr pixelated />
                </PerformanceMonitor>
                <AdaptiveEvents />

                {/* ── FPS tracker ──────────────────────── */}
                <PerformanceTracker />

                {/* ── Bake static shadows ──────────────── */}
                <BakeShadows />

                {/* ── Lights (reduced shadow maps) ─────── */}
                <Lighting
                    ambientIntensity={0.5}
                    directionalIntensity={1}
                    directionalPosition={[5, 5, 5]}
                    enablePointLight={deviceTier === 'desktop'}
                    shadowMapSize={shadowMapSize}
                />

                {/* Camera Controls */}
                <Camera
                    initialPosition={[0, 2, 5]}
                    enableDamping
                    dampingFactor={0.05}
                    enableZoom
                    enablePan={false}
                    minDistance={3}
                    maxDistance={15}
                />

                {/* Scene content */}
                <Suspense fallback={<FallbackLoader />}>
                    {/* Soft bloom postprocessing for background panels */}
                    <EffectComposer>
                        <Bloom
                            intensity={0.18}
                            luminanceThreshold={0.12}
                            luminanceSmoothing={0.18}
                        />
                    </EffectComposer>
                    {children}

                    {/* ── Konami secret scene (lazy) ──────── */}
                    {konamiActive && (
                        <Suspense fallback={null}>
                            <KonamiScene />
                        </Suspense>
                    )}

                    <Preload all />
                </Suspense>

                {/* Fog for depth (tightened far plane) */}
                <fog attach="fog" args={['#060810', 8, 25]} />
            </Canvas>
        </div>
    );
}
