import OpenAI from "openai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { message, threadId, fromUser = false } = await req.json();
  if (!threadId || !message) {
    return NextResponse.json(
      {
        error: "Thread and message are required",
        success: false,
      },
      { status: 400 }
    );
  }

  try {
    const openai = new OpenAI();

    const threadMessage = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
      metadata: {
        fromUser: `${fromUser}`,
      },
    });

    console.log(threadMessage);

    return NextResponse.json(
      { message: threadMessage, success: true },
      { status: 201 }
    );
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
