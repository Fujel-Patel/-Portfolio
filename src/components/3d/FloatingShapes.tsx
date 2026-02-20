/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export default function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null)
  const { viewport } = useThree()

  // Orbital layout positions
  const shapes = useMemo(() => {
    const items = [
      { geometry: 'torusKnot', color: '#00d4ff', scale: 0.8 },
      { geometry: 'icosahedron', color: '#ff00a0', scale: 1 },
      { geometry: 'octahedron', color: '#7000ff', scale: 0.6 },
      { geometry: 'torus', color: '#00d4ff', scale: 0.5 },
      { geometry: 'sphere', color: '#ff00a0', scale: 0.4 },
      { geometry: 'icosahedron', color: '#00ffa3', scale: 0.7 },
      { geometry: 'octahedron', color: '#ffcc00', scale: 0.5 },
    ]

    const isMobile = viewport.width < 10
    const baseRadius = isMobile ? 3.5 : 5.5

    return items.map((item, i) => {
      // Golden ratio distribution for a more organic spherical layout
      const goldenRatio = (1 + Math.sqrt(5)) / 2
      const theta = (2 * Math.PI * i) / goldenRatio
      const phi = Math.acos(1 - (2 * (i + 0.5)) / items.length)

      const radius = baseRadius + Math.random() * 1.5

      const x = Math.cos(theta) * Math.sin(phi) * radius
      const y = Math.cos(phi) * radius
      const z = Math.sin(theta) * Math.sin(phi) * radius

      return { ...item, position: [x, y, z] }
    })
  }, [viewport.width])

  const targetRotation = useRef({ x: 0, y: 0 })
  const scrollY = useRef(0)

  // Track scroll for 3D interaction
  useMemo(() => {
    const handleScroll = () => {
      scrollY.current = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Base auto-rotation combined with scroll and pointer interactions
      const time = state.clock.getElapsedTime()

      // Calculate target rotation based on mouse and scroll
      // Mouse influences local rotation (with larger area of effect)
      const mouseX = state.pointer.x * Math.PI * 0.4
      const mouseY = state.pointer.y * Math.PI * 0.4

      // Scroll influences rotation around Y and X significantly
      const scrollRotationY = (scrollY.current * 0.002) % (Math.PI * 2)
      const scrollRotationX = (scrollY.current * 0.0005) % (Math.PI * 2)

      // Dampening for ultra-smooth movement (lower factor = softer stop)
      targetRotation.current.x = THREE.MathUtils.damp(
        targetRotation.current.x,
        mouseY + scrollRotationX,
        2.5,
        delta
      )
      targetRotation.current.y = THREE.MathUtils.damp(
        targetRotation.current.y,
        mouseX + scrollRotationY,
        2.5,
        delta
      )

      // Apply dampened targets with continuous subtle orbital time drift
      groupRef.current.rotation.x = targetRotation.current.x + Math.sin(time * 0.1) * 0.1
      groupRef.current.rotation.y = targetRotation.current.y + time * 0.15
      groupRef.current.rotation.z = Math.cos(time * 0.05) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <Float
          key={index}
          speed={1.5 + index * 0.2}
          rotationIntensity={0.8} // Increased for a more dynamic "floating in space" feeling
          floatIntensity={1.2}
        >
          <mesh position={shape.position as [number, number, number]} scale={shape.scale * 1.5}>
            {shape.geometry === 'torusKnot' && <torusKnotGeometry args={[1, 0.3, 128, 16]} />}
            {shape.geometry === 'icosahedron' && <icosahedronGeometry args={[1, 0]} />}
            {shape.geometry === 'octahedron' && <octahedronGeometry args={[1, 0]} />}
            {shape.geometry === 'torus' && <torusGeometry args={[1, 0.4, 16, 100]} />}
            {shape.geometry === 'sphere' && <sphereGeometry args={[1, 32, 32]} />}
            <MeshDistortMaterial
              color={shape.color}
              distort={0.4}
              speed={1.5}
              roughness={0.1}
              metalness={0.9}
              emissive={shape.color}
              emissiveIntensity={0.3} // Boost emissive slightly to stand out behind UI
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}
