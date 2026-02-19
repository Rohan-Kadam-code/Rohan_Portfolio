import React, { useState, useRef, useEffect } from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

const toolkitLayers = [
    {
        layer: 'Protocols & Networks',
        items: [
            { name: 'CAN / CAN-FD', icon: 'fa-solid fa-bolt' },
            { name: 'LIN', icon: 'fa-solid fa-link' },
            { name: 'FlexRay', icon: 'fa-solid fa-project-diagram' },
            { name: 'Automotive Ethernet', icon: 'fa-solid fa-ethernet' },
            { name: 'UDS / DoIP', icon: 'fa-solid fa-stethoscope' },
            { name: 'XCP / A2L', icon: 'fa-solid fa-satellite-dish' },
        ]
    },
    {
        layer: 'Architecture & Standards',
        items: [
            { name: 'AUTOSAR Classic', icon: 'fa-solid fa-layer-group' },
            { name: 'AUTOSAR Adaptive', icon: 'fa-solid fa-cubes' },
            { name: 'ISO 26262', icon: 'fa-solid fa-shield-halved' },
            { name: 'ASPICE', icon: 'fa-solid fa-list-check' },
            { name: 'V-Model', icon: 'fa-solid fa-check-double' },
            { name: 'MBSE / SysML', icon: 'fa-solid fa-sitemap' },
        ]
    },
    {
        layer: 'Tools & Platforms',
        items: [
            { name: 'Vector CANoe', icon: 'fa-solid fa-desktop' },
            { name: 'ETAS INCA', icon: 'fa-solid fa-wrench' },
            { name: 'MATLAB / Simulink', icon: 'devicon-matlab-plain' },
            { name: 'dSPACE HIL', icon: 'fa-solid fa-microchip' },
            { name: 'Git / Jenkins CI', icon: 'devicon-jenkins-plain' },
        ]
    },
    {
        layer: 'CAD & Simulation',
        items: [
            { name: 'SolidWorks', icon: 'fa-solid fa-cube' },
            { name: 'CATIA', icon: 'fa-solid fa-plane' },
            { name: 'Creo', icon: 'fa-solid fa-pen-ruler' },
            { name: 'FreeCAD', icon: 'fa-solid fa-box-open' },
            { name: 'ANSYS', icon: 'fa-solid fa-wind' },
            { name: 'GT-Suite', icon: 'fa-solid fa-gauge-high' },
        ]
    },
    {
        layer: 'Languages & Embedded',
        items: [
            { name: 'Embedded C', icon: 'devicon-c-plain' },
            { name: 'C++ (MISRA)', icon: 'devicon-cplusplus-plain' },
            { name: 'Python', icon: 'devicon-python-plain' },
            { name: 'RTOS (FreeRTOS)', icon: 'fa-solid fa-stopwatch' },
            { name: 'Embedded Linux (Yocto)', icon: 'devicon-linux-plain' },
        ]
    },
    {
        layer: 'AI & Data Engineering',
        items: [
            { name: 'LLM Integration', icon: 'fa-solid fa-brain' },
            { name: 'Agentic AI Systems', icon: 'fa-solid fa-robot' },
            { name: 'LangChain / RAG', icon: 'fa-solid fa-link' },
            { name: 'Data Analysis (Pandas)', icon: 'devicon-pandas-plain' },
            { name: 'Prompt Engineering', icon: 'fa-solid fa-comment-dots' },
            { name: 'ML Pipelines', icon: 'fa-solid fa-network-wired' },
        ]
    },
];

const accentColor = '#ff3333';
const accentDim = '#ff333322';

const ToolkitItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);

    const style = {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 16px',
        background: isHovered ? 'rgba(255, 51, 51, 0.06)' : 'var(--color-bg)',
        border: `1px solid ${isHovered ? accentColor : '#222'}`,
        borderRadius: '4px',
        transition: 'all 0.3s ease',
        cursor: 'default',
        boxShadow: isHovered ? `0 0 15px ${accentDim}` : 'none',
        transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    };

    return (
        <div
            style={style}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <i className={item.icon} style={{ fontSize: '1.2rem', color: isHovered ? accentColor : '#666', transition: 'color 0.3s ease' }}></i>
            <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.9rem',
                color: isHovered ? '#fff' : '#bbb',
                transition: 'color 0.3s ease',
            }}>{item.name}</span>
        </div>
    );
};

const AnimatedLayerBar = ({ delay }) => {
    const [width, setWidth] = useState(0);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setWidth(100), delay * 1000 + 100);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [delay]);

    return (
        <div ref={ref} style={{
            width: '4px',
            height: '100%',
            background: '#222',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '2px',
            overflow: 'hidden',
        }}>
            <div style={{
                width: '100%',
                height: `${width}%`,
                background: accentColor,
                transition: 'height 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: `0 0 10px ${accentDim}`,
            }} />
        </div>
    );
};

const Expertise = () => {
    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-surface)',
        },
        layerContainer: {
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
        },
        layerCard: {
            position: 'relative',
            paddingLeft: '20px',
        },
        layerHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
        },
        layerName: {
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: accentColor,
        },
        itemsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
        },
    };

    return (
        <section id="toolkit" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">
                        <GlitchText text="ARCHITECTURE TOOLKIT" />
                        <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // TECH STACK</span>
                    </h2>
                </RevealOnScroll>

                <div style={styles.layerContainer}>
                    {toolkitLayers.map((layer, layerIndex) => (
                        <RevealOnScroll key={layerIndex} delay={layerIndex * 0.1}>
                            <div style={styles.layerCard}>
                                <AnimatedLayerBar delay={layerIndex * 0.15} />
                                <div style={styles.layerHeader}>
                                    <span style={styles.layerName}>{layer.layer}</span>
                                    <div style={{
                                        flex: 1,
                                        height: '1px',
                                        background: `linear-gradient(90deg, ${accentDim}, transparent)`,
                                    }} />
                                </div>
                                <div style={styles.itemsGrid}>
                                    {layer.items.map((item, itemIndex) => (
                                        <ToolkitItem key={itemIndex} item={item} />
                                    ))}
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
