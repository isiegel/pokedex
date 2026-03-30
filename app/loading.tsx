export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="h-10 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse mb-2" />
        <div className="h-5 w-56 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 flex flex-col items-center gap-2 animate-pulse"
            >
              <div className="h-3 w-8 bg-zinc-200 dark:bg-zinc-700 rounded self-start" />
              <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
              <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="h-5 w-12 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
