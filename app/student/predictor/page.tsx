'use client';

import { useState } from 'react';
import { LuTrendingUp, LuBarChart3, LuCalendar, LuCheckCircle2, LuAlertCircle, LuPlus, LuChevronRight, LuActivity, LuFlame, LuTarget } from 'react-icons/lu';

interface Prediction {
  subject: string;
  previousScore: number;
  predictedScore: number;
  trend: 'up' | 'down' | 'stable';
  improvementAreas: string[];
}

const mockPredictions: Prediction[] = [
  { 
    subject: 'Computer Science', 
    previousScore: 82, 
    predictedScore: 94, 
    trend: 'up', 
    improvementAreas: ['Dynamic Programming', 'OS Deadlocks'] 
  },
  { 
    subject: 'Mathematics', 
    previousScore: 75, 
    predictedScore: 81, 
    trend: 'stable', 
    improvementAreas: ['Calculus Integration', 'Complex Numbers'] 
  },
  { 
    subject: 'Physics', 
    previousScore: 68, 
    predictedScore: 78, 
    trend: 'up', 
    improvementAreas: ['Quantum Mechanics', 'Electromagnetism'] 
  },
];

export default function ExamPredictorPage() {
  const [predictions] = useState<Prediction[]>(mockPredictions);

  const overallPrediction = 84;
  const confidenceScore = 92;

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Exam <span className="text-student-accent">Predictor</span>
          </h1>
          <p className="text-os-muted font-bold tracking-widest uppercase text-xs">AI-driven score forecasting & analysis</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-os-border px-8 py-5 rounded-3xl">
          <div>
            <p className="text-[10px] font-black text-os-muted uppercase tracking-[0.2em]">Confidence Index</p>
            <p className="text-3xl font-black text-student-accent">{confidenceScore}%</p>
          </div>
          <LuTarget size={40} className="text-student-accent opacity-30" />
        </div>
      </div>

      <div className="ribbon-student" />

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
              { label: 'Overall Readiness', value: `${overallPrediction}%`, icon: LuActivity, color: 'text-student-accent' },
              { label: 'Trend Angle', value: '+12%', icon: LuTrendingUp, color: 'text-green-500' },
              { label: 'Syllabus Coverage', value: '88%', icon: LuBarChart3, color: 'text-blue-500' },
              { label: 'Focus Streak', value: '14D', icon: LuFlame, color: 'text-orange-500' },
          ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex items-center justify-between">
                  <div>
                      <p className="text-[10px] font-black text-os-muted uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  </div>
                  <stat.icon className={`${stat.color} opacity-20`} size={24} />
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-3xl font-black tracking-tighter flex items-center gap-3">
            <LuTrendingUp className="text-student-accent" /> Subject Forecast
          </h2>

          <div className="space-y-4">
            {predictions.map((item, i) => (
              <div key={i} className="glass-card p-8 group transition-all hover:bg-white/5 hover:border-student-accent/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 italic">
                      {item.subject}
                      {item.trend === 'up' && <LuTrendingUp className="text-green-500" size={20} />}
                    </h3>
                    <p className="text-xs font-bold text-os-muted uppercase tracking-widest">Targeting: <span className="text-white">{item.predictedScore}%</span></p>
                  </div>
                  <div className="flex items-center gap-6">
                      <div className="text-right">
                          <p className="text-[10px] font-black text-os-muted uppercase tracking-widest">Prev Score</p>
                          <p className="text-xl font-black text-os-muted">{item.previousScore}%</p>
                      </div>
                      <div className="w-px h-10 bg-os-border" />
                      <div className="text-right">
                          <p className="text-[10px] font-black text-student-accent uppercase tracking-widest">AI Target</p>
                          <p className="text-xl font-black text-student-accent">{item.predictedScore}%</p>
                      </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="w-full h-2 bg-os-border rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-student-accent shadow-[0_0_15px_rgba(229,9,20,0.8)] transition-all duration-1000" 
                        style={{ width: `${item.predictedScore}%` }} 
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.improvementAreas.map((area, idx) => (
                      <span key={idx} className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border border-white/5 bg-white/5 text-os-muted flex items-center gap-2 group-hover:border-student-accent/20 group-hover:text-white transition-colors">
                        <LuAlertCircle size={10} className="text-student-accent" />
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar / Recommendations */}
        <div className="space-y-8">
            <div className="glass-card p-8 bg-gradient-to-br from-red-600/10 to-transparent border-red-600/20">
                <h3 className="text-xl font-black tracking-tighter flex items-center gap-3 mb-6">
                    <LuCheckCircle2 className="text-student-accent" /> Strategy Guide
                </h3>
                <ul className="space-y-4">
                    {[
                        'Prioritize High-Yield Topics first',
                        'Shift to 2hr deep-work sessions',
                        'Increase mock test frequency by 20%',
                        'Focus on OS Deadlock theory revisions'
                    ].map((text, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                            <LuPlus size={14} className="mt-1 text-student-accent group-hover:rotate-90 transition-transform" />
                            <p className="text-sm font-bold text-os-muted leading-relaxed group-hover:text-white transition-colors">{text}</p>
                        </li>
                    ))}
                </ul>
                <button className="w-full mt-8 px-6 py-4 bg-white/5 border border-white/10 hover:border-student-accent/50 hover:bg-student-accent/10 rounded-2xl font-black text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 group">
                    GENERATE CUSTOM PLAN <LuChevronRight className="group-hover:translate-x-1 transition-transform" size={14} />
                </button>
            </div>

            <div className="p-8 rounded-3xl bg-black border border-os-border space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center font-black">!</div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Critical Alert</h3>
                </div>
                <p className="text-xs text-os-muted leading-relaxed italic">
                    "Mathematics score shows a 3% dip in consistency over the last 48 hours. Suggest solving 5 Calculus problems now."
                </p>
                <div className="h-1 w-1/2 bg-orange-500 rounded-full" />
            </div>
        </div>
      </div>
    </div>
  );
}
