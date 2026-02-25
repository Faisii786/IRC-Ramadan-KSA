/**
 * Local SQLite database for form submissions (using sql.js - no native build).
 * Data is stored in data/submissions.db and persists (never auto-deleted).
 */

import initSqlJs, { type Database, type InitSqlJsResult } from "sql.js";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "submissions.db");

let sqlJsInit: (() => Promise<InitSqlJsResult>) | null = null;

function getSqlJs() {
  if (!sqlJsInit) {
    sqlJsInit = () =>
      initSqlJs({
        locateFile: (file: string) =>
          path.join(process.cwd(), "node_modules", "sql.js", "dist", file),
      });
  }
  return sqlJsInit();
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadDb(SQL: InitSqlJsResult): Database {
  ensureDataDir();
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    return new SQL.Database(buffer);
  }
  return new SQL.Database();
}

function saveDb(db: Database) {
  ensureDataDir();
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

const createTableSql = `
  CREATE TABLE IF NOT EXISTS submissions (
    id TEXT PRIMARY KEY,
    employee_name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    company TEXT NOT NULL,
    attendance TEXT NOT NULL,
    submitted_at TEXT NOT NULL
  )
`;

export interface SubmissionRow {
  employeeName: string;
  employeeId: string;
  company: string;
  attendance: "Yes" | "No";
  submittedAt: string;
}

let writeQueue = Promise.resolve();

export async function hasEmployeeIdSubmitted(employeeId: string): Promise<boolean> {
  const normalized = employeeId.trim();
  if (!normalized) return false;
  const SQL = await getSqlJs();
  const db = loadDb(SQL);
  db.run(createTableSql);
  const stmt = db.prepare(
    "SELECT 1 FROM submissions WHERE employee_id = ? LIMIT 1"
  );
  stmt.bind([normalized]);
  const found = stmt.step();
  stmt.free();
  db.close();
  return found;
}

export async function addSubmission(data: SubmissionRow): Promise<{ id: string }> {
  const id = crypto.randomUUID();
  writeQueue = writeQueue
    .then(async () => {
      const SQL = await getSqlJs();
      const db = loadDb(SQL);
      db.run(createTableSql);
      db.run(
        `INSERT INTO submissions (id, employee_name, employee_id, company, attendance, submitted_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          data.employeeName,
          data.employeeId,
          data.company,
          data.attendance,
          data.submittedAt,
        ]
      );
      saveDb(db);
      db.close();
    })
    .catch((err) => {
      console.error("DB write error:", err);
      throw err;
    });
  await writeQueue;
  return { id };
}

export interface Submission {
  id: string;
  employeeName: string;
  employeeId: string;
  company: string;
  attendance: "Yes" | "No";
  submittedAt: string;
}

export async function getSubmissions(): Promise<Submission[]> {
  const SQL = await getSqlJs();
  const db = loadDb(SQL);
  db.run(createTableSql);
  const result = db.exec(
    `SELECT id, employee_name, employee_id, company, attendance, submitted_at
     FROM submissions ORDER BY submitted_at DESC`
  );
  db.close();
  if (!result.length || !result[0].values.length) {
    return [];
  }
  const cols = result[0].columns;
  return result[0].values.map((row) => ({
    id: String(row[cols.indexOf("id")]),
    employeeName: String(row[cols.indexOf("employee_name")]),
    employeeId: String(row[cols.indexOf("employee_id")]),
    company: String(row[cols.indexOf("company")]),
    attendance: String(row[cols.indexOf("attendance")]) as "Yes" | "No",
    submittedAt: String(row[cols.indexOf("submitted_at")]),
  }));
}
