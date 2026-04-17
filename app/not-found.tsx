import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-12 text-center shadow-sm">
          <p className="text-5xl font-black text-zinc-200 dark:text-zinc-700 mb-4">404</p>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Page not found
          </h1>
          <p className="text-sm text-zinc-500 mb-8">
            This page doesn&apos;t exist.
          </p>
          <Link
            href="/"
            className="text-sm font-medium px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Back to Pokédex
          </Link>
        </div>
      </div>
    </main>
  );
}
