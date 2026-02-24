import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * GlitchText — text that plays a glitch/scramble effect on hover.
 *
 * Characters randomise briefly then resolve back to the original string.
 * Reduced-motion users see the text without any animation.
 *
 * @param {Object}  props
 * @param {string}  props.text      - The display string
 * @param {string}  [props.className] - Extra Tailwind classes
 * @param {string}  [props.as='span'] - Wrapper element
 */
const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';

export default function GlitchText({ text, className = '', as: Tag = 'span' }) {
  const [display, setDisplay] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const scramble = useCallback(() => {
    if (prefersReducedMotion || isAnimating) return;
    setIsAnimating(true);

    const original = text.split('');
    let iteration = 0;
    const totalIterations = original.length * 3; // ~3 frames per char

    const interval = setInterval(() => {
      setDisplay(
        original
          .map((char, i) => {
            // Characters resolve left-to-right
            if (i < iteration / 3) return original[i];
            if (char === ' ') return ' ';
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join(''),
      );

      iteration += 1;
      if (iteration > totalIterations) {
        clearInterval(interval);
        setDisplay(text);
        setIsAnimating(false);
      }
    }, 35);
  }, [text, isAnimating, prefersReducedMotion]);

  const reset = useCallback(() => {
    setDisplay(text);
  }, [text]);

  return (
    <Tag
      className={`inline-block cursor-default ${className}`}
      onMouseEnter={scramble}
      onMouseLeave={reset}
      onFocus={scramble}
      aria-label={text}
    >
      {display.split('').map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          className="inline-block"
          initial={false}
          animate={
            char !== text[i] && !prefersReducedMotion
              ? { opacity: [0.4, 1], y: [2, 0] }
              : {}
          }
          transition={{ duration: 0.06 }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </Tag>
  );
}
