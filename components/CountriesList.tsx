"use client";

import { useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { useSuspenseQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchAllCountries, type Country } from "@/services/countries";

const REGIONS = [
    "All",
    "Africa",
    "Americas",
    "Asia",
    "Europe",
    "Oceania",
    "Antarctic",
] as const;
type Region = (typeof REGIONS)[number];

export function CountriesList() {
    const [region, setRegion] = useState<Region>("All");
    const [search, setSearch] = useState("");

    // Suspense query — data is guaranteed to be defined here. Loading is
    // handled by the <Suspense> boundary in the parent page (so SSR has the
    // rendered list, not a skeleton).
    const { data, isFetching } = useSuspenseQuery({
        queryKey: queryKeys.countries.list(),
        queryFn: fetchAllCountries,
        staleTime: 5 * 60 * 1_000, // countries change rarely
    });

    // Filter locally — REST Countries returns the full set; refetching per
    // keystroke would burn cache for nothing.
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return data.filter((c) => {
            if (region !== "All" && c.region !== region) return false;
            if (!q) return true;
            return (
                c.name.common.toLowerCase().includes(q) ||
                c.name.official.toLowerCase().includes(q) ||
                c.cca2.toLowerCase().includes(q) ||
                c.cca3.toLowerCase().includes(q)
            );
        });
    }, [data, region, search]);

    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search countries…"
                    className="flex-1 rounded-md border border-white/10 bg-[#1A1A1D] px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/30 focus:outline-none"
                />
                <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value as Region)}
                    className="rounded-md border border-white/10 bg-[#1A1A1D] px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                >
                    {REGIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>

            <p className="mb-3 text-xs text-white/50">
                {filtered.length} of {data.length} countries
                {isFetching ? " · refreshing…" : ""}
            </p>

            {filtered.length === 0 ? (
                <p className="rounded-lg border border-white/10 bg-[#1A1A1D] p-6 text-center text-sm text-white/60">
                    No countries match your filter.
                </p>
            ) : (
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {filtered.map((c) => (
                        <CountryRow key={c.cca3} country={c} />
                    ))}
                </ul>
            )}
        </div>
    );
}

function CountryRow({ country }: { country: Country }) {
    return (
        <li>
            <Link
                href={`/countries/${country.cca3.toLowerCase()}`}
                className="group flex flex-col gap-2 rounded-lg border border-white/10 bg-[#1A1A1D] p-3 transition-colors hover:border-white/30"
            >
                <span className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-black/30">
                    <Image
                        src={country.flags.svg}
                        alt={country.flags.alt ?? `${country.name.common} flag`}
                        fill
                        sizes="(max-width: 640px) 50vw, 200px"
                        className="object-cover"
                        unoptimized
                    />
                </span>
                <span className="flex flex-col">
                    <span className="text-sm font-medium text-white group-hover:text-white">
                        {country.name.common}
                    </span>
                    <span className="text-xs text-white/55">
                        {country.capital?.[0] ?? "—"} · {country.region}
                    </span>
                </span>
            </Link>
        </li>
    );
}

export function CountriesListSkeleton() {
    return (
        <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <div className="h-10 flex-1 animate-pulse rounded-md bg-[#1A1A1D]" />
                <div className="h-10 w-full animate-pulse rounded-md bg-[#1A1A1D] sm:w-32" />
            </div>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                    <li
                        key={i}
                        className="h-[140px] animate-pulse rounded-lg border border-white/10 bg-[#16161a]"
                    />
                ))}
            </ul>
        </div>
    );
}
