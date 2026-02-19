import React from 'react';
import useMousePosition from '../hooks/useMousePosition';

const MouseGlow = () => {
    const { clientX, clientY } = useMousePosition();

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: 9999,
                background: `radial-gradient(600px circle at ${clientX}px ${clientY}px, rgba(255, 51, 51, 0.04), transparent 40%)`,
                transition: 'background 0.15s ease',
            }}
        />
    );
};

export default MouseGlow;
