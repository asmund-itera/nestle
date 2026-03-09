"use client";

import React, { use } from "react";
import Image from "next/image";

export default function Home() {
  const todayIso = new Date().toISOString().split("T")[0];
  const [stats, setStats] = React.useState({
    currentStreak: 0,
    longestStreak: 0,
    totalGamesPlayed: 0,
  });

  React.useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            It's wordle, in nestJS.
          </h1>
          <h2 className="max-w-xs text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            NestJS, NextJS, React, Tailwind
          </h2>
          <ul className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <li>Current streak: {stats.currentStreak}</li>
            <li>Longest streak: {stats.longestStreak}</li>
            <li>Total games played: {stats.totalGamesPlayed}</li>
          </ul>
          <a
            href={todayIso}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Play Today's Puzzle
          </a>
        </div>
      </main>
    </div>
  );
}
