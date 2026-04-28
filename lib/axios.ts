import axios, { AxiosError, AxiosInstance } from "axios";

/**
 * Normalises axios errors into a stable shape so React Query can render
 * useful error UI without knowing about axios.
 */
export class ApiError extends Error {
    public readonly status: number | undefined;
    public readonly code: string | undefined;
    public readonly url: string | undefined;

    constructor(message: string, status?: number, code?: string, url?: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.code = code;
        this.url = url;
    }
}

function withInterceptors(instance: AxiosInstance, label: string): AxiosInstance {
    instance.interceptors.response.use(
        (response) => response,
        (error: AxiosError<{ message?: string }>) => {
            const message =
                error.response?.data?.message ??
                error.message ??
                `${label} request failed`;
            return Promise.reject(
                new ApiError(
                    message,
                    error.response?.status,
                    error.code,
                    error.config?.url,
                ),
            );
        },
    );
    return instance;
}

export const restCountriesApi = withInterceptors(
    axios.create({
        baseURL: "https://restcountries.com/v3.1",
        timeout: 8_000,
    }),
    "REST Countries",
);

export const openMeteoApi = withInterceptors(
    axios.create({
        baseURL: "https://api.open-meteo.com/v1",
        timeout: 8_000,
    }),
    "Open-Meteo",
);

export const wikipediaApi = withInterceptors(
    axios.create({
        baseURL: "https://en.wikipedia.org/api/rest_v1",
        timeout: 8_000,
    }),
    "Wikipedia",
);

/** Internal API (Next.js route handlers) for the user's trip. */
export const tripApi = withInterceptors(
    axios.create({
        baseURL:
            typeof window === "undefined"
                ? // Server-side: same origin, but we don't make trip calls SSR.
                  ""
                : "/api",
        timeout: 5_000,
    }),
    "Trip",
);
