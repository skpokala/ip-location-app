import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiUrl = 'http://ip-api.com/json';
    const fields = [
      'query',           // IP address
      'city',           // City name
      'district',       // District (if available)
      'regionName',     // State/Region name
      'country',        // Country name
      'countryCode',    // Country code
      'zip',            // Postal code
      'timezone',       // Timezone
      'isp',            // Internet Service Provider
      'org',           // Organization
      'lat',           // Latitude
      'lon',           // Longitude
      'reverse',        // Reverse DNS of the IP (if available)
      'mobile',        // Mobile connection
      'proxy',         // Proxy/VPN
      'hosting'        // Hosting/Data Center
    ].join(',');
    
    const response = await fetch(`${apiUrl}?fields=${fields}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`IP API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching IP info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch IP information' },
      { status: 500 }
    );
  }
}