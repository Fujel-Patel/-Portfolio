import { motion } from 'framer-motion';
import Header from './Header';
import SectionIndicator from './SectionIndicator';
import Footer from './Footer';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * Overlay — the top-level UI layer that floats over the 3D canvas.
 *
 * Container uses `pointer-events-none` so mouse interactions fall through
 * to the Canvas underneath; individual interactive elements opt back in
 * with `pointer-events-auto`.
 *
 * @param {Object} props
 * @param {import('react').ReactNode} [props.children] - Page content
 */
export default function Overlay({ children }) {
    const prefersReducedMotion = useReducedMotion();

    return (
        <div className="fixed inset-0 z-content pointer-events-none">
            {/* ── Header ─────────────────────────────────── */}
            <Header />

            {/* ── Main content (pages swap here) ────────── */}
            <motion.main
                id="main-content"
                className="w-full h-full pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: prefersReducedMotion ? 0 : 0.3 }}
                role="main"
                tabIndex={-1}
            >
                {children}
            </motion.main>

            {/* ── Section dots (right rail) ──────────────── */}
            <SectionIndicator />

            {/* ── Footer ─────────────────────────────────── */}
            <Footer />
        </div>
    );
}
