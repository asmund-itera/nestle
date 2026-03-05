export default function SessionDatePage() {
    const cells = Array.from({ length: 5 * 7 });
    const guesses = ["horse", "paper"];
    const letters = guesses.join("").split("");

    return (
        <main className="min-h-screen bg-zinc-50 px-6 py-10">
            <div className="mx-auto flex w-full max-w-md flex-col items-center gap-8">
                <h1 className="text-4xl font-bold tracking-wide text-zinc-900">Nestle</h1>

                <section
                    aria-label="Game grid"
                    className="grid grid-cols-5 gap-2"
                >
                    {cells.map((_, index) => (
                        <div
                            key={index}
                            className="flex h-12 w-12 items-center justify-center rounded-sm border-2 border-zinc-300 bg-white text-xl font-semibold text-zinc-900"
                        >
                            {letters[index]?.toUpperCase() ?? ""}
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
