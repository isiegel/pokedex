import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 mb-8 transition-colors"
        >
          ← Back to Pokédex
        </Link>
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <p className="text-6xl font-black text-zinc-200 dark:text-zinc-700 mb-4">404</p>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Pokémon not found
          </h1>
          <p className="text-sm text-zinc-500">
            No Pokémon with that ID exists in the Pokédex.
          </p>
        </div>
      </div>
    </main>
  );
}
