'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface AnimatedTextProps {
  text: string;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'typewriter';
}

export function AnimatedText({ text, className = '', animation = 'fadeIn' }: AnimatedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!textRef.current) return;
    
    const element = textRef.current;
    
    switch (animation) {
      case 'fadeIn':
        gsap.from(element, {
          opacity: 0,
          duration: 1,
          ease: 'power2.out'
        });
        break;
        
      case 'slideUp':
        gsap.from(element, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        });
        break;
        
      case 'typewriter':
        const chars = element.textContent?.split('') || [];
        element.textContent = '';
        
        chars.forEach((char, index) => {
          gsap.to(element, {
            duration: 0.05,
            delay: index * 0.05,
            onComplete: () => {
              element.textContent += char;
            }
          });
        });
        break;
    }
  }, [text, animation]);
  
  return (
    <div ref={textRef} className={className}>
      {animation !== 'typewriter' && text}
    </div>
  );
}