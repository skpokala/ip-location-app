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

describe('Home Page', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockImplementation((url: string) => {
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
      return Promise.reject(new Error('Not found'));
    });
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
    // Mock fetch to fail
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    // Check if retry button is present
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
  });

  it('handles API error response', async () => {
    // Mock fetch to return error response
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
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
    
    // Mock fetch to fail initially
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<Home />);

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    await user.click(retryButton);

    // Verify reload was called
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('handles undefined response', async () => {
    // Mock fetch to return undefined
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(undefined)
    );

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/no response received/i)).toBeInTheDocument();
    });
  });

  it('handles invalid data response', async () => {
    // Mock fetch to return invalid data
    (global.fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ invalid: 'data' })
      })
    );

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid ip data/i)).toBeInTheDocument();
    });
  });
});