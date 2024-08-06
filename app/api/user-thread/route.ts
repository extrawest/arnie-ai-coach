import OpenAI from "openai";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

import { getXataClient } from "@/database/xata";

export const GET = async () => {
  const user = await currentUser();
  const xataClient = getXataClient();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "unautorized" },
      {
        status: 403,
      }
    );
  }

  try {
    const userThread = await xataClient.db.userThread
      .filter("userId", user.id)
      .getFirst();

    if (userThread) {
      const userThreadAsObject = userThread.toSerializable();
      return NextResponse.json(
        { userThread: userThreadAsObject, success: true },
        { status: 200 }
      );
    }

    if (!userThread) {
      const openai = new OpenAI();
      const thread = await openai.beta.threads.create();
      const newUserThread = await xataClient.db.userThread.create({
        threadId: thread.id,
        userId: user.id,
      });
      const newUserThreadAsObject = newUserThread.toSerializable();
      return NextResponse.json(
        { userThread: newUserThreadAsObject, success: true },
        { status: 200 }
      );
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      {
        status: 500,
      }
    );
  }
};
