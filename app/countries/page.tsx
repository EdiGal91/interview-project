import { Suspense } from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import {
    CountriesList,
    CountriesListSkeleton,
} from "@/components/CountriesList";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { fetchAllCountries } from "@/services/countries";

export const metadata = {
    title: "Countries · Trip Planner",
    description: "Browse 250 countries with flags, capitals and basic facts.",
};

export default async function CountriesPage() {
    const queryClient = getQueryClient();

    // Await the prefetch so the dehydrated state contains the data; the
    // child <Suspense fallback> only shows while React is streaming HTML
    // back to the client, not while we're still fetching upstream.
    await queryClient.prefetchQuery({
        queryKey: queryKeys.countries.list(),
        queryFn: fetchAllCountries,
    });

    return (
        <main className="flex flex-1 flex-col bg-[#0E0E10] py-8">
            <div className="mx-auto w-full max-w-4xl px-4">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        Countries
                    </h1>
                    <p className="mt-1 text-sm text-white/60">
                        Pick a country to see weather, summary, and add it to your trip.
                    </p>
                </header>

                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Suspense fallback={<CountriesListSkeleton />}>
                        <CountriesList />
                    </Suspense>
                </HydrationBoundary>
            </div>
        </main>
    );
}
