import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', section: 'home' },
  { name: 'About', section: 'about' },
  { name: 'Projects', section: 'projects' },
  { name: 'Skills', section: 'skills' },
  { name: 'Blog', section: 'blog' },
  { name: 'Contact', section: 'contact' },
]

interface NavigationProps {
  onNavigate?: (section: string) => void
  activeSection?: string
}

export default function Navigation({ onNavigate, activeSection }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'glass py-4' : 'py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <motion.a
            href="#home"
            className="text-2xl font-bold text-gradient"
            whileHover={{ scale: 1.05 }}
          >
            Portfolio
          </motion.a>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                onClick={() => onNavigate?.(item.section)}
                className={`text-sm transition-colors relative group px-2 py-1 rounded focus:outline-none ${activeSection === item.section ? 'text-cyan-400 font-bold' : 'text-gray-300 hover:text-white'}`}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 bg-cyan-400 transition-all ${activeSection === item.section ? 'w-full' : 'w-0'} group-hover:w-full`}
                />
              </motion.button>
            ))}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 glass md:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => {
                    onNavigate?.(item.section)
                    setIsOpen(false)
                  }}
                  className={`text-2xl transition-colors px-4 py-2 rounded focus:outline-none ${activeSection === item.section ? 'text-cyan-400 font-bold' : 'text-white hover:text-cyan-400'}`}
                  whileHover={{ scale: 1.1 }}
                >
                  {item.name}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
