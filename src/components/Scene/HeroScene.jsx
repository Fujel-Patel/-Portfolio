import React from 'react';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Stars, Environment } from '@react-three/drei';

const AnimatedSphere = () => {
    const meshRef = useRef();

    useFrame((state) => {
        const elapsed = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = elapsed * 0.4;
            meshRef.current.rotation.x = elapsed * 0.1;
            meshRef.current.position.y = Math.sin(elapsed * 0.8) * 0.12;
        }
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1.2, 64, 64]} /> {/* Lower geometry for perf */}
            <MeshDistortMaterial
                color="#06b6d4"
                emissive="#0e7490"
                emissiveIntensity={0.3}
                roughness={0.15}
                metalness={0.7}
                distort={0.06}
                speed={0.8}
            />
        </mesh>
    );
};

const MemoAnimatedSphere = React.memo(AnimatedSphere);

const HeroScene = () => {
    return (
        <Canvas
            style={{ width: '100%', height: '100%', background: 'transparent' }}
            camera={{ position: [0, 0, 5], fov: 35 }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
        >
            <ambientLight intensity={0.2} />
            <pointLight position={[6, 6, 4]} intensity={8} color="#ffffff" /> {/* Lower intensity for perf */}
            <pointLight position={[-4, 0, 2]} intensity={3} color="#a855f7" /> {/* Lower intensity for perf */}

            <Environment preset="dawn" />

            <Stars radius={200} depth={80} count={300} factor={3} fade saturation={0} /> {/* Lower star count for perf */}

            <Suspense fallback={null}>
                <MemoAnimatedSphere />
            </Suspense>
        </Canvas>
    );
};

export default HeroScene;