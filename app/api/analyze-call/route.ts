import { NextRequest, NextResponse } from 'next/server';
import { callGemini } from '@/lib/gemini';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { transcript, studentId } = await req.json();

    if (!transcript || !transcript.length) {
      return NextResponse.json({ message: 'No transcript to analyze' });
    }

    const transcriptText = transcript
      .map((m: any) => `${m.role.toUpperCase()}: ${m.text}`)
      .join('\n');

    const prompt = `
    Analyze the following conversation between an AI Study Advisor (Parth) and a student.
    Extract the specific academic or personal study problem the student is facing.
    
    TRANSCRIPT:
    ${transcriptText}
    
    Return ONLY a JSON object: { "problem": "...", "sentiment": "...", "next_step": "..." }
    `;

    const analysisRes = await callGemini({ prompt, temperature: 0.1 });
    let analysis;
    try {
        analysis = JSON.parse(analysisRes);
    } catch {
        const match = analysisRes.match(/\{[\s\S]*\}/);
        analysis = match ? JSON.parse(match[0]) : { problem: analysisRes };
    }

    // Store in a JSON file (simple mock for "storing in json")
    const logPath = path.join(process.cwd(), 'data', 'student-problems.json');
    if (!fs.existsSync(path.dirname(logPath))) {
        fs.mkdirSync(path.dirname(logPath), { recursive: true });
    }

    let logs = [];
    if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        try { logs = JSON.parse(content); } catch { logs = []; }
    }

    const newLog = {
        studentId: studentId || 'anonymous',
        timestamp: new Date().toISOString(),
        analysis,
        transcript: transcriptText
    };

    logs.push(newLog);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    return NextResponse.json({ success: true, analysis });

  } catch (error: any) {
    console.error('Analysis Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
