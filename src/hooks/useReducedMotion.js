import { useState, useEffect } from 'react';

/**
 * useReducedMotion — returns `true` when the user prefers reduced motion.
 *
 * Listens to the `prefers-reduced-motion: reduce` media query so
 * animations can be toned down or disabled accordingly.
 *
 * @returns {boolean} `true` if the user has enabled reduced motion
 *
 * @example
 *   const prefersReducedMotion = useReducedMotion();
 *   // In framer-motion:  transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
 *   // In R3F useFrame:   if (prefersReducedMotion) return;
 */
export default function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mql = window.matchMedia('(prefers-reduced-motion: reduce)');

        const handler = (e) => setPrefersReducedMotion(e.matches);

        if (mql.addEventListener) {
            mql.addEventListener('change', handler);
            return () => mql.removeEventListener('change', handler);
        }
        // Fallback for older Safari
        mql.addListener(handler);
        return () => mql.removeListener(handler);
    }, []);

    return prefersReducedMotion;
}

/**
 * Helper to pick animation values based on reduced-motion preference.
 *
 * @template T
 * @param {boolean} prefersReducedMotion
 * @param {{ full: T, reduced: T }} options
 * @returns {T}
 *
 * @example
 *   const duration = motionSafe(prefersReducedMotion, { full: 0.6, reduced: 0 });
 */
export function motionSafe(prefersReducedMotion, { full, reduced }) {
    return prefersReducedMotion ? reduced : full;
}
