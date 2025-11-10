import { beforeEach, afterEach, vi } from 'vitest';

// Reset mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});

// Clean up after each test
afterEach(() => {
  vi.restoreAllMocks();
});

// Global test utilities
global.testUtils = {
  // Add global test utilities here
};
