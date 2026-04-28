"use client";

import { useEffect } from "react";

import Image from "next/image";

import type { Category, Item } from "@/lib/types";
import { CATALOG, CATEGORY_LABELS } from "@/lib/items";

interface PickerProps {
    category: Category | null;
    onClose: () => void;
    onPick: (item: Item) => void;
}

export function Picker({ category, onClose, onPick }: PickerProps) {
    useEffect(() => {
        if (!category) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [category, onClose]);

    if (!category) return null;

    const items = CATALOG[category];

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-label={`Pick ${CATEGORY_LABELS[category]}`}
            className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-4 sm:items-center"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1A1D] p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white">
                        Pick {CATEGORY_LABELS[category]}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="grid size-8 place-items-center rounded-md text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    >
                        <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="size-4"
                            aria-hidden
                        >
                            <path
                                d="M3 3l10 10M13 3L3 13"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <ul className="grid gap-2">
                    {items.map((item) => (
                        <li key={item.id}>
                            <button
                                type="button"
                                onClick={() => onPick(item)}
                                className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-[#222225] p-2 text-left transition-colors hover:bg-[#2D2D30]"
                            >
                                <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-black/30">
                                    <Image
                                        src={item.image}
                                        alt=""
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </span>
                                <span className="flex flex-col">
                                    <span className="text-sm font-medium text-white/95">
                                        {item.name}
                                    </span>
                                    <span className="text-xs text-white/60">
                                        {item.subtitle}
                                    </span>
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
