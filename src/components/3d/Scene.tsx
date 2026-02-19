import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import FloatingShapes from './FloatingShapes'
import ParticleField from './ParticleField'

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0 }}
    >
      <color attach="background" args={['#0a0a0f']} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ff00a0" />
      <pointLight position={[10, -10, 10]} intensity={0.5} color="#7000ff" />
      
      <FloatingShapes />
      <ParticleField />
      
      <EffectComposer>
        <Bloom intensity={1.5} luminanceThreshold={0.2} />
      </EffectComposer>
    </Canvas>
  )
}
