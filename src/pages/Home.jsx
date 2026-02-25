import { useEffect, useState } from 'react';
import HeroText from '../components/UI/HeroText';
import HeroScene from '../components/Scene/HeroScene';
import usePortfolioStore from '../store/usePortfolioStore';

const Home = () => {
    const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                minHeight: '100vh',
                alignItems: 'center',
                padding: '0 8%',
                background: '#0a0a0a',
                overflow: 'hidden',
                position: 'relative',
            }}
        >
            {/* Left Side: Text Content */}
            <div
                style={{
                    width: isMobile ? '100%' : '50%',
                    position: 'relative',
                    zIndex: 10,
                    paddingRight: isMobile ? 0 : '2rem',
                    paddingBottom: isMobile ? '2rem' : 0,
                }}
            >
                <HeroText onExploreWork={() => setActiveSection('projects')} />
            </div>

            {/* Right Side: 3D Canvas */}
            <div
                style={{
                    width: isMobile ? '100%' : '50%',
                    height: isMobile ? '300px' : '500px',
                    maxWidth: '500px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <HeroScene />
            </div>
        </div>
    );
};

export default Home;
