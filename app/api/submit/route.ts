import { NextResponse } from "next/server";
import { addSubmission, COMPANY_OPTIONS } from "@/lib/submissions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { employeeName, employeeId, company, attendance } = body;

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

    const submission = addSubmission({
      employeeName: String(employeeName).trim(),
      employeeId: String(employeeId).trim(),
      company,
      attendance,
    });

    return NextResponse.json({
      success: true,
      id: submission.id,
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
