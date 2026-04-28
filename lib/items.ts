import type { Category, Item } from "./types";

const picsum = (seed: string) => `https://picsum.photos/seed/${seed}/400/400`;

export const CATALOG: Record<Category, Item[]> = {
    destination: [
        {
            id: "paris",
            category: "destination",
            name: "Paris",
            subtitle: "France",
            image: picsum("paris"),
        },
        {
            id: "kyoto",
            category: "destination",
            name: "Kyoto",
            subtitle: "Japan",
            image: picsum("kyoto"),
        },
        {
            id: "reykjavik",
            category: "destination",
            name: "Reykjavik",
            subtitle: "Iceland",
            image: picsum("reykjavik"),
        },
        {
            id: "marrakech",
            category: "destination",
            name: "Marrakech",
            subtitle: "Morocco",
            image: picsum("marrakech"),
        },
        {
            id: "cusco",
            category: "destination",
            name: "Cusco",
            subtitle: "Peru",
            image: picsum("cusco"),
        },
    ],
    hotel: [
        {
            id: "h-grand",
            category: "hotel",
            name: "Grand Bellevue",
            subtitle: "5-star · city center",
            image: picsum("hotel-1"),
        },
        {
            id: "h-ryokan",
            category: "hotel",
            name: "Ryokan Sakura",
            subtitle: "Boutique · onsen",
            image: picsum("hotel-2"),
        },
        {
            id: "h-cabin",
            category: "hotel",
            name: "Aurora Cabin",
            subtitle: "Cabin · remote",
            image: picsum("hotel-3"),
        },
        {
            id: "h-riad",
            category: "hotel",
            name: "Riad Andalous",
            subtitle: "Boutique · medina",
            image: picsum("hotel-4"),
        },
    ],
    activity: [
        {
            id: "a-museum",
            category: "activity",
            name: "Museum tour",
            subtitle: "Half-day · guided",
            image: picsum("activity-1"),
        },
        {
            id: "a-hike",
            category: "activity",
            name: "Mountain hike",
            subtitle: "Full-day",
            image: picsum("activity-2"),
        },
        {
            id: "a-cooking",
            category: "activity",
            name: "Cooking class",
            subtitle: "Evening · chef",
            image: picsum("activity-3"),
        },
        {
            id: "a-diving",
            category: "activity",
            name: "Scuba diving",
            subtitle: "Half-day · gear incl.",
            image: picsum("activity-4"),
        },
    ],
    transport: [
        {
            id: "t-train",
            category: "transport",
            name: "Express train",
            subtitle: "First class",
            image: picsum("transport-1"),
        },
        {
            id: "t-flight",
            category: "transport",
            name: "Direct flight",
            subtitle: "Economy",
            image: picsum("transport-2"),
        },
        {
            id: "t-car",
            category: "transport",
            name: "Rental car",
            subtitle: "Compact · 7 days",
            image: picsum("transport-3"),
        },
    ],
};

export const DEFAULT_SELECTION = {
    destination: CATALOG.destination[0],
    hotel: CATALOG.hotel[0],
    activity: CATALOG.activity[0],
    transport: CATALOG.transport[0],
};

export const CATEGORY_LABELS: Record<Category, string> = {
    destination: "Destination",
    hotel: "Hotel",
    activity: "Activity",
    transport: "Transport",
};
