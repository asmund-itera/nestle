import { Link } from "@tanstack/react-router";

type DateNavProps = {
    date: string;
};

function shiftIsoDate(dateValue: string, days: number): string | null {
    const parsedDate = new Date(`${dateValue}T00:00:00Z`);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    parsedDate.setUTCDate(parsedDate.getUTCDate() + days);
    return parsedDate.toISOString().slice(0, 10);
}

export function DateNav({ date }: DateNavProps) {
    const previousDate = shiftIsoDate(date, -1);
    const nextDate = shiftIsoDate(date, 1);

    return (
        <nav
            aria-label="Date navigation"
            className="flex w-full items-center justify-between rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700"
        >
            {previousDate ? (
                <Link
                    to="/$date"
                    params={{ date: previousDate }}
                    className="transition-colors hover:text-zinc-900"
                >
                    Previous
                </Link>
            ) : (
                <span className="text-zinc-400">Previous</span>
            )}

            <span className="text-zinc-900">{date}</span>

            {nextDate ? (
                <Link
                    to="/$date"
                    params={{ date: nextDate }}
                    className="transition-colors hover:text-zinc-900"
                >
                    Next
                </Link>
            ) : (
                <span className="text-zinc-400">Next</span>
            )}
        </nav>
    );
}
