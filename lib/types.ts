export type Category = "destination" | "hotel" | "activity" | "transport";

export interface Item {
    id: string;
    category: Category;
    name: string;
    subtitle: string;
    image: string;
}

export type Selection = Record<Category, Item | null>;
