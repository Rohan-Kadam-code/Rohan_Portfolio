import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState(0); // 0: rev, 1: logo, 2: fade out
    const [rpmWidth, setRpmWidth] = useState(0);

    useEffect(() => {
        // Phase 0: RPM bar fills up
        const t1 = setTimeout(() => setRpmWidth(100), 100);
        // Phase 1: Show logo
        const t2 = setTimeout(() => setPhase(1), 800);
        // Phase 2: Fade out
        const t3 = setTimeout(() => setPhase(2), 2000);
        // Complete
        const t4 = setTimeout(() => onComplete(), 2600);

        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }, [onComplete]);

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            opacity: phase >= 2 ? 0 : 1,
            transition: 'opacity 0.6s ease',
            pointerEvents: phase >= 2 ? 'none' : 'all',
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(15px)',
            transition: 'all 0.6s cubic-bezier(0.33, 1, 0.68, 1)',
        },
        logoSlash: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '2rem',
            fontWeight: 700,
            color: '#ff3333',
        },
        logoText: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.8rem',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '3px',
        },
        rpmContainer: {
            width: '200px',
            height: '3px',
            background: '#1a1a1a',
            marginTop: '30px',
            borderRadius: '2px',
            overflow: 'hidden',
        },
        rpmBar: {
            height: '100%',
            width: `${rpmWidth}%`,
            background: 'linear-gradient(90deg, #ff3333, #ff6600, #ff3333)',
            transition: 'width 1.5s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: '0 0 10px rgba(255, 51, 51, 0.5)',
        },
        tagline: {
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.85rem',
            color: '#555',
            marginTop: '15px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.5s ease 0.3s',
        },
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.logoContainer}>
                <span style={styles.logoSlash}>//</span>
                <span style={styles.logoText}>ROHAN KADAM</span>
            </div>
            <div style={styles.rpmContainer}>
                <div style={styles.rpmBar} />
            </div>
            <div style={styles.tagline}>ENGINEERED FOR PERFORMANCE</div>
        </div>
    );
};

export default LoadingScreen;
