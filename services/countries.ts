import { restCountriesApi } from "@/lib/axios";

/**
 * Subset of the REST Countries v3.1 country payload that this UI needs.
 * The API returns far more — keep the shape narrow so changes upstream
 * don't break TS unless they affect what we actually use.
 */
export interface Country {
    cca2: string;
    cca3: string;
    name: {
        common: string;
        official: string;
    };
    capital?: string[];
    region: string;
    subregion?: string;
    population: number;
    area?: number;
    flags: {
        png: string;
        svg: string;
        alt?: string;
    };
    latlng?: [number, number];
    capitalInfo?: {
        latlng?: [number, number];
    };
    languages?: Record<string, string>;
    currencies?: Record<
        string,
        {
            name: string;
            symbol?: string;
        }
    >;
}

// REST Countries v3.1 caps the `/all` endpoint at 10 fields per request.
// List view only needs the basics; the detail page calls `/alpha/{code}`
// with the full set.
const LIST_FIELDS = [
    "cca2",
    "cca3",
    "name",
    "capital",
    "region",
    "subregion",
    "population",
    "flags",
    "latlng",
    "capitalInfo",
].join(",");

const DETAIL_FIELDS = [
    ...LIST_FIELDS.split(","),
    "area",
    "languages",
    "currencies",
].join(",");

export async function fetchAllCountries(): Promise<Country[]> {
    const { data } = await restCountriesApi.get<Country[]>("/all", {
        params: { fields: LIST_FIELDS },
    });
    // Stable alphabetical order — the API order is not guaranteed.
    return data.sort((a, b) => a.name.common.localeCompare(b.name.common));
}

export async function fetchCountryByCode(code: string): Promise<Country> {
    // /alpha/{code} returns a single object for one code; /alpha?codes=...
    // returns an array. Handle both shapes defensively.
    const { data } = await restCountriesApi.get<Country | Country[]>(
        `/alpha/${code}`,
        { params: { fields: DETAIL_FIELDS } },
    );
    const country = Array.isArray(data) ? data[0] : data;
    if (!country) {
        throw new Error(`Country not found: ${code}`);
    }
    return country;
}
