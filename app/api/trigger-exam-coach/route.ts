import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber: rawPhone, studentName, subject, redTopics, yellowTopics } = await req.json();

    if (!rawPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const phoneNumber = rawPhone.startsWith('+') ? rawPhone : `+${rawPhone}`;

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;

    // Exam Coach Script
    const SYSTEM_PROMPT = `
    You are Parth, a virtual exam coach at StudyOS.
    StudyOS is an AI-powered study platform that helps Indian college students prepare strategically for exams using their own notes and past paper analysis.

    You are calling ${studentName} because their ${subject} exam is in 3 days.

    Call Flow:
    1. Greeting: "Hello! This is Parth from StudyOS. Is this ${studentName}?"
    2. Confirm: If confirmed, say: "Hi ${studentName}! Quick call — I know your ${subject} exam is in 3 days, and I want to give you the exact strategy our AI has prepared. Just 2 minutes. Okay?"
    3. Tone: Calm and structured. "First — take a breath. 3 days is enough time if you study the right things in the right order."
    4. Plan: 
       - DAY 1 (Today): Focus on red topics: ${redTopics || 'the ones you struggled with in quizzes'}. maximum 2 hours.
       - DAY 2 (Tomorrow): Yellow topics: ${yellowTopics || 'topics you partially know'}. Take one full mock quiz.
       - DAY 3 (Before): Light review, flashcards, 8 hours sleep.
    5. Tips: Mention AI analyzed 5 years of ${subject} papers. High probability topics are key.
    6. Close: Everything is on your StudyOS dashboard. "You have done the preparation. Now execute it. All the very best, ${studentName}!"

    Style:
    - Calm, not panicky.
    - Indian touch in English (helpful senior student).
    - Max call: 3 minutes.
    `;

    // 1. Create Ultravox Call
    const ultravoxRes = await fetch('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY || ''
      },
      body: JSON.stringify({
        systemPrompt: SYSTEM_PROMPT,
        model: 'ultravox-v0.7',
        voice: 'Raju-English-Indian', // Indian voice
        medium: { twilio: {} }
      })
    });

    const ultravoxData = await ultravoxRes.json();

    // 2. Trigger Twilio Call
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const call = await client.calls.create({
      twiml: `<Response><Connect><Stream url="${ultravoxData.joinUrl}"/></Connect></Response>`,
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER || ''
    });

    return NextResponse.json({ success: true, callSid: call.sid });
  } catch (error: any) {
    console.error('Exam Coach Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
