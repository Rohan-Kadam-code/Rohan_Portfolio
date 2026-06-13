import React, { useState, useEffect, useRef } from 'react';
import '../index.css';
import MagneticButton from './MagneticButton';

// Wide horizontal F1-style circuit
const BG_TRACK = "M 110,420 L 780,420 C 880,420 950,390 960,320 C 968,255 920,210 840,210 L 700,210 C 672,210 655,222 645,248 L 625,288 C 614,308 598,318 575,318 L 495,318 C 472,318 456,308 447,284 L 427,244 C 417,222 400,210 374,210 L 240,210 C 152,210 92,258 84,330 C 76,392 92,420 110,420 Z";

const TrackBackground = () => {
    const carRef = useRef(null);
    const pathRef = useRef(null);
    const animFrameRef = useRef(null);
    const progressRef = useRef(0);

    useEffect(() => {
        let totalLen = 0;
        const animate = () => {
            if (!pathRef.current || !carRef.current) {
                animFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            if (!totalLen) totalLen = pathRef.current.getTotalLength();
            progressRef.current = (progressRef.current + 0.7) % totalLen;
            const p1 = pathRef.current.getPointAtLength(progressRef.current);
            const p2 = pathRef.current.getPointAtLength((progressRef.current + 3) % totalLen);
            const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
            carRef.current.setAttribute('transform', `translate(${p1.x}, ${p1.y}) rotate(${angle})`);
            animFrameRef.current = requestAnimationFrame(animate);
        };
        animFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, []);

    return (
        <svg viewBox="0 0 1080 660" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }} preserveAspectRatio="xMidYMid meet">
            <path ref={pathRef} d={BG_TRACK} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="26" strokeLinecap="round" strokeLinejoin="round" />
            <path d={BG_TRACK} fill="none" stroke="rgba(225,6,0,0.08)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <g ref={carRef}>
                <rect x="-8" y="-4" width="16" height="8" fill="#E10600" rx="1.5" opacity="0.95" />
                <rect x="4" y="-5" width="3" height="10" fill="#111" rx="1" />
                <rect x="-8" y="-5" width="2" height="10" fill="#ccc" rx="1" />
                <circle cx="-4" cy="-5" r="2.5" fill="#111" />
                <circle cx="-4" cy="5" r="2.5" fill="#111" />
                <circle cx="4" cy="-5" r="2.5" fill="#111" />
                <circle cx="4" cy="5" r="2.5" fill="#111" />
            </g>
        </svg>
    );
};

const StatRow = ({ label, value, accent, big }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#666', letterSpacing: '1.5px', textTransform: 'uppercase' }}>{label}</span>
        <span style={{ fontFamily: big ? 'var(--font-display)' : 'var(--font-mono)', fontSize: big ? '1.6rem' : '0.82rem', fontStyle: big ? 'italic' : 'normal', color: accent || '#ddd', fontWeight: big ? 900 : 600, lineHeight: 1.1 }}>{value}</span>
    </div>
);

const Hero = () => {
    const [text, setText] = useState('');
    const [speed, setSpeed] = useState(280);
    const [rpm, setRpm] = useState(11000);
    const [gear, setGear] = useState(7);
    const [drsActive, setDrsActive] = useState(false);
    const [lapTime, setLapTime] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 1024);
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getExperience = () => {
        const startDate = new Date(2019, 6, 1); // July 1, 2019
        const currentDate = new Date();
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();
        if (months < 0) {
            years--;
            months += 12;
        }
        if (months === 0) {
            return `${years} YRS`;
        }
        return `${years} YRS ${months} MOS`;
    };

    const fullText = "Architecting Powertrains & Engineering Future Vehicles.";

    useEffect(() => {
        let index = 0;
        const timer = setInterval(() => { setText(fullText.slice(0, index)); index++; if (index > fullText.length) clearInterval(timer); }, 22);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const t = setInterval(() => setLapTime(p => p + 1), 1000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSpeed(prev => {
                const target = drsActive ? 352 : 336;
                if (prev < target - 2) return prev + Math.floor(Math.random() * 4) + 1;
                if (prev > target + 2) return prev - Math.floor(Math.random() * 4) - 1;
                return target + (Math.random() > 0.5 ? 1 : -1);
            });
            setRpm(() => (drsActive ? 12800 : 12100) + Math.floor(Math.random() * 150) - 75);
            setGear(() => speed < 100 ? 3 : speed < 180 ? 5 : speed < 260 ? 7 : 8);
        }, 100);
        return () => clearInterval(interval);
    }, [speed, drsActive]);

    const formatLap = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

    const renderRpmLeds = () => {
        const total = 14;
        const active = Math.min(total, Math.floor((rpm / 13500) * total));
        return Array.from({ length: total }).map((_, i) => {
            const isLit = i < active;
            const color = !isLit ? '#1a1a22' : i < 5 ? '#00FF66' : i < 10 ? '#FFFF00' : '#E10600';
            return <div key={i} style={{ width: '14px', height: '6px', borderRadius: '1px', backgroundColor: color, boxShadow: isLit ? `0 0 5px ${color}88` : 'none', transition: 'background-color 0.08s ease' }} />;
        });
    };

    return (
        <section id="hero" style={{
            minHeight: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: 'var(--nav-height)',
            paddingBottom: isMobile ? '60px' : '0',
            background: 'radial-gradient(ellipse at 50% 60%, #23273a 0%, var(--color-bg) 70%)',
        }}>
            <TrackBackground />

            {/* Responsive column grid */}
            <div style={{
                position: 'relative',
                zIndex: 3,
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '220px 1fr 220px',
                gap: isMobile ? '40px' : '0',
                width: '100%',
                height: '100%',
                alignItems: 'center',
                padding: isMobile ? '40px 20px' : '0',
            }} className="animate-fade-in hero-container">

                {/* ── LEFT: Driver Card ── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    padding: isMobile ? '30px 20px' : '40px 24px 40px 40px',
                    borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    borderTop: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    borderBottom: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    height: '100%',
                    justifyContent: 'center',
                    order: isMobile ? 2 : 1,
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '500px' : 'none',
                    margin: isMobile ? '0 auto' : '0',
                }}>
                    {/* Race number */}
                    <div style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '5rem',
                        fontWeight: 900,
                        fontStyle: 'italic',
                        color: 'transparent',
                        WebkitTextStroke: '2px rgba(225,6,0,0.55)',
                        lineHeight: 1,
                        marginBottom: '8px',
                    }}>23</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <StatRow label="Driver" value="R. KADAM" accent="#fff" />
                        <StatRow label="Nationality" value="🇮🇳  INDIA" />
                        <StatRow label="Constructor" value="COGNIZANT Technologies" accent="var(--color-primary)" />
                        <StatRow label="Base" value="PUNE, INDIA" />
                        <StatRow label="Active Since" value="2019" />
                    </div>

                    {/* Position badge */}
                    <div style={{
                        marginTop: '8px',
                        padding: '9px 14px',
                        background: 'rgba(225,6,0,0.1)',
                        border: '1px solid rgba(225,6,0,0.28)',
                        borderLeft: '3px solid var(--color-primary)',
                        borderRadius: '2px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: 'var(--color-primary)',
                        letterSpacing: '1.5px',
                        fontWeight: 700,
                    }}>
                        P1 CURRENT STANDINGS
                    </div>
                </div>

                {/* ── CENTER: Main content ── */}
                <div style={{
                    padding: isMobile ? '20px 10px' : '40px 50px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: isMobile ? 'center' : 'flex-start',
                    textAlign: isMobile ? 'center' : 'left',
                    order: isMobile ? 1 : 2,
                }}>

                    {/* Session tag */}
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-primary)', letterSpacing: '5px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="f1-led-light f1-led-red" />
                        <span>SESSION ID: 2310</span>
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontSize: isMobile ? 'clamp(2rem, 8vw, 3.2rem)' : 'clamp(3rem, 5.5vw, 5.2rem)',
                        fontWeight: 900,
                        lineHeight: '0.95',
                        letterSpacing: '-2px',
                        fontStyle: 'italic',
                        marginBottom: '20px',
                        textTransform: 'uppercase',
                        textAlign: isMobile ? 'center' : 'left'
                    }}>
                        POWERTRAIN <br />
                        <span style={{ color: 'transparent', WebkitTextStroke: '1.5px #fff' }}>SYSTEMS ENGINEER</span>
                    </h1>

                    {/* Description — wrapped on mobile to avoid cutting */}
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        marginBottom: '30px',
                        whiteSpace: isMobile ? 'normal' : 'nowrap',
                        overflow: isMobile ? 'visible' : 'hidden',
                        textOverflow: isMobile ? 'clip' : 'ellipsis',
                        textAlign: isMobile ? 'center' : 'left',
                        maxWidth: isMobile ? '600px' : 'none',
                    }}>
                        {text}
                        <span className="animate-pulse" style={{ display: 'inline-block', width: '2px', height: '1em', background: 'var(--color-primary)', verticalAlign: 'text-bottom', marginLeft: '2px' }} />
                    </p>

                    {/* CTAs — symmetric equal-width buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '14px',
                        alignItems: 'center',
                        justifyContent: isMobile ? 'center' : 'flex-start',
                        flexWrap: isMobile ? 'wrap' : 'nowrap',
                        width: '100%',
                    }}>
                        <MagneticButton href="#journey" className="btn f1-skew-btn" strength={0.25}
                            style={{ width: '160px', textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                            <span>DRIVE CIRCUIT</span>
                        </MagneticButton>
                        <MagneticButton href="#projects" className="btn btn-secondary f1-skew-btn" strength={0.25}
                            style={{ width: '160px', textAlign: 'center', justifyContent: 'center', display: 'flex' }}>
                            <span>GARAGE BUILDS</span>
                        </MagneticButton>
                    </div>
                </div>

                {/* ── RIGHT: Key Experience Stats ── */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    padding: isMobile ? '30px 20px' : '40px 40px 40px 24px',
                    borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    height: '100%',
                    justifyContent: 'center',
                    order: isMobile ? 3 : 3,
                    width: isMobile ? '100%' : 'auto',
                    maxWidth: isMobile ? '500px' : 'none',
                    margin: isMobile ? '0 auto' : '0',
                }}>
                    {/* Big XP number */}
                    <StatRow label="Total Experience" value={getExperience()} accent="#fff" big />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <StatRow label="Current Role" value="Systems Eng." accent="var(--color-primary)" />
                        <StatRow label="Current Company" value="COGNIZANT" accent="var(--color-primary)" />
                        <StatRow label="Previous" value="Mahindra · Tata Tech" />
                        <StatRow label="Domain" value="Powertrain" />
                        <StatRow label="Key Tools" value="DOORS · MATLAB · Simulink · Catia" />
                        <StatRow label="Certification" value="Six Sigma Green Belt" accent="#FFCC00" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
