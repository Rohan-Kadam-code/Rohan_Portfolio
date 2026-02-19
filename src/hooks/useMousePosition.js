import { useState, useEffect } from 'react';

const useMousePosition = () => {
    const [position, setPosition] = useState({ x: 0.5, y: 0.5, clientX: 0, clientY: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
                clientX: e.clientX,
                clientY: e.clientY,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return position;
};

export default useMousePosition;
