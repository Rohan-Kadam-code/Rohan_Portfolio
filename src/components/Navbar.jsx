import React, { useState, useEffect } from 'react';
import '../index.css';

const sections = [
    { id: 'hero', label: 'START' },
    { id: 'about', label: 'PRACTICE' },
    { id: 'journey', label: 'RACE' },
    { id: 'toolkit', label: 'QUALIFYING' },
    { id: 'projects', label: 'GARAGE' },
    { id: 'journal', label: 'DEBRIEF' },
    { id: 'contact', label: 'PIT WALL' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const [scrollPercent, setScrollPercent] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            // Calculate overall scroll progress percentage
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (totalHeight > 0) {
                setScrollPercent(Math.round((window.scrollY / totalHeight) * 100));
            }

            // If we are on the debrief page, force active section to 'journal'
            if (window.location.hash === '#/debrief') {
                setActiveSection('journal');
                return;
            }

            // Determine active section
            let current = 'hero';
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    // When the section covers the upper third of screen
                    if (rect.top <= window.innerHeight / 3) {
                        current = section.id;
                    }
                }
            }
            setActiveSection(current);
        };

        window.addEventListener('scroll', handleScroll);
        
        // Listen to hash change to update active state instantly
        const handleHashChange = () => {
            if (window.location.hash === '#/debrief') {
                setActiveSection('journal');
            } else {
                handleScroll();
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        
        // Initial run
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('hashchange', handleHashChange);
        };
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
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            backgroundColor: scrolled ? 'rgba(5, 5, 8, 0.85)' : 'transparent',
            borderBottom: scrolled ? '1px solid rgba(225, 6, 0, 0.2)' : '1px solid rgba(255, 255, 255, 0.02)',
        },
        logo: {
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: '800',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1003,
            letterSpacing: '1px',
        },
        logoAccent: {
            color: 'var(--color-primary)',
            fontStyle: 'italic',
        },
        links: {
            display: 'flex',
            gap: '15px',
            alignItems: 'center',
        },
        linkWrapper: (isActive) => ({
            transform: 'skewX(-12deg)',
            transition: 'all 0.2s ease',
            background: isActive ? 'var(--color-primary)' : 'transparent',
            border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
            padding: '4px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
        }),
        link: (isActive) => ({
            transform: 'skewX(12deg)', // Undo skew for text readability
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: isActive ? '#fff' : 'var(--color-text-muted)',
            transition: 'color 0.2s ease',
            display: 'block',
        }),
        telemetryHUD: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
            paddingLeft: '15px',
        },
        telemetryValue: {
            color: 'var(--color-secondary)',
            fontWeight: 'bold',
        }
    };

    return (
        <nav style={styles.nav} className={scrolled ? 'scrolled' : ''}>
            <div style={styles.logo}>
                ROHAN KADAM
            </div>

            <div className={`mobile-menu-icon ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none', backgroundColor: '#fff' }}></span>
                <span style={{ opacity: isOpen ? 0 : 1, backgroundColor: '#fff' }}></span>
                <span style={{ transform: isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none', backgroundColor: '#fff' }}></span>
            </div>

            <ul style={styles.links} className={`nav-links ${isOpen ? 'open' : ''}`}>
                {sections.map(({ id, label }, index) => {
                    const isActive = activeSection === id;
                    return (
                        <li key={id} style={{ transitionDelay: `${index * 0.05}s`, margin: isOpen ? '15px 0' : '0' }}>
                            <div 
                                style={styles.linkWrapper(isActive)}
                                className={!isActive ? 'nav-link-item' : ''}
                                onClick={() => {
                                    setIsOpen(false);
                                    if (id === 'journal') {
                                        window.location.hash = '#/debrief';
                                    } else {
                                        const isOnDebrief = window.location.hash === '#/debrief';
                                        window.location.hash = `#${id}`;
                                        // If we are already on main page, scroll directly
                                        if (!isOnDebrief) {
                                            const element = document.getElementById(id);
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth' });
                                            }
                                        }
                                    }
                                }}
                            >
                                <span style={styles.link(isActive)}>
                                    {label}
                                </span>
                            </div>
                        </li>
                    );
                })}

                {/* Live telemetry in Navbar desktop */}
                {!isOpen && (
                    <div style={styles.telemetryHUD} className="nav-telemetry">
                        <div>LAP PROGRESS: <span style={styles.telemetryValue}>{scrollPercent}%</span></div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span className="f1-led-light f1-led-green" />
                            <span>TELEMETRY LIVE</span>
                        </div>
                    </div>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
