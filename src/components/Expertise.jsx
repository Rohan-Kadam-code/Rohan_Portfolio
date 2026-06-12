import React, { useState, useRef, useEffect } from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

const toolkitLayers = [
    {
        layer: 'BUS_01_NETWORKS',
        title: 'Protocols & Networks',
        items: [
            { name: 'CAN / CAN-FD', icon: 'fa-solid fa-bolt' },
            { name: 'LIN', icon: 'fa-solid fa-link' },
            { name: 'FlexRay', icon: 'fa-solid fa-project-diagram' },
            { name: 'Automotive Ethernet', icon: 'fa-solid fa-ethernet' },
            
        ]
    },
    {
        layer: 'BUS_02_STANDARDS',
        title: 'Architecture & Standards',
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
        layer: 'BUS_03_TOOLS',
        title: 'Tools & Platforms',
        items: [
            { name: 'Vector CANoe', icon: 'fa-solid fa-desktop' },
            { name: 'ETAS INCA', icon: 'fa-solid fa-wrench' },
            { name: 'MATLAB / Simulink', icon: 'devicon-matlab-plain' },
            { name: 'dSPACE HIL', icon: 'fa-solid fa-microchip' },
            { name: 'Git / Jenkins CI', icon: 'devicon-jenkins-plain' },
        ]
    },
    {
        layer: 'BUS_04_PHYSICS',
        title: 'CAD & Simulation',
        items: [
            { name: 'SolidWorks', icon: 'fa-solid fa-cube' },
            { name: 'CATIA', icon: 'fa-solid fa-plane' },
            { name: 'Creo', icon: 'fa-solid fa-pen-ruler' },
            { name: 'ANSYS', icon: 'fa-solid fa-wind' },
            { name: 'GT-Suite', icon: 'fa-solid fa-gauge-high' },
        ]
    },
    {
        layer: 'BUS_05_FIRMWARE',
        title: 'Languages & Embedded',
        items: [
            { name: 'Embedded C', icon: 'devicon-c-plain' },
            { name: 'C++ (MISRA)', icon: 'devicon-cplusplus-plain' },
            { name: 'Python', icon: 'devicon-python-plain' },
            { name: 'RTOS (FreeRTOS)', icon: 'fa-solid fa-stopwatch' },
            { name: 'Embedded Linux', icon: 'devicon-linux-plain' },
        ]
    },
    {
        layer: 'BUS_06_DATA_AI',
        title: 'AI & Data Engineering',
        items: [
            { name: 'LLM Integration', icon: 'fa-solid fa-brain' },
            { name: 'Agentic AI Systems', icon: 'fa-solid fa-robot' },
            { name: 'LangChain / RAG', icon: 'fa-solid fa-link' },
            { name: 'Data Analysis (Pandas)', icon: 'devicon-pandas-plain' },
            { name: 'ML Pipelines', icon: 'fa-solid fa-network-wired' },
        ]
    },
];

const accentColor = '#E10600';
const accentDim = 'rgba(225, 6, 0, 0.15)';

// Sub-component to render live dynamic sensor waves on hover
const LiveWave = () => {
    const [path, setPath] = useState('');

    useEffect(() => {
        let t = 0;
        const interval = setInterval(() => {
            let points = [];
            for (let x = 0; x <= 120; x += 5) {
                // Combine sine waves to simulate a telemetry sensor output (noise + harmonics)
                const y = 15 + Math.sin(x * 0.1 + t) * 8 + Math.cos(x * 0.05 + t * 0.5) * 4;
                points.push(`${x},${y}`);
            }
            setPath(`M ${points.join(' L ')}`);
            t += 0.25;
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <svg width="120" height="30" style={{ overflow: 'visible', opacity: 0.85 }}>
            <path d={path} fill="none" stroke="var(--color-secondary)" strokeWidth="1.5" />
        </svg>
    );
};

const ToolkitItem = ({ item }) => {
    const [isHovered, setIsHovered] = useState(false);

    const style = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        background: isHovered ? 'rgba(16, 16, 24, 0.9)' : 'var(--color-bg)',
        border: `1px solid ${isHovered ? accentColor : 'rgba(255, 255, 255, 0.03)'}`,
        borderRadius: '2px',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <i className={item.icon} style={{ 
                    fontSize: '1.1rem', 
                    color: isHovered ? accentColor : 'var(--color-text-muted)', 
                    transition: 'color 0.2s ease' 
                }}></i>
                <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    color: isHovered ? '#fff' : '#b2b2c2',
                    transition: 'color 0.2s ease',
                    fontWeight: 600,
                }}>{item.name}</span>
            </div>

            {/* Render dynamic waveform instead of static indicators when hovered */}
            {isHovered ? (
                <LiveWave />
            ) : (
                <div style={{ display: 'flex', gap: '3px' }}>
                    <span className="f1-led-light f1-led-green" style={{ width: '4px', height: '4px', opacity: 0.3 }} />
                    <span className="f1-led-light f1-led-green" style={{ width: '4px', height: '4px', opacity: 0.8 }} />
                </div>
            )}
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
            width: '3px',
            height: '100%',
            background: 'rgba(255,255,255,0.03)',
            position: 'absolute',
            left: 0,
            top: 0,
            borderRadius: '1px',
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
            paddingLeft: '25px',
        },
        layerHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
        },
        layerCode: {
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-secondary)',
            fontWeight: 'bold',
            background: 'rgba(0, 255, 102, 0.05)',
            padding: '2px 8px',
            borderRadius: '2px',
        },
        layerName: {
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: '#fff',
            fontWeight: 'bold',
        },
        itemsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
            gap: '12px',
        },
    };

    return (
        <section id="toolkit" style={styles.section}>
            <div className="container">
                <RevealOnScroll>
                    <h2 className="section-title">
                        <GlitchText text="QUALIFYING TOOLKIT" />
                        <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}> // TECHNICAL BUS CHANNELS</span>
                    </h2>
                </RevealOnScroll>

                <div style={styles.layerContainer}>
                    {toolkitLayers.map((layer, layerIndex) => (
                        <RevealOnScroll key={layerIndex} delay={layerIndex * 0.08}>
                            <div style={styles.layerCard}>
                                <AnimatedLayerBar delay={layerIndex * 0.1} />
                                <div style={styles.layerHeader}>
                                    <span style={styles.layerCode}>{layer.layer}</span>
                                    <span style={styles.layerName}>{layer.title}</span>
                                    <div style={{
                                        flex: 1,
                                        height: '1px',
                                        background: 'linear-gradient(90deg, rgba(255,255,255,0.05), transparent)',
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
