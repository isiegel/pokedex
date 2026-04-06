import { Fragment, JSX } from 'react';

export type GenderEntry = 'male' | 'female' | 'genderless' | 'hybrid' | null;

export function Filter({
  handleGenderChange,
}: {
  handleGenderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
  const options: Exclude<GenderEntry, null>[] = [
    'male',
    'female',
    'genderless',
    'hybrid',
  ];

  return (
    <div className="mb-4 flex items-center gap-2">
      {options.map((option, i) => (
        <Fragment key={i}>
          <input
            type="checkbox"
            value={option}
            id={option}
            onChange={handleGenderChange}
          />
          <label htmlFor={option} className="mr-1 hover:cursor-pointer">
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </label>
        </Fragment>
      ))}
    </div>
  );
}
