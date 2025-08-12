import { vi } from 'vitest';

// Type for mocked fetch
export type MockFetch = ReturnType<typeof vi.fn>;

// Mock Next.js navigation
export const mockNextNavigation = () => {
  vi.mock('next/navigation', () => ({
    useRouter() {
      return {
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
      };
    },
    useSearchParams() {
      return new URLSearchParams();
    },
    usePathname() {
      return '/';
    },
  }));
};

// Mock global fetch
export const mockGlobalFetch = () => {
  global.fetch = vi.fn();
};

// Mock Math.random for predictable testing
export const mockMathRandom = (returnValue: number) => {
  return vi.spyOn(Math, 'random').mockReturnValue(returnValue);
};

// Mock console methods
export const mockConsole = () => {
  global.console = {
    ...console,
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  };
};

// Mock form configuration responses
export const mockFormConfig = {
  success: {
    title: 'Test Form',
    description: 'Test description',
    components: [{ id: 'test', type: 'input', label: 'Test Input' }],
    submitUrl: '/api/submit',
  },
  empty: {
    title: 'Empty Form',
    description: 'No components',
    components: [],
    submitUrl: '/api/submit',
  },
  withoutDescription: {
    title: 'Form Without Description',
    components: [{ id: 'test', type: 'input', label: 'Test Input' }],
    submitUrl: '/api/submit',
  },
  retrySuccess: {
    title: 'Retry Success',
    components: [],
  },
};

// Mock API responses
export const mockApiResponses = {
  config: {
    success: {
      ok: true,
      json: async () => ({
        success: true,
        data: mockFormConfig.success,
        message: 'Configuration loaded successfully',
      }),
    },
    error: {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    },
    malformed: {
      ok: true,
      json: async () => ({
        success: false,
        error: 'Invalid configuration format',
      }),
    },
  },
  submit: {
    success: {
      ok: true,
      json: async () => ({
        success: true,
        message: 'Form submitted successfully',
        timestamp: new Date().toISOString(),
        data: {
          formData: {
            'first-name': 'John',
            email: 'john@example.com',
            country: 'us',
          },
          timestamp: new Date().toISOString(),
          formId: 'User Registration',
        },
      }),
    },
    error: {
      ok: false,
      status: 400,
      json: async () => ({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Validation failed',
      }),
    },
  },
};

// Mock form data
export const mockFormData = {
  valid: {
    'first-name': 'John',
    email: 'john@example.com',
    country: 'us',
  },
  invalid: {
    'first-name': 'John',
    email: 'invalid-email',
    country: 'us',
  },
  empty: {},
};

// Setup all mocks
export const setupMocks = () => {
  mockNextNavigation();
  mockGlobalFetch();
  mockConsole();
};

// Clean up mocks
export const cleanupMocks = () => {
  vi.clearAllMocks();
  mockGlobalFetch(); // Reset fetch mock
};

// Helper to get typed mock fetch
export const getMockFetch = (): MockFetch => {
  return global.fetch as MockFetch;
};
