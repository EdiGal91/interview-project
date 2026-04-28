import { wikipediaApi } from "@/lib/axios";

export interface WikipediaSummary {
    title: string;
    description: string | null;
    extract: string;
    thumbnailUrl: string | null;
    pageUrl: string;
}

interface WikipediaSummaryResponse {
    title: string;
    description?: string;
    extract: string;
    thumbnail?: { source: string };
    content_urls?: { desktop?: { page?: string } };
}

export async function fetchWikipediaSummary(
    title: string,
): Promise<WikipediaSummary> {
    const { data } = await wikipediaApi.get<WikipediaSummaryResponse>(
        `/page/summary/${encodeURIComponent(title)}`,
    );

    return {
        title: data.title,
        description: data.description ?? null,
        extract: data.extract,
        thumbnailUrl: data.thumbnail?.source ?? null,
        pageUrl:
            data.content_urls?.desktop?.page ??
            `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`,
    };
}
