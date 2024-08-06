import axios from "axios";
import OpenAI from "openai";
import { JSONData } from "@xata.io/client";
import { NextResponse } from "next/server";

import { UserThread } from "@/database/xata";
import { getXataClient } from "@/database/xata";

interface UserThreadMap {
  [userId: string]: JSONData<UserThread>;
}

export const POST = async (request: Request) => {
  const body = await request.json();

  const { challengeId, secret } = body;

  if (!challengeId || !secret) {
    return NextResponse.json(
      { error: "Challenge ID and secret are required" },
      { status: 400 }
    );
  }

  if (secret !== process.env.APP_SECRET_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
          Generate an ultra-intense, hard-hitting motivational message, followed by a concise, bullet-pointed, no-equipment-needed workout plan. The time of day provided should be taken into account. This output should strictly contain two parts: first, a motivational message in the style of Arnold Schwarzenegger. The message must be direct, confrontational, and incorporate Arnold's known phrases like 'I need your clothes, your boots, and your motorcycle' and other Terminator-related phrases. The second part should be a workout list: intense, high-impact exercises that can be done anywhere, designed to be completed within 10 minutes. The output must only include these two components, nothing else.

          Here's an example output that you should follow:

          Time to terminate the laziness! I need your clothes, your boots, and your determination. No more excuses, no more second-guessing. You're a machine, a Terminator, and this morning, we're going to crush this workout with the strength of a cybernetic organism. Let's make every second count and dominate this 10-minute workout. Remember, pain is temporary, but glory is forever. Let's go!

          - Chest: 30, 12, 10, 8, 6 (Low Angle Incline)
          - Back Exercise: 8, 6, 4, 2 (Wide Grip Chin Ups)
          - Abs: Leg Raises (5 Sets of 25 Reps)
        `,
    },
    {
      role: "user",
      content: "Generate a motivational message and a workout plan.",
    },
  ];

  const client = getXataClient();
  const challengePreferences = await client.db.challengePreferences
    .filter({ challengeId })
    .getAll();
  const serializedChallengePreferences = challengePreferences.toSerializable();

  const userIds = serializedChallengePreferences.map((preference) =>
    preference.userId?.toString()
  );

  const filteredUsers = userIds.filter((userId) => userId !== undefined);
  if (!userIds.length) {
    return NextResponse.json({ message: "No users found" }, { status: 200 });
  }

  const {
    data: { message, success },
  } = await axios.post<{
    message: string;
    success: boolean;
  }>(`${process.env.__NEXT_PRIVATE_ORIGIN}/api/openai`, {
    messages,
    secret: process.env.APP_SECRET_KEY,
  });

  const userThreads = await client.db.userThread
    .filter({
      userId: { $any: filteredUsers },
    })
    .getMany();
  const serializedUserThreads = userThreads.toSerializable();

  const userThreadMap: UserThreadMap = serializedUserThreads.reduce(
    (map, thread) => {
      map[thread.userId || ""] = thread;
      return map;
    },
    {} as UserThreadMap
  );

  try {
    const threadPromises: Promise<any>[] = [];
    challengePreferences.forEach((preference) => {
      const userThread = userThreadMap[preference.userId?.toString() || ""];
      if (userThread) {
        threadPromises.push(
          axios.post(
            `${process.env.__NEXT_PRIVATE_ORIGIN}/api/message/create`,
            {
              message,
              formUser: false,
              threadId: userThread.threadId,
            }
          )
        );
      }
    });
    await Promise.all(threadPromises);

    return NextResponse.json(
      {
        message,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
};
