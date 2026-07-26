import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Shuffle.css';

gsap.registerPlugin(ScrollTrigger);

interface ShuffleProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  maxDelay?: number;
  ease?: string;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: 'evenodd' | 'random';
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
}

export const Shuffle: React.FC<ShuffleProps> = ({
  text,
  className = '',
  style = {},
  shuffleDirection = 'right',
  duration = 0.35,
  maxDelay = 0,
  ease = 'power3.out',
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onShuffleComplete,
  shuffleTimes = 2,
  animationMode = 'evenodd',
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()',
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const [displayText, setDisplayText] = useState(text);

  useEffect(() => {
    let isCancelled = false;
    let iteration = 0;
    const maxIterations = Math.max(5, shuffleTimes * 5);
    const chars = text.split('');

    const interval = setInterval(() => {
      if (isCancelled) return;

      const scrambled = chars
        .map((char, idx) => {
          if (char === ' ') return ' ';
          if (iteration / maxIterations > (idx + 1) / chars.length) {
            return text[idx];
          }
          return scrambleCharset[Math.floor(Math.random() * scrambleCharset.length)];
        })
        .join('');

      setDisplayText(scrambled);
      iteration++;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        onShuffleComplete?.();
      }
    }, (duration * 1000) / maxIterations);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [text, duration, shuffleTimes, scrambleCharset, onShuffleComplete]);

  const Tag = tag || 'p';
  const commonStyle = useMemo(() => ({ textAlign, ...style }), [textAlign, style]);

  return (
    <Tag ref={containerRef as any} className={`shuffle-parent is-ready ${className}`} style={commonStyle}>
      {displayText}
    </Tag>
  );
};

export default Shuffle;
