'use client';

import { useState, useEffect, useRef } from 'react';
import { LuPhone, LuMic, LuZap, LuActivity, LuChevronRight, LuSparkles, LuPhoneCall, LuLogOut, LuStopCircle, LuCalendar, LuTrendingUp } from 'react-icons/lu';

export default function AiCallingPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [transcript, setTranscript] = useState<string[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Mock Speech Recognition (Usually would use Web Speech API or Vapi)
  const startVoiceInteraction = async () => {
    setCallStatus('connecting');
    setIsCalling(true);
    
    // Simulate connection
    setTimeout(() => {
        setCallStatus('active');
        setTranscript(["System: Secure channel established."]);
        speak("Hello, I am your StudyOS AI Mentor. How can I help you with your studies today?");
    }, 1500);
  };

  const speak = (text: string) => {
    setAiResponse(text);
    setTranscript(prev => [...prev, `AI: ${text}`]);
    // In a real app, use window.speechSynthesis or ElevenLabs
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleUserInput = async (text: string) => {
    setTranscript(prev => [...prev, `You: ${text}`]);
    
    try {
        const response = await fetch('/api/groq/chat', {
            method: 'POST',
            body: JSON.stringify({
                messages: [{ role: 'user', content: text }],
                systemPrompt: "You are a voice-based AI study mentor. Keep responses short (under 2 sentences) and highly encouraging."
            })
        });
        const data = await response.json();
        speak(data.text);
    } catch (e) {
        speak("I'm having trouble connecting to my brain right now.");
    }
  };

  const endCall = () => {
    window.speechSynthesis.cancel();
    setCallStatus('idle');
    setIsCalling(false);
    setTranscript([]);
  };

  const avatars = [
    { name: 'Dr. Mentor', role: 'Strategic Advisor', color: 'from-blue-600 to-blue-900', icon: LuZap },
    { name: 'Professor AI', role: 'Conceptual Expert', color: 'from-purple-600 to-purple-900', icon: LuSparkles },
    { name: 'Study Coach', role: 'Discipline & Habits', color: 'from-red-600 to-red-900', icon: LuActivity },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-4 italic">
            Orbital <span className="text-student-accent">Voice</span>
          </h1>
          <p className="text-os-muted font-bold tracking-[0.3em] uppercase text-[10px]">Real-time AI Mentorship & Flashcards</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-os-border px-8 py-5 rounded-3xl group">
          <div>
            <p className="text-[10px] font-black text-os-muted uppercase tracking-[0.2em] mb-1">VAPI Protocol</p>
            <p className={`text-xl font-black italic transition-colors ${isCalling ? 'text-green-500' : 'text-os-muted'}`}>
                {isCalling ? 'ENCRYPTED CHANNEL' : 'STANDBY MODE'}
            </p>
          </div>
          <LuPhoneCall size={32} className={`transition-all ${isCalling ? 'text-green-500 scale-110' : 'text-os-muted'}`} />
        </div>
      </div>

      <div className="ribbon-student" />

      {/* Main UI */}
      <div className="flex-1 flex flex-col lg:flex-row gap-12 mt-4">
        {/* Calling Interface */}
        <div className="lg:col-span-2 flex-grow flex flex-col bg-gradient-to-br from-white/5 to-transparent border border-os-border rounded-[40px] overflow-hidden relative">
            
            {/* Background Animation (Active) */}
            {isCalling && (
                <div className="absolute inset-0 z-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
                    <div className="absolute w-[800px] h-[800px] border-[40px] border-student-accent/30 rounded-full animate-ping delay-0" />
                    <div className="absolute w-[800px] h-[800px] border-[20px] border-student-accent/20 rounded-full animate-ping delay-500" />
                    <div className="absolute w-[800px] h-[800px] border-[10px] border-student-accent/10 rounded-full animate-ping delay-1000" />
                </div>
            )}

            <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-12 text-center space-y-8">
                {isCalling ? (
                    <>
                        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-4xl font-black italic shadow-[0_0_80px_rgba(229,9,20,0.5)] border-4 border-student-accent/50 animate-pulse transition-all">
                            <LuMic size={80} className="text-white" />
                        </div>
                        <div className="flex flex-col gap-4 mt-8 w-full max-w-sm mt-auto">
                            <input 
                                type="text" 
                                placeholder="Talk to Dr. Mentor..." 
                                className="bg-white/5 border border-os-border px-6 py-4 rounded-3xl outline-none focus:border-student-accent transition-all text-sm font-bold uppercase tracking-widest placeholder:text-os-muted"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                                        handleUserInput((e.target as HTMLInputElement).value);
                                        (e.target as HTMLInputElement).value = '';
                                    }
                                }}
                            />
                            <p className="text-[10px] text-os-muted font-black tracking-widest uppercase">REAL-TIME INFERENCE • ANALYZING TONE</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={endCall} className="p-8 rounded-full bg-black border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all hover:scale-110 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                                <LuStopCircle size={40} />
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                                <button 
                                    onClick={startVoiceInteraction}
                                    className="p-8 rounded-full bg-black border-2 border-student-accent text-student-accent hover:bg-student-accent hover:text-white transition-all hover:scale-110 shadow-[0_0_20px_rgba(255,51,0,0.3)] animate-pulse"
                                >
                                    <LuPhone size={40} />
                                </button>
                                <p className="text-[10px] text-os-muted font-black tracking-widest uppercase mt-4">DR. MENTOR IS ONLINE</p>
                            </>
                        )}
                    </div>

                {/* Transcript Overlay */}
                {isCalling && (
                    <div className="flex-1 lg:w-96 flex flex-col bg-white/5 border border-os-border rounded-[40px] p-8 max-h-[800px]">
                        <div className="flex items-center gap-4 mb-8">
                            <LuZap className="text-student-accent" size={24} />
                            <h3 className="text-xl font-black italic tracking-tighter uppercase">REAL-TIME TRANSCRIPT</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                            {transcript.map((msg, i) => (
                                <div key={i} className={`p-4 rounded-3xl text-xs font-bold leading-relaxed border ${
                                    msg.startsWith('You:') ? 'bg-student-accent border-student-accent text-white self-end text-right' : 'bg-black/40 border-os-border text-os-muted'
                                }`}>
                                    {msg}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls */}
            {!isCalling && (
                <div className="relative z-10 p-4 border-t border-os-border grid grid-cols-1 md:grid-cols-3 gap-4">
                    {avatars.map((avatar, i) => (
                        <div 
                            key={i} 
                            onClick={startVoiceInteraction}
                            className="glass-card p-6 flex flex-col items-center text-center gap-4 cursor-pointer hover:border-student-accent/40 group transition-all"
                        >
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-white border border-white/10 group-hover:scale-110 transition-transform`}>
                                <avatar.icon size={32} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-lg font-black italic tracking-tight">{avatar.name}</h4>
                                <p className="text-[10px] font-black text-os-muted tracking-widest uppercase">{avatar.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Sidebar Info */}
        <div className="w-full lg:w-80 space-y-8">
            <div className="p-8 glass-card border-student-accent/20 bg-gradient-to-br from-red-600/5 to-transparent space-y-6">
                <h3 className="text-xl font-black italic tracking-tighter group flex items-center gap-3">
                    <LuTrendingUp className="text-student-accent" /> Live Insights
                </h3>
                <div className="space-y-6">
                    <div>
                        <p className="text-[10px] font-black text-os-muted uppercase tracking-widest mb-3 italic">Conversation Topic</p>
                        <p className="text-sm font-black text-white uppercase italic tracking-tight">Active Learning Strategies</p>
                    </div>
                    <div className="w-full h-px bg-os-border" />
                    <div>
                        <p className="text-[10px] font-black text-os-muted uppercase tracking-widest mb-3 italic">Session Key Points</p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-student-accent" />
                                <span className="text-xs font-bold text-os-muted group-hover:text-white transition-colors">Spaced Repetition</span>
                            </li>
                            <li className="flex items-center gap-3 group">
                                <div className="w-1.5 h-1.5 rounded-full bg-student-accent" />
                                <span className="text-xs font-bold text-os-muted group-hover:text-white transition-colors">Cognitive Mapping</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="p-8 rounded-[30px] border border-os-border bg-black/50 space-y-4 group cursor-pointer hover:border-white/20 transition-all">
                <div className="flex items-center gap-3">
                    <LuCalendar className="text-os-muted group-hover:text-student-accent transition-colors" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-os-muted">Upcoming Call</h4>
                </div>
                <div className="space-y-1">
                    <p className="text-lg font-black italic tracking-tight underline-offset-4 decoration-student-accent group-hover:underline transition-all">Interview Simulation</p>
                    <p className="text-xs font-bold text-student-accent tracking-widest">TOMORROW • 10:00 AM</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
