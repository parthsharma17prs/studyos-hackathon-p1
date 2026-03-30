'use client';

import { useEffect, useRef, useState } from 'react';
import { LuCircleCheck } from 'react-icons/lu';

/**
 * Student Power Preview — Highlighted student features
 */
export default function RolePreview() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-24 px-4 max-w-4xl mx-auto">
      <div
        className={`glass-card p-12 border-student-accent/20 transition-all duration-1000 ${visible ? 'reveal revealed' : 'reveal'
          }`}
      >
        <div className="ribbon-student rounded-full mb-12" />
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-student-accent/20 flex items-center justify-center">
            <span className="text-student-accent font-black text-xl">S</span>
          </div>
          <h3 className="text-4xl font-black tracking-tighter">The Student Edge</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {[
            'AI quiz generator with adaptive difficulty',
            'Marksheet analyzer + placement readiness',
            'ATS resume checker with AI rewriter',
            'RAG gap detector for exam prep',
            'Voice calling agent for study nudges',
            'Peer battle mode with live scoreboard',
            'Spaced repetition calendar',
            'Burnout detection + recovery mode',
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 text-sm text-os-muted group hover:text-white transition-colors">
              <span className="text-student-accent mt-0.5 font-bold">▸</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        {/* Mock dashboard preview */}
        <div className="mt-12 rounded-2xl border border-os-border bg-black/50 p-6 overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-tr from-student-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-2 mb-4 relative z-10">
            <div className="w-3 h-3 rounded-full bg-student-accent animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-os-border" />
            <div className="w-3 h-3 rounded-full bg-os-border" />
            <span className="text-[10px] text-os-muted ml-3 uppercase tracking-[0.2em] font-black">Pulse Dashboard Preview</span>
          </div>
          <div className="grid grid-cols-3 gap-4 relative z-10">
            {[78, 92, 45].map((score, i) => (
              <div key={i} className="bg-os-card rounded-xl p-4 text-center border border-os-border group-hover:border-student-accent/20 transition-colors">
                <div className={`text-3xl font-black ${score > 70 ? 'text-student-accent' : 'text-os-muted'}`}>
                  {score}%
                </div>
                <div className="text-[10px] text-os-muted mt-2 uppercase font-bold tracking-widest">
                  {['Physics', 'Math', 'Chem'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
