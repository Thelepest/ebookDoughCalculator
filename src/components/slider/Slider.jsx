import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Slider.css';

const Slider = ({ children,onSlideChange }) => {
    const [index, setIndex] = useState(0);
    const items = React.Children.toArray(children);
    const total = items.length;
    const containerRef = useRef(null);
    const touchStartX = useRef(null);
    const touchEndX = useRef(null);

    const next = () => {
        if (index < total - 1) setIndex(index + 1);
    };

    const prev = () => {
        if (index > 0) setIndex(index - 1);
    };

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

    useEffect(() => {
        if (onSlideChange) {
            onSlideChange(index);
        }
    }, [index, onSlideChange]);


    return (
        <div className="slider-container" ref={containerRef}>
            <AnimatePresence>
                {index > 0 && (
                    <motion.button
                        key="left-arrow"
                        onClick={prev}
                        className="arrow left"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronLeft size={32} />
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="slider-content">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {items[index]}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {index < total - 1 && (
                    <motion.button
                        key="right-arrow"
                        onClick={next}
                        className="arrow right"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronRight size={32} />
                    </motion.button>
                )}
            </AnimatePresence>

            <div className="slider-dots">
                {Array.from({ length: total }).map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`dot ${i === index ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Slider;
