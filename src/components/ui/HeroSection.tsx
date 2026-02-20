import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Github, Linkedin, Twitter } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-text',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.3,
          ease: 'power4.out',
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none"
    >
      <div className="text-center z-10 px-6 max-w-4xl mx-auto w-full flex flex-col items-center">
        <motion.div
          className="hero-text mb-6 inline-block glass-morphism px-6 py-2 rounded-full border border-white/10 backdrop-blur-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <span className="text-cyan-400 text-sm md:text-base tracking-[0.3em] uppercase font-semibold">
            Creative Developer
          </span>
        </motion.div>

        {/* The main name overlay. Added ultra-strong drop shadows and modern mixed font weights. */}
        <h1 className="hero-text text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-tighter mb-8 leading-[0.9] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
          <span className="text-white mix-blend-plus-lighter inline-block">Fujel</span>
          <br />
          <span className="text-white mix-blend-plus-lighter inline-block opacity-90 font-black">Patel</span>
        </h1>

        <motion.div
          className="hero-text glass-morphism inline-block px-10 py-4 rounded-2xl border border-white/20 backdrop-blur-lg mb-12 shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-xl md:text-2xl text-gray-200 font-medium tracking-wide">
            Building immersive digital experiences
          </p>
        </motion.div>

        <div className="hero-text flex justify-center gap-8 pointer-events-auto">
          {[Github, Linkedin, Twitter].map((Icon, index) => (
            <motion.a
              key={index}
              href="#"
              className="p-4 bg-white/10 border border-white/20 backdrop-blur-md rounded-full hover:bg-white/20 hover:border-white/40 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
              whileHover={{ scale: 1.15, y: -5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon size={28} className="text-white" />
            </motion.a>
          ))}
        </div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.a
          href="#about"
          className="flex flex-col items-center gap-2 group glass-morphism border border-white/5 px-6 py-4 rounded-3xl"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/60 group-hover:text-cyan-400 font-bold transition-colors">Scroll</span>
          <div className="w-[2px] h-12 bg-gradient-to-b from-cyan-400 to-transparent rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </motion.a>
      </motion.div>
    </section>
  )
}
