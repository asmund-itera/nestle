import { Link, createFileRoute } from "@tanstack/react-router";
import { useStatsQuery } from "../features/home/use-stats-query";

export const Route = createFileRoute("/")({
    component: HomePage,
});

function HomePage() {
    const todayIso = new Date().toISOString().split("T")[0];
    const { data: stats } = useStatsQuery();

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start">
                <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
                        It&apos;s wordle, in nestJS.
                    </h1>
                    <h2 className="max-w-xs text-xl leading-8 text-zinc-600">
                        NestJS, Vite, TanStack Router, TanStack Query
                    </h2>
                    <ul className="max-w-md text-lg leading-8 text-zinc-600">
                        <li>Current streak: {stats?.currentStreak ?? 0}</li>
                        <li>Longest streak: {stats?.longestStreak ?? 0}</li>
                        <li>Total games played: {stats?.totalGamesPlayed ?? 0}</li>
                    </ul>
                    <Link
                        to="/$date"
                        params={{ date: todayIso }}
                        className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none"
                    >
                        Play Today&apos;s Puzzle
                    </Link>
                </div>
            </main>
        </div>
    );
}
