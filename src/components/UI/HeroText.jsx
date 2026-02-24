import { motion } from 'framer-motion';

const GithubIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
    </svg>
);

const LinkedinIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect x="2" y="9" width="4" height="12"></rect>
        <circle cx="4" cy="4" r="2"></circle>
    </svg>
);

const TwitterIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
);

const DownloadIcon = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);

const HeroText = ({ onExploreWork }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.6, ease: 'easeOut' },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: 'easeOut' },
        },
    };

    return (
        <motion.div
            className="flex flex-col items-start justify-center max-w-2xl px-6 py-12 md:px-12 lg:px-24"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Availability Tag */}
            <motion.div
                variants={itemVariants}
                className="flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/20"
            >
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Available for work
                </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-extrabold text-white mb-4 leading-tight"
            >
                Hi, I'm <span className="text-white">Fujel</span>
            </motion.h1>

            {/* Sub Heading */}
            <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
            >
                Full Stack Developer & 3D Web Designer
            </motion.h2>

            {/* Short Bio */}
            <motion.p
                variants={itemVariants}
                className="text-lg text-dark-100/70 mb-10 leading-relaxed max-w-lg"
            >
                I build immersive digital experiences that combine cutting-edge technology
                with elegant design. Specializing in high-performance web applications.
            </motion.p>

            {/* Buttons */}
            <motion.div
                variants={buttonVariants}
                className="flex flex-wrap gap-4 mb-12"
            >
                <button
                    onClick={onExploreWork}
                    className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-dark-950 font-bold rounded-lg transition-colors duration-300 shadow-lg shadow-cyan-500/20 pointer-events-auto"
                >
                    View Projects
                </button>
                <button
                    className="flex items-center gap-2 px-8 py-3 border border-dark-200 hover:border-white hover:bg-white/5 text-white font-semibold rounded-lg transition-all duration-300 pointer-events-auto"
                >
                    <DownloadIcon size={18} />
                    Download CV
                </button>
            </motion.div>

            {/* Social Icons */}
            <motion.div
                variants={itemVariants}
                className="flex items-center gap-6"
            >
                <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-100/50 hover:text-white transition-colors duration-300 pointer-events-auto"
                    aria-label="GitHub"
                >
                    <GithubIcon size={24} />
                </a>
                <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-100/50 hover:text-white transition-colors duration-300 pointer-events-auto"
                    aria-label="LinkedIn"
                >
                    <LinkedinIcon size={24} />
                </a>
                <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-dark-100/50 hover:text-white transition-colors duration-300 pointer-events-auto"
                    aria-label="Twitter"
                >
                    <TwitterIcon size={24} />
                </a>
            </motion.div>
        </motion.div>
    );
};

export default HeroText;
