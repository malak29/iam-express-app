module.exports = {
  // Use ts-jest preset for TypeScript support
  preset: 'ts-jest',
  
  // Test environment
  testEnvironment: 'node',
  
  // Test file locations
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  
  // Test file patterns
  testMatch: [
    '**/tests/**/*.test.ts',
    '**/tests/**/*.spec.ts',
    '**/__tests__/**/*.ts',
    '**/?(*.)+(spec|test).ts'
  ],
  
  // TypeScript transformation
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.test.json'
    }]
  },
  
  // Module file extensions
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Path mapping (same as tsconfig)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts', // Exclude main entry point
    '!src/**/*.interface.ts', // Exclude interfaces
    '!src/types/**/*.ts' // Exclude type definitions
  ],
  
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/'
  ],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Handle ES modules in node_modules (if needed)
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ],
  
  // Global setup/teardown (if needed)
  // globalSetup: '<rootDir>/tests/global-setup.ts',
  // globalTeardown: '<rootDir>/tests/global-teardown.ts',
  
  // Error handling
  bail: 1, // Stop after first test failure
  maxWorkers: '50%' // Use half of available CPU cores
};