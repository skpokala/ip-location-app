import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';

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

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockIpData)
  })
) as jest.Mock;

describe('Home Page', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
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
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(new RegExp(errorMessage, 'i'))).toBeInTheDocument();
    });

    // Check if retry button is present
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('handles API error response', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'Rate limit exceeded' })
      })
    );

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch ip information/i)).toBeInTheDocument();
    });
  });

  it('handles retry button click', async () => {
    const user = userEvent.setup();
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // First request fails
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    const { rerender } = render(<Home />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    // Mock window.location.reload
    const reloadMock = jest.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    // Verify reload was called
    expect(reloadMock).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});