import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * Lighting — manages all lights in the 3D scene.
 *
 * @param {Object}  props
 * @param {number}  [props.ambientIntensity=0.5]       - Ambient light strength
 * @param {number}  [props.directionalIntensity=1]     - Main directional light strength
 * @param {[number,number,number]} [props.directionalPosition=[5,5,5]] - Light position
 * @param {boolean} [props.enablePointLight=true]      - Toggle accent point light
 */
export default function Lighting({
    ambientIntensity = 0.5,
    directionalIntensity = 1,
    directionalPosition = [5, 5, 5],
    enablePointLight = true,
    shadowMapSize = 512,
}) {
    const pointLightRef = useRef();
    const prefersReducedMotion = useReducedMotion();

    // Subtle orbit for the point light (disabled with reduced motion)
    useFrame(({ clock }) => {
        if (pointLightRef.current && enablePointLight && !prefersReducedMotion) {
            const t = clock.getElapsedTime();
            pointLightRef.current.position.x = Math.sin(t * 0.5) * 3;
            pointLightRef.current.position.z = Math.cos(t * 0.5) * 3;
        }
    });

    return (
        <>
            {/* Soft fill */}
            <ambientLight intensity={ambientIntensity} />

            {/* Key light */}
            <directionalLight
                position={directionalPosition}
                intensity={directionalIntensity}
                castShadow
                shadow-mapSize-width={shadowMapSize}
                shadow-mapSize-height={shadowMapSize}
                shadow-camera-far={30}
                shadow-camera-left={-8}
                shadow-camera-right={8}
                shadow-camera-top={8}
                shadow-camera-bottom={-8}
                shadow-bias={-0.0005}
            />

            {/* Rim / fill light from behind */}
            <directionalLight
                position={[-3, 3, -5]}
                intensity={0.3}
                color="#a855f7"
            />

            {/* Accent point light */}
            {enablePointLight && (
                <pointLight
                    ref={pointLightRef}
                    position={[2, 3, 2]}
                    intensity={0.6}
                    color="#06b6d4"
                    distance={10}
                    decay={2}
                />
            )}

            {/* Hemisphere light for natural fill */}
            <hemisphereLight
                args={['#06b6d4', '#1a1a2e', 0.3]}
            />
        </>
    );
}
