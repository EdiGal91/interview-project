import { TripView } from "@/components/TripView";

export const metadata = {
    title: "My trip · Trip Planner",
};

export default function TripPage() {
    return (
        <main className="flex flex-1 flex-col bg-[#0E0E10] py-8">
            <div className="mx-auto w-full max-w-2xl px-4">
                <header className="mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                        My trip
                    </h1>
                    <p className="mt-1 text-sm text-white/60">
                        Countries you marked as part of this trip.
                    </p>
                </header>
                <TripView />
            </div>
        </main>
    );
}
