import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useReducedMotion from '../hooks/useReducedMotion';

/**
 * NotFound — 404 page with a minimal space-themed aesthetic.
 */
export default function NotFound() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-dark-900 text-center px-6">
      {/* Decorative gradient blob */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl" />
      </div>

      <motion.div
        className="relative z-10 max-w-md"
        initial={prefersReducedMotion ? {} : { opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        {/* 404 number */}
        <h1 className="text-[8rem] sm:text-[10rem] font-heading font-black leading-none gradient-text select-none">
          404
        </h1>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl font-heading font-semibold text-white mb-3 -mt-4">
          Lost in space
        </h2>
        <p className="text-dark-100/60 text-sm sm:text-base mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        {/* Back to home */}
        <Link
          to="/"
          className="btn-neon inline-flex items-center gap-2"
          aria-label="Return to homepage"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
