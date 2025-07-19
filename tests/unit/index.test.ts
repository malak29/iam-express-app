describe('index.ts', () => {
  let listenSpy: jest.SpyInstance;

  beforeEach(() => {
    // Clear module cache first
    delete require.cache[require.resolve('../../src/index')];
    delete require.cache[require.resolve('../../src/app')];
    
    // Import app and spy on listen BEFORE importing index
    const app = require('../../src/app').default || require('../../src/app');
    listenSpy = jest.spyOn(app, 'listen').mockImplementation(jest.fn());
  });

  afterEach(() => {
    // Restore the spy
    if (listenSpy) {
      listenSpy.mockRestore();
    }
  });

  it('should call app.listen when index.ts is executed', () => {
    // NOW import index.ts - this will trigger app.listen()
    require('../../src/index');
    
    // Check that listen was called
    expect(listenSpy).toHaveBeenCalled();
  });
});