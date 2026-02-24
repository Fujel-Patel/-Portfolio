/**
 * Skill data used by the SkillSpheres component.
 *
 * @typedef {Object} Skill
 * @property {string}                  id
 * @property {string}                  name
 * @property {string}                  category      - 'frontend' | 'backend' | 'tools' | '3d'
 * @property {string}                  color         - hex colour for the sphere
 * @property {string}                  emissive      - hex emissive colour
 * @property {number}                  level         - proficiency 0-100
 * @property {string}                  description
 * @property {string}                  icon          - emoji or short label
 * @property {[number,number,number]}  basePosition  - default position in the scene
 */

/** @type {Skill[]} */
const skills = [
    {
        id: 'react',
        name: 'React',
        category: 'frontend',
        color: '#61dafb',
        emissive: '#61dafb',
        level: 95,
        description:
            'Building complex SPAs, custom hooks, context patterns, and performance optimisation with React 18+.',
        icon: '⚛️',
        basePosition: [-2.5, 1.2, 0],
    },
    {
        id: 'threejs',
        name: 'Three.js',
        category: '3d',
        color: '#00fff5',
        emissive: '#00fff5',
        level: 85,
        description:
            'Creating immersive 3D web experiences with Three.js, React Three Fiber, and custom shaders.',
        icon: '🎲',
        basePosition: [2.5, 1.5, -1],
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        category: 'backend',
        color: '#68a063',
        emissive: '#68a063',
        level: 90,
        description:
            'RESTful APIs, real-time services, and microservice architectures with Express & Fastify.',
        icon: '🟢',
        basePosition: [0, 2.5, 1],
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        category: 'frontend',
        color: '#3178c6',
        emissive: '#3178c6',
        level: 88,
        description:
            'Type-safe application development, advanced generics, and utility types for large-scale codebases.',
        icon: 'TS',
        basePosition: [-1.5, 0, 2],
    },
    {
        id: 'python',
        name: 'Python',
        category: 'backend',
        color: '#ffd43b',
        emissive: '#ffd43b',
        level: 82,
        description:
            'Data automation, Flask/Django APIs, Celery task queues, and scripting for DevOps workflows.',
        icon: '🐍',
        basePosition: [1.8, 0.2, 1.5],
    },
    {
        id: 'docker',
        name: 'Docker',
        category: 'tools',
        color: '#2496ed',
        emissive: '#2496ed',
        level: 78,
        description:
            'Container orchestration, multi-stage builds, Docker Compose, and CI/CD pipeline integration.',
        icon: '🐳',
        basePosition: [-3, -0.5, -1],
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        category: 'frontend',
        color: '#38bdf8',
        emissive: '#38bdf8',
        level: 92,
        description:
            'Utility-first styling, custom design systems, responsive layouts, and dark-mode theming.',
        icon: '🎨',
        basePosition: [3, -0.3, 0.5],
    },
    {
        id: 'git',
        name: 'Git & CI/CD',
        category: 'tools',
        color: '#f14e32',
        emissive: '#f14e32',
        level: 88,
        description:
            'Version control, GitHub Actions, automated deployments, and branch strategies for teams.',
        icon: '🔀',
        basePosition: [0, -0.8, 3],
    },
];

/**
 * Map category → ring colour for group visualisation.
 * @type {Record<string, string>}
 */
export const categoryColors = {
    frontend: '#61dafb',
    backend: '#68a063',
    tools: '#f14e32',
    '3d': '#00fff5',
};

export default skills;
