import React, { useEffect, useRef, useState } from 'react';

const RevealOnScroll = ({ children, animation = 'animate-slide-up', delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px',
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div ref={ref} className={isVisible ? animation : 'opacity-0'} style={{ animationDelay: `${delay}s`, transition: 'opacity 0.5s' }}>
            {children}
        </div>
    );
};

export default RevealOnScroll;
