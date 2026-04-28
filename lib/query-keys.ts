/**
 * Hierarchical query key factory.
 *
 * Why a factory: centralises key shape so invalidations like
 * `qc.invalidateQueries({ queryKey: queryKeys.countries.all() })` are
 * type-safe and consistent.
 */
export const queryKeys = {
    countries: {
        all: () => ["countries"] as const,
        list: () => [...queryKeys.countries.all(), "list"] as const,
        detail: (code: string) =>
            [...queryKeys.countries.all(), "detail", code] as const,
    },
    weather: {
        forecast: (lat: number, lon: number) =>
            ["weather", "forecast", { lat, lon }] as const,
    },
    wikipedia: {
        summary: (title: string) => ["wikipedia", "summary", title] as const,
    },
    trip: {
        all: () => ["trip"] as const,
    },
} as const;
