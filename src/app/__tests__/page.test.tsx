import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

// Mock window.location
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true
});

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

describe('Home Page', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset fetch mock
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockIpData)
      })
    ) as jest.Mock;
  });

  it('renders loading state initially', () => {
    render(<Home />);
    expect(screen.getByText(/loading ip information/i)).toBeInTheDocument();
  });

  it('renders IP information after loading', async () => {
    render(<Home />);
    
    // Wait for IP address to appear
    await waitFor(() => {
      expect(screen.getByText(mockIpData.query)).toBeInTheDocument();
    });

    // Check location information
    expect(screen.getByText(new RegExp(mockIpData.city, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockIpData.regionName, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockIpData.country, 'i'))).toBeInTheDocument();

    // Check network information
    expect(screen.getByText(new RegExp(mockIpData.isp, 'i'))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mockIpData.org, 'i'))).toBeInTheDocument();

    // Check coordinates
    const coordsText = screen.getByText(/51\.5074°N, 0\.1278°W/);
    expect(coordsText).toBeInTheDocument();

    // Check connection type indicators
    expect(screen.getByText('Mobile')).toBeInTheDocument();
    expect(screen.getByText('Proxy/VPN')).toBeInTheDocument();
    expect(screen.getByText('Hosting')).toBeInTheDocument();
  });

  it('handles fetch error', async () => {
    const errorMessage = 'Failed to fetch';
    global.fetch = jest.fn(() =>
      Promise.reject(new Error(errorMessage))
    ) as jest.Mock;

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });

    // Check if retry button is present
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('handles API error response', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Rate limit exceeded' })
      })
    ) as jest.Mock;

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch ip information/i)).toBeInTheDocument();
    });
  });

  it('handles retry button click', async () => {
    const user = userEvent.setup();
    
    // Mock fetch to fail
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    ) as jest.Mock;

    render(<Home />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    // Verify reload was called
    expect(mockReload).toHaveBeenCalled();
  });

  it('handles undefined response', async () => {
    // Mock fetch to return undefined
    global.fetch = jest.fn(() => Promise.resolve(undefined)) as jest.Mock;

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/no response received/i)).toBeInTheDocument();
    });
  });

  it('handles invalid data response', async () => {
    // Mock fetch to return invalid data
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ invalid: 'data' })
      })
    ) as jest.Mock;

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid ip data/i)).toBeInTheDocument();
    });
  });
});