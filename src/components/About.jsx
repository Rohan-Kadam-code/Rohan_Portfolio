import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';
import useCountUp from '../hooks/useCountUp';

const StatItem = ({ target, suffix = '', label }) => {
    const { count, ref } = useCountUp(target, 2000, suffix);
    return (
        <div ref={ref} style={statStyles.statItem}>
            <span style={statStyles.statNumber}>{count}</span>
            <span style={statStyles.statLabel}>{label}</span>
        </div>
    );
};

const statStyles = {
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
            flexWrap: 'wrap',
            borderTop: '1px solid #333',
            paddingTop: '30px',
        },
    };

    return (
        <section id="about" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">
                        <GlitchText text="SYSTEM PROFILE" />
                        <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // ABOUT ME</span>
                    </h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    <RevealOnScroll animation="animate-slide-left">
                        <div style={styles.imagePlaceholder}>
                            <img src={`${import.meta.env.BASE_URL}DisplayPic.jpg`} alt="Rohan Kadam" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#111', objectPosition: 'center', position: 'absolute', top: 0, left: 0 }} />
                            <div style={styles.techOverlay}></div>
                        </div>
                    </RevealOnScroll>

                    <RevealOnScroll animation="animate-slide-left" delay={0.2}>
                        <div>
                            <h3 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>BRIDGING HARDWARE & SYSTEMS</h3>
                            <p style={{ marginBottom: '20px', color: '#ccc' }}>
                                I'm an embedded systems engineer with deep roots in powertrain design, now specializing in solutions architecture for automotive platforms. I bridge the gap between mechanical systems, embedded software, and E/E architecture — turning complex vehicle requirements into scalable, standards-compliant solutions.
                            </p>
                            <p style={{ color: '#ccc' }}>
                                My experience spans ICE powertrains, HV battery integration, and electrified platforms, with a strong focus on AUTOSAR, ISO 26262 functional safety, and model-based systems engineering. I am focused on the intersection of hardware and software, and I am passionate about creating solutions that are both innovative and sustainable.
                            </p>

                            <div style={styles.stats}>
                                <StatItem target={6} suffix="+" label="Years Exp." />
                                <StatItem target={3} suffix="" label="OEMs" />
                                <StatItem target={5} suffix="+" label="Platforms" />
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default About;
