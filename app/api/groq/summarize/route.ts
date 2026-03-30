import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional study assistant. Summarize the following notes into a concise, high-impact summary with bullet points. Use a premium, encouraging tone.',
        },
        {
          role: 'user',
          content: content,
        },
      ],
      model: 'llama3-8b-8192',
    });

    const summary = completion.choices[0]?.message?.content || 'Failed to generate summary.';
    
    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Groq API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
