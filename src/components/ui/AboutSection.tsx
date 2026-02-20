import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, Palette, Zap } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: 'Clean Code',
    description: 'Writing maintainable, efficient, and scalable code with modern best practices',
  },
  {
    icon: Palette,
    title: 'Creative Design',
    description: 'Crafting beautiful user interfaces with attention to detail and user experience',
  },
  {
    icon: Zap,
    title: 'Performance',
    description: 'Optimizing applications for speed, accessibility, and smooth interactions',
  },
]

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="about" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-cyan-400 text-lg mb-4 tracking-wider">About Me</h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-6">
            Passionate about creating
            <span className="text-gradient"> digital experiences</span>
          </h3>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            I'm a creative developer specializing in building immersive web applications with modern
            technologies. I love combining technical expertise with creative design to deliver
            exceptional user experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="glass p-8 rounded-2xl hover:bg-white/10 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon size={28} className="text-cyan-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
