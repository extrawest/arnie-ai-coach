import { NextResponse } from "next/server";
import OpenAI from "openai";

export const POST = async (req: Request) => {
  const { threadId, assistandId } = await req.json();

  if (!threadId || !assistandId) {
    return NextResponse.json(
      {
        error: "threadId and assistandId are required",
        success: false,
      },
      {
        status: 400,
      }
    );
  }
  try {
    const openai = new OpenAI();
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistandId,
    });
    console.log(run);
    return NextResponse.json({ run, success: true }, { status: 201 });
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

export default POST;
