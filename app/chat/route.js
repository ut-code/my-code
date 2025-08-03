import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';


const genAI = new GoogleGenerativeAI(process.env.API_KEY);

export async function POST(request) {
  const { message } = await request.json();


  if (!message) {
    return NextResponse.json(
      { error: "メッセージがありません。" },
      { status: 400 }
    );
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (e) {

    console.error("Error:", e);
    return NextResponse.json(
      { response: "エラーが発生しました。" },
      { status: 500 }
    );
  }
}