import React from 'react';
import RevealOnScroll from './RevealOnScroll';

const About = () => {
    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-bg)',
            position: 'relative',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '50px',
            alignItems: 'center',
        },
        imagePlaceholder: {
            width: '100%',
            height: '400px',
            background: 'linear-gradient(45deg, #111, #222)',
            border: '1px solid #333',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        techOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: 'radial-gradient(var(--color-primary-dim) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.3,
        },
        stats: {
            display: 'flex',
            gap: '40px',
            marginTop: '30px',
            borderTop: '1px solid #333',
            paddingTop: '30px',
        },
        statItem: {
            display: 'flex',
            flexDirection: 'column',
        },
        statNumber: {
            fontSize: '2.5rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--color-primary)',
            lineHeight: 1,
        },
        statLabel: {
            fontSize: '0.9rem',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
    };

    return (
        <section id="about" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">DIAGNOSTICS <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}>// ABOUT ME</span></h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    <RevealOnScroll animation="animate-slide-left">
                        <div style={styles.imagePlaceholder}>
                            <img src="/profile.jpg" alt="Rohan Kadam" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', position: 'absolute', top: 0, left: 0 }} />
                            <div style={styles.techOverlay}></div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll animation="animate-slide-left" delay={0.2}>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>DRIVEN BY PRECISION</h3>
                            <p style={{ marginBottom: '20px', color: '#ccc' }}>
                                I am a Powertrain Engineer passionate about optimizing engine performance and efficiency. With a deep understanding of thermodynamics and fluid mechanics, I bridge the gap between theoretical design and real-world application.
                            </p>
                            <p style={{ color: '#ccc' }}>
                                My work focuses on calibration, thermal management, and hybrid integration, ensuring that every vehicle I work on delivers peak performance while meeting stringent emission standards.
                            </p>

                            <div style={styles.stats}>
                                <div style={styles.statItem}>
                                    <span style={styles.statNumber}>05</span>
                                    <span style={styles.statLabel}>Years Exp.</span>
                                </div>
                                <div style={styles.statItem}>
                                    <span style={styles.statNumber}>42</span>
                                    <span style={styles.statLabel}>Projects</span>
                                </div>
                                <div style={styles.statItem}>
                                    <span style={styles.statNumber}>100%</span>
                                    <span style={styles.statLabel}>Success</span>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default About;
