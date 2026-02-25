import { NextResponse } from "next/server";
import { COMPANY_OPTIONS } from "@/lib/submissions";
import { getSheetsClient, getSheetsReadClient, getSpreadsheetId, SHEET_RANGE } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeName, employeeId, company, attendance, language } = body;

    if (!employeeName?.trim()) {
      return NextResponse.json(
        { error: "Employee name is required" },
        { status: 400 }
      );
    }
    if (!employeeId?.trim()) {
      return NextResponse.json(
        { error: "Employee ID is required" },
        { status: 400 }
      );
    }
    if (!company || !COMPANY_OPTIONS.includes(company)) {
      return NextResponse.json(
        { error: "Please select a valid company" },
        { status: 400 }
      );
    }
    if (attendance !== "Yes" && attendance !== "No") {
      return NextResponse.json(
        { error: "Please confirm attendance (Yes or No)" },
        { status: 400 }
      );
    }

    const trimmedId = String(employeeId).trim();
    const spreadsheetId = getSpreadsheetId();
    const sheetsRead = getSheetsReadClient();

    const existing = await sheetsRead.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!C:C",
    });
    const rawIds = (existing.data.values || []) as string[][];
    const dataRows = rawIds.length > 1 ? rawIds.slice(1) : rawIds;
    const ids = dataRows
      .flat()
      .map((s) => String(s ?? "").trim())
      .filter(Boolean);
    if (ids.some((id) => id === trimmedId)) {
      return NextResponse.json(
        { error: "duplicate_employee_id" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? String(forwarded).split(",")[0].trim() : (request.headers.get("x-real-ip") ?? "");

    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: SHEET_RANGE,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            String(employeeName).trim(),
            trimmedId,
            company,
            attendance,
            language === "ar" ? "ar" : "en",
            userAgent,
            ip,
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thank you. Your response has been recorded.",
    });
  } catch (e) {
    console.error("Submit error:", e);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
