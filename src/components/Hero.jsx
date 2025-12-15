import React, { useState, useEffect } from 'react';
import '../index.css';

const Hero = () => {
    const [text, setText] = useState('');
    const fullText = "Designing the heart of motion. Expertise in internal combustion, hybrid systems, and thermal management.";

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
            zIndex: 2,
            textAlign: 'center',
            maxWidth: '800px',
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
            maxWidth: '600px',
            margin: '0 auto 3rem',
            minHeight: '3.6em', // Prevent layout shift
        },
        backgroundDecoration: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60vw',
            height: '60vw',
            border: '1px solid rgba(255, 255, 255, 0.03)',
            borderRadius: '50%',
            zIndex: 1,
        },
        circleInner: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '40vw',
            height: '40vw',
            border: '1px dashed rgba(255, 51, 51, 0.1)',
            borderRadius: '50%',
            animation: 'spinSlow 20s linear infinite',
        }
    };

    return (
        <section id="hero" style={styles.hero}>
            <div style={styles.backgroundDecoration}></div>
            <div style={styles.circleInner} className="animate-spin-slow"></div>

            <div style={styles.content} className="animate-fade-in">
                <h2 className="animate-slide-up" style={{ animationDelay: '0.2s', ...styles.h2 }}>ENGINEERED FOR PERFORMANCE</h2>
                <h1 className="animate-slide-up" style={{ ...styles.h1, animationDelay: '0.4s' }}>
                    POWERTRAIN <br />
                    <span style={{ color: 'transparent', WebkitTextStroke: '1px #fff' }}>SPECIALIST</span>
                </h1>
                <p className="animate-slide-up" style={{ ...styles.description, animationDelay: '0.6s' }}>
                    {text}<span className="animate-pulse">_</span>
                </p>
                <div className="animate-slide-up" style={{ display: 'flex', gap: '20px', justifyContent: 'center', animationDelay: '0.8s' }}>
                    <a href="#projects" className="btn">View Systems</a>
                    <a href="#contact" className="btn btn-secondary">Contact Me</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
