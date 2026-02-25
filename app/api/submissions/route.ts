import { NextResponse } from "next/server";
import { getSheetsReadClient, getSpreadsheetId, SHEET_RANGE } from "@/lib/sheets";

export async function GET() {
  try {
    const sheets = getSheetsReadClient();
    const spreadsheetId = getSpreadsheetId();

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_RANGE,
    });

    const rows = res.data.values || [];
    const [_, ...dataRows] = rows;

    const submissions = dataRows
      .filter((r) => r.length >= 5)
      .map((r, i) => ({
        id: `row-${i}-${r[0] ?? ""}`,
        employeeName: String(r[1] ?? ""),
        employeeId: String(r[2] ?? ""),
        company: String(r[3] ?? ""),
        attendance: (r[4] === "No" ? "No" : "Yes") as "Yes" | "No",
        submittedAt: String(r[0] ?? new Date().toISOString()),
      }))
      .reverse();

    return NextResponse.json({ submissions });
  } catch (e: unknown) {
    let message = "Failed to load submissions";
    if (e instanceof Error) message = e.message;
    else if (e && typeof e === "object" && "response" in e) {
      const res = (e as { response?: { data?: { error?: { message?: string } } } }).response;
      if (res?.data?.error?.message) message = res.data.error.message;
    }
    console.error("Submissions fetch error:", e);
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
