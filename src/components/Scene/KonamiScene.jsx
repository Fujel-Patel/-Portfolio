import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * KonamiScene — a fun hidden particle field that appears
 * when the user enters the Konami code.
 *
 * 500 gently orbiting particles in a toroidal distribution,
 * with a glowing wireframe icosahedron at the centre.
 */
const PARTICLE_COUNT = 500;

export default function KonamiScene() {
  const pointsRef = useRef();
  const icoRef = useRef();

  /* ── Generate initial positions on a torus ────────── */
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 2;
      const R = 3 + Math.random() * 1.5;   // major radius
      const r = 0.6 + Math.random() * 0.6; // minor radius
      arr[i * 3]     = (R + r * Math.cos(phi)) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi);
      arr[i * 3 + 2] = (R + r * Math.cos(phi)) * Math.sin(theta);
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    const palette = [
      new THREE.Color('#06b6d4'),
      new THREE.Color('#a855f7'),
      new THREE.Color('#e94560'),
      new THREE.Color('#00fff5'),
      new THREE.Color('#f59e0b'),
    ];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const c = palette[Math.floor(Math.random() * palette.length)];
      arr[i * 3]     = c.r;
      arr[i * 3 + 1] = c.g;
      arr[i * 3 + 2] = c.b;
    }
    return arr;
  }, []);

  /* ── Animate ──────────────────────────────────────── */
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
      pointsRef.current.rotation.x += delta * 0.05;
    }
    if (icoRef.current) {
      icoRef.current.rotation.x += delta * 0.3;
      icoRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group position={[0, 1, 0]}>
      {/* Particle field */}
      <points ref={pointsRef} frustumCulled>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Centre wireframe icosahedron */}
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
}
