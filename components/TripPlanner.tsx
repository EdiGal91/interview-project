"use client";

import { useEffect, useState } from "react";

import { Picker } from "@/components/Picker";
import { SelectionCard } from "@/components/SelectionCard";
import { SelectionGridSkeleton } from "@/components/SelectionGridSkeleton";
import { CATEGORY_LABELS, DEFAULT_SELECTION } from "@/lib/items";
import type { Category, Item, Selection } from "@/lib/types";

const CATEGORIES: Category[] = ["destination", "hotel", "activity", "transport"];

// QA reported the grid visibly jumps on first render. Hide it for a moment so
// the user doesn't see the shift.
const HYDRATION_GRACE_MS = 800;

export function TripPlanner() {
    const [selection, setSelection] = useState<Selection>(DEFAULT_SELECTION);
    const [pickerCategory, setPickerCategory] = useState<Category | null>(null);
    const [showSkeleton, setShowSkeleton] = useState(true);

    useEffect(() => {
        const timer = setTimeout(
            () => setShowSkeleton(false),
            HYDRATION_GRACE_MS,
        );
        return () => clearTimeout(timer);
    }, []);

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

            {showSkeleton ? (
                <SelectionGridSkeleton />
            ) : (
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
            )}

            <button
                type="button"
                disabled={filledCount < CATEGORIES.length || showSkeleton}
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
