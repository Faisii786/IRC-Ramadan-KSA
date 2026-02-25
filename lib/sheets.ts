import { google } from "googleapis";

function normalizePrivateKey(raw: string | undefined): string {
  if (!raw || typeof raw !== "string") return "";
  let key = raw
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .trim();
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }
  return key;
}

function getAuth(scopes: string[]) {
  const email = process.env.GOOGLE_CLIENT_EMAIL?.trim();
  const key = normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  if (!email || !key) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY");
  }
  if (!key.includes("BEGIN PRIVATE KEY")) {
    throw new Error("GOOGLE_PRIVATE_KEY must be a PEM string (BEGIN PRIVATE KEY ... END PRIVATE KEY)");
  }
  return new google.auth.JWT({
    email,
    key,
    scopes,
  });
}

export function getSheetsClient() {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets"]);
  return google.sheets({ version: "v4", auth });
}

export function getSheetsReadClient() {
  const auth = getAuth(["https://www.googleapis.com/auth/spreadsheets.readonly"]);
  return google.sheets({ version: "v4", auth });
}

export function getSpreadsheetId() {
  const id = process.env.GOOGLE_SHEETS_ID;
  if (!id) throw new Error("Missing GOOGLE_SHEETS_ID");
  return id;
}

export const SHEET_RANGE = "Sheet1!A:H";
