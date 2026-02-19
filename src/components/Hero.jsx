import React, { useState, useEffect } from 'react';
import '../index.css';
import ParticleField from './ParticleField';
import MagneticButton from './MagneticButton';

const Hero = () => {
    const [text, setText] = useState('');
    const [scrollY, setScrollY] = useState(0);
    const fullText = "Bridging powertrain engineering, embedded systems, and E/E architecture to build safer, smarter vehicles.";

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => {
            setText(fullText.slice(0, index));
            index++;
            if (index > fullText.length) {
                clearInterval(timer);
            }
        }, 30);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const parallaxOffset = scrollY * 0.3;

    const styles = {
        hero: {
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: 'var(--nav-height)',
            background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #050505 70%)',
        },
        content: {
            position: 'relative',
            zIndex: 3,
            textAlign: 'center',
            maxWidth: '900px',
            padding: '0 20px',
        },
        h1: {
            fontSize: '4.5rem',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(0,0,0,0.5)',
            lineHeight: 1.1,
        },
        h2: {
            fontFamily: 'var(--font-mono)',
            fontSize: '1.5rem',
            color: 'var(--color-primary)',
            marginBottom: '2rem',
            fontWeight: '400',
            letterSpacing: '4px',
        },
        description: {
            color: 'var(--color-text-muted)',
            fontSize: '1.1rem',
            maxWidth: '700px',
            margin: '0 auto 3rem',
            minHeight: '3.6em',
        },
        backgroundDecoration: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(-50% + ${parallaxOffset}px))`,
            width: '60vw',
            height: '60vw',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            borderRadius: '50%',
            zIndex: 1,
            transition: 'transform 0.1s linear',
        },
        circleInner: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(-50% + ${parallaxOffset * 0.6}px))`,
            width: '40vw',
            height: '40vw',
            border: '1px dashed rgba(255, 51, 51, 0.1)',
            borderRadius: '50%',
            animation: 'spinSlow 20s linear infinite',
        },
        circleOuter: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(-50% + ${parallaxOffset * 1.2}px))`,
            width: '80vw',
            height: '80vw',
            border: '1px solid rgba(0, 242, 255, 0.03)',
            borderRadius: '50%',
            zIndex: 0,
        },
    };

    return (
        <section id="hero" style={styles.hero}>
            <ParticleField />
            <div style={styles.circleOuter}></div>
            <div style={styles.backgroundDecoration}></div>
            <div style={styles.circleInner} className="animate-spin-slow"></div>

            <div style={styles.content} className="animate-fade-in">
                <h2 className="animate-slide-up" style={{ animationDelay: '0.2s', ...styles.h2 }}>ARCHITECTING EMBEDDED AUTOMOTIVE SYSTEMS</h2>
                <h1 className="animate-slide-up" style={{ ...styles.h1, animationDelay: '0.4s' }}>
                    SOLUTIONS <br />
                    <span style={{ color: 'transparent', WebkitTextStroke: '1px #fff' }}>ARCHITECT</span>
                </h1>
                <p className="animate-slide-up" style={{ ...styles.description, animationDelay: '0.6s' }}>
                    {text}<span className="animate-pulse" style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--color-primary)', verticalAlign: 'text-bottom', marginLeft: '2px' }}></span>
                </p>
                <div className="animate-slide-up" style={{ display: 'flex', gap: '20px', justifyContent: 'center', animationDelay: '0.8s' }}>
                    <MagneticButton href="#projects" className="btn" strength={0.4}>
                        View Projects
                    </MagneticButton>
                    <MagneticButton href="#toolkit" className="btn btn-secondary" strength={0.4}>
                        Architecture Toolkit
                    </MagneticButton>
                </div>
            </div>
        </section>
    );
};

export default Hero;
