import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import HeroText from '../components/UI/HeroText';
import HeroScene from '../components/Scene/HeroScene';
import usePortfolioStore from '../store/usePortfolioStore';

const Home = () => {
    const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 400);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 45 }}
                    gl={{ antialias: true, alpha: true }}
                    dpr={[1, 2]}
                >
                    <Suspense fallback={null}>
                        {!isSmallScreen && <HeroScene isMobile={isSmallScreen} />}
                    </Suspense>
                </Canvas>
            </div>

            {/* UI Content Layer */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center justify-center md:justify-between max-w-7xl mx-auto pointer-events-none">
                {/* Left Side: Text content */}
                <div className="w-full md:w-1/2 flex items-center justify-center md:items-start pointer-events-auto">
                    <HeroText onExploreWork={() => setActiveSection('projects')} />
                </div>

                {/* Right Side: Reserved for 3D visual space on larger screens */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center">
                    {/* 3D element is rendered in the Canvas above, centered in this space visually */}
                </div>
            </div>

            {/* Background soft glow / particles overlay if needed */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent via-[#0a0a0a]/50 to-[#0a0a0a] z-[5]" />
        </div>
    );
};

export default Home;
