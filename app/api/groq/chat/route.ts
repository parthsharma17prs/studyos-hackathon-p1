import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages, systemPrompt } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful AI study assistant for the StudyOS platform. Provide concise, premium quality advice.',
        },
        ...messages,
      ],
      model: 'llama3-70b-8192',
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'I am processing your request.';
    
    return NextResponse.json({ text: response });
  } catch (error: any) {
    console.error('Groq Chat Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
