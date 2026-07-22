"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';

export interface TypewriterProps {
  words?: string[];
  text?: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  waitTime?: number;
  className?: string;
  cursorChar?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({
  words,
  text,
  speed = 70,
  deleteSpeed = 40,
  delayBetweenWords,
  waitTime = 1500,
  className = '',
  cursorChar = '|',
}) => {
  const wordList = useMemo(() => words || text || [], [words, text]);
  const pauseTime = delayBetweenWords ?? waitTime;

  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (wordList.length === 0) return;
    const currentWord = wordList[wordIndex] ?? '';

    if (timer.current) clearTimeout(timer.current);

    if (!isDeleting && charIndex < currentWord.length) {
      timer.current = setTimeout(() => setCharIndex(c => c + 1), speed);
    } else if (!isDeleting && charIndex === currentWord.length) {
      timer.current = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && charIndex > 0) {
      timer.current = setTimeout(() => setCharIndex(c => c - 1), deleteSpeed);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setWordIndex(i => (i + 1) % wordList.length);
    }

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [charIndex, isDeleting, wordIndex, wordList, speed, deleteSpeed, pauseTime]);

  const displayed = (wordList[wordIndex] ?? '').slice(0, charIndex);

  return (
    <span>
      <span className={className}>{displayed}</span>
      <span className="typewriter-cursor" aria-hidden="true">{cursorChar}</span>
    </span>
  );
};

export default Typewriter;
