import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import RefreshButton from '../app/components/RefreshButton';

const mockRefresh = vi.fn();

// Mock next/navigation so the component can render outside Next.js
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}));

const text = 'Get more!';

describe('RefreshButton', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders a button with the label Refresh', () => {
    render(<RefreshButton />);
    expect(screen.getByRole('button', { name: text })).toBeDefined();
  });

  it('calls router.refresh() when clicked', () => {
    render(<RefreshButton />);
    fireEvent.click(screen.getByRole('button', { name: text }));
    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('does not call router.refresh() before being clicked', () => {
    render(<RefreshButton />);
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
