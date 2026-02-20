import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, ArrowRight, X } from 'lucide-react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  date: string
  readTime: string
  category: string
  tags: string[]
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'Building Immersive 3D Experiences with React Three Fiber',
    excerpt:
      'Learn how to create stunning 3D web applications using React Three Fiber and Three.js.',
    content: `
      <p>React Three Fiber (R3F) is a powerful React renderer for Three.js that makes creating 3D web experiences incredibly intuitive.</p>
      
      <h3>Getting Started</h3>
      <p>First, install the necessary dependencies:</p>
      <pre><code>npm install three @react-three/fiber @react-three/drei</code></pre>
      
      <h3>Creating Your First Scene</h3>
      <p>The basic structure of an R3F scene is straightforward. You create a Canvas component and add your 3D objects as React components:</p>
      
      <h3>Performance Tips</h3>
      <ul>
        <li>Use instancing for repeated objects</li>
        <li>Implement LOD (Level of Detail) for complex models</li>
        <li>Optimize textures and materials</li>
        <li>Use frustum culling</li>
      </ul>
      
      <p>With these techniques, you can create performant 3D experiences that work across all devices.</p>
    `,
    date: '2024-01-15',
    readTime: '5 min read',
    category: '3D Development',
    tags: ['React', 'Three.js', 'WebGL', 'Tutorial'],
  },
  {
    id: 2,
    title: 'The Future of Web Animation: GSAP and Framer Motion',
    excerpt: 'Comparing two of the most popular animation libraries for React applications.',
    content: `
      <p>When it comes to web animation, two libraries stand out: GSAP (GreenSock Animation Platform) and Framer Motion.</p>
      
      <h3>GSAP: The Animation Powerhouse</h3>
      <p>GSAP has been the gold standard for web animation for over a decade. It offers:</p>
      <ul>
        <li>Incredible performance</li>
        <li>Timeline control</li>
        <li>Plugin ecosystem</li>
        <li>ScrollTrigger for scroll-based animations</li>
      </ul>
      
      <h3>Framer Motion: The React Way</h3>
      <p>Framer Motion brings animation to React with a declarative API:</p>
      <ul>
        <li>Simple syntax</li>
        <li>Layout animations</li>
        <li>Gesture support</li>
        <li>AnimatePresence for exit animations</li>
      </ul>
      
      <h3>Which Should You Choose?</h3>
      <p>Both libraries excel in different areas. Use GSAP for complex timeline-based animations and Framer Motion for React-native declarative animations.</p>
    `,
    date: '2024-01-10',
    readTime: '4 min read',
    category: 'Animation',
    tags: ['GSAP', 'Framer Motion', 'Animation', 'React'],
  },
  {
    id: 3,
    title: 'Optimizing Performance in Modern Web Applications',
    excerpt: 'Essential techniques for building fast, responsive web applications.',
    content: `
      <p>Performance optimization is crucial for modern web applications. Here are the key strategies I use:</p>
      
      <h3>1. Code Splitting & Lazy Loading</h3>
      <p>Split your code into chunks and load them on demand:</p>
      
      <h3>2. Image Optimization</h3>
      <p>Use modern formats like WebP and AVIF, implement lazy loading, and provide appropriate sizes.</p>
      
      <h3>3. Caching Strategies</h3>
      <p>Implement service workers for offline capability and intelligent caching.</p>
      
      <h3>4. Bundle Analysis</h3>
      <p>Regularly analyze your bundle size and remove unused dependencies.</p>
      
      <p>Remember: performance is a feature, not an afterthought!</p>
    `,
    date: '2024-01-05',
    readTime: '6 min read',
    category: 'Performance',
    tags: ['Performance', 'Optimization', 'Web Development'],
  },
]

export default function BlogSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  return (
    <section id="blog" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-cyan-400 text-lg mb-4 tracking-wider">Blog</h2>
          <h3 className="text-4xl md:text-5xl font-bold">
            Latest <span className="text-gradient">Articles</span>
          </h3>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="glass rounded-2xl overflow-hidden h-full hover:transform hover:scale-[1.02] transition-all duration-300">
                <div className="p-6 flex flex-col h-full">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-400">
                    <span className="text-cyan-400">{post.category}</span>
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {post.date}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="text-xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="text-gray-400 mb-4 flex-grow">{post.excerpt}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-white/5 border border-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                      <Clock size={14} />
                      {post.readTime}
                    </div>
                    <motion.span
                      className="flex items-center gap-1 text-sm text-cyan-400 group-hover:text-cyan-300"
                      whileHover={{ x: 5 }}
                    >
                      Read More
                      <ArrowRight size={16} />
                    </motion.span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPost(null)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />
            <motion.article
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-4 md:inset-10 lg:inset-20 z-50 overflow-auto"
            >
              <div className="min-h-full flex items-center justify-center p-4">
                <div className="glass w-full max-w-4xl rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="sticky top-0 glass border-b border-white/10 p-6 flex items-center justify-between">
                    <div>
                      <span className="text-cyan-400 text-sm">{selectedPost.category}</span>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {selectedPost.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {selectedPost.readTime}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedPost(null)}
                      className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">{selectedPost.title}</h2>

                    <div
                      className="prose prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                    />

                    {/* Tags */}
                    <div className="mt-8 pt-8 border-t border-white/10">
                      <div className="flex flex-wrap gap-2">
                        {selectedPost.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-sm rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}
