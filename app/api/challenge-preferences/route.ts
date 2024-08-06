import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { getXataClient } from "@/database/xata";

export const POST = async (req: Request) => {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const response = await req.json();
  const { id, sendNotifications, challengeId } = response;
  console.log(id, sendNotifications, challengeId);

  if (!id || sendNotifications === undefined || !challengeId) {
    return NextResponse.json(
      {
        message: "Invalid request",
      },
      {
        status: 400,
      }
    );
  }

  try {
    const client = getXataClient();

    const updateChallengePreferences =
      await client.db.challengePreferences.update(id, {
        sendNotifications,
        challengeId,
      });

    return NextResponse.json({
      success: true,
      data: updateChallengePreferences?.toSerializable(),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while updating challenge preferences",
      },
      {
        status: 500,
      }
    );
  }
};
