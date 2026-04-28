import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { TripItem } from "@/services/trip";

const COOKIE_NAME = "trip";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function readTrip(): Promise<TripItem[]> {
    const store = await cookies();
    const raw = store.get(COOKIE_NAME)?.value;
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as TripItem[]) : [];
    } catch {
        return [];
    }
}

async function writeTrip(items: TripItem[]) {
    const store = await cookies();
    store.set(COOKIE_NAME, JSON.stringify(items), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
    });
}

export async function GET() {
    const items = await readTrip();
    return NextResponse.json(items);
}

export async function POST(req: Request) {
    const body = (await req.json()) as Partial<TripItem>;
    if (!body.code || !body.name || !body.flag) {
        return NextResponse.json(
            { message: "code, name, flag are required" },
            { status: 400 },
        );
    }
    const items = await readTrip();
    if (items.some((it) => it.code === body.code)) {
        return NextResponse.json(items);
    }
    const next = [
        ...items,
        {
            code: body.code,
            name: body.name,
            flag: body.flag,
            addedAt: new Date().toISOString(),
        },
    ];
    await writeTrip(next);
    return NextResponse.json(next);
}
