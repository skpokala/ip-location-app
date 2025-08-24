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
  const [mounted, setMounted] = useState(false);

  // Always call all hooks first, regardless of early returns
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (!mounted) return;
    
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/login');
    }
  }, [session, status, router, mounted]);

  // Fetch IP info when authenticated
  useEffect(() => {
    if (!mounted || !session || status === 'loading') return;

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
  }, [mounted, session, status]);

  // Render loading state while mounting or checking auth
  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">IP Location App</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {!mounted ? 'Loading...' : 'Checking authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // Render redirect state if not authenticated
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">IP Location App</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
      <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-6 md:p-12 lg:p-24">
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
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-8 text-gray-900 dark:text-white text-center px-4">IP Location Information</h1>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 mx-4 max-w-2xl w-full border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 gap-4 sm:gap-6">
                {/* IP Address Section */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-900 dark:text-white break-all">{ipInfo.query}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-center text-sm sm:text-base">
                    {ipInfo.reverse ? `(${ipInfo.reverse})` : 'IP Address'}
                  </p>
                </div>
                
                {/* Location Section */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Location Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <p className="text-base sm:text-lg mb-2 text-gray-900 dark:text-white break-words">{formatAddress(ipInfo)}</p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Coordinates: {formatCoordinates(ipInfo.lat, ipInfo.lon)}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                      Timezone: {ipInfo.timezone}
                    </p>
                  </div>
                </div>
                
                {/* Network Section */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Network Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">ISP</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base break-words">{ipInfo.isp}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Organization</p>
                        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base break-words">{ipInfo.org}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Connection Type */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Connection Type</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 sm:p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Mobile</p>
                        <p className={`text-sm sm:text-base ${ipInfo.mobile ? 'text-green-500 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {ipInfo.mobile ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Proxy/VPN</p>
                        <p className={`text-sm sm:text-base ${ipInfo.proxy ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                          {ipInfo.proxy ? 'Yes' : 'No'}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">Hosting</p>
                        <p className={`text-sm sm:text-base ${ipInfo.hosting ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
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