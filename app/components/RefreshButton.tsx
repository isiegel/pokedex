'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { randomIds, serializeIds } from '../lib/pokemon-utils';

type RefreshButtonProps = {
  count?: number;
  max?: number;
};

export default function RefreshButton({
  count = 20,
  max = 898,
}: RefreshButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() =>
        startTransition(() =>
          router.replace(`/?ids=${serializeIds(randomIds(count, max))}`),
        )
      }
      disabled={isPending}
      className="text-sm font-medium px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:bg-zinc-100 enabled:dark:hover:bg-zinc-800"
    >
      {isPending ? 'Loading...' : 'Get more!'}
    </button>
  );
}
