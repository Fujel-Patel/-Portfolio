import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import useReducedMotion from '../../hooks/useReducedMotion';
import Navigation from './Navigation';

const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'];

/**
 * Header — fixed top bar with logo and navigation.
 * Positioned over the 3D canvas with pointer-events only on interactive parts.
 */
export default function Header() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const activeSection = usePortfolioStore((s) => s.activeSection);
    const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
    const isMobile = usePortfolioStore((s) => s.isMobile);
    const prefersReducedMotion = useReducedMotion();

    const motionDuration = prefersReducedMotion ? 0 : 0.8;

    const handleNavigate = useCallback(
        (section) => {
            setActiveSection(section);
            setMobileNavOpen(false);
        },
        [setActiveSection],
    );

    return (
        <motion.header
            className="fixed top-0 left-0 w-full z-nav pointer-events-none"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: motionDuration, ease: [0.22, 1, 0.36, 1] }}
            role="banner"
        >
            <div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
                {/* ── Logo ────────────────────────────────── */}
                <button
                    className="pointer-events-auto group flex items-center gap-2"
                    onClick={() => handleNavigate('home')}
                    aria-label="Go to home"
                >
                    <span className="text-2xl font-heading font-bold gradient-text">
                        FP
                    </span>
                    <span className="hidden sm:inline text-sm text-dark-100/60 font-mono tracking-wider group-hover:text-cyan-400 transition-colors duration-300">
                        .dev
                    </span>
                </button>

                {/* ── Desktop Navigation ──────────────────── */}
                <nav className="hidden md:block pointer-events-auto" aria-label="Main navigation">
                    <Navigation
                        sections={SECTIONS}
                        active={activeSection}
                        onNavigate={handleNavigate}
                    />
                </nav>

                {/* ── Mobile Hamburger ────────────────────── */}
                <button
                    className="md:hidden pointer-events-auto relative w-10 h-10 flex items-center justify-center"
                    onClick={() => setMobileNavOpen((v) => !v)}
                    aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileNavOpen}
                >
                    <div className="flex flex-col gap-1.5">
                        <motion.span
                            className="block w-6 h-0.5 bg-cyan-400 rounded-full origin-center"
                            animate={mobileNavOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.span
                            className="block w-6 h-0.5 bg-cyan-400 rounded-full"
                            animate={mobileNavOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.2 }}
                        />
                        <motion.span
                            className="block w-6 h-0.5 bg-cyan-400 rounded-full origin-center"
                            animate={mobileNavOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </button>
            </div>

            {/* ── Mobile Nav Drawer ──────────────────────── */}
            <AnimatePresence>
                {mobileNavOpen && isMobile && (
                    <motion.div
                        className="md:hidden absolute top-full left-0 w-full pointer-events-auto"
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -20 }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.3, ease: 'easeOut' }}
                        role="region"
                        aria-label="Mobile navigation"
                    >
                        <nav className="glass-panel mx-4 mt-2 rounded-2xl py-4 px-6" aria-label="Main navigation">
                            <Navigation
                                sections={SECTIONS}
                                active={activeSection}
                                onNavigate={handleNavigate}
                                vertical
                            />
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
