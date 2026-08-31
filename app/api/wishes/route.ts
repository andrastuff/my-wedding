import { NextResponse } from "next/server";
import {
  attendanceOptions,
  createWish,
  readWishes,
  type Attendance,
} from "@/lib/wishes-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const wishes = await readWishes();
    return NextResponse.json({ wishes }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ message: "Ucapan belum dapat dimuat." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const attendance = body.attendance as Attendance;

    if (!name || !message || !attendanceOptions.includes(attendance)) {
      return NextResponse.json({ message: "Nama, kehadiran, dan ucapan wajib diisi." }, { status: 400 });
    }
    if (name.length > 45 || message.length > 240) {
      return NextResponse.json({ message: "Nama atau ucapan terlalu panjang." }, { status: 400 });
    }

    const wish = await createWish({ name, message, attendance });
    return NextResponse.json({ wish }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Ucapan gagal disimpan. Silakan coba lagi." }, { status: 500 });
  }
}
