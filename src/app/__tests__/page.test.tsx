import { render, screen, waitFor } from '@testing-library/react';
import Home from '../page';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      query: '192.168.1.1',
      city: 'Test City',
      country: 'Test Country',
      regionName: 'Test Region',
      timezone: 'UTC',
      isp: 'Test ISP',
      org: 'Test Org',
      lat: 0,
      lon: 0
    })
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
    
    await waitFor(() => {
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    });

    expect(screen.getByText(/test city/i)).toBeInTheDocument();
    expect(screen.getByText(/test country/i)).toBeInTheDocument();
    expect(screen.getByText(/test isp/i)).toBeInTheDocument();
  });

  it('handles fetch error', async () => {
    (fetch as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch'))
    );

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});