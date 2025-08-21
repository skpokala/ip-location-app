'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface IPInfo {
  query: string;
  city: string;
  district?: string;
  regionName: string;
  country: string;
  countryCode: string;
  zip: string;
  timezone: string;
  isp: string;
  org: string;
  lat: number;
  lon: number;
  reverse?: string;
  mobile: boolean;
  proxy: boolean;
  hosting: boolean;
}

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle authentication
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    
    if (!session) {
      router.push('/login');
      return;
    }
  }, [session, status, router]);

  // Don't render anything while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">IP Location App</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  useEffect(() => {
    const fetchIpInfo = async () => {
      try {
        const response = await fetch('/api/ip');
        
        if (!response) {
          throw new Error('No response received from IP API');
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch IP information: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.query) {
          throw new Error('Invalid IP data received');
        }
        
        setIpInfo(data);
      } catch (err) {
        console.error('Error fetching IP info:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch IP information');
      } finally {
        setLoading(false);
      }
    };

    fetchIpInfo();
  }, []);

  const formatCoordinates = (lat: number, lon: number) => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
  };

  const formatAddress = (info: IPInfo) => {
    const parts = [
      info.district,
      info.city,
      info.regionName,
      info.zip,
      info.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        {loading ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">IP Location App</h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading IP information...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">IP Location App</h1>
            <p className="mt-4 text-red-500 dark:text-red-400">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Try Again
            </button>
          </div>
        ) : ipInfo && (
          <>
            <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">IP Location Information</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-2xl w-full border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-6">
                {/* IP Address Section */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-white">{ipInfo.query}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-center">
                    {ipInfo.reverse ? `(${ipInfo.reverse})` : 'IP Address'}
                  </p>
                </div>
                
                {/* Location Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Location Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-lg mb-2 text-gray-900 dark:text-white">{formatAddress(ipInfo)}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Coordinates: {formatCoordinates(ipInfo.lat, ipInfo.lon)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Timezone: {ipInfo.timezone}
                    </p>
                  </div>
                </div>
                
                {/* Network Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Network Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">ISP</p>
                        <p className="text-gray-600 dark:text-gray-300">{ipInfo.isp}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Organization</p>
                        <p className="text-gray-600 dark:text-gray-300">{ipInfo.org}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connection Type */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Connection Type</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">Mobile</p>
                        <p className={ipInfo.mobile ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}>
                          {ipInfo.mobile ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">Proxy/VPN</p>
                        <p className={ipInfo.proxy ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}>
                          {ipInfo.proxy ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white">Hosting</p>
                        <p className={ipInfo.hosting ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}>
                          {ipInfo.hosting ? 'Yes' : 'No'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}