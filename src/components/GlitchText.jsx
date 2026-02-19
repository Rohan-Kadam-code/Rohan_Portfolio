import React, { useState, useEffect, useRef } from 'react';

const GLITCH_CHARS = '!<>-_\\/[]{}—=+*^?#________';

const GlitchText = ({ text, className = '', style = {}, as: Tag = 'span' }) => {
    const [displayText, setDisplayText] = useState(text);
    const [hasPlayed, setHasPlayed] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasPlayed) {
                    setHasPlayed(true);
                    scramble();
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [hasPlayed]);

    const scramble = () => {
        const chars = text.split('');
        const iterations = 3; // how many random chars before settling
        let frame = 0;
        const totalFrames = chars.length * iterations;

        const interval = setInterval(() => {
            const progress = frame / totalFrames;
            const settled = Math.floor(progress * chars.length);

            setDisplayText(
                chars.map((char, i) => {
                    if (char === ' ') return ' ';
                    if (i < settled) return chars[i];
                    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                }).join('')
            );

            frame++;
            if (frame > totalFrames) {
                clearInterval(interval);
                setDisplayText(text);
            }
        }, 25);
    };

    return (
        <Tag ref={ref} className={className} style={style}>
            {displayText}
        </Tag>
    );
};

export default GlitchText;
