// Global test setup
import 'jest-extended';

// Global mocks
global.console = {
  ...console,
  // Uncomment to suppress console logs during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-minimum-32-chars';
process.env.PORT = '3001';

// Global test timeout
jest.setTimeout(10000);