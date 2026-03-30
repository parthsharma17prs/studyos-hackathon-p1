'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuZap, LuChevronRight, LuPlay } from 'react-icons/lu';

/**
 * Hero Section — Giant animated headline + CTAs
 * Premium black with subtle glow and refined typography
 */
export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-12 overflow-hidden px-4 text-center">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-red-500/5 rounded-full blur-[100px] animate-pulse" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Badge */}
        <div
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full 
            bg-white/5 border border-white/10 text-student-accent text-xs font-black uppercase tracking-widest mb-8
            transition-all duration-1000 ${mounted ? 'opacity-100' : 'opacity-0 -translate-y-4'}
          `}
        >
          <LuZap size={14} className="fill-current" />
          The Future of Student Success
        </div>

        {/* Headline */}
        <h1
          className={`
            text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-8
            transition-all duration-1000 delay-200 ${mounted ? 'opacity-100' : 'opacity-0 scale-95'}
          `}
        >
          Study <span className="gradient-text-red">Smarter</span>. <br />
          Not <span className="text-os-muted text-5xl sm:text-6xl md:text-7xl">Harder</span>.
        </h1>

        {/* Subtext */}
        <p
          className={`
            text-lg sm:text-xl text-os-muted max-w-2xl mx-auto mb-12 leading-relaxed
            transition-all duration-1000 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}
          `}
        >
          The AI platform that knows you — your notes, your marks, your gaps, your goals.
          Stop guessing, start <span className="text-white font-bold">dominating</span>.
        </p>

        {/* CTAs */}
        <div
          className={`
            flex flex-col sm:flex-row items-center justify-center gap-6 mb-20
            transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <Link href="/auth?role=student">
            <button className="btn-primary-student group flex items-center gap-2">
              Start Studying Free
              <LuChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="#how-it-works">
            <button className="btn-ghost flex items-center gap-2">
              <LuPlay size={16} className="fill-current text-student-accent" />
              Watch Demo
            </button>
          </Link>
        </div>

        {/* Mockup Display */}
        <div
          className={`
            relative mx-auto mt-12 max-w-5xl transition-all duration-1000 delay-1000
            ${mounted ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-12'}
          `}
        >
          <div className="relative glass-card border-white/5 p-4 md:p-6 shadow-premium-card group hover:scale-[1.01] transition-all duration-500 overflow-visible">
            {/* Red glow behind the mockup */}
            <div className="absolute -inset-2 bg-gradient-to-r from-student-accent/20 via-student-accent/5 to-student-accent/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity" />

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-os-black aspect-video lg:aspect-[16/10]">
              <Image
                src="/app-mockup.png"
                alt="StudyOS App Mockup"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-1000"
              />
            </div>

            {/* Floating UI Elements (Decorative) */}
            <div className="absolute -top-10 -right-10 w-40 h-40 glass-card !p-4 hidden lg:flex flex-col gap-2 animate-float shadow-2xl scale-75 md:scale-100">
              <div className="flex items-center gap-2">
                <LuZap className="text-student-accent" size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">AI Analysis</span>
              </div>
              <div className="h-1.5 w-full bg-os-border rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-student-accent" />
              </div>
              <p className="text-[8px] text-os-muted">Optimizing study path...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce transition-opacity duration-1000 delay-1000 ${mounted ? 'opacity-40' : 'opacity-0'}`}>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
      </div>
    </section>
  );
}
