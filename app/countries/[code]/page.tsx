import { Suspense } from "react";

import Link from "next/link";
import { notFound } from "next/navigation";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
    CountryDetail,
    CountryDetailSkeleton,
} from "@/components/CountryDetail";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { fetchCountryByCode } from "@/services/countries";

interface Props {
    params: Promise<{ code: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { code } = await params;
    try {
        const country = await fetchCountryByCode(code);
        return {
            title: `${country.name.common} · Trip Planner`,
            description: `${country.name.common} — capital ${country.capital?.[0] ?? "—"}, region ${country.region}.`,
        };
    } catch {
        return {
            title: "Country · Trip Planner",
        };
    }
}

export default async function CountryPage({ params }: Props) {
    const { code } = await params;
    const queryClient = getQueryClient();

    // Validate up front; 404 if the country code is unknown so we don't
    // render a broken Suspense boundary.
    try {
        await queryClient.fetchQuery({
            queryKey: queryKeys.countries.detail(code),
            queryFn: () => fetchCountryByCode(code),
        });
    } catch {
        notFound();
    }

    return (
        <main className="flex flex-1 flex-col bg-[#0E0E10] py-8">
            <div className="mx-auto w-full max-w-3xl px-4">
                <Link
                    href="/countries"
                    className="mb-4 inline-flex items-center gap-1 text-xs text-white/55 transition-colors hover:text-white"
                >
                    ← All countries
                </Link>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={<CountryDetailSkeleton />}>
                        <CountryDetail code={code} />
                    </Suspense>
                </HydrationBoundary>
            </div>
        </main>
    );
}
