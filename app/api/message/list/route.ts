import OpenAI from "openai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { threadId } = await req.json();
  if (!threadId) {
    return NextResponse.json(
      {
        error: "Thread is required",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    const openai = new OpenAI();
    const response = await openai.beta.threads.messages.list(threadId);

    return NextResponse.json({ messages: response.data, success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Something went wrong",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};
