'use client';

import { memo } from 'react';

type SearchInputProps = {
  query: string;
  onQueryChange: (value: string) => void;
};

function SearchInputBase({ query, onQueryChange }: SearchInputProps) {
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    onQueryChange(event.target.value);

  return (
    <div className="w-full max-w-xs">
      <input
        type="search"
        name="search"
        value={query}
        placeholder="Search by name..."
        onChange={handleQueryChange}
        className="w-full rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-800 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-800"
      />
    </div>
  );
}

export const SearchInput = memo(SearchInputBase);
