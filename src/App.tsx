import { Suspense, lazy } from 'react'
import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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

gsap.registerPlugin(ScrollTrigger)

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

  useEffect(() => {
    // Only initialize Lenis after loading is complete
    if (!isLoading) {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
      })

      lenis.on('scroll', ScrollTrigger.update)

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })

      gsap.ticker.lagSmoothing(0)

      return () => {
        lenis.destroy()
      }
    }
  }, [isLoading])

  // Swipe/gesture navigation
  useEffect(() => {
    if (isLoading) return
    let startX = 0
    let endX = 0
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }
    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX
      const dx = endX - startX
      if (Math.abs(dx) > 60) {
        const sections = ['home', 'about', 'projects', 'skills', 'blog', 'contact']
        const idx = sections.indexOf(activeSection)
        if (dx < 0 && idx < sections.length - 1) setActiveSection(sections[idx + 1])
        if (dx > 0 && idx > 0) setActiveSection(sections[idx - 1])
      }
    }
    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [activeSection, isLoading])

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  // Navigation click handler
  const handleNav = (section: string) => setActiveSection(section)

  return (
    <ThemeProvider>
      {/* Loading Screen */}
      <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      
      {/* Custom Cursor (desktop only) */}
      {!isLoading && <CustomCursor />}
      
      {/* Theme Toggle */}
      {!isLoading && <ThemeToggle />}
      
      {/* Main Content */}
      <div className={`relative min-h-screen transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        <div className="fixed inset-0 z-0 h-screen w-full">
          <Scene />
        </div>
        
        <div className="relative z-10">
          <Navigation onNavigate={handleNav} activeSection={activeSection} />
          {activeSection === 'home' && <HeroSection />}
          {activeSection === 'about' && (
            <Suspense fallback={<SectionLoader />}>
              <AboutSection />
            </Suspense>
          )}
          {activeSection === 'projects' && (
            <Suspense fallback={<SectionLoader />}>
              <ProjectsSection />
            </Suspense>
          )}
          {activeSection === 'skills' && (
            <Suspense fallback={<SectionLoader />}>
              <SkillsSection />
            </Suspense>
          )}
          {activeSection === 'blog' && (
            <Suspense fallback={<SectionLoader />}>
              <BlogSection />
            </Suspense>
          )}
          {activeSection === 'contact' && (
            <Suspense fallback={<SectionLoader />}>
              <ContactSection />
            </Suspense>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
