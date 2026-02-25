import { useCallback } from 'react';
import { motion } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import useReducedMotion from '../../hooks/useReducedMotion';

const SECTIONS = ['home', 'about', 'projects', 'skills', 'contact'];

/**
 * SectionIndicator — vertical dot navigation on the right side.
 * Indicates the current section and allows clicking to navigate.
 */
export default function SectionIndicator() {
    const activeSection = usePortfolioStore((s) => s.activeSection);
    const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
    const prefersReducedMotion = useReducedMotion();

    /** Keyboard arrow support for vertical dot nav */
    const handleKeyDown = useCallback(
        (e, index) => {
            let targetIndex = index;
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                targetIndex = (index - 1 + SECTIONS.length) % SECTIONS.length;
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                targetIndex = (index + 1) % SECTIONS.length;
            } else if (e.key === 'Home') {
                e.preventDefault();
                targetIndex = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                targetIndex = SECTIONS.length - 1;
            } else {
                return;
            }
            const buttons = e.currentTarget.parentElement?.parentElement?.querySelectorAll('button');
            buttons?.[targetIndex]?.focus();
        },
        [],
    );

    return (
        <motion.nav
            className="fixed right-6 top-1/2 -translate-y-1/2 z-nav pointer-events-auto hidden md:flex flex-col items-center gap-4"
            initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.8, delay: prefersReducedMotion ? 0 : 0.5, ease: 'easeOut' }}
            aria-label="Page sections"
            role="tablist"
            aria-orientation="vertical"
        >
            {SECTIONS.map((section, i) => {
                const isActive = activeSection === section;
                return (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                        className="group relative flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 rounded-full p-1"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={`${section} section`}
                        aria-controls={section}
                        tabIndex={isActive ? 0 : -1}
                    >
                        {/* Dot */}
                        <motion.div
                            className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${isActive ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_12px_2px_rgba(0,255,255,0.5)]' : 'bg-transparent border-dark-200 group-hover:border-cyan-400/50'}`}
                            animate={(!prefersReducedMotion && isActive) ? { scale: 1.25, boxShadow: '0 0 18px 4px rgba(0,255,255,0.35)' } : { scale: 1 }}
                            transition={(!prefersReducedMotion && isActive) ? { duration: 0.5, type: 'spring', stiffness: 300 } : {}}
                        />

                        {/* Tooltip label */}
                        <span
                            className="
                absolute right-8 px-3 py-1 rounded-lg text-xs font-medium capitalize whitespace-nowrap
                bg-dark-400/90 text-dark-100 backdrop-blur-sm border border-dark-200/30
                opacity-0 translate-x-2 pointer-events-none
                group-hover:opacity-100 group-hover:translate-x-0
                group-focus-visible:opacity-100 group-focus-visible:translate-x-0
                transition-all duration-300
              "
                            role="tooltip"
                        >
                            {section}
                        </span>

                        {/* Connecting line between dots */}
                        {i < SECTIONS.length - 1 && (
                            <span
                                className={`absolute top-full left-1/2 -translate-x-1/2 w-px h-4
                  ${isActive ? 'bg-cyan-400/40' : 'bg-dark-200/30'}`}
                                aria-hidden="true"
                            />
                        )}
                    </button>
                );
            })}
        </motion.nav>
    );
}
