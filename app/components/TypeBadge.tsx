const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-100 text-orange-700',
  water: 'bg-blue-100 text-blue-700',
  grass: 'bg-green-100 text-green-700',
  electric: 'bg-yellow-100 text-yellow-700',
  psychic: 'bg-pink-100 text-pink-700',
  ice: 'bg-cyan-100 text-cyan-700',
  dragon: 'bg-indigo-100 text-indigo-700',
  dark: 'bg-zinc-200 text-zinc-700',
  fairy: 'bg-rose-100 text-rose-700',
  normal: 'bg-zinc-100 text-zinc-600',
  fighting: 'bg-red-100 text-red-700',
  flying: 'bg-sky-100 text-sky-700',
  poison: 'bg-purple-100 text-purple-700',
  ground: 'bg-amber-100 text-amber-700',
  rock: 'bg-stone-100 text-stone-700',
  bug: 'bg-lime-100 text-lime-700',
  ghost: 'bg-violet-100 text-violet-700',
  steel: 'bg-slate-100 text-slate-700',
};

interface TypeBadgeProps {
  name: string;
  size?: 'sm' | 'md';
}

export default function TypeBadge({ name, size = 'sm' }: TypeBadgeProps) {
  const sizeClasses =
    size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5';
  return (
    <span
      className={`${sizeClasses} rounded-full font-medium capitalize ${
        TYPE_COLORS[name] ?? 'bg-zinc-100 text-zinc-600'
      }`}
    >
      {name}
    </span>
  );
}
