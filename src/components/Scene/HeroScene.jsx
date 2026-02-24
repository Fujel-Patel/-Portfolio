import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

const ParticleBackground = ({ count = 500 }) => {
    const points = useMemo(() => {
        const p = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            p[i * 3] = (Math.random() - 0.5) * 10;
            p[i * 3 + 1] = (Math.random() - 0.5) * 10;
            p[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        return p;
    }, [count]);

    const pointsRef = useRef();

    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
            pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#06b6d4"
                size={0.02}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.4}
            />
        </Points>
    );
};

const GeometricShape = () => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh ref={meshRef}>
                <icosahedronGeometry args={[1, 15]} />
                <MeshDistortMaterial
                    color="#a855f7"
                    speed={2}
                    distort={0.3}
                    radius={1}
                    metalness={0.8}
                    roughness={0.2}
                    emissive="#a855f7"
                    emissiveIntensity={0.5}
                />
            </mesh>
            {/* Soft Glow Layer */}
            <Sphere args={[1.2, 32, 32]}>
                <meshBasicMaterial color="#06b6d4" transparent opacity={0.1} wireframe />
            </Sphere>
        </Float>
    );
};

const HeroScene = ({ isMobile }) => {
    return (
        <group position={isMobile ? [0, -1.2, 0] : [1.5, 0, 0]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
            <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

            <GeometricShape />
            <ParticleBackground count={isMobile ? 400 : 800} />
        </group>
    );
};

export default HeroScene;
