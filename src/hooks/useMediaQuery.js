import { useState, useEffect, useCallback } from 'react';

/**
 * Breakpoint tiers used across the app for responsive 3D quality.
 * @typedef {'mobile' | 'tablet' | 'desktop'} DeviceTier
 */

/** @type {Record<string, number>} */
const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
};

/* ─────────────────────────────────────────────────────
   useMediaQuery  — single query
   ───────────────────────────────────────────────────── */

/**
 * Subscribe to a CSS media-query string and return whether it matches.
 *
 * @param {string} query  e.g. '(min-width: 768px)'
 * @returns {boolean}
 *
 * @example
 *   const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mql = window.matchMedia(query);
        const handler = (e) => setMatches(e.matches);

        // Modern browsers
        if (mql.addEventListener) {
            mql.addEventListener('change', handler);
            return () => mql.removeEventListener('change', handler);
        }
        // Safari < 14
        mql.addListener(handler);
        return () => mql.removeListener(handler);
    }, [query]);

    return matches;
}

/* ─────────────────────────────────────────────────────
   useBreakpoint  — named breakpoint helpers
   ───────────────────────────────────────────────────── */

/**
 * Returns booleans for common Tailwind-style breakpoints.
 *
 * @returns {{
 *   isSm: boolean,
 *   isMd: boolean,
 *   isLg: boolean,
 *   isXl: boolean,
 *   is2xl: boolean,
 * }}
 */
export function useBreakpoint() {
    const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
    const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
    const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
    const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
    const is2xl = useMediaQuery(`(min-width: ${BREAKPOINTS['2xl']}px)`);

    return { isSm, isMd, isLg, isXl, is2xl };
}

/* ─────────────────────────────────────────────────────
   useDeviceTier  — coarse mobile / tablet / desktop
   ───────────────────────────────────────────────────── */

/**
 * Determine device tier for 3D quality scaling.
 *
 *   mobile  → width ≤ 768 px
 *   tablet  → 769 – 1024 px
 *   desktop → > 1024 px
 *
 * @returns {{
 *   tier: DeviceTier,
 *   isMobile: boolean,
 *   isTablet: boolean,
 *   isDesktop: boolean,
 *   isTouchDevice: boolean,
 * }}
 */
export function useDeviceTier() {
    const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.md + 1}px)`);
    const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg + 1}px)`);

    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        setIsTouchDevice(
            'ontouchstart' in window || navigator.maxTouchPoints > 0,
        );
    }, []);

    /** @type {DeviceTier} */
    const tier = isLg ? 'desktop' : isMd ? 'tablet' : 'mobile';

    return {
        tier,
        isMobile: tier === 'mobile',
        isTablet: tier === 'tablet',
        isDesktop: tier === 'desktop',
        isTouchDevice,
    };
}

export default useMediaQuery;
