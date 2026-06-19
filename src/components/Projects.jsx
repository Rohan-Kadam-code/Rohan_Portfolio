import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import TiltCard from './TiltCard';
import GlitchText from './GlitchText';

const Projects = () => {
    const projects = [
        {
            title: 'AI-Powered Systems Engineering Platform (AISE)',
            category: 'MBSE / AI APPLICATIONS',
            desc: 'An intelligent systems engineering platform automating requirements decomposition and trace matrices using LLMs. Instantly maps natural language system requirements into SysML-compliant block definitions and interface contracts.',
            tags: ['Python', 'LangChain', 'React', 'MBSE', 'SysML', 'RAG'],
            highlight: false,
            status: 'STABLE_RELEASE',
            safety: 'ASIL-A COMPLIANT',
            architecture: [
                'Semantic requirements parser generating bi-directional trace links',
                'SysML architecture inference mapping stakeholder inputs -> interfaces',
                'Export layers for SysML XML, IBM DOORS, and schema diagrams',
            ]
        },
        {
            title: 'F1 Telemetry & 3D Race Visualisation',
            category: 'VEHICLE KINETICS / WEBGL SIMULATION',
            desc: 'A real-time telemetry streaming and interactive 3D visualization dashboard. Decodes live CAN and sensor streams over WebSockets to render vehicle kinetics, tire thermal zones, and track positioning in a high-performance WebGL-based 3D environment.',
            tags: ['React', 'Three.js', 'WebGL', 'WebSockets', 'MQTT', 'Python', 'Node.js'],
            highlight: true,
            status: 'TELEMETRY_STREAMING',
            safety: 'REAL-TIME LOGGED',
            architecture: [
                'WebSocket server ingestion layer processing high-frequency sensor telemetry',
                'Interactive 3D WebGL scene displaying vehicle chassis orientation, velocity vectors, and tire temps',
                'Interactive track overlay with GPS mapping and predictive lap timing overlays',
            ]
        }
    ];

    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-bg)',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
        },
        card: (isHighlight) => ({
            background: 'var(--color-surface)',
            border: `1px solid ${isHighlight ? 'rgba(225, 6, 0, 0.3)' : 'rgba(255, 255, 255, 0.04)'}`,
            borderTop: `4px solid ${isHighlight ? 'var(--color-primary)' : 'var(--color-text-muted)'}`,
            padding: '35px',
            position: 'relative',
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            borderRadius: '4px',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            boxShadow: isHighlight ? '0 15px 35px rgba(225, 6, 0, 0.08)' : 'none',
        }),
        featuredBadge: {
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.65rem',
            padding: '2px 8px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            letterSpacing: '1px',
            borderRadius: '2px',
        },
        cardHeader: {
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            paddingBottom: '15px',
        },
        category: {
            color: 'var(--color-secondary)',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1.5px',
            marginBottom: '8px',
            display: 'block',
            fontWeight: 700,
        },
        title: {
            fontSize: '1.35rem',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.25,
            color: '#fff',
        },
        desc: {
            color: 'var(--color-text-muted)',
            marginBottom: '20px',
            fontSize: '0.9rem',
            lineHeight: 1.5,
        },
        specBox: {
            background: 'var(--color-bg)',
            padding: '12px 18px',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: '#8e8e9e',
            marginBottom: '20px',
            borderLeft: '2px solid rgba(255, 255, 255, 0.05)',
        },
        specLine: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
        },
        tags: {
            display: 'flex',
            gap: '6px',
            flexWrap: 'wrap',
            marginTop: 'auto',
        },
        tag: {
            fontSize: '0.7rem',
            padding: '3px 8px',
            background: 'var(--color-bg)',
            color: '#bbb',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
            border: '1px solid rgba(255,255,255,0.03)',
        },
    };

    return (
        <section id="projects" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">
                        <GlitchText text="GARAGE BUILDS" />
                        <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // SELECTED AUTOMOTIVE NODES</span>
                    </h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    {projects.map((project, index) => (
                        <RevealOnScroll key={index} delay={index * 0.12}>
                            <TiltCard style={styles.card(project.highlight)}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span className={`f1-led-light ${project.highlight ? 'f1-led-red' : 'f1-led-green'}`} />
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666' }}>
                                                {project.status}
                                            </span>
                                        </div>
                                        {project.highlight && (
                                            <div style={styles.featuredBadge}>★ OVERTAKE ACTIVE</div>
                                        )}
                                    </div>
                                    
                                    <div style={styles.cardHeader}>
                                        <span style={styles.category}>{project.category}</span>
                                        <h3 style={styles.title}>{project.title}</h3>
                                    </div>
                                    
                                    <p style={styles.desc}>{project.desc}</p>

                                    {/* HUD Specifications Area */}
                                    <div style={styles.specBox}>
                                        <div style={styles.specLine}>
                                            <span>SAFETY RATING</span>
                                            <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{project.safety}</span>
                                        </div>
                                        <div style={{ borderTop: '1px dashed rgba(255,255,255,0.05)', margin: '8px 0' }} />
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#666', marginBottom: '6px', textTransform: 'uppercase' }}>
                                            ECU ARCHITECTURE SPECS:
                                        </div>
                                        {project.architecture.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', lineHeight: 1.3 }}>
                                                <span style={{ color: 'var(--color-secondary)' }}>▸</span>
                                                <span>{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.tags}>
                                    {project.tags.map(tag => (
                                        <span key={tag} style={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </TiltCard>
                        </RevealOnScroll>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
