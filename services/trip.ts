import { tripApi } from "@/lib/axios";

export interface TripItem {
    code: string;
    name: string;
    flag: string;
    addedAt: string;
}

export async function fetchTrip(): Promise<TripItem[]> {
    const { data } = await tripApi.get<TripItem[]>("/trip");
    return data;
}

export async function addTripItem(
    item: Omit<TripItem, "addedAt">,
): Promise<TripItem[]> {
    const { data } = await tripApi.post<TripItem[]>("/trip", item);
    return data;
}

export async function removeTripItem(code: string): Promise<TripItem[]> {
    const { data } = await tripApi.delete<TripItem[]>(`/trip/${code}`);
    return data;
}
