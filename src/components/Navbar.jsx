import React, { useState, useEffect } from 'react';
import '../index.css';

const sections = [
    { id: 'hero', label: 'Start' },
    { id: 'about', label: 'Profile' },
    { id: 'journey', label: 'Circuit' },
    { id: 'toolkit', label: 'Toolkit' },
    { id: 'projects', label: 'Builds' },
    { id: 'contact', label: 'Connect' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Determine active section
            let current = 'hero';
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight / 3) {
                        current = section.id;
                    }
                }
            }
            setActiveSection(current);
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
            zIndex: 1003, // Above mobile menu
        },
        logoAccent: {
            color: 'var(--color-primary)',
        },
        links: {
            display: 'flex',
            gap: '40px',
        },
        link: (isActive) => ({
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: isActive ? '#fff' : 'var(--color-text)',
            position: 'relative',
            transition: 'color 0.3s ease',
            cursor: 'pointer',
        }),
        activeIndicator: {
            position: 'absolute',
            bottom: '-4px',
            left: '0',
            width: '100%',
            height: '2px',
            background: 'var(--color-primary)',
            boxShadow: '0 0 8px var(--color-primary)',
            borderRadius: '1px',
            transition: 'all 0.3s ease',
        },
    };

    return (
        <nav style={styles.nav} className={scrolled ? 'scrolled' : ''}>
            <div style={styles.logo}>
                <span style={styles.logoAccent}>//</span> ROHAN KADAM
            </div>

            <div className={`mobile-menu-icon ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
                <span style={{ opacity: isOpen ? 0 : 1 }}></span>
                <span style={{ transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }}></span>
            </div>

            <ul style={styles.links} className={`nav-links ${isOpen ? 'open' : ''}`}>
                {sections.map(({ id, label }, index) => (
                    <li key={id} style={{ transitionDelay: `${index * 0.1}s` }}>
                        <a
                            href={`#${id}`}
                            style={styles.link(activeSection === id)}
                            onClick={() => setIsOpen(false)}
                        >
                            {label}
                            {activeSection === id && <span style={styles.activeIndicator} />}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
