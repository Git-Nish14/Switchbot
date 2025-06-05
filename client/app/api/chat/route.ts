import { NextResponse } from "next/server";
import { openaiBot } from "@/lib/openaiBot";
import { classifierBot } from "@/lib/classifierBot";

export async function POST(req: Request) {
  const { message, mode } = await req.json();

  let reply = "Default fallback reply";

  if (mode === "gpt") {
    reply = await openaiBot(message);
  } else if (mode === "offline") {
    reply = classifierBot(message);
  } else {
    reply = "Invalid mode selected.";
  }

  return NextResponse.json({ reply });
}
