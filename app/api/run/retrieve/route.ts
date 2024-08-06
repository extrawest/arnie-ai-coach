import OpenAI from "openai";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { threadId, runId } = await req.json();

  if (!threadId || !runId) {
    return NextResponse.json(
      {
        error: "threadId and runId are required",
        success: false,
      },
      {
        status: 400,
      }
    );
  }

  try {
    const openai = new OpenAI();
    const run = await openai.beta.threads.runs.retrieve(threadId, runId);
    return NextResponse.json({ run, success: true }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        error: "Something went wring",
        success: false,
      },
      {
        status: 500,
      }
    );
  }
};
