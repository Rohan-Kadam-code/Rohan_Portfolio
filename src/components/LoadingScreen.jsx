import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
    const [lights, setLights] = useState([false, false, false, false, false]);
    const [statusText, setStatusText] = useState('PRE-GRID PREPARATION...');
    const [extinguished, setExtinguished] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Stage 1: Turn lights red one by one
        const timers = [];
        
        for (let i = 0; i < 5; i++) {
            const timer = setTimeout(() => {
                setLights(prev => {
                    const next = [...prev];
                    next[i] = true;
                    return next;
                });
                setStatusText(`LOCKED AND READY: LIGHT ${i + 1}`);
            }, 600 + i * 500); // Light up every 500ms
            timers.push(timer);
        }

        // Stage 2: Wait for random interval after all 5 are lit, then extinguish them
        const allLitTime = 600 + 4 * 500;
        const extinguishDelay = allLitTime + 800 + Math.random() * 800; // random 800-1600ms delay like real F1

        const extinguishTimer = setTimeout(() => {
            setLights([false, false, false, false, false]);
            setExtinguished(true);
            setStatusText("LIGHTS OUT AND AWAY WE GO!");
            
            // Stage 3: Fade out loading screen shortly after
            const fadeTimer = setTimeout(() => {
                setFadeOut(true);
                // Stage 4: Trigger parent completion
                const completeTimer = setTimeout(() => {
                    onComplete();
                }, 600);
                timers.push(completeTimer);
            }, 1200);
            timers.push(fadeTimer);

        }, extinguishDelay);
        timers.push(extinguishTimer);

        return () => timers.forEach(clearTimeout);
    }, [onComplete]);

    const styles = {
        overlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: '#14161D',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: fadeOut ? 'none' : 'all',
            padding: '20px',
            boxSizing: 'border-box',
        },
        lightSystem: {
            background: '#1E212B',
            border: '4px solid #2D313F',
            borderRadius: '16px',
            padding: '25px 40px',
            display: 'flex',
            gap: '30px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8), inset 0 2px 10px rgba(255,255,255,0.05)',
            marginBottom: '40px',
            position: 'relative',
        },
        lightContainer: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
        },
        lightBox: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#292D3B',
            border: '3px solid #3c3c4a',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 3px 8px rgba(0,0,0,0.6)',
        },
        led: (isActive) => ({
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: isActive ? '#E10600' : '#3E4353',
            transition: 'all 0.1s ease',
            boxShadow: isActive 
                ? '0 0 30px #ff0000, 0 0 60px #ff0000, inset 0 2px 10px rgba(255,255,255,0.8)' 
                : 'inset 0 2px 5px rgba(0,0,0,0.5)',
        }),
        lightSupport: {
            width: '8px',
            height: '20px',
            background: '#2D313F',
        },
        titleContainer: {
            textAlign: 'center',
            minHeight: '80px',
        },
        status: {
            fontFamily: "'Orbitron', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: extinguished ? '#00ff66' : '#fff',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: extinguished ? '0 0 15px rgba(0,255,102,0.4)' : 'none',
            transition: 'all 0.3s ease',
        },
        tagline: {
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.9rem',
            color: '#8e8e9e',
            marginTop: '10px',
            letterSpacing: '6px',
            textTransform: 'uppercase',
            fontWeight: 600,
        },
        connectionBox: {
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: '0.8rem',
            color: '#444450',
            letterSpacing: '2px',
        },
        blinkDot: {
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: extinguished ? '#00ff66' : '#E10600',
            animation: 'pulseGlow 1.5s infinite',
        }
    };

    return (
        <div style={styles.overlay}>
            {/* The F1 Gantry Starting Lights */}
            <div style={styles.lightSystem}>
                {lights.map((isLit, idx) => (
                    <div key={idx} style={styles.lightContainer}>
                        {/* Two support brackets like the real FIA gantry */}
                        <div style={styles.lightBox}>
                            <div style={styles.led(isLit)} />
                        </div>
                        <div style={styles.lightBox}>
                            <div style={styles.led(isLit)} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={styles.titleContainer}>
                <div style={styles.status}>{statusText}</div>
                <div style={styles.tagline}>ROHAN KADAM • CIRCUITS ENGINEERING</div>
            </div>

            <div style={styles.connectionBox}>
                <div style={styles.blinkDot} />
                <span>TELEMETRY UPLINK ESTABLISHED</span>
            </div>
        </div>
    );
};

export default LoadingScreen;
