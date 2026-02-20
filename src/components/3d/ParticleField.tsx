/* eslint-disable react-hooks/purity */
import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const [particleCount, setParticleCount] = useState(500)

  // Detect mobile device and reduce particles
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
    setParticleCount(isMobile ? 200 : 500)

    const handleResize = () => {
      const isMobileNow = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768
      setParticleCount(isMobileNow ? 200 : 500)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20

      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        colors[i * 3] = 0
        colors[i * 3 + 1] = 0.83
        colors[i * 3 + 2] = 1
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 1
        colors[i * 3 + 1] = 0
        colors[i * 3 + 2] = 0.63
      } else {
        colors[i * 3] = 0.44
        colors[i * 3 + 1] = 0
        colors[i * 3 + 2] = 1
      }
    }

    return { positions, colors }
  }, [particleCount])

  useFrame((state) => {
    if (pointsRef.current) {
      // Base rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.015
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.008

      // Mouse interaction: gentle shift
      pointsRef.current.rotation.y += state.mouse.x * 0.2
      pointsRef.current.rotation.x += state.mouse.y * 0.2
    }
  })

  // Create geometry with buffer attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [positions, colors])

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}
