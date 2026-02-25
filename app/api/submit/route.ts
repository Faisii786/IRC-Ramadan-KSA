import { NextResponse } from "next/server";
import { COMPANY_OPTIONS } from "@/lib/submissions";
import { addSubmission, hasEmployeeIdSubmitted } from "@/lib/db";

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

    const trimmedId = String(employeeId).trim();
    const alreadySubmitted = await hasEmployeeIdSubmitted(trimmedId);
    if (alreadySubmitted) {
      return NextResponse.json(
        { error: "duplicate_employee_id" },
        { status: 400 }
      );
    }

    const data = {
      employeeName: String(employeeName).trim(),
      employeeId: trimmedId,
      company,
      attendance,
      submittedAt: new Date().toISOString(),
    };

    const { id } = await addSubmission(data);

    return NextResponse.json({
      success: true,
      id,
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
