import React, { useRef, useState } from 'react';

const TiltCard = ({ children, style = {}, className = '' }) => {
    const cardRef = useRef(null);
    const [tiltStyle, setTiltStyle] = useState({});

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;  // 0 to 1
        const y = (e.clientY - rect.top) / rect.height;   // 0 to 1
        const rotateX = (0.5 - y) * 15; // max 7.5deg
        const rotateY = (x - 0.5) * 15; // max 7.5deg

        setTiltStyle({
            transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
            transition: 'transform 0.1s ease',
        });
    };

    const handleMouseLeave = () => {
        setTiltStyle({
            transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transition: 'transform 0.5s ease',
        });
    };

    return (
        <div
            ref={cardRef}
            className={className}
            style={{
                ...style,
                ...tiltStyle,
                transformStyle: 'preserve-3d',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            {/* Glare overlay */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    background: tiltStyle.transform && !tiltStyle.transform.includes('rotateX(0deg)')
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)'
                        : 'transparent',
                    transition: 'background 0.3s ease',
                    zIndex: 10,
                }}
            />
        </div>
    );
};

export default TiltCard;
