'use client';

import { useRouter } from 'next/navigation';

export default function RefreshButton() {
  const router = useRouter();
  return (
    <button
      // router.refresh() re-runs the server component, generating new random IDs
      onClick={() => router.refresh()}
      className="cursor-pointer text-sm font-medium px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
    >
      Get more!
    </button>
  );
}
