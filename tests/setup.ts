// Global test setup file
// This file runs once before all test suites

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-minimum-32-characters-long';
process.env.ADMIN_PASSWORD = 'TestAdmin123!';
process.env.PORT = '3001';
process.env.DB_PATH = './tests/fixtures/test-users.json';

// Global test configuration
beforeAll(() => {
  // Any global setup before all tests
  console.log('🧪 Starting test suite...');
});

afterAll(() => {
  // Any global cleanup after all tests
  console.log('✅ Test suite completed!');
});

// Global mocks (optional)
// Uncomment if you want to suppress console logs during tests
/*
const originalConsole = global.console;
global.console = {
  ...originalConsole,
  log: jest.fn(), // Mock console.log
  warn: jest.fn(), // Mock console.warn
  error: originalConsole.error, // Keep console.error for debugging
};
*/

// Jest global configuration
// Increase timeout for slow tests if needed
// jest.setTimeout(30000);

// Custom matchers (optional)
// Add any custom Jest matchers here if needed

// Mock global modules that might interfere with tests
// Example: Mock external services, databases, etc.

// Helper functions for tests (optional)
declare global {
  namespace NodeJS {
    interface Global {
      testHelper: {
        cleanupDatabase: () => void;
        createTestUser: () => any;
      };
    }
  }
}

// Global test helpers (optional)
(global as any).testHelper = {
  cleanupDatabase: () => {
    // Cleanup test database
    console.log('🧹 Cleaning up test database...');
  },
  
  createTestUser: () => ({
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    userType: 'GENERAL',
    department: 'DEPARTMENT1',
    status: 'ACTIVE'
  })
};

// Export for use in tests if needed
export {};