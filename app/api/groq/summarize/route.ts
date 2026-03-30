import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const content = formData.get('content') as string || '';
    const difficulty = formData.get('difficulty') as string || 'medium';
    const language = formData.get('language') as string || 'English';
    const questionCount = formData.get('questionCount') as string || '5';
    const format = formData.get('format') as string || 'text';
    const file = formData.get('file') as File | null;
    
    if (!content.trim() && !file) {
      return NextResponse.json({ error: 'Content or file is required' }, { status: 400 });
    }

    const formatPrompt = format ? `FORMAT FOCUS: Keep in mind the student selected "${format}" format. If video: write script notes. If ppt: write slide structures. If image: write visual prompts. If text: write deep textual notes.` : '';

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const promptText = `You are a professional study assistant. Extract key information from the provided text or document and output ONLY a valid JSON object with the following structure:
{
  "summary": [
    {
      "heading": "Clear Main Topic Heading",
      "description": "Comprehensive detailed description covering everything under this heading. Use multiple sentences."
    }
  ],
  "quiz": [
    {
      "question": "Clear question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1,
      "explanation": "Why this is correct.",
      "topic": "Concept Name"
    }
  ],
  "keyTerms": [
    { "term": "Term exactly as in text", "definition": "Clear concise definition" }
  ],
  "studyStrategy": "A 2-3 sentence strategic plan on how to master this material.",
  "confabulationFlags": []
}

Rules:
1. SUMMARY: Identify ALL the main headings/topics in the text. Number of summary items must depend on the number of main topics found.
2. Each summary item must have a 'heading' and a 'description'.
3. The 'description' must be detailed.
4. LANGUAGE: The resulting text should be in ${language}.
5. DIFFICULTY: Target difficulty level is ${difficulty}.
6. QUESTIONS: Generate EXACTLY ${questionCount} quiz questions.
${formatPrompt}
Make sure the output is pure JSON. Do not include markdown code blocks or extra text.

Here is the student's text/notes:
${content}`;

    const parts: any[] = [{ text: promptText }];
    
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: file.type || 'application/pdf'
        }
      });
    }

    const result = await model.generateContent(parts);
    const outputText = result.response.text();
    
    let studyData;
    try {
        studyData = JSON.parse(outputText);
    } catch {
        studyData = JSON.parse(outputText.replace(/```json/g, '').replace(/```/g, ''));
    }
    
    return NextResponse.json(studyData);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
