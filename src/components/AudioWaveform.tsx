import { useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

interface AudioWaveformProps {
  isActive: boolean;
  audioLevel: number;
  className?: string;
}

export const AudioWaveform = ({ isActive, audioLevel, className }: AudioWaveformProps) => {
  const bars = useMemo(() => Array.from({ length: 20 }, (_, i) => i), []);

  return (
    <div className={cn("flex items-center justify-center gap-1 h-16", className)}>
      {bars.map((_, index) => {
        const height = isActive 
          ? Math.max(20, (audioLevel * 100) * (0.5 + Math.random() * 0.5))
          : 20;
        
        return (
          <div
            key={index}
            className={cn(
              "w-1 bg-waveform rounded-full transition-all duration-150",
              isActive && "animate-waveform bg-waveform-active"
            )}
            style={{
              height: `${height}%`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        );
      })}
    </div>
  );
};