'use client';

import { Search } from 'lucide-react';

import { cn } from '@/lib/utils';

import { PLACEHOLDERS } from '../constants/placeholderWords';
import { useTypewriter } from '../hooks/useTypewriter';

interface AnimatedPlaceholderProps {
  query: string;
  className?: string;
}

export function AnimatedPlaceholder({
  query,
  className,
}: AnimatedPlaceholderProps) {
  const text = useTypewriter({
    words: PLACEHOLDERS,
    typingSpeed: 32,
    deletingSpeed: 16,
    pauseTime: 900,
  });

  if (query.length > 0) return null;

  return (
    <>
      {/* Search Icon */}
      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center justify-center">
        <Search
          className="h-5 w-5 text-teal-700 transition-all duration-300"
          strokeWidth={2.2}
        />
      </div>

      {/* Placeholder */}
      <div
        className={cn(
          'pointer-events-none absolute inset-y-0 left-11 flex items-center overflow-hidden',
          'whitespace-nowrap select-none',
          className
        )}
      >
        <span className="typewriter-text relative">
          {text}
        </span>

        <span className="typewriter-cursor ml-[2px]">
          |
        </span>
      </div>
    </>
  );
}