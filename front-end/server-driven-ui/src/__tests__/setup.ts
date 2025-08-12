import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';
import { setupMocks, cleanupMocks } from '../__tests__/mocks';

// Setup all mocks
setupMocks();

// Setup test environment
beforeEach(() => {
  cleanupMocks();
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  warn: vi.fn(),
  error: vi.fn(),
};
