import React from 'react';
import RevealOnScroll from './RevealOnScroll';
import TiltCard from './TiltCard';
import GlitchText from './GlitchText';

const Projects = () => {
    const projects = [
        {
            title: 'CAN Bus Analyser & Diagnostic Platform',
            category: 'Embedded Systems / Automotive Diagnostics',
            desc: 'A production-grade diagnostic tool for real-time CAN/CAN-FD bus monitoring, DBC-based signal decoding, and UDS diagnostic session management. Features a modular architecture with pluggable protocol decoders and a Qt-based visualization dashboard for ECU communication analysis.',
            tags: ['C++', 'Embedded C', 'CAN Protocol', 'UDS', 'DBC', 'Qt', 'Python'],
            highlight: true,
            architecture: [
                'Hardware Abstraction Layer for multi-vendor CAN interfaces (PEAK, Vector, Kvaser)',
                'Protocol stack: Raw CAN → DBC Decode → UDS Service Layer',
                'Real-time filtering & logging engine with configurable trigger conditions',
            ]
        },
        {
            title: 'AI-Powered Systems Engineering Platform',
            category: 'MBSE / AI Architecture',
            desc: 'An intelligent platform that automates requirements decomposition and system architecture generation using LLMs. Converts natural language requirements into SysML-compatible block diagrams and interface definitions, streamlining the MBSE workflow.',
            tags: ['Python', 'LangChain', 'React', 'MBSE', 'SysML'],
            highlight: false,
            architecture: [
                'NLP pipeline for requirements parsing and traceability matrix generation',
                'Architecture inference engine mapping requirements → functional blocks',
                'Export layer: SysML XML, DOORS-compatible CSV, architecture diagrams',
            ]
        },
        {
            title: 'Connected Mobility Platform',
            category: 'V2X / IoT Solutions',
            desc: 'A full-stack connected vehicle application with real-time fleet telemetry, OTA update orchestration, and predictive maintenance alerts. Designed with SOA principles for scalable vehicle-cloud communication.',
            tags: ['React Native', 'Node.js', 'MQTT', 'Socket.io', 'REST API'],
            highlight: false,
            architecture: [
                'Event-driven microservice architecture for vehicle telemetry ingestion',
                'MQTT broker for low-latency V2C (Vehicle-to-Cloud) messaging',
                'Edge computing module for local decision-making and data aggregation',
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
        },
        card: (isHighlight) => ({
            background: isHighlight
                ? 'linear-gradient(180deg, #1a0808 0%, #0a0505 100%)'
                : 'linear-gradient(180deg, #111 0%, #080808 100%)',
            border: `1px solid ${isHighlight ? '#ff333355' : '#222'}`,
            padding: '40px',
            position: 'relative',
            cursor: 'pointer',
            height: '100%',
        }),
        featuredBadge: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'var(--color-primary)',
            color: '#fff',
            fontSize: '0.65rem',
            padding: '3px 10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },
        cardHeader: {
            marginBottom: '20px',
            borderBottom: '1px solid #222',
            paddingBottom: '20px',
        },
        category: {
            color: 'var(--color-secondary)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '10px',
            display: 'block',
        },
        title: {
            fontSize: '1.4rem',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.3,
        },
        desc: {
            color: '#aaa',
            marginBottom: '20px',
            fontSize: '0.95rem',
            lineHeight: 1.6,
        },
        archSection: {
            borderTop: '1px solid #1a1a1a',
            paddingTop: '15px',
            marginBottom: '20px',
        },
        archLabel: {
            fontSize: '0.7rem',
            color: 'var(--color-primary)',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginBottom: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: '600',
        },
        archItem: {
            fontSize: '0.85rem',
            color: '#888',
            marginBottom: '6px',
            display: 'flex',
            gap: '8px',
            lineHeight: 1.4,
        },
        tags: {
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
        },
        tag: {
            fontSize: '0.75rem',
            padding: '4px 10px',
            background: '#1a1a1a',
            color: '#888',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
        },
    };

    return (
        <section id="projects" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">
                        <GlitchText text="SYSTEM BUILDS" />
                        <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // SELECTED WORKS</span>
                    </h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    {projects.map((project, index) => (
                        <RevealOnScroll key={index} delay={index * 0.15}>
                            <TiltCard style={styles.card(project.highlight)}>
                                {project.highlight && (
                                    <div style={styles.featuredBadge}>★ FEATURED</div>
                                )}
                                <div style={styles.cardHeader}>
                                    <span style={styles.category}>{project.category}</span>
                                    <h3 style={styles.title}>{project.title}</h3>
                                </div>
                                <p style={styles.desc}>{project.desc}</p>

                                <div style={styles.archSection}>
                                    <div style={styles.archLabel}>Architecture Highlights</div>
                                    {project.architecture.map((item, i) => (
                                        <div key={i} style={styles.archItem}>
                                            <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>▸</span>
                                            <span>{item}</span>
                                        </div>
                                    ))}
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
