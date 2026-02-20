import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import ProjectModal from './ProjectModal'

const projects = [
  {
    title: '3D E-Commerce Platform',
    description: 'Interactive shopping experience with 3D product visualization and AR features',
    fullDescription:
      'A cutting-edge e-commerce platform that revolutionizes online shopping through immersive 3D product visualization. Users can interact with products in real-time, view them from all angles, and even use AR to see how items would look in their space before purchasing.',
    tags: ['React', 'Three.js', 'Node.js'],
    technologies: [
      'React',
      'Three.js',
      'React Three Fiber',
      'Node.js',
      'Express',
      'MongoDB',
      'WebGL',
      'AR.js',
    ],
    features: [
      'Real-time 3D product visualization',
      'Augmented reality product preview',
      '360° product rotation and zoom',
      'Interactive product customization',
      'Seamless checkout experience',
      'Mobile-responsive design',
    ],
    image: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
    githubUrl: 'https://github.com/yourusername/3d-ecommerce',
    demoUrl: 'https://3d-ecommerce-demo.vercel.app',
    timeline: '3 months',
    team: 'Solo Project',
  },
  {
    title: 'AI Dashboard',
    description: 'Real-time analytics dashboard with data visualization and predictive insights',
    fullDescription:
      'An intelligent analytics dashboard that leverages machine learning to provide predictive insights and real-time data visualization. The platform helps businesses make data-driven decisions by transforming complex datasets into actionable insights.',
    tags: ['Next.js', 'TypeScript', 'Python'],
    technologies: [
      'Next.js',
      'TypeScript',
      'Python',
      'TensorFlow',
      'D3.js',
      'PostgreSQL',
      'FastAPI',
      'Docker',
    ],
    features: [
      'Real-time data streaming and visualization',
      'AI-powered predictive analytics',
      'Custom dashboard builder',
      'Automated report generation',
      'Multi-source data integration',
      'Role-based access control',
    ],
    image: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    githubUrl: 'https://github.com/yourusername/ai-dashboard',
    demoUrl: 'https://ai-dashboard-demo.vercel.app',
    timeline: '4 months',
    team: 'Team of 3',
  },
  {
    title: 'Social Media App',
    description: 'Full-stack social platform with real-time messaging and content sharing',
    fullDescription:
      'A modern social media platform designed for creative professionals. Features real-time messaging, content sharing, collaborative workspaces, and AI-powered content recommendations. Built with performance and scalability in mind.',
    tags: ['React Native', 'Firebase', 'GraphQL'],
    technologies: [
      'React Native',
      'Firebase',
      'GraphQL',
      'Apollo',
      'Node.js',
      'Redis',
      'WebSocket',
      'TensorFlow',
    ],
    features: [
      'Real-time messaging with typing indicators',
      'Photo and video sharing with filters',
      'Story and reel functionality',
      'AI-powered content feed',
      'Push notifications',
      'End-to-end encryption',
    ],
    image: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
    githubUrl: 'https://github.com/yourusername/social-app',
    demoUrl: 'https://social-app-demo.vercel.app',
    timeline: '6 months',
    team: 'Team of 5',
  },
]

export default function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (project: (typeof projects)[0]) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <section id="projects" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-cyan-400 text-lg mb-4 tracking-wider">My Work</h2>
          <h3 className="text-4xl md:text-5xl font-bold">
            Featured <span className="text-gradient">Projects</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer"
              onClick={() => openModal(project)}
            >
              <div className="glass rounded-2xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300">
                <div className={`h-48 ${project.image} flex items-center justify-center`}>
                  <div className="w-20 h-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-3xl">📱</span>
                  </div>
                </div>

                <div className="p-6">
                  <h4 className="text-xl font-semibold mb-2 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-gray-400 mb-4 text-sm">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300"
                      whileHover={{ x: 5 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        openModal(project)
                      }}
                    >
                      <ExternalLink size={16} />
                      View Details
                    </motion.button>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
                      whileHover={{ x: 5 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github size={16} />
                      Code
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeModal} />
    </section>
  )
}
