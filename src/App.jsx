import { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MainScene from './components/Scene/MainScene';
import SkillSpheres from './components/Models/SkillSpheres';
import ProjectPanels from './components/Models/ProjectPanels';
import Overlay from './components/UI/Overlay';
import ProjectModal from './components/UI/ProjectModal';
import DebugPanel from './components/UI/DebugPanel';
import GlitchText from './components/UI/GlitchText';
import Home from './pages/Home';
import usePortfolioStore from './store/usePortfolioStore';
import { useDeviceTier } from './hooks/useMediaQuery';
import useReducedMotion from './hooks/useReducedMotion';
import { useAnalytics } from './hooks/useAnalytics';
import useEasterEggs from './hooks/useEasterEggs';
import projects from './data/projects';
import skills, { categoryColors } from './data/skills';
import './App.css';

export default function App() {
  const isLoading = usePortfolioStore((s) => s.isLoading);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
  const selectedProject = usePortfolioStore((s) => s.selectedProject);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const checkMobile = usePortfolioStore((s) => s.checkMobile);
  const setDeviceTier = usePortfolioStore((s) => s.setDeviceTier);
  const setReducedMotion = usePortfolioStore((s) => s.setReducedMotion);

  /* ── Analytics ── */
  useAnalytics();

  /* ── Easter eggs ── */
  const { konamiActive, debugActive, themeName } = useEasterEggs();

  /* ── Responsive tier ── */
  const { tier } = useDeviceTier();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    checkMobile();
    const onResize = () => checkMobile();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [checkMobile]);

  useEffect(() => { setDeviceTier(tier); }, [tier, setDeviceTier]);
  useEffect(() => { setReducedMotion(prefersReducedMotion); }, [prefersReducedMotion, setReducedMotion]);

  const liveRegionRef = useRef(null);
  useEffect(() => {
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `Now viewing ${activeSection} section`;
    }
  }, [activeSection]);

  const selectedProjectData = selectedProject
    ? projects.find((p) => p.id === selectedProject) ?? null
    : null;

  const handleSelectProject = useCallback((id) => {
    setSelectedProject(id);
  }, [setSelectedProject]);

  const handleCloseModal = useCallback(() => {
    setSelectedProject(null);
  }, [setSelectedProject]);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactChange = useCallback((e) => {
    setContactForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleContactSubmit = useCallback((e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => setContactSubmitted(false), 4000);
    setContactForm({ name: '', email: '', message: '' });
  }, []);

  const fadeVariants = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden dark bg-dark-900">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan-500 focus:text-dark-900 focus:font-semibold focus:text-sm focus:outline-none focus:ring-2 focus:ring-white transition-all">
        Skip to main content
      </a>

      <div ref={liveRegionRef} role="status" aria-live="polite" aria-atomic="true" className="sr-only" />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900" role="alert" aria-busy="true" aria-label="Loading portfolio">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" role="progressbar" aria-label="Loading" />
            <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase animate-pulse">Loading…</p>
          </div>
        </div>
      )}

      {/* MainScene acts as the persistent background for other sections, 
          but we hide its main content when on the redesigned Home to save resources */}
      <MainScene aria-hidden="true" konamiActive={konamiActive}>
        {activeSection !== 'home' && (
          <>
            <SkillSpheres visible={activeSection === 'skills'} />
            <ProjectPanels visible={activeSection === 'projects'} onSelectProject={handleSelectProject} />
          </>
        )}
      </MainScene>

      <DebugPanel visible={debugActive} themeName={themeName} />
      <ProjectModal project={selectedProjectData} onClose={handleCloseModal} />

      <Overlay>
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="h-full w-full"
            >
              <Home />
            </motion.div>
          )}

          {activeSection === 'about' && (
            <motion.section
              key="about"
              variants={fadeVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="h-full flex flex-col items-center justify-center p-6"
            >
              <div className="section-container">
                <h2 className="section-title text-4xl md:text-6xl mb-8 text-center">About Me</h2>
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                  <div className="flex justify-center">
                    <div className="relative w-56 h-56 md:w-72 h-72">
                      <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-3xl" />
                      <div className="relative w-full h-full rounded-full border border-cyan-500/30 flex items-center justify-center bg-dark-800/50 backdrop-blur-md">
                        <span className="text-8xl">👨‍💻</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5 text-dark-100/70 leading-relaxed">
                    <p>Hi, I'm <span className="text-cyan-400 font-semibold">Fujel Patel</span>.</p>
                    <p>I specialize in <span className="text-purple-400">React</span>, <span className="text-purple-300">Three.js</span>, and <span className="text-purple-400">Node.js</span>.</p>
                    <div className="grid grid-cols-3 gap-4 pt-4">
                      {[{ v: '3+', l: 'Years' }, { v: '20+', l: 'Projects' }, { v: '8+', l: 'Stack' }].map((s) => (
                        <div key={s.l} className="glass-panel text-center p-3 rounded-xl">
                          <p className="text-2xl font-bold text-cyan-400">{s.v}</p>
                          <p className="text-2xs text-dark-100/50">{s.l}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {activeSection === 'projects' && (
            <motion.section
              key="projects"
              variants={fadeVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="h-full flex flex-col items-center justify-center p-6"
            >
              <div className="section-container text-center">
                <h2 className="section-title text-4xl md:text-6xl mb-4">Projects</h2>
                <p className="text-dark-100/50 mb-10">Select a project in the 3D scene to explore.</p>
                <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  {projects.map((p) => (
                    <button key={p.id} onClick={() => handleSelectProject(p.id)} className="glass-card p-6 text-left group">
                      <h3 className="font-bold text-base mb-1" style={{ color: p.color }}>{p.title}</h3>
                      <p className="text-dark-100/50 text-xs">{p.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeSection === 'skills' && (
            <motion.section
              key="skills"
              variants={fadeVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="h-full flex flex-col items-center justify-center p-6"
            >
              <div className="section-container text-center">
                <h2 className="section-title text-4xl md:text-6xl mb-8">Skills</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                  {skills.map((s) => (
                    <div key={s.id} className="glass-card p-4">
                      <span className="text-2xl mb-2 block">{s.icon}</span>
                      <h3 className="font-bold text-sm mb-1" style={{ color: s.color }}>{s.name}</h3>
                      <div className="w-full h-1 bg-dark-600 rounded-full mt-2 overflow-hidden">
                        <div className="h-full" style={{ width: `${s.level}%`, background: s.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {activeSection === 'contact' && (
            <motion.section
              key="contact"
              variants={fadeVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="h-full flex flex-col items-center justify-center p-6"
            >
              <div className="section-container max-w-xl mx-auto text-center">
                <h2 className="section-title text-4xl md:text-6xl mb-4">Contact</h2>
                {contactSubmitted ? (
                  <div className="glass-card p-8">
                    <h3 className="text-cyan-400 text-xl font-bold">Message Sent!</h3>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="glass-card p-8 text-left space-y-4">
                    <input type="text" placeholder="Name" className="w-full p-3 bg-dark-700 rounded-lg text-white" required />
                    <input type="email" placeholder="Email" className="w-full p-3 bg-dark-700 rounded-lg text-white" required />
                    <textarea placeholder="Message" rows={4} className="w-full p-3 bg-dark-700 rounded-lg text-white" required />
                    <button type="submit" className="btn-neon w-full">Send</button>
                  </form>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </Overlay>
    </div>
  );
}
