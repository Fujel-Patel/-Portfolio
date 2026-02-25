import { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import usePortfolioStore from '../../store/usePortfolioStore';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * ProjectModal — 2D overlay that shows full project details.
 * Includes focus trap and full keyboard/ARIA support.
 *
 * @param {Object}  props
 * @param {import('../../data/projects').Project | null} props.project
 * @param {() => void} props.onClose
 */
export default function ProjectModal({ project, onClose }) {
    const prefersReducedMotion = useReducedMotion();
    const closeButtonRef = useRef(null);
    const modalRef = useRef(null);

    /** Focus the close button when modal opens */
    useEffect(() => {
        if (project && closeButtonRef.current) {
            closeButtonRef.current.focus();
        }
    }, [project]);

    /** Trap focus inside modal */
    useEffect(() => {
        if (!project || !modalRef.current) return;

        const modal = modalRef.current;
        const focusable = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        const trapFocus = (e) => {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last?.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first?.focus();
                }
            }
        };

        modal.addEventListener('keydown', trapFocus);
        return () => modal.removeEventListener('keydown', trapFocus);
    }, [project]);

    /** Close on backdrop click */
    const handleBackdropClick = useCallback(
        (e) => {
            if (e.target === e.currentTarget) onClose();
        },
        [onClose],
    );

    /** Close on Escape */
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Escape') onClose();
        },
        [onClose],
    );

    return (
        <AnimatePresence>
            {project && (
                <motion.div
                    ref={modalRef}
                    className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
                    onClick={handleBackdropClick}
                    onKeyDown={handleKeyDown}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    tabIndex={-1}
                >
                    {/* Backdrop blur */}
                    <motion.div
                        className="absolute inset-0 bg-dark-900/70 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Card */}
                    <motion.div
                        className="relative glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto no-scrollbar"
                        initial={{ scale: prefersReducedMotion ? 1 : 0.85, y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: prefersReducedMotion ? 1 : 0.85, y: prefersReducedMotion ? 0 : 40, opacity: 0 }}
                        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 180, damping: 22 }}
                        role="document"
                    >
                        {/* Coloured top bar */}
                        <div
                            className="h-1 w-full rounded-t-2xl"
                            style={{ background: project.color }}
                        />

                        <div className="p-6 sm:p-8">
                            {/* Header row */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h2
                                        id="modal-title"
                                        className="font-heading font-bold text-2xl sm:text-3xl mb-1"
                                        style={{ color: project.color }}
                                    >
                                        {project.title}
                                    </h2>
                                    <p className="text-dark-100/50 text-sm font-mono">
                                        {project.subtitle}
                                    </p>
                                </div>

                                {/* Close button */}
                                <button
                                    ref={closeButtonRef}
                                    onClick={onClose}
                                    className="
                    p-2 rounded-lg text-dark-100/40 hover:text-white
                    hover:bg-white/5 transition-all duration-200
                    focus-visible:ring-2 focus-visible:ring-cyan-400/50 outline-none
                  "
                                    aria-label="Close project details"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Project thumbnail placeholder */}
                            <div
                                className="w-full h-44 sm:h-56 rounded-xl mb-6 flex items-center justify-center overflow-hidden"
                                style={{
                                    background: `linear-gradient(135deg, ${project.color}15, ${project.color}05)`,
                                    border: `1px solid ${project.color}20`,
                                }}
                            >
                                <span
                                    className="text-6xl sm:text-7xl font-heading font-black opacity-10"
                                    style={{ color: project.color }}
                                >
                                    {project.title.charAt(0)}
                                </span>
                            </div>

                            {/* Description */}
                            <p
                                id="modal-description"
                                className="text-dark-100/70 text-sm sm:text-base leading-relaxed mb-6"
                            >
                                {project.description}
                            </p>

                            {/* Tech tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {project.tech.map((t) => (
                                    <span
                                        key={t}
                                        className="tag"
                                        style={{
                                            borderColor: `${project.color}30`,
                                            color: project.color,
                                            background: `${project.color}10`,
                                        }}
                                    >
                                        {t}
                                    </span>
                                ))}
                            </div>

                            {/* Action buttons */}
                            <div className="flex flex-wrap gap-3">
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-neon text-xs"
                                        style={{
                                            borderColor: `${project.color}60`,
                                            color: project.color,
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Live Demo
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-neon text-xs"
                                        style={{
                                            borderColor: `${project.color}60`,
                                            color: project.color,
                                        }}
                                    >
                                        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                                        </svg>
                                        Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
