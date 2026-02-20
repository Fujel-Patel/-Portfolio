import { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Environment, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import FloatingShapes from './FloatingShapes'
import ParticleField from './ParticleField'
import InteractiveNode from './InteractiveNode'

// Navigation target points
const SECTION_TARGETS: Record<string, { pos: [number, number, number], lookAt: [number, number, number] }> = {
  home: { pos: [0, 0, 8], lookAt: [0, 0, 0] },
  about: { pos: [0, 5, -5], lookAt: [0, 5, -10] },
  projects: { pos: [5, 0, -5], lookAt: [10, 0, -10] },
  skills: { pos: [-5, 0, -5], lookAt: [-10, 0, -10] },
  blog: { pos: [0, -5, -5], lookAt: [0, -5, -10] },
  contact: { pos: [0, 0, -15], lookAt: [0, 0, -20] },
}

// Nodes configuration
const NODES = [
  { id: 'about', title: 'About', position: [0, 5, -10] as [number, number, number], color: '#00d4ff' },
  { id: 'projects', title: 'Projects', position: [10, 0, -10] as [number, number, number], color: '#ff00a0' },
  { id: 'skills', title: 'Skills', position: [-10, 0, -10] as [number, number, number], color: '#7000ff' },
  { id: 'blog', title: 'Blog', position: [0, -5, -10] as [number, number, number], color: '#ffcc00' },
  { id: 'contact', title: 'Contact', position: [0, 0, -20] as [number, number, number], color: '#00ffa3' },
]

function CameraController({ activeSection }: { activeSection: string }) {
  const targetPos = useRef(new THREE.Vector3(...SECTION_TARGETS.home.pos))
  const targetLookAt = useRef(new THREE.Vector3(...SECTION_TARGETS.home.lookAt))
  const currentLookAt = useRef(new THREE.Vector3(...SECTION_TARGETS.home.lookAt))

  useEffect(() => {
    const config = SECTION_TARGETS[activeSection] || SECTION_TARGETS.home
    targetPos.current.set(...config.pos)
    targetLookAt.current.set(...config.lookAt)
  }, [activeSection])

  useFrame((state) => {
    // Interpolate position
    state.camera.position.lerp(targetPos.current, 0.05)
    
    // Interpolate lookAt point
    currentLookAt.current.lerp(targetLookAt.current, 0.05)
    state.camera.lookAt(currentLookAt.current)
  })

  return null
}

interface SceneProps {
  activeSection: string
  onNodeClick: (id: string) => void
}

export default function Scene({ activeSection, onNodeClick }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="h-full w-full"
    >
      <color attach="background" args={['#050508']} />
      <PerspectiveCamera makeDefault fov={75} />
      <CameraController activeSection={activeSection} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00a0" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#7000ff" />
      
      <Environment preset="city" />
      
      <FloatingShapes />
      <ParticleField />

      {NODES.map((node) => (
        <InteractiveNode
          key={node.id}
          {...node}
          isActive={activeSection === node.id}
          onClick={onNodeClick}
        />
      ))}
      
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} />
      </EffectComposer>
    </Canvas>
  )
}
