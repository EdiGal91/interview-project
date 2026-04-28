"use client";

import Image from "next/image";

import {
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
    type Country,
    fetchCountryByCode,
} from "@/services/countries";
import {
    addTripItem,
    fetchTrip,
    type TripItem,
} from "@/services/trip";
import {
    describeWeatherCode,
    fetchForecast,
    type WeatherForecast,
} from "@/services/weather";
import {
    fetchWikipediaSummary,
    type WikipediaSummary,
} from "@/services/wikipedia";

interface Props {
    code: string;
}

export function CountryDetail({ code }: Props) {
    // Main country data is suspended at the page level — the rest of the
    // tree only mounts once we have it.
    const { data: country } = useSuspenseQuery({
        queryKey: queryKeys.countries.detail(code),
        queryFn: () => fetchCountryByCode(code),
        staleTime: 5 * 60 * 1_000,
    });

    const coords = pickCoords(country);
    const wikiTitle = country.name.common;

    // Parallel side queries — kicked off as soon as we have the country.
    // Kept as useQuery (not Suspense) so each block has its own
    // loading / error UI without blocking the page.
    const weather = useQuery({
        queryKey: coords
            ? queryKeys.weather.forecast(coords[0], coords[1])
            : ["weather", "disabled"],
        queryFn: () => fetchForecast(coords![0], coords![1]),
        enabled: coords !== null,
        staleTime: 30 * 60 * 1_000, // weather refreshes hourly upstream
    });

    const wiki = useQuery({
        queryKey: queryKeys.wikipedia.summary(wikiTitle),
        queryFn: () => fetchWikipediaSummary(wikiTitle),
        staleTime: 24 * 60 * 60 * 1_000, // summary changes rarely
    });

    return (
        <article className="flex flex-col gap-6">
            <CountryHeader country={country} />

            <section>
                <h2 className="mb-3 text-base font-semibold text-white">
                    About
                </h2>
                {wiki.isLoading ? (
                    <BlockSkeleton lines={4} />
                ) : wiki.isError ? (
                    <ErrorBlock
                        title="Wikipedia summary unavailable"
                        error={wiki.error}
                        onRetry={() => wiki.refetch()}
                    />
                ) : wiki.data ? (
                    <WikiBlock summary={wiki.data} />
                ) : null}
            </section>

            <section>
                <h2 className="mb-3 text-base font-semibold text-white">
                    7-day forecast for {country.capital?.[0] ?? "capital"}
                </h2>
                {coords === null ? (
                    <p className="text-sm text-white/60">
                        No coordinates available for this country.
                    </p>
                ) : weather.isLoading ? (
                    <BlockSkeleton lines={3} />
                ) : weather.isError ? (
                    <ErrorBlock
                        title="Forecast unavailable"
                        error={weather.error}
                        onRetry={() => weather.refetch()}
                    />
                ) : weather.data ? (
                    <WeatherBlock forecast={weather.data} />
                ) : null}
            </section>
        </article>
    );
}

function CountryHeader({ country }: { country: Country }) {
    const queryClient = useQueryClient();

    const trip = useQuery({
        queryKey: queryKeys.trip.all(),
        queryFn: fetchTrip,
        staleTime: 0,
    });

    const inTrip = trip.data?.some((it) => it.code === country.cca3) ?? false;

    const addMutation = useMutation({
        mutationFn: () =>
            addTripItem({
                code: country.cca3,
                name: country.name.common,
                flag: country.flags.svg,
            }),
        onMutate: async (): Promise<{ previous?: TripItem[] }> => {
            // Optimistic update — feels instant; rolled back on error.
            await queryClient.cancelQueries({
                queryKey: queryKeys.trip.all(),
            });
            const previous = queryClient.getQueryData<TripItem[]>(
                queryKeys.trip.all(),
            );
            queryClient.setQueryData<TripItem[]>(
                queryKeys.trip.all(),
                (current = []) => [
                    ...current,
                    {
                        code: country.cca3,
                        name: country.name.common,
                        flag: country.flags.svg,
                        addedAt: new Date().toISOString(),
                    },
                ],
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

    return (
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="relative h-24 w-36 shrink-0 overflow-hidden rounded-md border border-white/10 bg-black/30 sm:h-28 sm:w-44">
                <Image
                    src={country.flags.svg}
                    alt={country.flags.alt ?? `${country.name.common} flag`}
                    fill
                    sizes="200px"
                    className="object-cover"
                    unoptimized
                    priority
                />
            </span>
            <div className="flex-1">
                <h1 className="text-2xl font-semibold text-white">
                    {country.name.common}
                </h1>
                <p className="mt-0.5 text-sm text-white/55">
                    {country.name.official}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-white/75">
                    <Fact label="Capital" value={country.capital?.[0]} />
                    <Fact label="Region" value={country.region} />
                    <Fact label="Subregion" value={country.subregion} />
                    <Fact
                        label="Population"
                        value={country.population.toLocaleString("en-US")}
                    />
                </dl>
                <button
                    type="button"
                    onClick={() => addMutation.mutate()}
                    disabled={inTrip || addMutation.isPending}
                    className="mt-4 inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#FF437A] to-[#FF8A3D] px-4 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {inTrip ? "✓ In your trip" : "Add to trip"}
                </button>
                {addMutation.isError ? (
                    <p className="mt-2 text-xs text-red-300">
                        {addMutation.error instanceof Error
                            ? addMutation.error.message
                            : "Failed to add — try again"}
                    </p>
                ) : null}
            </div>
        </header>
    );
}

function Fact({ label, value }: { label: string; value: string | undefined }) {
    return (
        <>
            <dt className="text-white/45">{label}</dt>
            <dd className="text-white">{value || "—"}</dd>
        </>
    );
}

function WikiBlock({ summary }: { summary: WikipediaSummary }) {
    return (
        <div className="rounded-lg border border-white/10 bg-[#1A1A1D] p-4">
            <p className="text-sm leading-relaxed text-white/85">
                {summary.extract}
            </p>
            <a
                href={summary.pageUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
                Read on Wikipedia →
            </a>
        </div>
    );
}

function WeatherBlock({ forecast }: { forecast: WeatherForecast }) {
    return (
        <div className="rounded-lg border border-white/10 bg-[#1A1A1D] p-4">
            <div className="mb-3 flex items-baseline justify-between">
                <p className="text-sm text-white/70">Now</p>
                <p className="text-sm text-white">
                    {Math.round(forecast.current.temperature)}°C ·{" "}
                    {describeWeatherCode(forecast.current.weatherCode)}
                </p>
            </div>
            <ul className="grid grid-cols-7 gap-2">
                {forecast.daily.map((day) => (
                    <li
                        key={day.date}
                        className="flex flex-col items-center gap-1 rounded-md bg-black/20 px-1 py-2 text-center"
                    >
                        <span className="text-[10px] uppercase tracking-wide text-white/45">
                            {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                            })}
                        </span>
                        <span className="text-xs text-white">
                            {Math.round(day.tempMax)}°
                        </span>
                        <span className="text-xs text-white/55">
                            {Math.round(day.tempMin)}°
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ErrorBlock({
    title,
    error,
    onRetry,
}: {
    title: string;
    error: unknown;
    onRetry: () => void;
}) {
    return (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-red-300/80">
                {error instanceof Error ? error.message : "Unknown error"}
            </p>
            <button
                type="button"
                onClick={onRetry}
                className="mt-3 rounded-md bg-red-500/30 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500/50"
            >
                Retry
            </button>
        </div>
    );
}

export function CountryDetailSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row">
                <div className="h-28 w-44 animate-pulse rounded-md border border-white/10 bg-[#16161a]" />
                <div className="flex flex-1 flex-col gap-2">
                    <div className="h-7 w-1/2 animate-pulse rounded bg-[#16161a]" />
                    <div className="h-4 w-1/3 animate-pulse rounded bg-[#16161a]" />
                </div>
            </div>
            <BlockSkeleton lines={3} />
            <BlockSkeleton lines={2} />
        </div>
    );
}

function BlockSkeleton({ lines }: { lines: number }) {
    return (
        <div className="rounded-lg border border-white/10 bg-[#1A1A1D] p-4">
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className="mb-2 h-3 w-full animate-pulse rounded bg-[#1f1f23] last:mb-0"
                />
            ))}
        </div>
    );
}

function pickCoords(country: Country): [number, number] | null {
    if (country.capitalInfo?.latlng?.length === 2) {
        return country.capitalInfo.latlng;
    }
    if (country.latlng?.length === 2) {
        return country.latlng;
    }
    return null;
}
