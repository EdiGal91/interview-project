"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { fetchTrip } from "@/services/trip";

const NAV = [
    { href: "/", label: "Plan" },
    { href: "/countries", label: "Countries" },
] as const;

export function SiteHeader() {
    const pathname = usePathname();

    // Trip count badge — refreshed on focus, stale time short.
    const trip = useQuery({
        queryKey: queryKeys.trip.all(),
        queryFn: fetchTrip,
        staleTime: 0,
        refetchOnMount: false,
    });
    const tripCount = trip.data?.length ?? 0;

    return (
        <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0E0E10]/85 backdrop-blur">
            <nav className="mx-auto flex w-full max-w-4xl items-center gap-1 px-4 py-3">
                <Link
                    href="/"
                    className="mr-2 text-sm font-semibold text-white"
                >
                    Trip Planner
                </Link>
                <span className="flex-1" />
                {NAV.map((item) => {
                    const active =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={
                                "rounded-md px-2.5 py-1.5 text-sm transition-colors " +
                                (active
                                    ? "bg-white/10 text-white"
                                    : "text-white/65 hover:bg-white/5 hover:text-white")
                            }
                        >
                            {item.label}
                        </Link>
                    );
                })}
                <Link
                    href="/trip"
                    className={
                        "ml-1 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors " +
                        (pathname.startsWith("/trip")
                            ? "bg-white/10 text-white"
                            : "text-white/65 hover:bg-white/5 hover:text-white")
                    }
                >
                    Trip
                    <span className="grid min-w-5 place-items-center rounded-full bg-white/15 px-1.5 text-[10px] font-medium leading-5 text-white">
                        {tripCount}
                    </span>
                </Link>
            </nav>
        </header>
    );
}
