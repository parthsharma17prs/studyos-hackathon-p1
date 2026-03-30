'use client';

import { useState } from 'react';
import { LuSettings, LuUser, LuBell, LuLock, LuGlobe, LuCreditCard, LuZap, LuCircleHelp, LuLogOut, LuChevronRight, LuShieldCheck, LuSparkles, LuKey } from 'react-icons/lu';

export default function SettingsPage() {
  const [user] = useState({ name: 'Demo Student', email: 'student@studyos.ai' });

  const sections = [
    { 
        id: 'profile', 
        icon: LuUser, 
        label: 'Account Settings', 
        desc: 'Manage your personal identity' 
    },
    { 
        id: 'security', 
        icon: LuShieldCheck, 
        label: 'Security & Privacy', 
        desc: 'Update password & data permissions' 
    },
    { 
        id: 'notifications', 
        icon: LuBell, 
        label: 'Notification Config', 
        desc: 'Customize alerts for study reminders' 
    },
    { 
        id: 'ai', 
        icon: LuSparkles, 
        label: 'AI Preferences', 
        desc: 'Token usage & model customization' 
    },
    { 
        id: 'billing', 
        icon: LuCreditCard, 
        label: 'Premium Subscription', 
        desc: 'Manage billing & student plan' 
    },
    { 
        id: 'help', 
        icon: LuCircleHelp, 
        label: 'Support & Docs', 
        desc: 'Contact team or read guides' 
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 italic">
            Config <span className="text-student-accent">Center</span>
          </h1>
          <p className="text-os-muted font-bold tracking-[0.3em] uppercase text-[10px]">Optimize your learning ecosystem</p>
        </div>
      </div>

      <div className="ribbon-student" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="space-y-8 flex flex-col items-center text-center lg:items-start lg:text-left">
            <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-4xl font-black italic shadow-[0_0_30px_rgba(229,9,20,0.3)] border-2 border-student-accent/50 group-hover:scale-105 transition-all">
                    {user.name.charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-black border-2 border-os-border flex items-center justify-center text-student-accent group-hover:border-student-accent transition-colors">
                    <LuZap size={20} />
                </div>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
                <p className="text-sm font-bold text-os-muted uppercase tracking-widest">{user.email}</p>
            </div>

            <div className="w-full h-px bg-os-border" />

            <div className="w-full space-y-4">
                <div className="p-5 glass-card flex items-center justify-between group cursor-pointer hover:border-red-500/30">
                    <div className="flex items-center gap-3">
                        <LuKey className="text-os-muted group-hover:text-student-accent" />
                        <span className="text-xs font-black uppercase tracking-widest">API Usage</span>
                    </div>
                    <span className="text-xs font-black text-student-accent italic">882/1000</span>
                </div>
                <div className="p-5 glass-card flex items-center justify-between group cursor-pointer hover:border-red-500/30">
                    <div className="flex items-center gap-3">
                        <LuGlobe className="text-os-muted group-hover:text-student-accent" />
                        <span className="text-xs font-black uppercase tracking-widest">Language</span>
                    </div>
                    <span className="text-xs font-black text-white italic underline">English</span>
                </div>
                <button className="w-full p-5 glass-card flex items-center justify-between text-red-500 hover:bg-red-500/10 font-bold group">
                    <div className="flex items-center gap-3">
                        <LuLogOut />
                        <span className="text-xs uppercase tracking-[0.2em]">Logout Session</span>
                    </div>
                </button>
            </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sections.map((section, idx) => (
                    <div key={idx} className="glass-card p-8 group cursor-pointer hover:border-student-accent/40 bg-gradient-to-br from-transparent to-white/5 transition-all hover:bg-white/5">
                        <div className="flex items-start justify-between">
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-student-accent group-hover:bg-student-accent group-hover:text-white transition-all">
                                <section.icon size={28} />
                            </div>
                            <LuChevronRight className="text-os-muted group-hover:translate-x-1 group-hover:text-white transition-all" size={20} />
                        </div>
                        <div className="mt-8 space-y-2">
                            <h3 className="text-xl font-black italic tracking-tight">{section.label}</h3>
                            <p className="text-xs text-os-muted font-bold leading-relaxed">{section.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-3xl border border-os-border bg-black/50 overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-150 transition-transform duration-1000">
                    <LuSparkles size={80} className="text-student-accent" />
                </div>
                <div className="relative z-10 space-y-4 max-w-md">
                    <h3 className="text-2xl font-black italic tracking-tighter">Upgrade to Pro</h3>
                    <p className="text-sm font-bold text-os-muted leading-relaxed uppercase tracking-widest">
                        Unlimited Gemini 1.5 Tokens, Unlimited ATS Checks, and Custom Battle Modes.
                    </p>
                    <button className="px-8 py-4 bg-student-accent hover:bg-red-700 text-white rounded-2xl font-black text-xs tracking-widest italic transition-all shadow-[0_10px_20px_rgba(229,9,20,0.3)]">
                        RECLAIM ELITE STATUS ($19/mo)
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
