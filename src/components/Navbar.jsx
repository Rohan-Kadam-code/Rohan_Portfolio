import React, { useState, useEffect } from 'react';
import '../index.css';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const styles = {
        nav: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: 'var(--nav-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5%',
            zIndex: 1000,
            transition: 'all 0.3s ease',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            backgroundColor: scrolled ? 'rgba(5, 5, 5, 0.8)' : 'transparent',
            borderBottom: scrolled ? '1px solid var(--color-surface-hover)' : 'none',
        },
        logo: {
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: '700',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
        },
        logoAccent: {
            color: 'var(--color-primary)',
        },
        links: {
            display: 'flex',
            gap: '40px',
        },
        link: {
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--color-text)',
            position: 'relative',
        },
    };

    return (
        <nav style={styles.nav} className={scrolled ? 'scrolled' : ''}>
            <div style={styles.logo}>
                <span style={styles.logoAccent}>//</span> ROHAN KADAM
            </div>
            <ul style={styles.links} className="nav-links">
                <li><a href="#hero" style={styles.link}>Start</a></li>
                <li><a href="#about" style={styles.link}>Diagnostics</a></li>
                <li><a href="#journey" style={styles.link}>Circuit</a></li>
                <li><a href="#expertise" style={styles.link}>Specs</a></li>
                <li><a href="#projects" style={styles.link}>Builds</a></li>
                <li><a href="#contact" style={styles.link}>Connect</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
