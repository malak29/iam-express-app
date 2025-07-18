// Alternative approach - mock at the Jest module level
jest.mock('../../src/app');
jest.mock('../../src/config/env');

import app from '../../src/app';
import { PORT } from '../../src/config/env';

// Type the mocked modules
const mockedApp = app as jest.Mocked<typeof app>;
const mockedPORT = PORT as jest.Mocked<typeof PORT>;

describe('index.ts (Alternative approach)', () => {
  let consoleSpy: jest.SpyInstance;

  beforeAll(() => {
    // Set up the mocks
    (mockedApp.listen as jest.Mock) = jest.fn();
    (mockedPORT as any) = 3001;
  });

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should call app.listen with correct parameters', () => {
    // Dynamically import to trigger execution
    delete require.cache[require.resolve('../../src/index')];
    require('../../src/index');

    expect(mockedApp.listen).toHaveBeenCalledWith(3001, expect.any(Function));
  });

  it('should log correct startup messages', () => {
    delete require.cache[require.resolve('../../src/index')];
    require('../../src/index');

    // Get the callback and execute it
    const callback = (mockedApp.listen as jest.Mock).mock.calls[0][1];
    callback();

    expect(consoleSpy).toHaveBeenCalledWith('🚀 Server running on port 3001');
    expect(consoleSpy).toHaveBeenCalledWith('📋 Health check: http://localhost:3001/health');
    expect(consoleSpy).toHaveBeenCalledWith('🔐 Auth endpoints: http://localhost:3001/api/auth');
    expect(consoleSpy).toHaveBeenCalledWith('👥 User endpoints: http://localhost:3001/api/users');
  });
});