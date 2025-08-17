import '@testing-library/jest-dom';

const mockIpData = {
  query: '192.168.1.1',
  city: 'Test City',
  district: 'Test District',
  regionName: 'Test Region',
  country: 'Test Country',
  countryCode: 'TC',
  zip: '12345',
  timezone: 'UTC',
  isp: 'Test ISP',
  org: 'Test Organization',
  lat: 51.5074,
  lon: -0.1278,
  reverse: 'test.example.com',
  mobile: false,
  proxy: false,
  hosting: true
};

// Mock fetch globally
global.fetch = jest.fn((url: string) => {
  // Mock successful response for API route
  if (url === '/api/ip') {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockIpData),
      clone: () => ({
        text: () => Promise.resolve(JSON.stringify(mockIpData))
      })
    });
  }
  
  // Default response for unknown URLs
  return Promise.resolve({
    ok: false,
    status: 404,
    json: () => Promise.resolve({ error: 'Not found' })
  });
}) as jest.Mock;

// Mock window.location
Object.defineProperty(window, 'location', {
  value: {
    reload: jest.fn(),
  },
  writable: true,
});

// Mock console.error to avoid noise in test output
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    (
      args[0].includes('Warning:') ||
      args[0].includes('Error:') ||
      args[0].includes('Invalid hook call')
    )
  ) {
    return;
  }
  originalConsoleError.call(console, ...args);
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});