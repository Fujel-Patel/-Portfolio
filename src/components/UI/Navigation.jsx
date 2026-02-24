import { useCallback } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * Navigation — renders horizontal or vertical nav links.
 *
 * @param {Object}   props
 * @param {string[]} props.sections   - List of section IDs
 * @param {string}   props.active     - Currently active section
 * @param {(section: string) => void} props.onNavigate
 * @param {boolean}  [props.vertical] - Stack links vertically (for mobile)
 */
export default function Navigation({
    sections,
    active,
    onNavigate,
    vertical = false,
}) {
    const prefersReducedMotion = useReducedMotion();

    /** Handle keyboard navigation within the menu */
    const handleKeyDown = useCallback(
        (e, index) => {
            const isVertical = vertical;
            const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
            const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';

            if (e.key === prevKey) {
                e.preventDefault();
                const prev = (index - 1 + sections.length) % sections.length;
                const buttons = e.currentTarget.parentElement?.parentElement?.querySelectorAll('[role="menuitem"]');
                buttons?.[prev]?.focus();
            } else if (e.key === nextKey) {
                e.preventDefault();
                const next = (index + 1) % sections.length;
                const buttons = e.currentTarget.parentElement?.parentElement?.querySelectorAll('[role="menuitem"]');
                buttons?.[next]?.focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                const buttons = e.currentTarget.parentElement?.parentElement?.querySelectorAll('[role="menuitem"]');
                buttons?.[0]?.focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                const buttons = e.currentTarget.parentElement?.parentElement?.querySelectorAll('[role="menuitem"]');
                buttons?.[sections.length - 1]?.focus();
            }
        },
        [sections.length, vertical],
    );

    return (
        <ul
            className={`flex ${vertical ? 'flex-col gap-1' : 'items-center gap-1'} list-none`}
            role="menubar"
            aria-orientation={vertical ? 'vertical' : 'horizontal'}
            aria-label="Site sections"
        >
            {sections.map((section, i) => {
                const isActive = active === section;

                return (
                    <li key={section} role="none">
                        <motion.button
                            role="menuitem"
                            onClick={() => onNavigate(section)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className={`
                relative px-4 py-2 rounded-lg text-sm font-medium tracking-wide capitalize
                transition-colors duration-300 outline-none
                focus-visible:ring-2 focus-visible:ring-cyan-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-900
                ${isActive
                                    ? 'text-cyan-400'
                                    : 'text-dark-100/60 hover:text-dark-100'
                                }
                ${vertical ? 'w-full text-left' : ''}
              `}
                            initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={prefersReducedMotion ? { duration: 0 } : { delay: i * 0.08, duration: 0.4 }}
                            aria-current={isActive ? 'page' : undefined}
                            aria-label={`Navigate to ${section}`}
                            tabIndex={isActive ? 0 : -1}
                        >
                            {section}

                            {/* Active indicator underline */}
                            {isActive && (
                                <motion.span
                                    className={`absolute ${vertical ? 'left-0 top-0 w-0.5 h-full' : 'bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4/5'} bg-cyan-400 rounded-full`}
                                    layoutId="nav-indicator"
                                    transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    </li>
                );
            })}
        </ul>
    );
}
