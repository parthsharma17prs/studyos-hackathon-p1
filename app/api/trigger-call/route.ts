import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber: rawPhone, name } = await req.json();

    if (!rawPhone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    const phoneNumber = rawPhone.startsWith('+') ? rawPhone : `+${rawPhone}`;

    const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
    const ULTRAVOX_API_KEY = process.env.ULTRAVOX_API_KEY;

    if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_PHONE_NUMBER || !ULTRAVOX_API_KEY) {
      return NextResponse.json({ error: 'Missing environment variables' }, { status: 500 });
    }

    // 1. Create call on Ultravox to get joinUrl
    const SYSTEM_PROMPT = `
    You are Parth, a personal AI study advisor at StudyOS.
    StudyOS helps Indian college students improve their quiz scores, track performance, detect learning gaps, and build personalized study schedules using AI.
    You handle inbound calls from students who request help on the platform.
    You must always begin the call by saying:
    "Hello! This is Parth from StudyOS. Is this a good time to talk for two minutes?"

    Call Flow:
    1. Check Availability.
    2. Company Introduction.
    3. Need Discovery (Ask ONE question at a time).
    4. Solution — Give ONE Clear Action.
    5. Wrap Up.

    Style: Simple, friendly, and encouraging language. Listen first. Speak like a helpful senior student.
    `;

    const ultravoxConfig = {
      systemPrompt: SYSTEM_PROMPT,
      model: 'ultravox-v0.7',
      voice: 'Raju-English-Indian', // Indian voice
      temperature: 0.3,
      firstSpeakerSettings: { user: {} },
      medium: { twilio: {} }
    };

    const ultravoxRes = await fetch('https://api.ultravox.ai/api/calls', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': ULTRAVOX_API_KEY
      },
      body: JSON.stringify(ultravoxConfig)
    });

    const ultravoxData = await ultravoxRes.json();

    if (!ultravoxRes.ok) {
      throw new Error(`Ultravox API Error: ${JSON.stringify(ultravoxData)}`);
    }

    const joinUrl = ultravoxData.joinUrl;
    if (!joinUrl) {
      throw new Error('No joinUrl received from Ultravox');
    }

    // 2. Initiate Twilio Call
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    const call = await client.calls.create({
      twiml: `<Response><Connect><Stream url="${joinUrl}"/></Connect></Response>`,
      to: phoneNumber,
      from: TWILIO_PHONE_NUMBER
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Call initiated successfully via Ultravox + Twilio',
      callSid: call.sid 
    });

  } catch (error: any) {
    console.error('Call Trigger Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
