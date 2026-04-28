"use client";

import Image from "next/image";
import Link from "next/link";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
    fetchTrip,
    removeTripItem,
    type TripItem,
} from "@/services/trip";

export function TripView() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: queryKeys.trip.all(),
        queryFn: fetchTrip,
        staleTime: 0,
    });

    const removeMutation = useMutation({
        mutationFn: (code: string) => removeTripItem(code),
        onMutate: async (code): Promise<{ previous?: TripItem[] }> => {
            await queryClient.cancelQueries({
                queryKey: queryKeys.trip.all(),
            });
            const previous = queryClient.getQueryData<TripItem[]>(
                queryKeys.trip.all(),
            );
            queryClient.setQueryData<TripItem[]>(
                queryKeys.trip.all(),
                (current = []) => current.filter((it) => it.code !== code),
            );
            return { previous };
        },
        onError: (_err, _vars, ctx) => {
            if (ctx?.previous) {
                queryClient.setQueryData(queryKeys.trip.all(), ctx.previous);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.trip.all() });
        },
    });

    if (isLoading) {
        return (
            <ul className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                    <li
                        key={i}
                        className="h-16 animate-pulse rounded-lg border border-white/10 bg-[#16161a]"
                    />
                ))}
            </ul>
        );
    }

    if (isError) {
        return (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                <p className="font-medium">Failed to load your trip.</p>
                <p className="mt-1 text-red-300/80">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-3 rounded-md bg-red-500/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500/50"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="rounded-lg border border-white/10 bg-[#1A1A1D] p-6 text-center text-sm text-white/60">
                <p>No countries in your trip yet.</p>
                <Link
                    href="/countries"
                    className="mt-3 inline-block rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/20"
                >
                    Browse countries
                </Link>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2">
            {data.map((item) => (
                <li
                    key={item.code}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#1A1A1D] p-3"
                >
                    <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-sm border border-white/10 bg-black/30">
                        <Image
                            src={item.flag}
                            alt=""
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                        />
                    </span>
                    <div className="flex-1">
                        <Link
                            href={`/countries/${item.code.toLowerCase()}`}
                            className="text-sm font-medium text-white hover:underline"
                        >
                            {item.name}
                        </Link>
                        <p className="text-[11px] text-white/45">
                            Added {new Date(item.addedAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => removeMutation.mutate(item.code)}
                        disabled={removeMutation.isPending}
                        className="rounded-md px-2 py-1 text-xs text-white/55 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed"
                    >
                        Remove
                    </button>
                </li>
            ))}
        </ul>
    );
}
