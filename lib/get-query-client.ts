import {
    QueryClient,
    defaultShouldDehydrateQuery,
    isServer,
} from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
    return new QueryClient({
        defaultOptions: {
            queries: {
                // 1 minute is a reasonable default for this app — most data
                // is "rarely changes" (countries, weather updates per hour).
                staleTime: 60 * 1_000,
                refetchOnWindowFocus: false,
                retry: (failureCount, error) => {
                    // Don't retry 4xx — that's a real error, not a flake.
                    const status = (error as { status?: number } | null)?.status;
                    if (status && status >= 400 && status < 500) return false;
                    return failureCount < 2;
                },
            },
            dehydrate: {
                // Dehydrate pending queries too — Suspense / streaming SSR
                // pattern from RQ docs.
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === "pending",
            },
        },
    });
}

let browserQueryClient: QueryClient | undefined;

/**
 * - On the server: a fresh QueryClient per request. Sharing a client across
 *   requests would leak data between users.
 * - In the browser: a singleton, so React doesn't lose cache on remount.
 */
export function getQueryClient(): QueryClient {
    if (isServer) {
        return makeQueryClient();
    }
    if (!browserQueryClient) {
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}
