import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsComplete(true)
            setTimeout(onLoadingComplete, 500)
          }, 500)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [onLoadingComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col items-center justify-center"
        >
          {/* 3D Animated Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative mb-12"
          >
            {/* Spinning geometric shapes */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="w-32 h-32 relative"
            >
              <div className="absolute inset-0 border-2 border-cyan-500/30 rounded-full" />
              <div className="absolute inset-2 border-2 border-magenta-500/30 rounded-full rotate-45" />
              <div className="absolute inset-4 border-2 border-purple-500/30 rounded-full" />
            </motion.div>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-gradient">P</span>
            </div>
          </motion.div>

          {/* Loading text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-semibold mb-8"
          >
            Loading Portfolio
          </motion.h2>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Progress percentage */}
          <motion.p
            className="mt-4 text-gray-400 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {Math.min(Math.round(progress), 100)}%
          </motion.p>

          {/* Loading tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-sm text-gray-500 text-center max-w-md"
          >
            <p>Preparing 3D experience...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
