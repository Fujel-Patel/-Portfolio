import { useRef, useState, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import projects from '../../data/projects';
import usePortfolioStore from '../../store/usePortfolioStore';
import useReducedMotion from '../../hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════════
   Single Project Panel — a 3D card in the scene
   ═══════════════════════════════════════════════════════ */

/**
 * @param {Object}  props
 * @param {import('../../data/projects').Project} props.project
 * @param {[number,number,number]} props.position
 * @param {[number,number,number]} props.rotation
 * @param {number}  props.index
 * @param {(id: string) => void} props.onSelect
 * @param {boolean} props.isMobile
 */
function ProjectPanel({ project, position, rotation, index, onSelect, isMobile }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const prefersReducedMotion = useReducedMotion();

    const { gl } = useThree();

    /* Entrance animation target */
    const targetY = position[1];
    const startY = prefersReducedMotion ? targetY : targetY - 3;

    /* Animate entrance + hover lift */
    useFrame((state, delta) => {
        if (!groupRef.current) return;
        if (prefersReducedMotion) return;

        // Entrance: slide up to final position
        const currentY = groupRef.current.position.y;
        const goal = hovered ? targetY + 0.15 : targetY;
        groupRef.current.position.y = THREE.MathUtils.lerp(currentY, goal, delta * 3);

        // Gentle idle float
        const t = state.clock.getElapsedTime();
        groupRef.current.position.y += Math.sin(t * 0.8 + index * 1.5) * 0.03;
    });

    const handlePointerOver = useCallback((e) => {
        e.stopPropagation();
        setHovered(true);
        gl.domElement.style.cursor = 'pointer';
    }, [gl]);

    const handlePointerOut = useCallback((e) => {
        e.stopPropagation();
        setHovered(false);
        gl.domElement.style.cursor = 'auto';
    }, [gl]);

    const handleClick = useCallback((e) => {
        e.stopPropagation();
        onSelect(project.id);
    }, [onSelect, project.id]);

    const panelWidth = isMobile ? 1.6 : 2.2;
    const panelHeight = isMobile ? 2.2 : 2.8;

    const accentColor = new THREE.Color(project.color);

    return (
        <group
            ref={groupRef}
            position={[position[0], startY, position[2]]}
            rotation={rotation}
        >
            {/* Card body */}
            <RoundedBox
                ref={meshRef}
                args={[panelWidth, panelHeight, 0.08]}
                radius={0.06}
                smoothness={4}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onClick={handleClick}
                castShadow
                receiveShadow
                frustumCulled
            >
                <meshStandardMaterial
                    color={hovered ? '#1e293b' : '#151b2d'}
                    metalness={0.1}
                    roughness={0.6}
                    emissive={accentColor}
                    emissiveIntensity={hovered ? 0.08 : 0.02}
                />
            </RoundedBox>

            {/* Accent top edge */}
            <mesh position={[0, panelHeight / 2 - 0.03, 0.045]}>
                <planeGeometry args={[panelWidth - 0.12, 0.04]} />
                <meshBasicMaterial color={project.color} transparent opacity={hovered ? 1 : 0.6} />
            </mesh>

            {/* Glow border on hover */}
            {hovered && (
                <mesh position={[0, 0, -0.001]}>
                    <planeGeometry args={[panelWidth + 0.06, panelHeight + 0.06]} />
                    <meshBasicMaterial
                        color={project.color}
                        transparent
                        opacity={0.08}
                    />
                </mesh>
            )}

            {/* HTML overlay content */}
            <Html
                center
                distanceFactor={isMobile ? 5 : 6}
                position={[0, 0, 0.05]}
                style={{ pointerEvents: 'none', userSelect: 'none', width: `${(panelWidth - 0.3) * 100}px` }}
                transform
                occlude
            >
                <div
                    className="flex flex-col items-center text-center px-2"
                    role="button"
                    tabIndex={0}
                    aria-label={`View project: ${project.title} — ${project.subtitle}`}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(project.id); } }}
                >
                    {/* Project icon / initial */}
                    <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3 text-2xl font-heading font-black"
                        style={{
                            background: `linear-gradient(135deg, ${project.color}20, ${project.color}08)`,
                            border: `1px solid ${project.color}30`,
                            color: project.color,
                        }}
                    >
                        {project.title.charAt(0)}
                    </div>

                    {/* Title */}
                    <h3
                        className="font-heading font-bold text-sm mb-1 leading-tight"
                        style={{ color: project.color }}
                    >
                        {project.title}
                    </h3>

                    {/* Subtitle */}
                    <p className="text-[10px] text-gray-400 mb-3 leading-snug">
                        {project.subtitle}
                    </p>

                    {/* Tech chips (first 3) */}
                    <div className="flex flex-wrap gap-1 justify-center">
                        {project.tech.slice(0, 3).map((t) => (
                            <span
                                key={t}
                                className="text-[8px] px-1.5 py-0.5 rounded-full font-mono"
                                style={{
                                    background: `${project.color}12`,
                                    border: `1px solid ${project.color}25`,
                                    color: `${project.color}cc`,
                                }}
                            >
                                {t}
                            </span>
                        ))}
                        {project.tech.length > 3 && (
                            <span
                                className="text-[8px] px-1.5 py-0.5 rounded-full font-mono"
                                style={{ color: `${project.color}80` }}
                            >
                                +{project.tech.length - 3}
                            </span>
                        )}
                    </div>

                    {/* CTA hint */}
                    <p
                        className={`
              text-[9px] mt-3 font-mono tracking-wider uppercase transition-opacity duration-300
              ${hovered ? 'opacity-100' : 'opacity-0'}
            `}
                        style={{ color: project.color }}
                    >
                        Click to view →
                    </p>
                </div>
            </Html>
        </group>
    );
}

/* ═══════════════════════════════════════════════════════
   ProjectPanels — arc layout in 3D space
   ═══════════════════════════════════════════════════════ */

/**
 * Arranges project panels in a curved arc.
 * Designed to be placed inside an R3F <Canvas>.
 *
 * @param {Object}  props
 * @param {boolean} [props.visible=true]
 * @param {(id: string) => void} props.onSelectProject
 */
export default function ProjectPanels({ visible = true, onSelectProject }) {
    const isMobile = usePortfolioStore((s) => s.isMobile);

    /** Compute positions along an arc */
    const panelData = useMemo(() => {
        const count = projects.length;
        const arcSpread = isMobile ? Math.PI * 0.5 : Math.PI * 0.6;
        const radius = isMobile ? 3.5 : 4.5;
        const startAngle = -arcSpread / 2;
        const step = arcSpread / (count - 1);

        return projects.map((project, i) => {
            const angle = startAngle + step * i;
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius - radius;
            const rotY = -angle * 0.5; // face inward

            return {
                project,
                position: [x, 0.5, z],
                rotation: [0, rotY, 0],
            };
        });
    }, [isMobile]);

    const handleSelect = useCallback(
        (id) => {
            onSelectProject?.(id);
        },
        [onSelectProject],
    );

    if (!visible) return null;

    return (
        <group position={[0, -0.5, 0]}>
            {panelData.map(({ project, position, rotation }, i) => (
                <ProjectPanel
                    key={project.id}
                    project={project}
                    position={position}
                    rotation={rotation}
                    index={i}
                    onSelect={handleSelect}
                    isMobile={isMobile}
                />
            ))}
        </group>
    );
}
