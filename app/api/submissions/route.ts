import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/db";

export async function GET() {
  try {
    const submissions = await getSubmissions();
    return NextResponse.json({ submissions });
  } catch (e) {
    console.error("Submissions fetch error:", e);
    return NextResponse.json(
      { error: "Failed to load submissions" },
      { status: 500 }
    );
  }
}
