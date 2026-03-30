export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 px-6 py-12">
      <div className="max-w-2xl mx-auto animate-pulse">
        <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-8" />

        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
          {/* header skeleton */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-8 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-40 h-40 shrink-0 rounded-2xl bg-zinc-100 dark:bg-zinc-800" />
            <div className="flex-1 w-full space-y-3">
              <div className="h-3 w-12 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-8 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
                <div className="h-6 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
              </div>
            </div>
          </div>

          <div className="p-8 grid sm:grid-cols-2 gap-8">
            {/* info skeleton */}
            <div className="space-y-3">
              <div className="h-3 w-8 bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  <div className="h-3 w-12 bg-zinc-200 dark:bg-zinc-700 rounded" />
                </div>
              ))}
            </div>

            {/* stats skeleton */}
            <div className="space-y-4">
              <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-800 rounded mb-4" />
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <div className="h-2.5 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
                    <div className="h-2.5 w-6 bg-zinc-100 dark:bg-zinc-800 rounded" />
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
