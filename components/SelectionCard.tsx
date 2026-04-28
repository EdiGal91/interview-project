"use client";

import Image from "next/image";

import type { Item } from "@/lib/types";

interface SelectionCardProps {
    label: string;
    selected: Item | null;
    onClick: () => void;
    onSwap: () => void;
}

export function SelectionCard({
    label,
    selected,
    onClick,
    onSwap,
}: SelectionCardProps) {
    if (!selected) {
        return (
            <button
                type="button"
                onClick={onClick}
                aria-label={`Pick ${label}`}
                className="relative aspect-square w-full overflow-hidden rounded-lg border border-dashed border-white/15 bg-[#222225] text-left transition-colors hover:bg-[#2D2D30]"
            >
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-sm text-white/60">
                    <span className="text-xl leading-none">+</span>
                    <span>{label}</span>
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="relative aspect-square w-full overflow-hidden rounded-lg border border-white/15 bg-[#222225] text-left transition-colors hover:bg-[#2D2D30]"
        >
            <Image
                src={selected.image}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 200px"
                className="object-cover"
            />
            <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_55%,rgba(0,0,0,0.65)_100%)]" />

            <span className="relative flex h-full w-full flex-col justify-between p-2">
                <span className="flex justify-end">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onSwap();
                        }}
                        aria-label={`Clear ${label}`}
                        className="grid size-7 place-items-center rounded-md bg-black/60 text-white/90 transition-colors hover:bg-black/80"
                    >
                        <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            className="size-3.5"
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
                </span>
                <span className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-medium leading-tight text-white/95">
                        {selected.name}
                    </span>
                    <span className="text-[11px] leading-tight text-white/65">
                        {selected.subtitle}
                    </span>
                </span>
            </span>
        </button>
    );
}
