/**
 * Project data used by ProjectPanels and ProjectModal.
 *
 * @typedef {Object} Project
 * @property {string}   id
 * @property {string}   title
 * @property {string}   subtitle
 * @property {string}   description
 * @property {string[]} tech        - Technologies used
 * @property {string}   color       - Accent hex colour
 * @property {string}   [liveUrl]
 * @property {string}   [githubUrl]
 * @property {string}   [image]     - Thumbnail path (or placeholder gradient)
 */

/** @type {Project[]} */
const projects = [
    {
        id: 'portfolio-3d',
        title: '3D Portfolio',
        subtitle: 'Immersive Web Experience',
        description:
            'A fully interactive 3D developer portfolio built with React Three Fiber, featuring floating skill spheres, animated project panels, and smooth camera transitions. Optimised for 60 FPS across devices.',
        tech: ['React', 'Three.js', 'R3F', 'Zustand', 'Tailwind', 'Framer Motion'],
        color: '#06b6d4',
        liveUrl: 'https://fujelpatel.dev',
        githubUrl: 'https://github.com/fujel/portfolio',
    },
    {
        id: 'gdrive-automation',
        title: 'GDrive ETL Pipeline',
        subtitle: 'Data Automation Platform',
        description:
            'Enterprise-grade ETL pipeline that processes 100k+ Google Drive files using Celery workers, Redis queuing, and MySQL. Features real-time progress dashboards and deadlock-resilient batch operations.',
        tech: ['Python', 'Flask', 'Celery', 'Redis', 'MySQL', 'Docker'],
        color: '#a855f7',
        githubUrl: 'https://github.com/fujel/gdrive-etl',
    },
    {
        id: 'dashboard-analytics',
        title: 'Analytics Dashboard',
        subtitle: 'Real-time Data Visualisation',
        description:
            'Interactive analytics dashboard with real-time chart updates, filterable data tables, role-based access control, and automated PDF report generation. Handles 50k+ daily active users.',
        tech: ['React', 'TypeScript', 'D3.js', 'Node.js', 'PostgreSQL', 'AWS'],
        color: '#e94560',
        liveUrl: 'https://dashboard.example.com',
    },
    {
        id: 'ai-chatbot',
        title: 'AI Chat Assistant',
        subtitle: 'Conversational AI Interface',
        description:
            'Full-stack AI chat application with streaming responses, conversation memory, document Q&A via RAG, and a sleek glassmorphism UI. Supports multiple LLM backends.',
        tech: ['Next.js', 'Python', 'LangChain', 'OpenAI', 'Pinecone', 'Vercel'],
        color: '#00fff5',
        githubUrl: 'https://github.com/fujel/ai-chat',
    },
];

export default projects;
