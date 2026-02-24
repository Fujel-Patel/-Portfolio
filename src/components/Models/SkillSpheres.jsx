import { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Float, Instances, Instance, PerformanceMonitor } from '@react-three/drei';
import * as THREE from 'three';
import skills from '../../data/skills';
import usePortfolioStore from '../../store/usePortfolioStore';
import useReducedMotion from '../../hooks/useReducedMotion';

function SkillInstance({ skill, selectedId, onSelect, isMobile, hoveredId, setHoveredId }) {
    const instanceRef = useRef();
    const isSelected = selectedId === skill.id;
    const isHovered = hoveredId === skill.id;
    const prefersReducedMotion = useReducedMotion();

    useFrame((_, delta) => {
        if (!instanceRef.current || prefersReducedMotion) return;
        const targetScale = isHovered || isSelected ? 1.4 : 1;
        const s = THREE.MathUtils.lerp(instanceRef.current.scale.x, targetScale, delta * 6);
        instanceRef.current.scale.set(s, s, s);
    });

    const sphereSize = isMobile ? 0.3 : 0.4;

    return (
        <group position={skill.basePosition}>
            <Float
                speed={prefersReducedMotion ? 0 : 1.5}
                rotationIntensity={0.2}
                floatIntensity={0.5}
            >
                <Instance
                    ref={instanceRef}
                    onPointerOver={(e) => { e.stopPropagation(); setHoveredId(skill.id); document.body.style.cursor = 'pointer'; }}
                    onPointerOut={(e) => { e.stopPropagation(); if (hoveredId === skill.id) setHoveredId(null); document.body.style.cursor = 'auto'; }}
                    onClick={(e) => { e.stopPropagation(); onSelect(isSelected ? null : skill.id); }}
                />

                {(isHovered || isSelected) && (
                    <Html center distanceFactor={8} zIndexRange={[10, 0]} style={{ pointerEvents: 'none' }}>
                        <div className={`px-2 py-1 rounded bg-dark-800/90 text-white text-xs border border-white/10 backdrop-blur-md transition-opacity duration-300 ${isHovered || isSelected ? 'opacity-100' : 'opacity-0'}`}>
                            {skill.name}
                        </div>
                    </Html>
                )}

                {isSelected && (
                    <Html center distanceFactor={6} position={[0, -1.2, 0]} zIndexRange={[20, 0]}>
                        <div className="glass-card p-4 w-48 text-center animate-scale-in border border-white/10" style={{ borderColor: `${skill.color}50` }}>
                            <p className="text-xl mb-1">{skill.icon}</p>
                            <h3 className="font-bold text-xs mb-1" style={{ color: skill.color }}>{skill.name}</h3>
                            <div className="w-full h-1 bg-dark-600 rounded-full mb-2 overflow-hidden">
                                <div className="h-full" style={{ width: `${skill.level}%`, backgroundColor: skill.color }} />
                            </div>
                            <p className="text-[10px] text-dark-100/60 leading-tight">{skill.description}</p>
                        </div>
                    </Html>
                )}
            </Float>
        </group>
    );
}

export default function SkillSpheres({ visible = true }) {
    const [selectedId, setSelectedId] = useState(null);
    const [hoveredId, setHoveredId] = useState(null);
    const isMobile = usePortfolioStore((s) => s.isMobile);
    const [dpr, setDpr] = useState(1.5);

    if (!visible) return null;

    return (
        <group>
            <PerformanceMonitor onDecline={() => setDpr(1)} />
            <Instances range={skills.length} castShadow receiveShadow>
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial roughness={0.3} metalness={0.8} />
                {skills.map((skill) => (
                    <SkillInstance
                        key={skill.id}
                        skill={skill}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        hoveredId={hoveredId}
                        setHoveredId={setHoveredId}
                        isMobile={isMobile}
                    />
                ))}
            </Instances>
        </group>
    );
}
