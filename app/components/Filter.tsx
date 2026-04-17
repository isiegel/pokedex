import { Fragment, JSX, memo } from 'react';

export type GenderEntry = 'male' | 'female' | 'genderless' | 'hybrid' | null;

function FilterBase({
  handleGenderChange,
  selectedGenders,
}: {
  handleGenderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  selectedGenders: Exclude<GenderEntry, null>[];
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
            checked={selectedGenders.includes(option)}
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

export const Filter = memo(FilterBase);
