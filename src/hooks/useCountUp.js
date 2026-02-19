import { useState, useEffect, useRef } from 'react';

const useCountUp = (target, duration = 2000, suffix = '') => {
    const [count, setCount] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setHasStarted(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) observer.observe(ref.current);
        return () => { if (ref.current) observer.unobserve(ref.current); };
    }, [hasStarted]);

    useEffect(() => {
        if (!hasStarted) return;

        const numericTarget = parseInt(target, 10);
        if (isNaN(numericTarget)) {
            setCount(target);
            return;
        }

        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * numericTarget));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [hasStarted, target, duration]);

    return { count: hasStarted ? `${count}${suffix}` : `0${suffix}`, ref };
};

export default useCountUp;
