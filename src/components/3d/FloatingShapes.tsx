import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null)

  const shapes = useMemo(() => [
    { geometry: 'torusKnot', position: [2, 0, -2], color: '#00d4ff', scale: 0.8 },
    { geometry: 'icosahedron', position: [-2, 1, -1], color: '#ff00a0', scale: 1 },
    { geometry: 'octahedron', position: [0, -1.5, -3], color: '#7000ff', scale: 0.6 },
    { geometry: 'torus', position: [-1.5, -0.5, -1], color: '#00d4ff', scale: 0.5 },
    { geometry: 'sphere', position: [1.5, 1.5, -2], color: '#ff00a0', scale: 0.4 },
  ], [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <Float
          key={index}
          speed={2 + index * 0.5}
          rotationIntensity={1}
          floatIntensity={2}
        >
          <mesh position={shape.position as [number, number, number]} scale={shape.scale}>
            {shape.geometry === 'torusKnot' && <torusKnotGeometry args={[1, 0.3, 128, 16]} />}
            {shape.geometry === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            {shape.geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {shape.geometry === 'torus' && <torusGeometry args={[1, 0.4, 16, 100]} />}
            {shape.geometry === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
            <MeshDistortMaterial
              color={shape.color}
              distort={0.3}
              speed={2}
              roughness={0.2}
              metalness={0.8}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
