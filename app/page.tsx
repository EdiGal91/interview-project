import { TripPlanner } from "@/components/TripPlanner";

export default function Home() {
    return (
        <main className="flex flex-1 flex-col items-stretch justify-start bg-[#0E0E10] py-10">
            <TripPlanner />
        </main>
    );
}
