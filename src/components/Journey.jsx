import React, { useEffect, useState, useRef } from 'react';
import RevealOnScroll from './RevealOnScroll';
import GlitchText from './GlitchText';

const Journey = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeStop, setActiveStop] = useState(null);
    const containerRef = useRef(null);

    const stops = [
        {
            id: 1,
            name: "Veloce Racing",
            role: "Brake Systems Design",
            year: "Test Lap",
            align: "left",
            details: [
                "Designed hydraulic brake control circuits with sensor integration for Formula Student race car.",
                "Designed and optimized brake balance bar assembly based on real-time data acquired during track testing.",
                "Performed FEA thermal analysis (ANSYS) on brake rotors — first exposure to simulation-driven design."
            ]
        },
        {
            id: 2,
            name: "TATA Technologies",
            role: "Powertrain Design Lead — 3T Forklifts",
            year: "Lap 1 • 2019–2023",
            align: "right",
            details: [
                "Led complete powertrain design for 3D/E forklifts, simulating 50+ engine-transmission combinations for optimal performance.",
                "Conducted comprehensive benchmarking and ROI analysis to propose cost-effective, high-performance powertrain architectures.",
                "Validated systems on-site and prepared detailed engineering documentation, calculations, and interface specifications.",
                "Collaborated on embedded integration: fleet management strategy, IoT connectivity modules, and sensor selection."
            ]
        },
        {
            id: 3,
            name: "Mahindra & Mahindra",
            role: "Thermal Systems Architecture",
            year: "Lap 2 • 2023–2024",
            align: "left",
            details: [
                "Owned end-to-end thermal management architecture: 1D/3D CFD for radiator, intercooler, and EGR cooler sizing; validated in wind tunnel with hands-on instrumentation and sensor rigs.",
                "Conducted data acquisition and post-processing analysis; drove design improvements through iterative test-analyze-fix cycles with full documented signoffs.",
                "Designed accelerator pedal module from concept to tooling completion — including technology selection, mechanical packaging design, and ASIL C functional safety signoffs.",
                "Followed OEM product development practices: PPAP, DFMEA, quality gateway reviews, and warranty signoff processes aligned with Mahindra's APQP framework.",
                "Defined coolant circuit topology and fan control architecture with CAN-based speed modulation under varying duty cycles."
            ]
        },
        {
            id: 4,
            name: "Cognizant (Stellantis)",
            role: "Feature Owner — Range & Powerflow Systems",
            year: "Lap 3 • 2024–Present",
            align: "right",
            details: [
                "Feature owner for Range Estimation and Powerflow management — end-to-end ownership from requirements through validation.",
                "Authoring, reviewing, and releasing system requirements using DOORS Next Gen; maintaining full traceability from stakeholder needs to system specs.",
                "Led a process improvement initiative to develop an internal DOORS NXG alternative, streamlining requirements management workflows across teams.",
                "Performing requirements validation and calibration through ETAS INCA — verifying system behavior against specification on HIL and vehicle.",
                "Creating and maintaining system architecture models in IBM Rhapsody using SysML — defining block definitions, activity diagrams, and interface contracts.",
                "Driving cross-functional issue resolution across powertrain controls, calibration, and integration teams for production release milestones."
            ]
        }
    ];

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const height = containerRef.current.offsetHeight;
                const windowHeight = window.innerHeight;

                let scrollPercent = (windowHeight / 2 - rect.top) / height;
                let progress = Math.max(0, Math.min(0.98, scrollPercent));

                setScrollProgress(progress * 100);

                let foundActive = null;
                if (progress < 0.22) foundActive = 1;
                else if (progress >= 0.22 && progress < 0.47) foundActive = 2;
                else if (progress >= 0.47 && progress < 0.72) foundActive = 3;
                else if (progress >= 0.72) foundActive = 4;

                setActiveStop(foundActive);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const styles = {
        section: {
            padding: '100px 0',
            background: 'var(--color-bg)',
            position: 'relative',
            overflow: 'hidden'
        },
        trackContainer: {
            position: 'relative',
            maxWidth: '1200px',
            margin: '0 auto',
            minHeight: '2800px',
            padding: '100px 0 600px 0'
        },
        centerLine: {
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '60px',
            background: '#333',
            transform: 'translateX(-50%)',
            backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.2) 50%)',
            backgroundSize: '100% 40px',
            borderLeft: '5px dashed rgba(255, 51, 51, 0.5)',
            borderRight: '5px dashed rgba(255, 51, 51, 0.5)',
            zIndex: 1
        },
        kerbs: {
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '80px',
            transform: 'translateX(-50%)',
            background: 'repeating-linear-gradient(45deg, #cc0000, #cc0000 10px, #ffffff 10px, #ffffff 20px)',
            zIndex: 0,
            opacity: 0.8
        },
        car: {
            position: 'absolute',
            left: '50%',
            top: `${scrollProgress}%`,
            transform: 'translate(-50%, -50%) rotate(180deg)',
            width: '40px',
            height: '80px',
            zIndex: 5,
            transition: 'top 0.1s linear',
            filter: 'drop-shadow(0 0 15px var(--color-primary))'
        },
        stopNode: (align, index) => ({
            position: 'absolute',
            top: `${8 + index * 22}%`,
            width: '50%',
            left: align === 'right' ? '50%' : '0',
            display: 'flex',
            justifyContent: align === 'right' ? 'flex-start' : 'flex-end',
            padding: align === 'right' ? '0 0 0 80px' : '0 80px 0 0',
            boxSizing: 'border-box',
            zIndex: 3,
        }),
        stopContent: (align, isActive) => ({
            background: isActive ? 'rgba(0, 0, 0, 0.95)' : 'rgba(20, 20, 20, 0.6)',
            border: '1px solid #333',
            borderLeft: align === 'right' ? `4px solid ${isActive ? '#fff' : 'var(--color-secondary)'}` : '1px solid #333',
            borderRight: align === 'left' ? `4px solid ${isActive ? '#fff' : 'var(--color-primary)'}` : '1px solid #333',
            padding: isActive ? '30px' : '20px',
            position: 'relative',
            backdropFilter: 'blur(5px)',
            boxShadow: isActive ? '0 0 40px rgba(255, 51, 51, 0.3)' : '0 10px 30px rgba(0,0,0,0.5)',
            borderRadius: '4px',
            maxWidth: isActive ? '500px' : '350px',
            width: '100%',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            transform: isActive ? (align === 'left' ? 'translateX(-20px) scale(1.05)' : 'translateX(20px) scale(1.05)') : 'translateX(0) scale(1)',
            opacity: isActive ? 1 : 0.7
        }),
        markerLine: (align, isActive) => ({
            position: 'absolute',
            top: '50%',
            [align === 'left' ? 'right' : 'left']: isActive ? '-90px' : '-80px',
            width: isActive ? '90px' : '80px',
            height: '2px',
            background: align === 'left' ? 'var(--color-primary)' : 'var(--color-secondary)',
            transition: 'all 0.3s ease'
        }),
        pitLabel: (align, isActive) => ({
            position: 'absolute',
            top: '-15px',
            [align === 'left' ? 'right' : 'left']: '0',
            background: isActive ? '#fff' : (align === 'left' ? 'var(--color-primary)' : 'var(--color-secondary)'),
            color: '#000',
            fontSize: '0.7rem',
            padding: '2px 8px',
            fontWeight: 'bold',
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            transition: 'all 0.3s ease'
        }),
        role: {
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            marginBottom: '5px',
            fontFamily: 'var(--font-display)'
        },
        company: {
            color: '#aaa',
            fontSize: '1rem',
            fontFamily: 'var(--font-mono)'
        },
        details: {
            marginTop: '15px',
            borderTop: '1px solid #333',
            paddingTop: '15px',
            listStyle: 'none',
        },
        detailItem: {
            color: '#bbb',
            fontSize: '0.82rem',
            marginBottom: '6px',
            display: 'flex',
            gap: '8px',
            lineHeight: 1.35,
        }
    };

    return (
        <section id="journey" style={styles.section}>
            <div className="container" ref={containerRef}>
                <RevealOnScroll>
                    <h2 className="section-title"><GlitchText text="CAREER CIRCUIT" /> <span style={{ fontSize: '0.5em', color: 'var(--color-text-muted)' }}>// PIT STOPS</span></h2>
                </RevealOnScroll>

                <div style={styles.trackContainer}>
                    {/* Track Visuals */}
                    <div style={styles.kerbs}></div>
                    <div style={styles.centerLine}></div>

                    {/* F1 Car SVG Representation */}
                    <div style={styles.car}>
                        <svg viewBox="0 0 60 120" fill="none" style={{ overflow: 'visible' }}>
                            {/* Rear Wing */}
                            <path d="M10 105 H50 V115 H10 Z" fill="#fff" />
                            <rect x="10" y="108" width="40" height="5" fill="#cc0000" />

                            {/* Rear Suspension */}
                            <line x1="20" y1="90" x2="5" y2="90" stroke="#333" strokeWidth="4" />
                            <line x1="40" y1="90" x2="55" y2="90" stroke="#333" strokeWidth="4" />

                            {/* Rear Tires */}
                            <rect x="0" y="80" width="14" height="24" rx="4" fill="#151515" />
                            <rect x="46" y="80" width="14" height="24" rx="4" fill="#151515" />
                            <rect x="2" y="85" width="10" height="14" fill="#222" opacity="0.5" />
                            <rect x="48" y="85" width="10" height="14" fill="#222" opacity="0.5" />

                            {/* Main Body */}
                            <path d="M30 10 Q 38 30 40 50 V 95 H 20 V 50 Q 22 30 30 10 Z" fill="#cc0000" />
                            <path d="M30 10 L 30 95" stroke="#aa0000" strokeWidth="1" />

                            {/* Sidepods */}
                            <path d="M15 55 Q 10 60 10 90 H 20 V 55 Z" fill="#cc0000" />
                            <path d="M45 55 Q 50 60 50 90 H 40 V 55 Z" fill="#cc0000" />

                            {/* Cockpit */}
                            <ellipse cx="30" cy="60" rx="5" ry="10" fill="#222" />
                            <circle cx="30" cy="58" r="3.5" fill="#ffcc00" />

                            {/* Front Suspension */}
                            <line x1="25" y1="30" x2="10" y2="30" stroke="#333" strokeWidth="3" />
                            <line x1="35" y1="30" x2="50" y2="30" stroke="#333" strokeWidth="3" />

                            {/* Front Tires */}
                            <rect x="2" y="20" width="12" height="20" rx="3" fill="#151515" />
                            <rect x="46" y="20" width="12" height="20" rx="3" fill="#151515" />

                            {/* Front Wing */}
                            <path d="M12 5 L48 5 L52 12 H8 L12 5Z" fill="#fff" />
                            <path d="M5 12 H55 V16 H5 Z" fill="#cc0000" />
                        </svg>
                    </div>

                    {stops.map((stop, index) => {
                        const isActive = activeStop === stop.id;
                        return (
                            <div key={index} style={styles.stopNode(stop.align, index)}>
                                <div style={styles.stopContent(stop.align, isActive)}>
                                    <div style={styles.markerLine(stop.align, isActive)}></div>
                                    <div style={styles.pitLabel(stop.align, isActive)}>
                                        {isActive ? 'PIT BOX ACTIVE' : `PIT STOP ${stop.id}`}
                                    </div>
                                    <h3 style={styles.role}>{stop.role}</h3>
                                    <div style={styles.company}>{stop.name}</div>
                                    <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#666' }}>
                                        {stop.year}
                                    </div>

                                    {isActive && (
                                        <ul style={styles.details} className="animate-fade-in">
                                            {stop.details.map((detail, i) => (
                                                <li key={i} style={styles.detailItem}>
                                                    <span style={{ color: 'var(--color-primary)' }}>»</span> {detail}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Journey;
