import React, { useRef, useState } from 'react';

const MagneticButton = ({ children, className = '', style = {}, href, strength = 0.3 }) => {
    const btnRef = useRef(null);
    const [transform, setTransform] = useState('translate(0px, 0px)');

    const handleMouseMove = (e) => {
        const rect = btnRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (e.clientX - centerX) * strength;
        const dy = (e.clientY - centerY) * strength;
        setTransform(`translate(${dx}px, ${dy}px)`);
    };

    const handleMouseLeave = () => {
        setTransform('translate(0px, 0px)');
    };

    const Tag = href ? 'a' : 'button';

    return (
        <Tag
            ref={btnRef}
            href={href}
            className={className}
            style={{
                ...style,
                transform,
                transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
                display: 'inline-block',
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </Tag>
    );
};

export default MagneticButton;
