import { getXataClient } from "@/database/xata";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const client = getXataClient();

    const assistants = await client.db.assistant.getAll();

    if (assistants.length === 0) {
      return NextResponse.json(
        { error: "No assistant found", success: false },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      { assistant: assistants[0].toSerializable(), success: true },
      { status: 200 }
    );
  } catch (e) {
    console.error(e, "Something went wrong");
  }
};
