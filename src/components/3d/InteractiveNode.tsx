import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, Text, Float } from '@react-three/drei'
import * as THREE from 'three'

interface InteractiveNodeProps {
  position: [number, number, number]
  title: string
  id: string
  isActive: boolean
  onClick: (id: string) => void
  color?: string
}

export default function InteractiveNode({
  position,
  title,
  id,
  isActive,
  onClick,
  color = '#00d4ff'
}: InteractiveNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const { size } = useThree()
  
  const isMobile = size.width < 768
  const baseScale = isMobile ? 1.5 : 1

  useFrame((state) => {
    if (!meshRef.current) return
    
    // Gentle rotation
    meshRef.current.rotation.y += 0.01
    meshRef.current.rotation.z += 0.005

    // Scale interpolation
    const targetScale = (hovered || isActive ? 1.5 : 1) * baseScale
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
    
    // Hover effect: slight pulse
    if (hovered && !isActive) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onPointerOver={() => {
            setHovered(true)
            document.body.style.cursor = 'pointer'
          }}
          onPointerOut={() => {
            setHovered(false)
            document.body.style.cursor = 'auto'
          }}
          onClick={(e) => {
            e.stopPropagation()
            onClick(id)
          }}
        >
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color={isActive ? '#ffffff' : color}
            emissive={color}
            emissiveIntensity={hovered || isActive ? 2 : 0.5}
            wireframe
          />
        </mesh>
      </Float>

      {/* Label */}
      <Html position={[0, 1.5, 0]} center distanceFactor={10}>
        <div className={`px-4 py-2 rounded-full glass border transition-all duration-300 pointer-events-none whitespace-nowrap ${
          hovered || isActive ? 'border-cyan-400 opacity-100' : 'border-white/10 opacity-50'
        }`}>
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            {title}
          </span>
        </div>
      </Html>

      {/* Large background text when active */}
      {isActive && (
        <Text
          position={[0, 0, -2]}
          fontSize={2}
          color="white"
          fillOpacity={0.1}
        >
          {title.toUpperCase()}
        </Text>
      )}
    </group>
  )
}
