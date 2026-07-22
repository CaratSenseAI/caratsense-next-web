"use client";
import { useState, useEffect, useRef } from 'react';

/**
 * Typewriter – cycles through an array of words with a type / delete animation.
 *
 * Props
 *  text[]       – words to cycle through
 *  speed        – ms per character while typing   (default 70)
 *  deleteSpeed  – ms per character while deleting (default 40)
 *  waitTime     – ms to pause before deleting     (default 1500)
 *  className    – class applied to the typed-word <span>
 *  cursorChar   – blinking cursor symbol           (default '|')
 */
const Typewriter = ({
  text = [],
  speed = 70,
  deleteSpeed = 40,
  waitTime = 1500,
  className = '',
  cursorChar = '|',
}) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const currentWord = text[wordIndex] ?? '';

    clearTimeout(timer.current);

    if (!isDeleting && charIndex < currentWord.length) {
      // Still typing forward
      timer.current = setTimeout(() => setCharIndex(c => c + 1), speed);
    } else if (!isDeleting && charIndex === currentWord.length) {
      // Word fully typed – wait, then start deleting
      timer.current = setTimeout(() => setIsDeleting(true), waitTime);
    } else if (isDeleting && charIndex > 0) {
      // Deleting backward
      timer.current = setTimeout(() => setCharIndex(c => c - 1), deleteSpeed);
    } else if (isDeleting && charIndex === 0) {
      // Fully deleted – advance to next word
      setIsDeleting(false);
      setWordIndex(i => (i + 1) % text.length);
    }

    return () => clearTimeout(timer.current);
  }, [charIndex, isDeleting, wordIndex, text, speed, deleteSpeed, waitTime]);

  const displayed = (text[wordIndex] ?? '').slice(0, charIndex);

  return (
    <span>
      <span className={className}>{displayed}</span>
      <span className="typewriter-cursor" aria-hidden="true">{cursorChar}</span>
    </span>
  );
};

export { Typewriter };
