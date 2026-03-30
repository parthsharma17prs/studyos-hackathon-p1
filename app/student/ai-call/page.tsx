'use client';

import { useState, useEffect, useRef } from 'react';
import Vapi from '@vapi-ai/web';
import { 
    LuPhone, LuMic, LuZap, LuActivity, LuChevronRight, 
    LuSparkles, LuPhoneCall, LuLogOut, LuCircleStop, 
    LuCalendar, LuTrendingUp, LuMessageSquare 
} from 'react-icons/lu';

// Initialize Vapi Instance - Private Key from user used as Public for demo if needed
// In production, separate Public/Private keys are used. 
const vapi = new Vapi('48e82ecf-732a-4c0f-9768-bf9189d82da2');

export default function AiCallingPage() {
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
  const [transcript, setTranscript] = useState<{ role: 'ai' | 'user' | 'system', text: string }[]>([]);
  const [activeSpeech, setActiveSpeech] = useState('');
  const [isAiTalking, setIsAiTalking] = useState(false);

  useEffect(() => {
    // Vapi Event Listeners
    vapi.on('call-start', () => {
      setCallStatus('active');
      setIsCalling(true);
      setTranscript(prev => [...prev, { role: 'system', text: 'Secure uplink finalized.' }]);
    });

    vapi.on('call-end', async () => {
      setCallStatus('idle');
      setIsCalling(false);
      setActiveSpeech('');
      
      // Analyze and store problem
      try {
        await fetch('/api/analyze-call', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            transcript: transcriptRef.current,
            studentId: 'parth-demo-001'
          })
        });
      } catch (err) {
        console.error('Failed to store problem log:', err);
      }
    });

    vapi.on('speech-start', () => {
        setIsAiTalking(true);
    });

    vapi.on('speech-end', () => {
        setIsAiTalking(false);
    });

    vapi.on('message', (message) => {
      if (message.type === 'transcript' && message.transcriptType === 'partial') {
        setActiveSpeech(message.transcript);
      }
      if (message.type === 'transcript' && message.transcriptType === 'final') {
        const newMsg = { 
            role: message.role === 'assistant' ? 'ai' : 'user', 
            text: message.transcript 
        };
        // @ts-ignore
        setTranscript(prev => [...prev, newMsg]);
        transcriptRef.current = [...transcriptRef.current, newMsg];
        setActiveSpeech('');
      }
    });

    return () => {
      vapi.stop();
    };
  }, []);

  const transcriptRef = useRef<any[]>([]);

  const startCall = async () => {
    setCallStatus('connecting');
    transcriptRef.current = [];
    
    // RAG: Fetching real student data (mocked for demo)
    const studentContext = {
        name: "Parth",
        recentScore: "45%",
        weakTopic: "Data Structures (Linked Lists)",
        lastActive: "2 days ago"
    };

    try {
      // @ts-ignore
      await vapi.start({
        name: 'Parth (StudyOS Advisor)',
        model: {
          provider: 'groq',
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: `
              You are Parth, a personal AI study advisor at StudyOS. 
              
              CONTEXT: 
              - Student: \${studentContext.name}
              - Recent Score: \${studentContext.recentScore}
              - Weak Topic: \${studentContext.weakTopic}

              TASK: Give ONE quick study tip.
              
              FIRST MESSAGE: "Hello! This is Parth from StudyOS. Is this a good time to talk for two minutes?"

              STYLE: 
              - Extremely concise (max 2 sentences).
              - Indian English tone.
              - No lists.
              `
            }
          ]
        },
        voice: {
          provider: '11labs',
          voiceId: 'Raju-English-Indian'
        },
        firstMessage: "Hello! This is Parth from StudyOS. Is this a good time to talk for two minutes?"
      });
    } catch (e) {
      console.error('Vapi Start Error:', e);
      setCallStatus('idle');
    }
  };

  const endCall = () => {
    vapi.stop();
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter mb-2 italic">
            Orbital <span className="text-student-accent">Voice</span>
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-student-accent animate-pulse" />
            <p className="text-os-muted font-bold tracking-[0.2em] uppercase text-[9px]">Neural Uplink Active • Vapi Protocol 2.4</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-os-border px-8 py-5 rounded-3xl group shadow-[0_0_50px_rgba(255,0,0,0.05)]">
          <div className="text-right">
            <p className="text-[10px] font-black text-os-muted uppercase tracking-[0.2em] mb-1">Status</p>
            <p className={`text-xl font-black italic transition-colors ${isCalling ? 'text-green-500' : 'text-os-muted'}`}>
                {callStatus === 'active' ? 'ENCRYPTED CHANNEL' : callStatus === 'connecting' ? 'NEGOTIATING...' : 'STANDBY MODE'}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isCalling ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-os-muted'} transition-all`}>
            <LuPhoneCall size={24} className={isCalling ? 'animate-bounce' : ''} />
          </div>
        </div>
      </div>

      <div className="ribbon-student" />

      {/* Main UI */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-3 gap-12 mt-4">
        
        {/* Visualizer Area */}
        <div className="lg:col-span-2 flex flex-col bg-gradient-to-br from-white/5 to-transparent border border-os-border rounded-[40px] overflow-hidden relative min-h-[500px]">
            
            {/* Pulsing Visualizer */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`w-64 h-64 border-[1px] border-student-accent/30 rounded-full transition-all duration-300 ${isAiTalking ? 'scale-150 opacity-20' : 'scale-100 opacity-5'}`} />
                <div className={`absolute w-80 h-80 border-[1px] border-student-accent/20 rounded-full transition-all duration-500 ${isAiTalking ? 'scale-150 opacity-10' : 'scale-100 opacity-0'}`} />
                <div className={`absolute w-[400px] h-[400px] border-[1px] border-student-accent/10 rounded-full transition-all duration-700 ${isAiTalking ? 'scale-150 opacity-5' : 'scale-100 opacity-0'}`} />
            </div>

            <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-12 text-center">
                {isCalling ? (
                    <div className="space-y-12 w-full">
                        <div className="relative inline-block">
                            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center shadow-[0_0_100px_rgba(229,9,20,0.4)] border-4 border-student-accent/50 animate-pulse transition-all">
                                <LuMic size={64} className="text-white" />
                            </div>
                            {isAiTalking && (
                                <div className="absolute -top-4 -right-4 bg-student-accent text-white p-3 rounded-full animate-bounce shadow-xl">
                                    <LuSparkles size={20} />
                                </div>
                            )}
                        </div>

                        {/* Partial Transcript / Live Listening */}
                        <div className="max-w-md mx-auto h-20 flex items-center justify-center px-6">
                            <p className="text-xl font-black italic text-white tracking-tight animate-in fade-in duration-300">
                                {activeSpeech || (isAiTalking ? "Dr. Mentor is speaking..." : "Listening...")}
                            </p>
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            <button 
                                onClick={isCalling ? endCall : startCall} 
                                title={isCalling ? "Pause Call" : "Start Call"}
                                className="w-20 h-20 rounded-full bg-white/5 border-2 border-os-border flex items-center justify-center text-white hover:border-student-accent transition-all active:scale-90 shadow-xl"
                            >
                                {isCalling ? <LuCircleStop size={32} /> : <LuMic size={32} />}
                            </button>
                            <button 
                                onClick={endCall} 
                                className="bg-student-accent text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.3em] transition-all flex items-center gap-4 group shadow-[0_0_50px_rgba(255,51,0,0.3)] hover:scale-105 active:scale-95"
                            >
                                TERMINATE <LuLogOut />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="w-32 h-32 rounded-3xl bg-white/5 border border-os-border flex items-center justify-center text-os-muted mx-auto group-hover:border-student-accent transition-all">
                            <LuPhone size={48} />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-black italic tracking-tighter uppercase">Initialize Neural Link</h2>
                            <p className="text-os-muted text-xs font-bold tracking-widest uppercase max-w-xs mx-auto">Voice-first cognitive optimization for students.</p>
                        </div>
                        <button 
                            onClick={startCall}
                            disabled={callStatus === 'connecting'}
                            className="bg-student-accent text-white px-16 py-6 rounded-3xl font-black uppercase tracking-[0.4em] hover:scale-110 active:scale-95 transition-all shadow-[0_0_60px_rgba(255,51,0,0.4)] disabled:opacity-50"
                        >
                            {callStatus === 'connecting' ? 'NEGOTIATING...' : 'CONNECT NOW →'}
                        </button>
                    </div>
                )}
            </div>

            {/* Bottom Info Bar */}
            <div className="bg-black/40 border-t border-os-border p-6 flex justify-between items-center relative z-20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <LuActivity className="text-student-accent animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-os-muted">Biometric optimization: Active</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-os-muted italic">
                    Latency: <span className="text-green-500">42ms</span>
                </div>
            </div>
        </div>

        {/* Real-time Subtitles / Log Area */}
        <div className="flex flex-col gap-8">
            <div className="glass-card flex-1 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3">
                        <LuMessageSquare className="text-student-accent" /> Uplink Logs
                    </h3>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-student-accent animate-ping" />
                        <div className="w-1 h-1 rounded-full bg-student-accent animate-ping delay-150" />
                        <div className="w-1 h-1 rounded-full bg-student-accent animate-ping delay-300" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar max-h-[400px]">
                    {transcript.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center opacity-20 italic">
                            <p className="text-xs font-bold">No active logs</p>
                        </div>
                    )}
                    {transcript.map((msg, i) => (
                        <div key={i} className={`p-4 rounded-2xl text-[11px] font-bold leading-relaxed border animate-in slide-in-from-left-2 duration-300 ${
                            msg.role === 'user' ? 'bg-student-accent border-student-accent text-white ml-8 shadow-lg' : 
                            msg.role === 'ai' ? 'bg-black/60 border-os-border text-white mr-8 shadow-inner' : 
                            'bg-white/5 border-transparent text-os-muted italic mx-auto w-full text-center'
                        }`}>
                            <span className="opacity-40 uppercase mr-2 text-[9px]">{msg.role}:</span>
                            {msg.text}
                        </div>
                    ))}
                    {activeSpeech && (
                        <div className="p-4 rounded-2xl text-[11px] font-bold leading-relaxed border bg-black/30 border-dashed border-os-border text-os-muted animate-pulse">
                            <span className="opacity-40 uppercase mr-2 text-[9px]">User (Live):</span>
                            {activeSpeech}...
                        </div>
                    )}
                </div>
            </div>

            <div className="p-8 glass-card border-student-accent/10 bg-gradient-to-tr from-os-card to-transparent group cursor-pointer hover:border-student-accent/30 transition-all">
                <div className="flex items-center gap-4 mb-4">
                    <LuTrendingUp className="text-student-accent" />
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-os-muted">Live Analysis</h4>
                </div>
                <div className="h-1 bg-os-border rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-student-accent w-2/3 animate-progress transition-all" />
                </div>
                <p className="text-[10px] font-bold text-os-muted italic">Confidence Score: <span className="text-white">94.2%</span></p>
            </div>
        </div>

      </div>
    </div>
  );
}
