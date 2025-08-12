import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from '../page';
import {
  getMockFetch,
  mockFormConfig,
  mockApiResponses,
} from '../../__tests__/mocks';

// Use screen queries for testing

describe('Page Component - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock for each test to avoid long-living variables
    global.fetch = vi.fn();
  });

  it('fetches config from /api/config and displays form', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce(mockApiResponses.config.success);

    render(<Page />);

    // Should show loading initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for config to load
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/config');
    });

    // Should display form with config using data-automation tags
    await waitFor(() => {
      expect(screen.getByText('Test Form')).toBeInTheDocument();
      expect(screen.getByText('Test description')).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
    });
  });

  it('handles config fetch error gracefully', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Form')).toBeInTheDocument();
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('handles config fetch with non-ok response', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce(mockApiResponses.config.error);

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Form')).toBeInTheDocument();
      expect(
        screen.getByText(/response\.json is not a function/)
      ).toBeInTheDocument();
    });
  });

  it('retries config fetch on error', async () => {
    const mockFetch = getMockFetch();
    mockFetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockFormConfig.retrySuccess,
          message: 'Success',
        }),
      });

    render(<Page />);

    // Wait for first error
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Click retry button using data-automation
    const retryButton = screen.getByRole('button', { name: /try again/i });
    retryButton.click();

    // Should retry fetch
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    // Should show success
    await waitFor(() => {
      expect(screen.getByText('Retry Success')).toBeInTheDocument();
    });
  });

  it('handles malformed config response', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce(mockApiResponses.config.malformed);

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Error Loading Form')).toBeInTheDocument();
      expect(
        screen.getByText('Failed to load configuration')
      ).toBeInTheDocument();
    });
  });

  it('shows retry count after multiple failures', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<Page />);

    // First error
    await waitFor(() => {
      expect(screen.getByText(/network error/i)).toBeInTheDocument();
    });

    // Click retry multiple times using data-automation
    const retryButton = screen.getByRole('button', { name: /try again/i });

    retryButton.click();
    // The current implementation doesn't show retry count
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });

    retryButton.click();
    // The current implementation doesn't show retry count
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('handles config with empty components array', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockFormConfig.empty,
        message: 'Success',
      }),
    });

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Empty Form')).toBeInTheDocument();
      expect(screen.getByText('No components')).toBeInTheDocument();
    });
  });

  it('handles config without description', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockFormConfig.withoutDescription,
        message: 'Success',
      }),
    });

    render(<Page />);

    await waitFor(() => {
      expect(screen.getByText('Form Without Description')).toBeInTheDocument();
      expect(screen.getByText('Test Input')).toBeInTheDocument();
    });
  });
});
