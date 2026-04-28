// Quick fix for the layout-shift bug reported by QA.
// Hide the grid behind a skeleton for ~800ms on first render so the user
// doesn't see the cards jump around while React finishes hydrating.
export function SelectionGridSkeleton() {
    return (
        <div
            className="grid grid-cols-2 gap-3"
            aria-hidden
        >
            {Array.from({ length: 4 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-square w-full animate-pulse rounded-lg border border-white/10 bg-[#1c1c1f]"
                />
            ))}
        </div>
    );
}
