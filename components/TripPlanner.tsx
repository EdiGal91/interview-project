"use client";

import { useEffect, useRef, useState } from "react";

import { Picker } from "@/components/Picker";
import { SelectionCard } from "@/components/SelectionCard";
import { serialiseHomeTripCookie } from "@/lib/home-trip-cookie";
import { CATEGORY_LABELS } from "@/lib/items";
import type { Category, Item, Selection } from "@/lib/types";

const CATEGORIES: Category[] = ["destination", "hotel", "activity", "transport"];

interface Props {
    initialSelection: Selection;
}

export function TripPlanner({ initialSelection }: Props) {
    const [selection, setSelection] = useState<Selection>(initialSelection);
    const [pickerCategory, setPickerCategory] = useState<Category | null>(null);

    // Persist the selection to a cookie so the next SSR render reflects
    // what the user picked last. Skip the very first effect run — that
    // value is already what the server gave us; no point writing it back.
    const isFirstRenderRef = useRef(true);
    useEffect(() => {
        if (isFirstRenderRef.current) {
            isFirstRenderRef.current = false;
            return;
        }
        document.cookie = serialiseHomeTripCookie(selection);
    }, [selection]);

    const filledCount = CATEGORIES.filter((c) => selection[c] !== null).length;

    return (
        <div className="mx-auto w-full max-w-md p-4">
            <header className="mb-6">
                <h1 className="text-2xl font-semibold text-white">
                    Plan your trip
                </h1>
                <p className="mt-1 text-sm text-white/60">
                    Pick a destination, hotel, activity and transport.
                </p>
            </header>

            <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((category) => (
                    <SelectionCard
                        key={category}
                        label={CATEGORY_LABELS[category]}
                        selected={selection[category]}
                        onClick={() => setPickerCategory(category)}
                        onSwap={() =>
                            setSelection((prev) => ({
                                ...prev,
                                [category]: null,
                            }))
                        }
                    />
                ))}
            </div>

            <button
                type="button"
                disabled={filledCount < CATEGORIES.length}
                className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-[#FF437A] to-[#FF8A3D] text-sm font-semibold text-white transition-opacity disabled:opacity-50"
            >
                Book trip ({filledCount}/{CATEGORIES.length})
            </button>

            <Picker
                category={pickerCategory}
                onClose={() => setPickerCategory(null)}
                onPick={(item: Item) => {
                    setSelection((prev) => ({
                        ...prev,
                        [item.category]: item,
                    }));
                    setPickerCategory(null);
                }}
            />
        </div>
    );
}
