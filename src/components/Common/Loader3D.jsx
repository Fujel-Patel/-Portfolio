import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * Loader3D — an animated 3D wireframe spinner used as a Suspense
 * fallback inside the R3F Canvas.
 *
 * Accepts an optional progress value (0-1) from a Loading Manager
 * and adjusts the spinner speed + opacity accordingly.
 *
 * @param {Object}  props
 * @param {[number,number,number]} [props.position=[0,0,0]]
 * @param {number}  [props.size=0.4]
 * @param {string}  [props.color='#06b6d4']
 * @param {number}  [props.progress]        - 0-1 loading progress (optional)
 */
export default function Loader3D({
    position = [0, 0, 0],
    size = 0.4,
    color = '#06b6d4',
    progress,
}) {
    const groupRef = useRef();

    /* Speed reduces as loading progresses */
    const speed = useMemo(() => {
        if (progress == null) return 1;
        return Math.max(0.2, 1 - progress * 0.8);
    }, [progress]);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.x += delta * 1.2 * speed;
            groupRef.current.rotation.y += delta * 0.8 * speed;
            groupRef.current.rotation.z += delta * 0.4 * speed;
        }
    });

    return (
        <group ref={groupRef} position={position}>
            {/* Outer ring */}
            <mesh frustumCulled>
                <torusGeometry args={[size, size * 0.08, 8, 32]} />
                <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
            </mesh>

            {/* Inner ring (rotated) */}
            <mesh rotation={[Math.PI / 2, 0, 0]} frustumCulled>
                <torusGeometry args={[size * 0.65, size * 0.06, 8, 24]} />
                <meshBasicMaterial color="#a855f7" wireframe transparent opacity={0.4} />
            </mesh>

            {/* Centre dot */}
            <mesh frustumCulled>
                <sphereGeometry args={[size * 0.12, 8, 8]} />
                <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>
        </group>
    );
}
