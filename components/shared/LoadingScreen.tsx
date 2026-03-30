'use client';

import { useState, useEffect } from 'react';

/**
 * Premium Smash Preloader
 * "Study Hard" -> [SMASH] -> "Study Smart"
 */
export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total animation time is 2.5s, let's keep it visible for 3s to be safe
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="relative text-center">
        {/* The consistent word: STUDY */}
        <span className="text-5xl md:text-7xl font-black tracking-tighter text-white inline-block">
          STUDY
        </span>

        {/* The switching part */}
        <div className="inline-block relative ml-4">
          {/* HARD — Disappears with smash */}
          <span className="text-5xl md:text-7xl font-black tracking-tighter text-os-muted animate-hard-fade">
            HARD
          </span>

          {/* SMART — Smashes down from top */}
          <span className="absolute left-0 top-0 text-5xl md:text-7xl font-black tracking-tighter text-student-accent animate-smart-smash opacity-0">
            SMART
          </span>
        </div>

        {/* Smash Effect — Animated ring/flash */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-[4px] border-student-accent rounded-full animate-smash-ring opacity-0 pointer-events-none" />
        
        {/* Glow behind everything */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-student-accent/20 blur-[100px] animate-pulse pointer-events-none" />
      </div>

      <style jsx>{`
        .animate-hard-fade {
          animation: hardFade 2.5s forwards;
        }
        
        .animate-smart-smash {
          animation: smartSmash 2.5s forwards;
        }
        
        .animate-smash-ring {
          animation: smashRing 2.5s forwards;
        }

        @keyframes hardFade {
          0% { opacity: 1; transform: scale(1); }
          45% { opacity: 1; transform: scale(1); }
          50% { opacity: 0; transform: scale(1.5) rotate(5deg); filter: blur(10px); }
          100% { opacity: 0; transform: scale(1.5) rotate(5deg); filter: blur(10px); }
        }

        @keyframes smartSmash {
          0% { opacity: 0; transform: translateY(-100px) scale(2); }
          45% { opacity: 0; transform: translateY(-100px) scale(2); }
          50% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes smashRing {
          0% { width: 0; height: 0; opacity: 0; border-width: 20px; }
          45% { width: 0; height: 0; opacity: 0; border-width: 20px; }
          50% { width: 500px; height: 500px; opacity: 0.8; border-width: 1px; }
          60% { width: 800px; height: 800px; opacity: 0; border-width: 0px; }
          100% { width: 800px; height: 800px; opacity: 0; border-width: 0px; }
        }
      `}</style>
    </div>
  );
}
