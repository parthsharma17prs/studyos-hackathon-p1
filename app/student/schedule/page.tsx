'use client';

import { useState, useEffect } from 'react';
import { LuCalendar, LuPlus, LuClock, LuBookOpen, LuCheckCircle2, LuAlertCircle, LuTrash2 } from 'react-icons/lu';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';

interface ScheduleTask {
  id: string; // Firebase doc id
  time: string;
  task: string;
  subject: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export default function StudySchedulePage() {
  const [tasks, setTasks] = useState<ScheduleTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ task: '', subject: 'Computer Science', priority: 'medium' as const, time: '09:00 AM' });

  // Real-time Firestore Sync
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('studyos_user') || '{}');
    if (!user.uid) return;

    const q = query(
      collection(db, "tasks"), 
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScheduleTask[];
      setTasks(taskList.sort((a,b) => a.time.localeCompare(b.time)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    const user = JSON.parse(localStorage.getItem('studyos_user') || '{}');
    if (!user.uid || !newTask.task) return;

    try {
      await addDoc(collection(db, "tasks"), {
        ...newTask,
        userId: user.uid,
        completed: false,
        createdAt: serverTimestamp()
      });
      setNewTask({ ...newTask, task: '' }); // Clear input
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "tasks", id), {
        completed: !currentStatus
      });
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-5xl font-black tracking-tighter mb-4">
            Study <span className="text-student-accent">Schedule</span>
          </h1>
          <div className="flex flex-wrap gap-4 mt-8">
            <input 
              type="text" 
              placeholder="New Focus Task..." 
              value={newTask.task}
              onChange={(e) => setNewTask({...newTask, task: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              className="flex-1 bg-black/50 border border-os-border focus:border-student-accent rounded-xl p-4 text-white outline-none"
            />
            <select 
              value={newTask.priority}
              onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
              className="bg-black/50 border border-os-border rounded-xl p-4 text-os-muted outline-none"
            >
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <button 
              onClick={addTask}
              className="flex items-center gap-2 px-8 py-4 bg-student-accent hover:bg-red-700 text-white rounded-xl font-black transition-all hover:scale-105"
            >
              <LuPlus size={20} />
              <span>LOG TASK</span>
            </button>
          </div>
        </div>
      </div>

      <div className="ribbon-student" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Calendar View (Mock) */}
        <div className="glass-card p-8 space-y-6 flex flex-col items-center">
            <LuCalendar className="text-student-accent mb-2" size={48} />
            <h3 className="text-xl font-black tracking-tight">March 2026</h3>
            <div className="grid grid-cols-7 gap-2 w-full text-center text-[10px] font-black text-os-muted mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2 w-full">
                {Array.from({ length: 31 }, (_, i) => (
                    <div 
                        key={i} 
                        className={`aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer
                            ${i + 1 === 30 ? 'bg-student-accent text-white shadow-[0_0_10px_rgba(229,9,20,0.5)]' : 'hover:bg-white/10 text-os-muted hover:text-white'}
                        `}
                    >
                        {i + 1}
                    </div>
                ))}
            </div>
            <div className="pt-6 w-full space-y-4">
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                    <LuCheckCircle2 className="text-green-500" />
                    <div>
                        <p className="text-[10px] font-black text-green-500 uppercase tracking-widest">Completed Today</p>
                        <p className="text-lg font-black text-white">1 Task</p>
                    </div>
                </div>
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3">
                    <LuAlertCircle className="text-orange-500" />
                    <div>
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Pending Tasks</p>
                        <p className="text-lg font-black text-white">3 Tasks</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <LuClock className="text-student-accent" /> Daily Agenda
            </h2>
            <span className="text-os-muted text-xs font-bold tracking-widest uppercase">30 March, Monday</span>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="w-8 h-8 border-2 border-student-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="glass-card p-12 text-center text-os-muted italic uppercase font-black text-xs">
                No active tasks found in the database.
              </div>
            ) : tasks.map((task) => (
              <div 
                key={task.id} 
                className={`glass-card p-6 flex items-center gap-6 transition-all duration-300 group ${task.completed ? 'opacity-50 grayscale' : 'hover:border-student-accent/30 hover:bg-white/5'}`}
              >
                <div 
                  onClick={() => toggleTask(task.id, task.completed)}
                  className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all
                    ${task.completed ? 'bg-green-500 border-green-500' : 'border-os-border group-hover:border-student-accent'}
                  `}
                >
                  {task.completed && <LuCheckCircle2 className="text-white" size={18} />}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-student-accent flex items-center gap-1 uppercase tracking-widest">
                      <LuClock size={10} /> {task.time}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border
                        ${task.priority === 'high' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 
                          task.priority === 'medium' ? 'border-orange-500/20 text-orange-500 bg-orange-500/5' : 
                          'border-blue-500/20 text-blue-500 bg-blue-500/5'}
                    `}>
                        {task.priority}
                    </span>
                  </div>
                  <h3 className={`text-lg font-black tracking-tight ${task.completed ? 'line-through' : 'text-white'}`}>
                    {task.task}
                  </h3>
                  <div className="flex items-center gap-2 text-os-muted">
                    <LuBookOpen size={12} />
                    <span className="text-xs font-bold uppercase tracking-widest">{task.subject}</span>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-4">
                    <button onClick={() => deleteTask(task.id)} className="text-os-muted hover:text-red-500 transition-colors">
                        <LuTrash2 size={24} />
                    </button>
                    <button className="text-os-muted hover:text-red-500 transition-colors">
                        <LuPlus className="rotate-45" size={24} />
                    </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-r from-red-600/10 via-transparent to-transparent border border-red-600/20 flex items-center justify-between group">
            <div className="space-y-2">
                <h3 className="text-xl font-black italic tracking-tighter">"Consistency is the currency of masters."</h3>
                <p className="text-xs text-os-muted font-bold tracking-widest uppercase">— STUDY OS AI MOTIVATION</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-student-accent/20 flex items-center justify-center text-student-accent group-hover:scale-110 transition-transform">
                S
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
