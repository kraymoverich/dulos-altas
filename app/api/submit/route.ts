import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]", "utf-8");
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await ensureFile();
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const list = JSON.parse(raw || "[]");
    list.push({ id: crypto.randomUUID(), ...body });
    await fs.writeFile(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/submit] error:", err);
    return NextResponse.json(
      { ok: false, error: "internal_error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await ensureFile();
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(raw || "[]"));
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
