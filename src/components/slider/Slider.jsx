import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slider.css';

const Slider = ({ children }) => {
    const [index, setIndex] = useState(0);
    const total = React.Children.count(children);
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const next = () => setIndex((index + 1) % total);
    const prev = () => setIndex((index - 1 + total) % total);

    const handleTouchStart = (e) => {
        touchStartX.current = e.changedTouches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (diff > 50) next();
        else if (diff < -50) prev();
    };

    useEffect(() => {
        const container = containerRef.current;
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);
        return () => {
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [index]);

    return (
        <div className="slider-container" ref={containerRef}>
            <button onClick={prev} className="arrow left">
                <ChevronLeft size={32} />
            </button>

            <div className="slider-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children[index]}
                    </motion.div>
                </AnimatePresence>
            </div>

            <button onClick={next} className="arrow right">
                <ChevronRight size={32} />
            </button>

            <div>
                {Array.from({ length: total }).map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIndex(i)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
