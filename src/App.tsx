import { Suspense, lazy } from 'react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './hooks/useTheme'
import Scene from './components/3d/Scene'
import Navigation from './components/ui/Navigation'
import HeroSection from './components/ui/HeroSection'
import LoadingScreen from './components/ui/LoadingScreen'
import CustomCursor from './components/ui/CustomCursor'
import ThemeToggle from './components/ui/ThemeToggle'

// Lazy load sections below the fold
const AboutSection = lazy(() => import('./components/ui/AboutSection'))
const ProjectsSection = lazy(() => import('./components/ui/ProjectsSection'))
const SkillsSection = lazy(() => import('./components/ui/SkillsSection'))
const BlogSection = lazy(() => import('./components/ui/BlogSection'))
const ContactSection = lazy(() => import('./components/ui/ContactSection'))

// Loading fallback component
function SectionLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
    </div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('home')

  // Navigation click handler
  const handleNav = (section: string) => {
    setActiveSection(section)
  }

  const handleNodeClick = (id: string) => {
    setActiveSection(id)
  }

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <ThemeProvider>
      {/* Loading Screen */}
      <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      
      {/* Custom Cursor (desktop only) */}
      {!isLoading && <CustomCursor />}
      
      {/* Theme Toggle */}
      {!isLoading && <ThemeToggle />}
      
      {/* Main Content */}
      <div className={`relative h-screen w-full transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* 3D Scene Foundation */}
        <div className="fixed inset-0 z-0">
          <Scene activeSection={activeSection} onNodeClick={handleNodeClick} />
        </div>
        
        {/* UI Overlay Layer */}
        <div className="relative z-10 pointer-events-none h-full w-full">
          <div className="pointer-events-auto">
            <Navigation onNavigate={handleNav} activeSection={activeSection} />
          </div>

          <AnimatePresence mode="wait">
            {activeSection === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <div className="pointer-events-auto">
                   <HeroSection />
                </div>
              </motion.div>
            )}

            {activeSection === 'projects' && (
              <motion.div
                key="projects"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 z-20 overflow-y-auto pointer-events-auto pt-24"
              >
                <Suspense fallback={<SectionLoader />}>
                  <ProjectsSection />
                </Suspense>
              </motion.div>
            )}

            {activeSection === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute inset-0 z-20 overflow-y-auto pointer-events-auto pt-24"
              >
                <Suspense fallback={<SectionLoader />}>
                  <AboutSection />
                </Suspense>
              </motion.div>
            )}

            {activeSection === 'skills' && (
              <motion.div
                key="skills"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 100 }}
                className="absolute inset-0 z-20 overflow-y-auto pointer-events-auto pt-24"
              >
                <Suspense fallback={<SectionLoader />}>
                  <SkillsSection />
                </Suspense>
              </motion.div>
            )}

            {activeSection === 'blog' && (
              <motion.div
                key="blog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 overflow-y-auto pointer-events-auto pt-24"
              >
                <Suspense fallback={<SectionLoader />}>
                  <BlogSection />
                </Suspense>
              </motion.div>
            )}

            {activeSection === 'contact' && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="absolute inset-0 z-20 overflow-y-auto pointer-events-auto pt-24"
              >
                <Suspense fallback={<SectionLoader />}>
                  <ContactSection />
                </Suspense>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
