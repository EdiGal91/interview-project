import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import type { TripItem } from "@/services/trip";

const COOKIE_NAME = "trip";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

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

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ code: string }> },
) {
    const { code } = await params;
    const items = await readTrip();
    const next = items.filter((it) => it.code !== code);
    await writeTrip(next);
    return NextResponse.json(next);
}
