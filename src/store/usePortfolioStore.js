import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

/**
 * @typedef {'home' | 'about' | 'projects' | 'skills' | 'contact'} Section
 */

/**
 * @typedef {'mobile' | 'tablet' | 'desktop'} DeviceTier
 */

/**
 * @typedef {Object} PortfolioState
 * @property {Section}                activeSection    - Currently visible section
 * @property {boolean}                isLoading        - Global loading flag
 * @property {string|null}            selectedProject  - ID of the selected project
 * @property {[number,number,number]} cameraPosition   - Current camera [x,y,z]
 * @property {[number,number,number]} cameraTarget     - Camera look-at target [x,y,z]
 * @property {boolean}                isMobile         - Viewport ≤ 768 px
 * @property {DeviceTier}             deviceTier       - 'mobile' | 'tablet' | 'desktop'
 * @property {boolean}                reducedMotion    - User prefers reduced motion
 * @property {boolean}                menuOpen         - Mobile nav drawer state
 *
 * @property {(section: Section) => void}             setActiveSection
 * @property {(id: string|null) => void}              setSelectedProject
 * @property {(pos: [number,number,number]) => void}  setCameraPosition
 * @property {(target: [number,number,number]) => void} setCameraTarget
 * @property {() => void}                             toggleLoading
 * @property {() => void}                             checkMobile
 * @property {(tier: DeviceTier) => void}             setDeviceTier
 * @property {(v: boolean) => void}                   setReducedMotion
 * @property {(open: boolean) => void}                setMenuOpen
 */

const usePortfolioStore = create(
    subscribeWithSelector((set) => ({
        /* ── State ──────────────────────────────────────── */
        activeSection: 'home',
        isLoading: true,
        selectedProject: null,
        cameraPosition: [0, 2, 5],
        cameraTarget: [0, 0, 0],
        isMobile: false,
        deviceTier: 'desktop',
        reducedMotion: false,
        menuOpen: false,

        /* ── Actions ────────────────────────────────────── */

        /**
         * Set the currently active section and update camera position accordingly.
         * @param {Section} section
         */
        setActiveSection: (section) =>
            set((state) => {
                /** @type {Record<Section, [number,number,number]>} */
                const cameraMap = {
                    home:     { pos: [0, 2, 5],   target: [0, 0, 0] },
                    about:    { pos: [3, 2, 4],   target: [0, 0.5, 0] },
                    projects: { pos: [-2, 3, 5],  target: [0, 0, -1] },
                    skills:   { pos: [0, 4, 6],   target: [0, 1, 0] },
                    contact:  { pos: [0, 1, 3],   target: [0, 0, 0] },
                };

                const preset = cameraMap[section];
                return {
                    activeSection: section,
                    cameraPosition: preset?.pos ?? state.cameraPosition,
                    cameraTarget: preset?.target ?? state.cameraTarget,
                    menuOpen: false,            // auto-close mobile nav
                };
            }),

        /**
         * Select or de-select a project.
         * @param {string|null} id
         */
        setSelectedProject: (id) => set({ selectedProject: id }),

        /**
         * Manually override camera position.
         * @param {[number,number,number]} position
         */
        setCameraPosition: (position) => set({ cameraPosition: position }),

        /**
         * Set camera look-at target for smooth transitions.
         * @param {[number,number,number]} target
         */
        setCameraTarget: (target) => set({ cameraTarget: target }),

        /** Toggle the global loading flag. */
        toggleLoading: () => set((s) => ({ isLoading: !s.isLoading })),

        /** Check viewport width and set isMobile flag. */
        checkMobile: () =>
            set({ isMobile: window.innerWidth <= 768 }),

        /**
         * Update the device tier for responsive 3D quality.
         * @param {DeviceTier} tier
         */
        setDeviceTier: (tier) => set({ deviceTier: tier }),

        /**
         * Track whether user prefers reduced motion.
         * @param {boolean} v
         */
        setReducedMotion: (v) => set({ reducedMotion: v }),

        /**
         * Open / close the mobile navigation drawer.
         * @param {boolean} open
         */
        setMenuOpen: (open) => set({ menuOpen: open }),
    }))
);

export default usePortfolioStore;
