import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Github, Calendar, Users } from 'lucide-react'

interface Project {
  title: string
  description: string
  tags: string[]
  image: string
  fullDescription?: string
  features?: string[]
  technologies?: string[]
  githubUrl?: string
  demoUrl?: string
  timeline?: string
  team?: string
}

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto"
          >
            <div className="min-h-full flex items-center justify-center p-4">
              <div className="glass w-full max-w-4xl rounded-2xl overflow-hidden">
                {/* Header Image */}
                <div className={`h-64 ${project.image} relative`}>
                  <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-5xl">📱</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{project.title}</h2>
                  
                  <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                    {project.fullDescription || project.description}
                  </p>

                  {/* Features */}
                  {project.features && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Key Features</h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {project.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2 text-gray-300">
                            <span className="text-cyan-400 mt-1">•</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Technologies */}
                  {project.technologies && (
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4 text-cyan-400">Technologies Used</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-6 mb-8 text-sm text-gray-400">
                    {project.timeline && (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-cyan-400" />
                        <span>{project.timeline}</span>
                      </div>
                    )}
                    {project.team && (
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-cyan-400" />
                        <span>{project.team}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-4">
                    {project.demoUrl && (
                      <motion.a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink size={18} />
                        View Live Demo
                      </motion.a>
                    )}
                    {project.githubUrl && (
                      <motion.a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 glass rounded-xl font-semibold hover:bg-white/10 transition-all"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github size={18} />
                        View Code
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
