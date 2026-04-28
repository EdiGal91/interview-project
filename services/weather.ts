import { openMeteoApi } from "@/lib/axios";

export interface WeatherForecast {
    latitude: number;
    longitude: number;
    timezone: string;
    current: {
        temperature: number;
        weatherCode: number;
        windSpeed: number;
        time: string;
    };
    daily: Array<{
        date: string;
        tempMax: number;
        tempMin: number;
        weatherCode: number;
        precipitationMm: number;
    }>;
}

interface OpenMeteoResponse {
    latitude: number;
    longitude: number;
    timezone: string;
    current: {
        time: string;
        temperature_2m: number;
        weather_code: number;
        wind_speed_10m: number;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        weather_code: number[];
        precipitation_sum: number[];
    };
}

export async function fetchForecast(
    lat: number,
    lon: number,
): Promise<WeatherForecast> {
    const { data } = await openMeteoApi.get<OpenMeteoResponse>("/forecast", {
        params: {
            latitude: lat,
            longitude: lon,
            current: "temperature_2m,weather_code,wind_speed_10m",
            daily: "temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum",
            forecast_days: 7,
            timezone: "auto",
        },
    });

    return {
        latitude: data.latitude,
        longitude: data.longitude,
        timezone: data.timezone,
        current: {
            temperature: data.current.temperature_2m,
            weatherCode: data.current.weather_code,
            windSpeed: data.current.wind_speed_10m,
            time: data.current.time,
        },
        daily: data.daily.time.map((date, i) => ({
            date,
            tempMax: data.daily.temperature_2m_max[i],
            tempMin: data.daily.temperature_2m_min[i],
            weatherCode: data.daily.weather_code[i],
            precipitationMm: data.daily.precipitation_sum[i],
        })),
    };
}

/**
 * https://open-meteo.com/en/docs#weathervariables — WMO weather codes.
 * Trimmed to the most common buckets for compact UI.
 */
export function describeWeatherCode(code: number): string {
    if (code === 0) return "Clear";
    if (code <= 3) return "Partly cloudy";
    if (code <= 48) return "Fog";
    if (code <= 67) return "Rain";
    if (code <= 77) return "Snow";
    if (code <= 82) return "Showers";
    if (code <= 86) return "Snow showers";
    if (code <= 99) return "Thunderstorm";
    return "Unknown";
}
