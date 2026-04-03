import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RefreshButton from '../app/components/RefreshButton';
import { MAX_POKEMON_ID, POKEMON_COUNT } from '../app/lib/pokemon-constants';

const mockReplace = vi.fn();

// Mock next/navigation so the component can render outside Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const text = 'Get more!';

describe('RefreshButton', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a button with the label Refresh', () => {
    render(<RefreshButton />);
    expect(screen.getByRole('button', { name: text })).toBeDefined();
  });

  it('calls router.replace() with a fresh ids query when clicked', () => {
    render(<RefreshButton />);
    fireEvent.click(screen.getByRole('button', { name: text }));
    expect(mockReplace).toHaveBeenCalledTimes(1);
    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringMatching(
        new RegExp(`^/\\?ids=(\\d+,){${POKEMON_COUNT - 1}}\\d+$`),
      ),
    );
  });

  it('uses the shared defaults when no props are passed', () => {
    render(<RefreshButton />);
    fireEvent.click(screen.getByRole('button', { name: text }));

    const [href] = mockReplace.mock.calls[0];
    const params = new URLSearchParams(href.split('?')[1]);
    const ids = params.get('ids')?.split(',').map(Number) ?? [];

    expect(ids).toHaveLength(POKEMON_COUNT);
    expect(ids.every((id) => id >= 1 && id <= MAX_POKEMON_ID)).toBe(true);
  });

  it('does not call router.replace() before being clicked', () => {
    render(<RefreshButton />);
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
