import { useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import usePortfolioStore from '../../store/usePortfolioStore';

/* ── Easing helper ───────────────────────────────────── */
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Camera preset positions per section */
const CAMERA_PRESETS = {
    home:     { position: [0, 2, 5],   target: [0, 0, 0] },
    about:    { position: [3, 2, 4],   target: [0, 0.5, 0] },
    projects: { position: [-2, 3, 5],  target: [0, 0, -1] },
    skills:   { position: [0, 4, 6],   target: [0, 1, 0] },
    contact:  { position: [0, 1, 3],   target: [0, 0, 0] },
};

/** Movement speed for WASD/Arrow keys (units per second) */
const MOVE_SPEED = 4;

/**
 * Camera — perspective camera controller with OrbitControls,
 * smooth lerp transitions between sections, and WASD/Arrow
 * keyboard navigation.
 *
 * @param {Object}  props
 * @param {[number,number,number]} [props.initialPosition=[0,2,5]]
 * @param {boolean} [props.enableDamping=true]
 * @param {number}  [props.dampingFactor=0.05]
 * @param {boolean} [props.enableZoom=true]
 * @param {boolean} [props.enablePan=false]
 * @param {number}  [props.minDistance=3]
 * @param {number}  [props.maxDistance=15]
 * @param {number}  [props.maxPolarAngle]
 */
export default function Camera({
    initialPosition = [0, 2, 5],
    enableDamping = true,
    dampingFactor = 0.05,
    enableZoom = true,
    enablePan = false,
    minDistance = 3,
    maxDistance = 15,
    maxPolarAngle = Math.PI / 2,
}) {
    const controlsRef = useRef();
    const { camera } = useThree();
    const cameraPosition = usePortfolioStore((s) => s.cameraPosition);
    const cameraTarget = usePortfolioStore((s) => s.cameraTarget);
    const reducedMotion = usePortfolioStore((s) => s.reducedMotion);

    /* Smooth transition state */
    const transitionRef = useRef({
        active: false,
        startPos: new THREE.Vector3(),
        endPos: new THREE.Vector3(),
        startTarget: new THREE.Vector3(),
        endTarget: new THREE.Vector3(),
        elapsed: 0,
        duration: 1.2,
    });

    /* Keyboard movement keys currently held */
    const keysRef = useRef(new Set());

    /* Animate camera smoothly to new position when store changes */
    useEffect(() => {
        if (!cameraPosition) return;
        const t = transitionRef.current;

        if (reducedMotion) {
            camera.position.set(...cameraPosition);
            if (controlsRef.current && cameraTarget) {
                controlsRef.current.target.set(...cameraTarget);
            }
            return;
        }

        t.startPos.copy(camera.position);
        t.endPos.set(...cameraPosition);
        t.startTarget.copy(controlsRef.current?.target ?? new THREE.Vector3());
        t.endTarget.set(...(cameraTarget ?? [0, 0, 0]));
        t.elapsed = 0;
        t.duration = 1.2;
        t.active = true;
    }, [cameraPosition, cameraTarget, camera, reducedMotion]);

    /* Set initial position on mount */
    useEffect(() => {
        camera.position.set(...initialPosition);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    /* WASD / Arrow key listeners */
    useEffect(() => {
        const onDown = (e) => {
            const k = e.key.toLowerCase();
            if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
                // Don't capture when typing in inputs
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
                keysRef.current.add(k);
            }
        };
        const onUp = (e) => {
            keysRef.current.delete(e.key.toLowerCase());
        };
        const onBlur = () => keysRef.current.clear();

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);
        window.addEventListener('blur', onBlur);
        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
            window.removeEventListener('blur', onBlur);
        };
    }, []);

    /* Per-frame: smooth transition + keyboard movement + controls update */
    useFrame((_, delta) => {
        const t = transitionRef.current;

        /* ── Smooth camera transition ──────────────────── */
        if (t.active) {
            t.elapsed += delta;
            const progress = Math.min(t.elapsed / t.duration, 1);
            const eased = easeInOutCubic(progress);

            camera.position.lerpVectors(t.startPos, t.endPos, eased);

            if (controlsRef.current) {
                controlsRef.current.target.lerpVectors(t.startTarget, t.endTarget, eased);
            }

            if (progress >= 1) {
                t.active = false;
            }
        }

        /* ── Keyboard movement ─────────────────────────── */
        const keys = keysRef.current;
        if (keys.size > 0 && controlsRef.current) {
            const speed = MOVE_SPEED * delta;
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();
            const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

            const move = new THREE.Vector3();
            if (keys.has('w') || keys.has('arrowup'))    move.add(forward.clone().multiplyScalar(speed));
            if (keys.has('s') || keys.has('arrowdown'))  move.add(forward.clone().multiplyScalar(-speed));
            if (keys.has('d') || keys.has('arrowright')) move.add(right.clone().multiplyScalar(speed));
            if (keys.has('a') || keys.has('arrowleft'))  move.add(right.clone().multiplyScalar(-speed));

            camera.position.add(move);
            controlsRef.current.target.add(move);
        }

        /* ── Controls update ───────────────────────────── */
        if (controlsRef.current) {
            controlsRef.current.update();
        }
    });

    return (
        <OrbitControls
            ref={controlsRef}
            enableDamping={enableDamping}
            dampingFactor={dampingFactor}
            enableZoom={enableZoom}
            enablePan={enablePan}
            minDistance={minDistance}
            maxDistance={maxDistance}
            maxPolarAngle={maxPolarAngle}
            makeDefault
        />
    );
}

export { CAMERA_PRESETS };
