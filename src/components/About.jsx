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
        background: 'var(--color-bg)',
        padding: '15px 25px',
        borderLeft: '3px solid var(--color-primary)',
        borderRadius: '2px',
        flex: '1 1 120px',
    },
    statNumber: {
        fontSize: '2.2rem',
        fontFamily: 'var(--font-display)',
        color: '#fff',
        fontWeight: 'bold',
        lineHeight: 1.1,
    },
    statLabel: {
        fontSize: '0.75rem',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        marginTop: '5px',
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
    },
};

const SkillMeter = ({ label, percentage }) => {
    return (
        <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '6px', letterSpacing: '1px' }}>
                <span style={{ color: '#fff' }}>{label}</span>
                <span style={{ color: 'var(--color-secondary)' }}>{percentage}% EFFICIENCY</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--color-surface-hover)', borderRadius: '1px', overflow: 'hidden' }}>
                <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', borderRadius: '1px', boxShadow: '0 0 10px rgba(225,6,0,0.3)' }} />
            </div>
        </div>
    );
};

const About = () => {
    const getExperienceYears = () => {
        const startDate = new Date(2019, 6, 1); // July 1, 2019
        const currentDate = new Date();
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();
        if (months < 0) {
            years--;
        }
        return years;
    };
    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-bg)',
            position: 'relative',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '60px',
            alignItems: 'start',
        },
        driverCard: {
            background: 'var(--color-surface)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderTop: '4px solid var(--color-primary)',
            borderRadius: '4px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        },
        imageContainer: {
            width: '100%',
            height: '380px',
            position: 'relative',
            background: 'var(--color-bg)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
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
            backgroundSize: '16px 16px',
            opacity: 0.2,
        },
        driverNumber: {
            position: 'absolute',
            bottom: '-15px',
            right: '10px',
            fontFamily: 'var(--font-display)',
            fontSize: '8rem',
            fontWeight: '900',
            color: 'rgba(255, 255, 255, 0.03)',
            lineHeight: '0.8',
            fontStyle: 'italic',
        },
        driverMeta: {
            padding: '25px',
        },
        metaGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginTop: '15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '15px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
        },
        metaLabel: {
            color: 'var(--color-text-muted)',
            display: 'block',
            fontSize: '0.75rem',
            letterSpacing: '1px',
        },
        metaValue: {
            color: '#fff',
            fontWeight: 'bold',
            marginTop: '2px',
            display: 'block',
        },
        stats: {
            display: 'flex',
            gap: '20px',
            marginTop: '30px',
            flexWrap: 'wrap',
        },
        skillSection: {
            marginTop: '35px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: '25px',
        }
    };

    return (
        <section id="about" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">
                        <GlitchText text="PILOT PROFILE" />
                        <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // SESSION DATA</span>
                    </h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    {/* Column 1: F1 Pilot Card */}
                    <RevealOnScroll animation="animate-slide-left">
                        <div style={styles.driverCard} className="driver-profile-card">
                            <div style={styles.imageContainer}>
                                <img
                                    src={`${import.meta.env.BASE_URL}DisplayPic.jpg`}
                                    alt="Rohan Kadam"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'contain',
                                        objectPosition: 'center',
                                        zIndex: 2,
                                    }}
                                />
                                <div style={styles.techOverlay}></div>
                                <div style={styles.driverNumber}>23</div>
                            </div>
                            <div style={styles.driverMeta}>
                                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px' }}>
                                    TEAM COGNIZANT (STELLANTIS)
                                </span>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '5px', color: '#fff', fontFamily: 'var(--font-display)' }}>
                                    ROHAN KADAM
                                </h3>

                                <div style={styles.metaGrid}>
                                    <div>
                                        <span style={styles.metaLabel}>ROLE</span>
                                        <span style={styles.metaValue}>Systems Engineer</span>
                                    </div>
                                    <div>
                                        <span style={styles.metaLabel}>ACTIVE SINCE</span>
                                        <span style={styles.metaValue}>2019</span>
                                    </div>
                                    <div>
                                        <span style={styles.metaLabel}>SPECIALIZATION</span>
                                        <span style={styles.metaValue}>Powertrain Systems</span>
                                    </div>
                                    <div>
                                        <span style={styles.metaLabel}>LOCATION</span>
                                        <span style={styles.metaValue}>Pune, India</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>

                    {/* Column 2: Bio & Performance Metrics */}
                    <RevealOnScroll animation="animate-slide-left" delay={0.2}>
                        <div>
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '20px', fontFamily: 'var(--font-display)', color: '#fff' }}>
                                DESIGNING POWERTRAINS
                            </h3>
                            <p style={{ marginBottom: '20px', color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                Automotive Powertrain Systems Engineer with deep roots in high-performance automotive platforms. I bridge the complex interfaces between mechanical design, embedded software, and E/E configurations — transforming vehicle requirements into production-ready vehicle features.
                            </p>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                My experience spans ICE, BEV and Hybrid powertrain layouts, High Voltage Battery Integration, and electrified micro-mobility platforms. Expericed in requirements elicitation, model-based engineering (SysML), control algorithms development, calibration and knowledge in ISO 26262 functional safety standards.
                            </p>

                            <div style={styles.stats}>
                                <StatItem target={getExperienceYears()} suffix="+" label="Years Exp." />
                                <StatItem target={3} suffix="" label="Oems" />
                                <StatItem target={5} suffix="+" label="Platforms" />
                            </div>

                            {/* F1 HUD Skill Meters */}
                            <div style={styles.skillSection}>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#fff', marginBottom: '20px', letterSpacing: '1px' }}>
                                    SYSTEM DIAGNOSTIC CAPABILITY
                                </div>
                                <SkillMeter label="REQUIREMENT MANAGEMENT" percentage={95} />
                                <SkillMeter label="MODEL-BASED SYSTEMS ENGINEERING (SysML)" percentage={88} />
                                <SkillMeter label="FUNCTIONAL SAFETY SIGN-OFFS (ISO 26262)" percentage={70} />
                                <SkillMeter label="POWERTRAIN ARCHITECTURE" percentage={90} />
                                <SkillMeter label="DFMEA" percentage={95} />
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </section>
    );
};

export default About;
