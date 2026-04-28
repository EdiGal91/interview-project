/**
 * Cookie that persists the home-page trip composer's selection.
 *
 * Read on the server (`app/page.tsx`) so the SSR HTML reflects the user's
 * last picks; written on the client (`TripPlanner` effect) when the user
 * changes a card. Not `httpOnly` because the client needs to write it.
 */
import type { Category, Item, Selection } from "@/lib/types";
import { CATALOG } from "@/lib/items";

export const HOME_TRIP_COOKIE = "home-trip";
export const HOME_TRIP_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const EMPTY_SELECTION: Selection = {
    destination: null,
    hotel: null,
    activity: null,
    transport: null,
};

const CATEGORIES: Category[] = ["destination", "hotel", "activity", "transport"];

type SelectionIds = Partial<Record<Category, string>>;

function findItem(category: Category, id: string | undefined): Item | null {
    if (!id) return null;
    return CATALOG[category].find((item) => item.id === id) ?? null;
}

export function selectionFromIds(ids: SelectionIds): Selection {
    return {
        destination: findItem("destination", ids.destination),
        hotel: findItem("hotel", ids.hotel),
        activity: findItem("activity", ids.activity),
        transport: findItem("transport", ids.transport),
    };
}

export function selectionToIds(selection: Selection): SelectionIds {
    const ids: SelectionIds = {};
    for (const category of CATEGORIES) {
        const item = selection[category];
        if (item) ids[category] = item.id;
    }
    return ids;
}

/**
 * Parse the raw cookie value (which may be missing or malformed). Always
 * returns a valid Selection — never throws.
 */
export function parseHomeTripCookie(raw: string | undefined): Selection {
    if (!raw) return EMPTY_SELECTION;
    try {
        const parsed = JSON.parse(decodeURIComponent(raw));
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
            return selectionFromIds(parsed as SelectionIds);
        }
    } catch {
        // fall through
    }
    return EMPTY_SELECTION;
}

/** Serialise a Selection for `document.cookie =`. Client-only helper. */
export function serialiseHomeTripCookie(selection: Selection): string {
    const ids = selectionToIds(selection);
    const value = encodeURIComponent(JSON.stringify(ids));
    return `${HOME_TRIP_COOKIE}=${value}; path=/; max-age=${HOME_TRIP_COOKIE_MAX_AGE}; SameSite=Lax`;
}
