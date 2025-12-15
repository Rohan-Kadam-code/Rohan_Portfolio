import React from 'react';
import RevealOnScroll from './RevealOnScroll';

const Expertise = () => {
    const skills = [
        { name: 'Engine Calibration', level: 95, category: 'Powertrain' },
        { name: 'Thermal Analysis', level: 90, category: 'Powertrain' },
        { name: 'Hybrid Systems', level: 85, category: 'Powertrain' },
        { name: 'MATLAB / Simulink', level: 88, category: 'Software' },
        { name: 'GT-Power', level: 92, category: 'Software' },
        { name: 'SolidWorks', level: 80, category: 'CAD' },
    ];

    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-surface)',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
        },
        card: {
            background: 'var(--color-bg)',
            padding: '30px',
            border: '1px solid #222',
            transition: 'all 0.3s ease',
            height: '100%',
        },
        skillName: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.1rem',
        },
        progressBar: {
            height: '4px',
            background: '#222',
            width: '100%',
            position: 'relative',
        },
        progressFill: (level) => ({
            height: '100%',
            width: `${level}%`,
            background: 'var(--color-primary)',
            boxShadow: '0 0 10px var(--color-primary-dim)',
        }),
        category: {
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            marginBottom: '20px',
            display: 'block',
        }
    };

    return (
        <section id="expertise" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">TECHNICAL SPECS <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}>// SKILLS</span></h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    {skills.map((skill, index) => (
                        <RevealOnScroll key={index} delay={index * 0.1}>
                            <div style={styles.card} className="skill-card">
                                <span style={styles.category}>{skill.category}</span>
                                <div style={styles.skillName}>
                                    <span>{skill.name}</span>
                                    <span style={{ color: 'var(--color-primary)' }}>{skill.level}%</span>
                                </div>
                                <div style={styles.progressBar}>
                                    <div style={styles.progressFill(skill.level)}></div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Expertise;
