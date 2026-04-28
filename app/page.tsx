import { cookies } from "next/headers";

import { TripPlanner } from "@/components/TripPlanner";
import {
    HOME_TRIP_COOKIE,
    parseHomeTripCookie,
} from "@/lib/home-trip-cookie";

export default async function Home() {
    // Read the user's last home-trip composer selection from the cookie so
    // SSR renders the same cards the client will hydrate to. Empty for a
    // first-time visitor.
    const store = await cookies();
    const initialSelection = parseHomeTripCookie(
        store.get(HOME_TRIP_COOKIE)?.value,
    );

    return (
        <main className="flex flex-1 flex-col items-stretch justify-start bg-[#0E0E10] py-10">
            <TripPlanner initialSelection={initialSelection} />
        </main>
    );
}
