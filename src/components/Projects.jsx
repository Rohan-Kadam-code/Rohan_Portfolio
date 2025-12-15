import React from 'react';
import RevealOnScroll from './RevealOnScroll';

const Projects = () => {
    const projects = [
        {
            title: 'AI Systems Engineering Tool',
            category: 'AI & Systems Architecture',
            desc: 'An intelligent platform for automating requirements analysis and system architecture generation using LLMs. Streamlines the MBSE workflow.',
            tags: ['Python', 'LangChain', 'React', 'MBSE']
        },
        {
            title: 'Ride Sharing Application',
            category: 'Mobility Solutions',
            desc: 'A full-stack mobile application for real-time ride matching and route optimization. Features live tracking and secure payment integration.',
            tags: ['React Native', 'Node.js', 'Google Maps API', 'Socket.io']
        },
        {
            title: 'CAN Analyser Tool',
            category: 'Automotive Diagnostics',
            desc: 'A robust diagnostic tool for monitoring and decoding CAN bus traffic. essential for real-time vehicle network analysis and debugging.',
            tags: ['C++', 'Python', 'CAN Protocol', 'Qt']
        }
    ];

    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-bg)',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '40px',
        },
        card: {
            background: 'linear-gradient(180deg, #111 0%, #080808 100%)',
            border: '1px solid #222',
            padding: '40px',
            position: 'relative',
            transition: 'transform 0.3s ease, border-color 0.3s ease',
            cursor: 'pointer',
            height: '100%',
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
            fontSize: '1.5rem',
            fontFamily: 'var(--font-display)',
            lineHeight: 1.3,
        },
        desc: {
            color: '#aaa',
            marginBottom: '30px',
            fontSize: '1rem',
        },
        tags: {
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
        },
        tag: {
            fontSize: '0.75rem',
            padding: '5px 10px',
            background: '#1a1a1a',
            color: '#888',
            borderRadius: '2px',
            fontFamily: 'var(--font-mono)',
        },
        link: {
            marginTop: '30px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--color-primary)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            fontSize: '0.9rem',
        }
    };

    return (
        <section id="projects" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">BUILDS <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}>// SELECTED WORKS</span></h2>
                </RevealOnScroll>

                <div style={styles.grid}>
                    {projects.map((project, index) => (
                        <div key={index}
                            style={styles.card}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-primary)';
                                e.currentTarget.style.transform = 'translateY(-5px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = '#222';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={styles.cardHeader}>
                                <span style={styles.category}>{project.category}</span>
                                <h3 style={styles.title}>{project.title}</h3>
                            </div>
                            <p style={styles.desc}>{project.desc}</p>
                            <div style={styles.tags}>
                                {project.tags.map(tag => (
                                    <span key={tag} style={styles.tag}>{tag}</span>
                                ))}
                            </div>
                            <a href="#" style={styles.link}>
                                View Study <span>&rarr;</span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
